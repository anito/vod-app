<script>
  import { onMount } from "svelte";
  import { flash } from "../stores/flashStore";
  import { goto, stores } from "@sapper/app";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";

  const dev = process.env.NODE_ENV === "development";
  const { page } = stores();

  export let status = 500;
  export let error;

  $: errorMeassgeTemplate = ((message) => `<div class="error">${message}<div>`)(
    error.message
  );

  function redirect(page) {
    let tab = page.query.tab;
    let path = page.path;
    let bit = "";
    return path
      ? (bit = `?redirect=${path}`) && tab
        ? bit + `&tab=${tab}`
        : bit
      : bit;
  }

  onMount(() => {
    if (status >= 400) {
      flash.update({
        type: "error",
        message: error.message,
      });
      setTimeout((params) => goto(`login${params}`), 1500, redirect($page));
    }
  });
</script>

<style>
  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
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

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="wrapper">
  <h1>{status}</h1>
  <Paper color="secondary" style="align-self: center;">
    <Title style="color: var(--text-light)">{error.message}</Title>
  </Paper>
</div>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
