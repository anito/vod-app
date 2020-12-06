<script context="module">
  import * as api from "api";
  import { post, redirectPath } from "utils";

  export async function preload(page, session) {
    let res, token;
    if (page.query && (token = page.query.token)) {
      res = await api.get(`login?token=${token}`);

      if (res.success) {
        return { ...res.data };
      } else {
        console.log(res);
      }
    }
  }
</script>

<script>
  import { onMount, getContext } from "svelte";
  import { ListErrors } from "components";
  import { ListMessages } from "components";
  import { LoginForm } from "components";
  import { Header } from "@sveltejs/site-kit";
  import { flash } from "../../stores/flashStore";
  import { stores } from "@sapper/app";

  const { getSnackbar, configSnackbar } = getContext("snackbar");

  const { page, session } = stores();

  let errors = null;
  let message = null;
  let path;
  let snackbar;

  export let user;
  export let groups;

  onMount(() => {
    snackbar = getSnackbar();

    if (user) {
      saveSession();
    }
  });

  function handleLogin(e) {
    let res = e.detail;
    snackbar.isOpen && snackbar.close();

    message = res.message || res.data.message || res.statusText;
    if (res.success) {
      flash.update({ message });
      res.data.user &&
        ($session.user = res.data.user) &&
        ($session.role = res.data.user.group.name);
      res.data.groups && ($session.groups = res.data.groups);

      path = redirectPath($page, $session);
      configSnackbar(message, path);
      snackbar.open();
    } else {
      configSnackbar(message);
      snackbar.open();
    }
  }
  async function saveSession() {
    const res = await post("auth/proxy", { user, groups });
    if (res) {
      ($session.user = res.user) && ($session.role = res.user.group.name);
      res.groups && ($session.groups = res.groups);

      let path = redirectPath($page, $session);
      configSnackbar(`Herzlich Willkommen ${res.user.name}`, path);
      snackbar.open();
    }
  }
</script>

<style>
  :global(.error).login-header {
    color: var(--error);
  }
  :global(.info).login-header {
    color: var(--info);
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Login</title>
</svelte:head>

<Header h="2" mdc class="login-header m-2 lg:m-5 {$flash.type}">
  {$flash.message || 'Anmeldung'}
</Header>
<div class="flex justify-center m-8">
  <div class="">
    <div class="cols-3">
      <Header h="4" mdc class="m-2">Bitte loggen Sie sich ein</Header>
    </div>
    <div class="cols-3">
      <LoginForm on:loginResponse={handleLogin} />
    </div>
  </div>
</div>

<ListErrors {errors} />
<ListMessages {message} />
