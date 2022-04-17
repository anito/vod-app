<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto, stores } from "@sapper/app";
  import { flash } from "stores/flashStore";
  import { post, createRedirectSlug } from "utils";
  import Paper, { Title } from "@smui/paper";
  import { _ } from "svelte-i18n";

  const dev = process.env.NODE_ENV === "development";
  const { page, session } = stores();
  const WAIT = 3;
  let update, timer, sec, word, unsubscribe, interval;

  export let status;
  export let error;

  $: status === 401 && (error.message = $_("error.error401"));
  $: status === 403 && (error.message = $_("error.error403"));
  $: status === 404 && (error.message = $_("error.error404"));

  onMount(async () => {
    createTimer();
    startTimer();
    flash.update({
      type: "error",
      message: error.message || error,
      status,
    });
    if (error.message && error.message.toLowerCase() === "expired token") {
      status = 401;
    }
    if ($session.user && 401 === status) {
      const res = await post(`auth/logout`);
      if (res.success) {
        $session.user = null;
        $session.role = null;
        $session.groups = null;
      }
    }
  });

  async function gotoLogin() {
    let redirectSlug = createRedirectSlug($page);
    goto(`login${redirectSlug}`);
  }

  function createTimer() {
    timer = { update } = writable(WAIT, () => {
      interval = setInterval(() => {
        update((val) => --val);
      }, 1000);

      return () => {
        clearInterval(interval);
        gotoLogin();
      };
    });
  }

  function startTimer() {
    unsubscribe = timer.subscribe((val) => {
      sec = val;
      word = sec === 1 ? $_("text.second") : $_("text.seconds");
      val === 0 && unsubscribe();
    });
  }
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="wrapper">
  <h1>{status}</h1>
  <Paper color="primary" style="align-self: center;">
    <Title style="color: var(--text-light); text-transform: uppercase;">
      {error.message}
    </Title>
    <div class="">
      {@html $_("text.you_will_be_redirected", { values: { sec, word } })}
    </div>
  </Paper>
</div>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}

<style>
  h1 {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  .wrapper {
    padding-top: var(--nav-h);
    margin: 0 3rem;
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
