<script>
  import { onMount } from 'svelte';
  import { goto, stores } from '@sapper/app';
  import { flash } from '../stores/flashStore';
  import { post, createRedirectSlug } from 'utils';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import { _ } from 'svelte-i18n';

  const dev = process.env.NODE_ENV === 'development';
  const { page, session } = stores();

  export let status;
  export let error;

  $: status === 401 && (error.message = $_('error.error401'));
  $: status === 403 && (error.message = $_('error.error403'));
  $: status === 404 && (error.message = $_('error.error404'));

  onMount(async () => {
    flash.update({
      type: 'error',
      message: error.message || error,
      status,
    });
    if (error.message && error.message.toLowerCase() === 'expired token') {
      status = 401;
    }
    if ($session.user && 401 === status) {
      const res = await post(`auth/logout`);
      if (res.success) {
        $session.user = null;
        $session.role = null;
        $session.groups = null;
        gotoLogin();
      }
    } else {
      gotoLogin();
    }
  });

  async function gotoLogin() {
    let redirectSlug = status === 404 ? '' : createRedirectSlug($page);
    goto(`login${redirectSlug}`);
  }
</script>

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
