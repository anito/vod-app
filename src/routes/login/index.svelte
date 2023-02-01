<script context="module">
  export async function preload(page, session) {
    let token = page.query.token;
    if (token) {
      return await this.fetch(`auth/login/?token=${token}`)
        .then(async (res) => res.json())
        .then((res) => {
          return {
            data: {
              ...res,
              fromToken: true
            }
          };
        });
    }
  }
</script>

<script>
  import { stores, goto } from '@sapper/app';
  import { getContext, onMount } from 'svelte';
  import { ListMessages, ListErrors, LoginForm } from 'components';
  import { flash } from 'stores';
  import { sitename } from 'stores';
  import { fly } from 'svelte/transition';
  import { processRedirect, proxyEvent } from 'utils';
  import Paper, { Content } from '@smui/paper';
  import { _ } from 'svelte-i18n';

  const { page, session } = stores();

  let errors = null;
  let message = '';

  export let data;

  const { mounted } = getContext('mounted');

  $: $mounted && init();
  $: loggedin = !!$session.user;
  $: ({ message, type } = $session.user
    ? {
        message: $_('text.welcome-message', { values: { name: $session.user.name } }),
        type: 'success'
      }
    : $page.query.token
    ? {
        message: $_('text.authenticating'),
        type: 'success'
      }
    : {
        message: $_('text.login-text'),
        type: 'success'
      });

  onMount(() => {});

  // listeners are ready
  function init() {
    if (data?.fromToken) {
      loginFromToken();
    }
  }

  async function introendHandler() {
    if ($session.user) {
      const redirect = processRedirect($page, $session);
      setTimeout(() => goto(redirect), 1000);
    }
  }

  async function loginFromToken() {
    if (data.success) {
      proxyEvent('session:start', {
        ...data.data
      });
    } else {
      proxyEvent('session:end', { ...data.data, redirect: '/login' });
    }
  }
</script>

<svelte:head>
  <title>{$sitename} | Login</title>
</svelte:head>

<div
  in:fly={{ x: -200, duration: 800 }}
  out:fly={{ x: 200 }}
  class="flex flex-1 justify-center m-8"
>
  <div class="flex flex-col justify-center">
    <Paper elevation="20">
      <div class="flyer">
        {#if $flash.message}
          <div
            class="flex justify-center items-center message {$flash.type}"
            in:fly={{ delay: 0, duration: 200, x: -80 }}
          >
            <h5 class="m-2 mdc-typography--headline5 headline">
              {$flash.message}
            </h5>
          </div>
        {:else}
          <div
            class="flex justify-center items-center message {type}"
            in:fly={{ delay: 0, duration: 200, x: -80 }}
            on:introend={introendHandler}
          >
            <h5 class="m-2 mdc-typography--headline5 headline">{message}</h5>
          </div>
        {/if}
      </div>
      <div class="login-form loggedin" class:loggedin>
        <Paper elevation="0">
          <Content>
            <LoginForm />
          </Content>
        </Paper>
      </div>
    </Paper>
  </div>
</div>

<div class="hidden">
  <ListErrors {errors} />
  <ListMessages {message} />
</div>

<style>
  .login-form {
    transition: opacity 0.4s ease-in;
    opacity: 1;
  }
  .login-form.loggedin {
    transition: opacity 0.4s ease-in;
    opacity: 0.5;
    pointer-events: none;
  }
  .flyer {
    height: 100px;
    overflow: hidden;
    position: relative;
  }
  .message {
    margin: 0 auto;
    color: var(--primary);
  }
  .message .headline {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
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
  @media (min-width: 768px) {
    .wrapper {
      width: 600px;
    }
    .message .headline {
      max-width: 100%;
      overflow: auto;
      white-space: normal;
      text-align: center;
    }
  }
</style>
