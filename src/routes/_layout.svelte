<script>
  import { stores, goto } from "@sapper/app";
  import isMobile from "ismobilejs";
  import { onMount, setContext } from "svelte";
  import { Nav, NavItem } from "@sveltejs/site-kit";
  import Button from "@smui/button";
  import IconButton from "@smui/icon-button";
  import Snackbar, { Actions } from "@smui/snackbar";
  import { Label } from "@smui/common";
  import { post } from "utils";
  import { flash } from "../stores/flashStore";
  import { Modal } from "@sveltejs/site-kit";

  // import ListErrors from 'components';

  const { page, session } = stores();
  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  let root;
  let snackbar;
  let message = "";
  let action = "";
  let path = "";
  let timeout = 4000;
  let isMobileDevice;
  let image;

  setContext("snackbar", {
    getSnackbar: () => snackbar,
    configSnackbar,
  });

  $: slug = ((page) => {
    let params = page.params;
    let slug = (params && params.slug) || "";
    let tab = page.query.tab;
    if (slug && tab) return `${slug}?tab=${tab}`;
    return slug || "";
  })($page);
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
  $: timeout = action ? "8000" : "4000";

  async function logout() {
    let res = await post(`auth/logout`);
    if (res && res.success) {
      message = res.data.message;
      flash.update({ message });

      res = goto("login");
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
    message = msg;
    action = path = "";
    if (typeof link === "object") {
      path = link.path;
      action = link.action;
    } else {
      path = link;
    }
    !action && path && (message = `${message}. Redirecting...`);
  }

  function handleClosed() {
    !action && path && goto(path);
  }
</script>

<Modal>
  <form on:submit|preventDefault={logout} method="post">
    <Nav {segment} {page} logo="logo-sticky.svg">
      {#if $session.user}
        <NavItem segment="videos">Videos</NavItem>
      {/if}
      {#if $session.role === 'Administrator'}
        <NavItem segment="users" {slug}>Users</NavItem>
      {/if}

      <NavItem title="Login">
        {#if $session.user}
          <Button type="submit" variant="raised">
            <Label>Logout</Label>
          </Button>
        {:else}
          <a
            rel="prefetch"
            aria-current={segment === 'login' ? 'page' : undefined}
            href="/login">Login</a>
        {/if}
      </NavItem>
    </Nav>
  </form>

  <slot />
</Modal>

<Snackbar
  timeoutMs={timeout}
  bind:this={snackbar}
  labelText={message}
  on:MDCSnackbar:closed={handleClosed}>
  <Label />
  <Actions>
    {#if action}
      <Button on:click={() => goto(path)}>{action}</Button>
    {/if}
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
