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
  import { flash } from "../stores/flashStore";
  import { Modal } from "@sveltejs/site-kit";
  import { UserGraphic } from "components";

  // import ListErrors from 'components';

  const { page, session } = stores();
  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  let root;
  let snackbar;
  let message = "";
  let action = "";
  let path = "";
  let snackbarLifetime = 4000;
  let snackbarActionDelay = 300;
  let snackbarTimeoutID;
  let isMobileDevice;

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

  async function logout(e) {
    goto("login");
    let res = await post(`auth/logout`);
    if (res && res.success) {
      message = res.message;
      flash.update({ message });

      if (res) {
        $session.user = null;
        $session.role = null;
        $session.groups = null;
      }
      configSnackbar(message);
      snackbar.open();
    }
  }

  onMount(() => {
    root = document.documentElement;

    isMobileDevice && root.classList.add("ismobile");
    return () => root.classList.remove("ismobile");
  });

  function configSnackbar(msg = "", link) {
    snackbar.open && snackbar.close();
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
    clearTimeout(snackbarTimeoutID);
    snackbarTimeoutID = setTimeout(
      () => !action && path && goto(path),
      snackbarActionDelay
    );
  }

  function handleClosed() {}
</script>

<style>
  .user-name-indicator {
    position: absolute;
    font-size: 0.46rem;
    top: 20px;
    width: 84%;
    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  :global(.button-login) {
    height: 74px;
  }
</style>

<Modal>
  <form on:submit|preventDefault={logout} method="post">
    <Nav {segment} {page} logo="logo-sticky.svg">
      {#if $session.user}
        <NavItem segment="videos" title="videos" let:active>
          <Icon class="material-icons" style="vertical-align: middle;">
            video_library
          </Icon>
          <Label>Videokurse</Label>
        </NavItem>
      {/if}

      {#if $session.role === 'Administrator'}
        <NavItem segment="users" title="users" let:active>
          <Icon class="material-icons" style="vertical-align: middle;">
            settings
          </Icon>
          <Label>Admin</Label>
        </NavItem>
      {/if}

      {#if $session.user}
        <NavItem title="Logout" let:active>
          <Button variant="raised" class="button-login">
            <span class="user-name-indicator">{$session.user.name}</span>
            <Label style="padding-top: 20px;">Abmelden</Label>
          </Button>
        </NavItem>
      {:else}
        <NavItem title="Login" segment="login" let:active>
          <Button color="secondary" variant="raised" class="button-login">
            <Label>Anmelden</Label>
          </Button>
        </NavItem>
      {/if}

      {#if $session.user}
        <NavItem title="Avatar" link="users/{$session.user.id}?tab=user">
          <UserGraphic
            border
            dense
            width="40"
            height="40"
            user={$session.user} />
        </NavItem>
      {/if}
    </Nav>
  </form>

  <slot />
</Modal>

<Snackbar
  snackbarLifetimeMs={snackbarLifetime}
  bind:this={snackbar}
  labelText={message}
  on:MDCSnackbar:closed={handleClosed}
  on:MDCSnackbar:opened={handleOpened}>
  <Label />
  <Actions>
    {#if action}
      <Button on:click={() => goto(path)}>{action}</Button>
    {/if}
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
