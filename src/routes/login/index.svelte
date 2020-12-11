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
  import { stores } from "@sapper/app";
  import { ListMessages, ListErrors, LoginForm } from "components";
  import { Header } from "@sveltejs/site-kit";
  import { flash } from "../../stores/flashStore";
  import { fly, fade, slide } from "svelte/transition";
  import { windowSize } from "utils";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";

  const { getSnackbar, configSnackbar } = getContext("snackbar");

  const { page, session } = stores();
  const dispatch = createEventDispatcher();
  const transitionParams = {
    delay: 0,
    duration: 200,
  };

  let errors = null;
  let message = null;
  let viewportSize;
  let snackbar;
  let statusEl;
  let flashEl;
  let root;
  let flashOutroEnded = false;

  export let data = null;
  export let success = null;

  $: flyTransitionParams = { ...transitionParams, x: -80 };
  $: statusMessage = {
    text: !$session.user
      ? "Bitte loggen Sie sich ein"
      : `Willkommen ${$session.user.name}`,
    type: "success",
  };

  onMount(() => {
    root = document.documentElement;
    root.classList.add("is-login-page");

    viewportSize = windowSize();
    window.addEventListener("resize", setViewportSize);

    snackbar = getSnackbar();

    // start intro
    setTimeout(() => {
      flashOutroEnded = true;
    }, 1000); // should be the same as defined in flashStore to avoid clashing

    if (success && data.user) {
      saveSession();
    } else if (success === false) {
      // wait until snackbar is ready
      let detail = { data, success };
      setTimeout(() => {
        flash.update({ type: "warning", message });
        configSnackbar(message);
        snackbar.open();
      }, 10);
    }
    return () => {
      window.removeEventListener("resize", setViewportSize);
      root.classList.remove("is-login-page");
    };
  });

  function setViewportSize() {
    viewportSize = windowSize();
  }

  function dispatchCustomEvent(e) {
    if ($session.user) {
      let detail = {
        path: redirectPath($page, $session),
      };
      window.dispatchEvent(new CustomEvent(e.type, { detail }));
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
</style>

<svelte:head>
  <title>Physiotherapy Online | Login</title>
</svelte:head>

<div class="flex flex-1 justify-center m-8">
  <div class="flex flex-col justify-center">
    <div class="relative">
      <Paper elevation="20">
        <div>
          {#if $flash.message}
            <div
              bind:this={flashEl}
              class="flex justify-center"
              transition:fly={flyTransitionParams}
              on:outrostart={(e) => (flashOutroEnded = false)}
              on:outroend={(e) => (flashOutroEnded = true)}>
              <Header
                h="5"
                mdc
                class="m-2 {$flash.type || statusMessage.type}"
                style="max-width: 400px;">
                {$flash.message}
              </Header>
            </div>
          {:else if flashOutroEnded}
            <div
              bind:this={statusEl}
              class="flyer flex justify-center"
              in:fly={flyTransitionParams}
              on:introend={(e) => dispatchCustomEvent(e, statusEl)}>
              <Header
                h="5"
                mdc
                class="m-2 {flash.type || statusMessage.type}"
                style="max-width: 400px;">
                {statusMessage.text}
              </Header>
            </div>
          {/if}
          <Paper elevation="0">
            <Content>
              <LoginForm />
            </Content>
          </Paper>
        </div>
      </Paper>
    </div>
  </div>
</div>

<div class="hidden">
  <ListErrors {errors} />
  <ListMessages {message} />
</div>
