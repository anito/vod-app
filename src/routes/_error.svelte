<script>
  import { onMount } from "svelte";
  import { goto, stores } from "@sapper/app";
  import { flash } from "../stores/flashStore";
  import { createRedirectSlug } from "utils";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";

  const dev = process.env.NODE_ENV === "development";
  const { page, session } = stores();

  export let status;
  export let error;

  onMount(() => {
    flash.update({
      type: "error",
      message: error.message || error,
      status: status,
    });
    if (400 <= status && status < 500) {
      // gotoLogin(status);
    }
  });
  $: status === 403 && (error.message = "Forbidden");
  $: status === 404 && (error.message = "Not found");

  async function gotoLogin(status) {
    let redirectSlug = status === 404 ? "" : createRedirectSlug($page);
    const res = goto(`login${redirectSlug}`);
    if (res) {
      $session.user = null;
      $session.role = null;
      $session.groups = null;
    }
  }
</script>

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

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="wrapper">
  <h1>{status}</h1>
  <Paper color="secondary" style="align-self: center;">
    <Title style="color: var(--text-light); text-transform: uppercase;">
      {error.message}
    </Title>
  </Paper>
</div>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
