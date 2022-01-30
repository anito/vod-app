<script context="module">
  import { waitLocale } from "svelte-i18n";

  export async function preload() {
    return waitLocale();
  }
</script>

<script>
  import { stores, goto } from "@sapper/app";
  import { onMount, setContext } from "svelte";
  import isMobile from "ismobilejs";
  import { Nav, NavItem, Icons, Icon as ExternalIcon } from "@anito/site-kit";
  import Button, { Icon } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import { Label } from "@smui/common";
  import {
    post,
    createRedirectSlug,
    proxyEvent,
    extendSession as sessionExtendHandler,
    locationSearch,
    __session__,
  } from "utils";
  import { flash } from "stores/flashStore";
  import { ticker } from "stores/tickerStore";
  import { fabs } from "stores/fabStore";
  import { settings } from "stores/settingStore";
  import { theme } from "stores/themeStore";
  import { Modal } from "@anito/site-kit";
  import { Jumper } from "svelte-loading-spinners";
  import { UserGraphic, LoadingModal, LocaleSwitcher } from "components";
  import { _, locale } from "svelte-i18n";
  import { serverConfig } from "config";

  const { page, session } = stores();
  const snackbarLifetimeDefault = 4000;
  const redirectDelay = 300;

  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  let root;
  let snackbar;
  let message = "";
  let action = "";
  let path = "";
  let timeoutId;
  let isMobileDevice;
  let loggedInButtonTextSecondLine;
  let unsubscribeTicker;
  let emphasize;

  settings.update({ Session: $session });

  // load configuration data
  serverConfig($session.api);

  setContext("snackbar", {
    getSnackbar: () => snackbar,
    configSnackbar,
  });

  setContext("fab", {
    setFab: (fab) => $session.role === "Administrator" && fabs.update(fab),
    restoreFab: () => fabs.restore(),
  });

  $: root &&
    ((user) => root.classList.toggle("loggedin", user))(!!$session.user);
  $: root &&
    ((isAdmin) => root.classList.toggle("admin", isAdmin))(
      $session.role === "Administrator"
    );
  $: ((seg) => {
    root &&
      ((seg && root.classList.remove("home")) ||
        (!seg && root.classList.add("home")));
  })(segment);
  $: isMobileDevice = isMobile().any;
  $: snackbarLifetime = action ? 6000 : snackbarLifetimeDefault;
  $: $session.user &&
    (loggedInButtonTextSecondLine = $_("text.logged-in-button-second-line", {
      values: { name: $session.user.name },
    }));
  $: location = locationSearch($page);

  onMount(() => {
    root = document.documentElement;

    window.addEventListener("session:start", sessionStartHandler);
    window.addEventListener("session:started", sessionStartedHandler);
    window.addEventListener("session:extend", sessionExtendHandler);
    window.addEventListener("session:extended", sessionExtendedHandler);
    window.addEventListener("session:end", sessionEndHandler);
    window.addEventListener("session:ended", sessionEndedHandler);
    isMobileDevice && root.classList.add("ismobile");

    recoverSession();

    let styles = window.getComputedStyle(root);
    theme.set({
      primary: styles.getPropertyValue("--prime"),
      secondary: styles.getPropertyValue("--second"),
    });

    return () => {
      root.classList.remove("ismobile");
      window.removeEventListener("session:start", sessionStartHandler);
      window.removeEventListener("session:started", sessionStartedHandler);
      window.removeEventListener("session:extend", sessionExtendHandler);
      window.removeEventListener("session:extended", sessionExtendedHandler);
      window.removeEventListener("session:end", sessionEndHandler);
      window.removeEventListener("session:ended", sessionEndedHandler);
    };
  });

  function submit(e) {
    if ($session.user) {
      loggedInButtonTextSecondLine = $_("text.one-moment");
      proxyEvent("session:end");
    }
  }

  function configSnackbar(msg, link) {
    try {
      snackbar.close();
    } catch (e) {}
    configureAction(msg, link);
  }

  function configureAction(msg = "", link) {
    message = msg;
    action = path = "";
    if (typeof link === "object") {
      path = link.path;
      action = link.action;
    } else {
      path = link;
    }
    !action && path && (message = `${message}...`);
  }

  function handleOpened() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => !action && path && goto(path), redirectDelay);
  }

  function handleClosed() {}

  async function sessionStartHandler(e) {
    const data = e.detail.data;
    const res = await post("auth/proxy", { ...data });
    if (res) {
      const { user, groups, expires, renewed } = { ...res };

      $session.user = user;
      $session.role = user.group.name;
      $session.groups = groups;
      $session.expires = new Date(expires);

      renewed && localStorage.setItem("renewed", renewed);
      proxyEvent("session:started", { expires });

      configSnackbar(
        $_("text.external-login-welcome-message", {
          values: { name: user.name },
        })
      );
      snackbar.open();
    }
  }

  function sessionStartedHandler(e) {
    if (__session__.started) return;

    unsubscribeTicker = ticker.subscribe((val) => {
      if (val === 0) {
        proxyEvent("session:end", { redirect: "login" });
      }
    });
    ticker.start($session.expires);
  }

  function sessionExtendedHandler(e) {
    $session.expires = e.detail.expires;
    ticker.start($session.expires);
  }

  async function sessionEndHandler(e) {
    if (!$session.user) return;

    const res = await post(`auth/logout?lang=${$locale}`);
    if (res && res.success) {
      proxyEvent("session:ended", { redirect: e.detail.redirect || "/" });
      message = res.message;

      flash.update({ message });
      configSnackbar(message);
      snackbar.open();
    }
  }

  function sessionEndedHandler(e) {
    unsubscribeTicker && unsubscribeTicker();

    setTimeout(() => {
      goto(`${e.detail.redirect}${createRedirectSlug($page)}`);
      $session.user = null;
      $session.role = null;
      $session.groups = null;
      $session.expires = null;
    }, 1000);
  }

  function recoverSession() {
    if (!$session.user || $session.expires < Date.now) return;
    proxyEvent("session:started");
  }
</script>

<Icons />

<Modal>
  {#if $locale}
    <form
      class="main-menu"
      on:submit|stopPropagation|preventDefault={submit}
      method="post"
    >
      <Nav {segment} {page} logo="logo-sticky.svg">
        <NavItem segment="privacy-policy" title={$_("nav.privacy")} let:active>
          <Label>{$_("nav.privacy")}</Label>
        </NavItem>

        {#if $session.user}
          <NavItem segment="videos" title="Videothek" let:active>
            <Icon class="material-icons" style="vertical-align: middle;"
              >video_library</Icon
            >
            <Label>{$_("nav.library")}</Label>
          </NavItem>
        {/if}

        {#if $session.role === "Administrator"}
          <NavItem segment="users" title="Administration" let:active>
            <Icon class="material-icons" style="vertical-align: middle;"
              >settings</Icon
            >
            <Label>Admin</Label>
          </NavItem>
        {/if}

        {#if $session.user}
          <NavItem let:active>
            <Button
              variant="raised"
              class="button-logout v-emph v-emph-bounce {emphasize}"
              on:mouseenter={() => (emphasize = "v-emph-active")}
              on:mouseleave={() => (emphasize = "")}
            >
              <span class="button-first-line v-emph-primary v-emph-down"
                >Logout</span
              >
              <Label class="no-break v-emph-secondary v-emph-up">
                {@html loggedInButtonTextSecondLine}
              </Label>
            </Button>
          </NavItem>
        {:else}
          <NavItem segment="login{location}" let:active>
            <Button color="secondary" variant="raised" class="button-login">
              <Label>{$_("nav.login")}</Label>
            </Button>
          </NavItem>
        {/if}

        {#if $session.user}
          <NavItem title="Avatar" link="users/{$session.user.id}?tab=user">
            <UserGraphic
              border="0px 0px 0px 3px var(--prime)"
              dense
              width="40"
              height="40"
              user={$session.user}
            />
          </NavItem>
        {:else}
          <NavItem title="Avatar">
            <UserGraphic
              border="0px 0px 0px 3px var(--prime)"
              dense
              width="40"
              height="40"
            />
          </NavItem>
        {/if}

        <li class="locale-switcher">
          <LocaleSwitcher />
        </li>

        <NavItem
          external="https://github.com/anito/physio-dips-app"
          blank
          title="GitHub Repo"
        >
          <ExternalIcon name="github" />
        </NavItem>
      </Nav>
    </form>
    <slot />
  {/if}
</Modal>
<LoadingModal backgroundColor="#ffffff" opacity=".45" wait="400">
  <Jumper size="200" color="var(--flash)" unit="px" />
</LoadingModal>

<Snackbar
  snackbarLifetimeMs={snackbarLifetime}
  bind:this={snackbar}
  labelText={message}
  on:MDCSnackbar:closed={handleClosed}
  on:MDCSnackbar:opened={handleOpened}
>
  <Label />
  <Actions>
    {#if action}
      <Button on:click={() => goto(path)}>{action}</Button>
    {/if}
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  .button-first-line {
    position: absolute;
    width: 84%;
    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  :global(.is-login-page) .main-menu :global(button) {
    transform: translateY(-60px);
    transition: all 0.4s ease-out;
  }
  .main-menu :global(button) {
    transform: translateY(0px);
    transition: all 0.4s ease-in;
  }
  .main-menu :global(button) {
    height: 74px;
    width: 130px;
  }
  .main-menu :global(button .no-break) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
