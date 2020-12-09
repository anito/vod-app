<script context="module">
  import * as api from "api";
  import { post, redirectPath } from "utils";

  export async function preload(page, session) {
    let res, token;
    if (page.query && (token = page.query.token)) {
      res = await api.get(`login?token=${token}`);

      if (res) {
        return { ...res };
      }
    }
  }
</script>

<script>
  import { onMount, getContext, createEventDispatcher } from "svelte";
  import { ListErrors } from "components";
  import { ListMessages } from "components";
  import { LoginForm } from "components";
  import { Header } from "@sveltejs/site-kit";
  import { flash } from "../../stores/flashStore";
  import { stores } from "@sapper/app";
  import { fly, fade, slide } from "svelte/transition";
  import { windowSize } from "utils";

  const { getSnackbar, configSnackbar } = getContext("snackbar");

  const { page, session } = stores();
  const dispatch = createEventDispatcher();
  const transitionParams = {
    delay: 0,
    duration: 400,
  };

  let errors = null;
  let message = null;
  let viewportSize;
  let snackbar;
  let statusEl;
  let flashEl;
  let flashOutroEnded = false;

  export let data = null;
  export let success = null;

  $: flyTransitionParams = { ...transitionParams, y: -80 };
  $: statusMessage = !$session.user
    ? "Bitte loggen Sie sich ein"
    : `Willkommen ${$session.user.name}`;

  onMount(() => {
    viewportSize = windowSize();
    snackbar = getSnackbar();

    window.addEventListener("resize", () => (viewportSize = windowSize()));

    // start intro
    setTimeout(() => {
      flashOutroEnded = true;
    }, 1000); // should be the same as defined in flashStore to avoid flashing

    if (success && data.user) {
      saveSession();
    } else if (success === false) {
      // wait until snackbar is ready
      let detail = { data, success };
      setTimeout(() => handleLogin({ detail }), 10);
    }
  });

  function dispatchCustomEvent(e, node) {
    let detail = {};
    let path;
    let fromFlash = node == flashEl;
    let fromStatus = node == statusEl;

    switch (e.type) {
      case "introstart":
        break;
      case "introend":
        if (fromStatus && $session.user) {
          path = redirectPath($page, $session);
          detail = { ...detail, path };
          window.dispatchEvent(new CustomEvent(e.type, { detail }));
        }
        break;
      case "outrostart":
        fromFlash && (flashOutroEnded = false);
        break;
      case "outroend":
        fromFlash && (flashOutroEnded = true);
        break;
    }
  }

  function handleLogin(e) {
    let res = e.detail;

    message = res.message || res.data.message || res.statusText;

    if (res.success) {
      flash.update({ message });
      res.data.user &&
        ($session.user = res.data.user) &&
        ($session.role = res.data.user.group.name);
      res.data.groups && ($session.groups = res.data.groups);

      configSnackbar(message);
      snackbar.open();
    } else {
      flash.update({ type: "warning", message });
      configSnackbar(message);
      snackbar.open();
    }
  }

  async function saveSession() {
    const res = await post("auth/proxy", { ...data });
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
  :global(.warning).login-header {
    color: var(--prime-unused);
  }
  :global(.success).login-header {
    color: var(--flash);
  }
  .flyer {
    position: absolute;
    top: -60px;
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Login</title>
</svelte:head>

<div class="flex flex-1 justify-center m-8">
  <div class="flex flex-col justify-center">
    <div class="relative">
      {#if $flash.message}
        <div
          bind:this={flashEl}
          class="flyer"
          transition:fly={flyTransitionParams}
          on:outrostart={(e) => dispatchCustomEvent(e, flashEl)}
          on:outroend={(e) => dispatchCustomEvent(e, flashEl)}>
          <Header h="4" mdc class="m-2">{$flash.message}</Header>
        </div>
      {:else if flashOutroEnded}
        <div
          bind:this={statusEl}
          class="flyer"
          in:fly={flyTransitionParams}
          on:introend={(e) => dispatchCustomEvent(e, statusEl)}
          style="top: -60px;">
          <Header h="4" mdc class="m-2">{statusMessage}</Header>
        </div>
      {/if}
      <LoginForm on:loginResponse={handleLogin} />
    </div>
  </div>
</div>

<div class="hidden">
  <ListErrors {errors} />
  <ListMessages {message} />
</div>
