<script context="module">
  import * as api from "api";

  export async function preload(page) {
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
  import { onMount, getContext } from "svelte";
  import { stores, goto } from "@sapper/app";
  import { ListMessages, ListErrors, LoginForm } from "components";
  import { flash } from "../../stores/flashStore";
  import { fly } from "svelte/transition";
  import { post, windowSize, redirectPath, proxyEvent } from "utils";
  import Paper, { Title, Subtitle, Content } from "@smui/paper/styled";
  import { _ } from "svelte-i18n";

  const { getSnackbar, configSnackbar } = getContext("snackbar");

  const { page, session } = stores();
  const transitionParams = {
    delay: 0,
    duration: 200,
  };

  let errors = null;
  let viewportSize;
  let message = "";
  let snackbar;
  let statusEl;
  let flashEl;
  let root;
  let flashOutroEnded = false;

  /**
   * For token logins
   * from preload
   */
  export let data = null;
  export let success = false;

  $: flyTransitionParams = { ...transitionParams, x: -80 };
  $: message = ((user) => {
    return {
      text:
        (user && $_("text.welcome-message", { values: { name: user.name } })) ||
        $_("text.login-text"),
      type: "success",
    };
  })($session.user);

  onMount(() => {
    root = document.documentElement;
    root.classList.add("is-login-page");

    viewportSize = windowSize();
    window.addEventListener("resize", setViewportSize);

    snackbar = getSnackbar();

    /**
     * As for displaying the result message: there are two steps:
     * The flashStore handles the (wait) time the servers result message should stay visible.
     * After that (amount of time) the message will be set empty and will therefore be unmounted.
     * As a result a second message is triggered to fly in.
     * This second message will be either a welcome message (on success) or
     * a default message (on first appearance)
     *
     * Handle Form or Token login
     */
    if (!data) {
      /**
       * Form login
       */
      flash.update({ message: message.text, wait: -1 });
    } else {
      if (success) {
        /**
         * Token Login succeeded
         * especially the user object returned from the Apache Server which will here
         * passed to node may not exceed a certain payload size in order to avoid errors
         * this can be achieved by populating the user with only the minimal necessary assotiations:
         * Groups, Avatar, Token, Videos
         */
        flash.update({ type: "success", ...data });
        saveSession();
      } else {
        /**
         * Token login failed
         */
        flash.update({ type: "warning", ...data, wait: -1 });
      }
      // configSnackbar(data.message);
      configSnackbar(message);
      snackbar.open();
    }

    return () => {
      window.removeEventListener("resize", setViewportSize);
      root.classList.remove("is-login-page");
    };
  });

  function setViewportSize() {
    viewportSize = windowSize();
  }

  function redirectAfterIntroEnd(e) {
    if ($session.user) {
      goto(redirectPath($page, $session));
    }
  }

  async function saveSession() {
    const res = await post("auth/proxy", { ...data });
    if (res) {
      res.user && ($session.user = res.user);
      res.groups && ($session.groups = res.groups);
      res.expires && ($session.expires = new Date(res.expires));
      $session.role = res.user.group.name;

      if (res.renewed) localStorage.setItem("renewed", res.renewed);
      proxyEvent("session:started");

      configSnackbar(
        $_("text.external-login-welcome-message", {
          values: { name: res.user.name },
        })
      );
      snackbar.open();
    }
  }
</script>

<svelte:head>
  <title>Physiotherapy Online | Login</title>
</svelte:head>

<div class="flex flex-1 justify-center m-8">
  <div class="flex flex-col justify-center">
    <Paper elevation="20">
      <div class="flyer">
        {#if $flash.message}
          <div
            bind:this={flashEl}
            class="flex justify-center message {$flash.type}"
            transition:fly={flyTransitionParams}
            on:outrostart={(e) => (flashOutroEnded = false)}
            on:outroend={(e) => (flashOutroEnded = true)}
          >
            <h5 class="m-2 mdc-typography--headline5 headline">
              {$flash.message}
            </h5>
          </div>
        {:else if flashOutroEnded}
          <div
            bind:this={statusEl}
            class="flex justify-center message {message.type}"
            in:fly={flyTransitionParams}
            on:introend={(e) => redirectAfterIntroEnd(e)}
          >
            <h5 class="m-2 mdc-typography--headline5 headline">
              {message.text}
            </h5>
          </div>
        {/if}
      </div>
      <Paper elevation="0">
        <Content>
          <LoginForm />
        </Content>
      </Paper>
    </Paper>
  </div>
</div>

<div class="hidden">
  <ListErrors {errors} />
  <ListMessages {message} />
</div>

<style>
  .flyer {
    height: 50px;
    overflow: hidden;
    position: relative;
  }
  .message {
    margin: 0 auto;
  }
  .message .headline {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :global(.error).message {
    color: var(--error);
  }
  :global(.info).message {
    color: var(--info);
  }
  :global(.warning).message {
    color: var(--warning);
  }
  :global(.success).message {
    color: var(--success);
  }
</style>
