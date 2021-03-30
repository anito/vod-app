<script context="module">
  import * as api from 'api';
  import { post, redirectPath } from 'utils';

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
  import { onMount, getContext } from 'svelte';
  import { stores } from '@sapper/app';
  import { ListMessages, ListErrors, LoginForm } from 'components';
  import { Header } from '@sveltejs/site-kit';
  import { flash } from '../../stores/flashStore';
  import { fly, fade, slide } from 'svelte/transition';
  import { windowSize } from 'utils';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import { _ } from 'svelte-i18n';

  const { getSnackbar, configSnackbar } = getContext('snackbar');

  const { page, session } = stores();
  const transitionParams = {
    delay: 0,
    duration: 200,
  };

  let errors = null;
  let viewportSize;
  let message = '';
  let snackbar;
  let statusEl;
  let flashEl;
  let root;
  let flashOutroEnded = false;

  // from preload
  export let data = null;
  export let success = false;

  $: flyTransitionParams = { ...transitionParams, x: -80 };
  $: statusMessage = ((sessionUser) => {
    return {
      text:
        (!sessionUser && $_('text.login-text')) || $_('text.welcome-message', { values: { name: $session.user.name } }),
      type: 'success',
    };
  })($session.user);

  onMount(() => {
    root = document.documentElement;
    root.classList.add('is-login-page');

    viewportSize = windowSize();
    window.addEventListener('resize', setViewportSize);

    snackbar = getSnackbar();

    // init intro

    // token login success
    if (success && data.user) {
      flash.update({ type: 'success', ...data });
      saveSession();
    } else if (success === false && data) {
      console.log('failed', data);
      // token login failed
      // wait until snackbar is ready
      setTimeout(() => {
        flash.update({ type: 'warning', ...data, delayed: 4000 });
        configSnackbar(data.message);
        snackbar.open();
      }, 500);
    } else {
      setTimeout(() => {
        flash.update({ message: statusMessage.text, keep: true });
      }, 500); // should be the same as defined in flashStore to avoid clashing
    }
    return () => {
      window.removeEventListener('resize', setViewportSize);
      root.classList.remove('is-login-page');
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
      setTimeout(() => window.dispatchEvent(new CustomEvent(e.type, { detail })), 500);
    }
  }

  async function saveSession() {
    const res = await post('auth/proxy', { ...data });
    if (res) {
      ($session.user = res.user) && ($session.role = res.user.group.name);
      res.groups && ($session.groups = res.groups);

      configSnackbar($_('text.external-login-welcome-message', { values: { name: res.user.name } }));
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
            <Header h="5" mdc class="m-2" style="max-width: 400px;">
              {$flash.message}
            </Header>
          </div>
        {:else if flashOutroEnded}
          <div
            bind:this={statusEl}
            class="flex justify-center message {statusMessage.type}"
            in:fly={flyTransitionParams}
            on:introend={(e) => dispatchCustomEvent(e)}
          >
            <Header h="5" mdc class="m-2" style="max-width: 400px;">
              {statusMessage.text}
            </Header>
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
