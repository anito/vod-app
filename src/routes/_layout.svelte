<script>
  import { stores, goto } from "@sapper/app";
  import isMobile from "ismobilejs";
  import { onMount } from "svelte";
  import { Nav, NavItem } from "@sveltejs/site-kit";
  import Button from "@smui/button";
  import { Label } from "@smui/common";
  import { post } from "utils";
  import { flash } from "../stores/flashStore";
  import Snackbar, { Actions, Label as SnackbarLabel } from "@smui/snackbar";

  // import ListErrors from 'components';

  const { page, session } = stores();

  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  let root;
  let snackbar;
  let message = "";
  let isMobileDevice;

  $: slug = ((page) => {
    let params = page.params;
    let slug = (params && params.slug) || "";
    let tab = page.query.tab;
    if (slug && tab) return `${slug}?tab=${tab}`;
    return slug || "";
  })($page);

  async function logout() {
    let res = await post(`auth/logout`);
    if (res.success) {
      message = res.data.message;
      flash.update({ type: "alert", message });

      res = goto("login");
      if (res) {
        $session.user = null;
        $session.role = null;
        $session.groups = null;
      }
      snackbar.open();
    }
  }

  onMount(() => {
    root = document.documentElement;
    !window.snackbar && (window.snackbar = snackbar);

    isMobileDevice && root.classList.add("ismobile");
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
</script>

<form on:submit|preventDefault={logout} method="post">
  <Nav {segment} {page} logo="logo-sticky.svg">
    {#if $session.user}
      <NavItem segment="videos">Videos</NavItem>
    {/if}
    {#if $session.role === 'Administrator'}
      <NavItem segment="images">Posters</NavItem>
    {/if}
    {#if $session.role === 'Administrator'}
      <NavItem segment="users" {slug}>Users</NavItem>
    {/if}
    <NavItem segment="about">About</NavItem>

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

<Snackbar timeoutMs="4000" bind:this={snackbar} labelText={message}>
  <SnackbarLabel />
</Snackbar>
