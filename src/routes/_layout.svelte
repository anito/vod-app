<script>
  import { stores, goto } from "@sapper/app";
  import isMobile from "ismobilejs";
  import { onMount, setContext } from "svelte";
  import { Nav, NavItem } from "@sveltejs/site-kit";
  import Button, { Icon } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import { Label } from "@smui/common";
  import { post } from "utils";
  import { loginGuard as frozen } from "../stores/loginGuard";
  import { flash } from "../stores/flashStore";
  import { Modal } from "@sveltejs/site-kit";
  import { UserGraphic, LoadingModal } from "components";
  import { Jumper } from "svelte-loading-spinners";

  // import ListErrors from 'components';

  const { page, session } = stores();

  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  let root;
  let snackbar;
  let message = "";
  let action = "";
  let path = "";
  let snackbarLifetime = 4000;
  let redirectDelay = 300;
  let timeoutId;
  let isMobileDevice;
  let logoutLabelTextDefault = "Zum Login";
  let logoutLabelText = logoutLabelTextDefault;

  setContext("snackbar", {
    getSnackbar: () => snackbar,
    configSnackbar,
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
  $: snackbarLifetime = action ? "8000" : "4000";
  $: $session.user && (logoutLabelText = `Hallo,<br />${$session.user.name}`);

  async function submit(e) {
    if ($session.user) {
      logoutLabelText = "Einen Moment...";
      const res = await post(`auth/logout`);
      if (res && res.success) {
        message = res.message;
        setTimeout(() => {
          goto("/");
          $session.user = null;
          $session.role = null;
          $session.groups = null;
          logoutLabelText = logoutLabelTextDefault;
          flash.update({ message });
        }, 1000);
        configSnackbar(message);
        snackbar.open();
      }
    }
  }

  onMount(() => {
    root = document.documentElement;

    window.addEventListener("introend", handleIntroEnd);
    isMobileDevice && root.classList.add("ismobile");

    return () => {
      root.classList.remove("ismobile");
      window.removeEventListener("introend", handleIntroEnd);
    };
  });

  function configSnackbar(msg, link) {
    snackbar.close();
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

  function handleIntroEnd(e) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(
      (o) => o.path && goto(o.path),
      redirectDelay,
      e.detail
    );
  }
</script>

<Modal>
  <form
    class="main-menu"
    on:submit|stopPropagation|preventDefault={submit}
    method="post"
  >
    <Nav {segment} {page} logo="logo-sticky.svg">
      <NavItem segment="privacy-policy" title="Privacy Policy" let:active>
        <Label>Privacy Policy</Label>
      </NavItem>

      {#if $session.user}
        <NavItem segment="videos" title="Videothek" let:active>
          <Icon class="material-icons" style="vertical-align: middle;">
            video_library
          </Icon>
          <Label>Videothek</Label>
        </NavItem>
      {/if}

      {#if $session.role === "Administrator"}
        <NavItem segment="users" title="Administration" let:active>
          <Icon class="material-icons" style="vertical-align: middle;">
            settings
          </Icon>
          <Label>Admin</Label>
        </NavItem>
      {/if}

      {#if $session.user}
        <NavItem let:active>
          <Button variant="raised" class="button-logout">
            <span class="button-first-line">Logout</span>
            <Label
              class="no-break"
              style="padding-top: 20px; font-size: 0.7rem"
            >
              {@html logoutLabelText}
            </Label>
          </Button>
        </NavItem>
      {:else}
        <NavItem segment="login" let:active>
          <Button color="secondary" variant="raised" class="button-login">
            <Label>Zum Login</Label>
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
    </Nav>
  </form>
  <slot />
</Modal>
<LoadingModal backgroundColor="#ffffff" opacity=".45">
  <Jumper size="60" color="var(--flash)" unit="px" />
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
    font-size: 0.46rem;
    top: 20px;
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
