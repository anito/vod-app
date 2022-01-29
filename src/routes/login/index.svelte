<script context="module">
  import * as api from "api";

  export async function preload(page) {
    let token = page.query.token;
    if (token) {
      const res = await api.get(`login/?token=${token}`);

      if (res) {
        return { ...res };
      }
    }
  }
</script>

<script>
  import { onMount } from "svelte";
  import { stores, goto } from "@sapper/app";
  import { ListMessages, ListErrors, LoginForm } from "components";
  import { flash } from "stores/flashStore";
  import { fly } from "svelte/transition";
  import { windowSize, redirectPath, proxyEvent } from "utils";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import { _ } from "svelte-i18n";

  const { page, session } = stores();
  const transitionParams = {
    delay: 0,
    duration: 200,
  };

  let errors = null;
  let viewportSize;
  let message = "";
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
    return (
      (user && {
        text: $_("text.welcome-message", { values: { name: user.name } }),
        type: "success",
      }) || {
        text: $_("text.login-text"),
      }
    );
  })($session.user);

  onMount(() => {
    root = document.documentElement;
    root.classList.add("is-login-page");

    viewportSize = windowSize();
    window.addEventListener("resize", setViewportSize);

    /**
     * DISPLAY RESULT MESSAGES
     * There are two steps:
     * 
     * Message 1: The flashStore handles the "wait" time the first message should stay visible until the servers result message appears
     * After that "wait" time) the message will be set empty and will therefore be unmounted.
     * 
     * Message 2: After the "wait" time a second message will be triggered by the store.
     * This second message will be either a welcome message (on success) or
     * a default message (on first appearance)
     */
    if (!data) {
      /**
       * Form login
       */
      flash.update({ message: message.text, wait: -5 });
    } else {
      /**
       * Token login
       */
      if (success) {
        
        flash.update({ type: "success", ...data });
        setTimeout(scheduleStart, 100, data);
      } else {
        flash.update({ type: "warning", ...data, wait: 5000 });
      }
    }

    return () => {
      window.removeEventListener("resize", setViewportSize);
      root.classList.remove("is-login-page");
    };
  });

  function scheduleStart(data) {
    proxyEvent("session:start", { data })
  }

  function setViewportSize() {
    viewportSize = windowSize();
  }

  function redirectAfterIntroEnd(e) {
    if ($session.user) {
      goto(redirectPath($page, $session));
    }
  }
</script>

<svelte:head>
  <title>Physiotherapy Online | Login</title>
</svelte:head>

<div in:fly={{x: -200, duration: 800}} out:fly={{x: 200}} class="flex flex-1 justify-center m-8">
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
    color: var(--prime);
  }
  .message .headline {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :global(.error).message {
    color: var(--error) !important;
  }
  :global(.info).message {
    color: var(--info) !important;
  }
  :global(.warning).message {
    color: var(--warning) !important;
  }
  :global(.success).message {
    color: var(--success) !important;
  }
</style>
