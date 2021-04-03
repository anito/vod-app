<script context="module">
  import { waitLocale } from 'svelte-i18n';

  export async function preload() {
    return waitLocale();
  }
</script>

<script>
  import { stores, goto } from '@sapper/app';
  import isMobile from 'ismobilejs';
  import { onMount, setContext } from 'svelte';
  import { Nav, NavItem } from '@sveltejs/site-kit';
  import Button, { Icon } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Snackbar, { Actions } from '@smui/snackbar';
  import { Label } from '@smui/common';
  import { post, createRedirectSlug, proxyEvent, recoverSession, __session__ } from 'utils';
  import { flash } from '../stores/flashStore';
  import { ticker } from '../stores/tickerStore';
  import { Modal } from '@sveltejs/site-kit';
  import { Jumper } from 'svelte-loading-spinners';
  import { UserGraphic, LoadingModal, LocaleSwitcher } from 'components';
  import { _, locale } from 'svelte-i18n';
  // import ListErrors from 'components';

  const { page, session } = stores();
  const snackbarLifetimeDefault = 4000;
  const redirectDelay = 300;

  export let segment = $page.path.match(/\/([a-z_-]*)/)[1];

  let root;
  let snackbar;
  let message = '';
  let action = '';
  let path = '';
  let timeoutId;
  let isMobileDevice;
  let loggedInButtonTextSecondLine;
  let unsubscribeTicker;

  setContext('snackbar', {
    getSnackbar: () => snackbar,
    configSnackbar,
  });

  $: root && ((user) => root.classList.toggle('loggedin', user))(!!$session.user);
  $: root && ((isAdmin) => root.classList.toggle('admin', isAdmin))($session.role === 'Administrator');
  $: ((seg) => {
    root && ((seg && root.classList.remove('home')) || (!seg && root.classList.add('home')));
  })(segment);
  $: isMobileDevice = isMobile().any;
  $: snackbarLifetime = action ? 6000 : snackbarLifetimeDefault;
  $: $session.user &&
    (loggedInButtonTextSecondLine = $_('text.logged-in-button-second-line', { values: { name: $session.user.name } }));
  // $: $session.expires && ticker.init($session.expires);

  onMount(() => {
    root = document.documentElement;

    window.addEventListener('introend', handleIntroEndHandler);
    window.addEventListener('session:started', sessionStartedHandler);
    window.addEventListener('session:extend', sessionExtendHandler);
    window.addEventListener('session:ended', sessionEndedHandler);
    isMobileDevice && root.classList.add('ismobile');

    if ($session.user) recoverSession($session);

    return () => {
      root.classList.remove('ismobile');
      window.removeEventListener('introend', handleIntroEndHandler);
      window.removeEventListener('session:started', sessionStartedHandler);
      window.removeEventListener('session:extend', sessionExtendHandler);
      window.removeEventListener('session:ended', sessionEndedHandler);
    };
  });

  async function submit(e) {
    if ($session.user) {
      loggedInButtonTextSecondLine = $_('text.one-moment');
      const res = await post(`auth/logout`);
      if (res && res.success) {
        message = res.message;
        proxyEvent('session:ended', { redirect: '/' });

        flash.update({ message });
        configSnackbar(message);
        snackbar.open();
      }
    }
  }

  function configSnackbar(msg, link) {
    snackbar.close();
    configureAction(msg, link);
  }

  function configureAction(msg = '', link) {
    message = msg;
    action = path = '';
    if (typeof link === 'object') {
      path = link.path;
      action = link.action;
    } else {
      path = link;
    }
    !action && path && (message = `${message}...`);
  }

  function handleOpened() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => !action && path && goto(path), redirectDelay);
  }

  function handleClosed() {}

  function handleIntroEndHandler(e) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout((o) => o.path && goto(o.path), redirectDelay, e.detail);
  }

  function sessionStartedHandler() {
    if (__session__.started) return;
    ticker.init($session.expires);
    unsubscribeTicker = ticker.subscribe((val) => {
      val === 0 && proxyEvent('session:ended', { redirect: 'login' });
    });
  }

  function sessionExtendHandler(e) {
    $session.expires = e.detail.expires;
    ticker.init($session.expires);
  }

  function sessionEndedHandler(e) {
    unsubscribeTicker();
    setTimeout(() => {
      goto(`${e.detail.redirect}${createRedirectSlug($page)}`);
      $session.user = null;
      $session.role = null;
      $session.groups = null;
      $session.expires = null;
    }, 1000);
  }
</script>

<Modal>
  {#if $locale}
    <form class="main-menu" on:submit|stopPropagation|preventDefault={submit} method="post">
      <Nav {segment} {page} logo="logo-sticky.svg">
        <NavItem segment="privacy-policy" title={$_('nav.privacy')} let:active>
          <Label>{$_('nav.privacy')}</Label>
        </NavItem>

        {#if $session.user}
          <NavItem segment="videos" title="Videothek" let:active>
            <Icon class="material-icons" style="vertical-align: middle;">video_library</Icon>
            <Label>{$_('nav.library')}</Label>
          </NavItem>
        {/if}

        {#if $session.role === 'Administrator'}
          <NavItem segment="users" title="Administration" let:active>
            <Icon class="material-icons" style="vertical-align: middle;">settings</Icon>
            <Label>Admin</Label>
          </NavItem>
        {/if}

        {#if $session.user}
          <NavItem let:active>
            <Button variant="raised" class="button-logout">
              <span class="button-first-line">Logout</span>
              <Label class="no-break" style="padding-top: 20px; font-size: 0.7rem">
                {@html loggedInButtonTextSecondLine}
              </Label>
            </Button>
          </NavItem>
        {:else}
          <NavItem segment="login" let:active>
            <Button color="secondary" variant="raised" class="button-login">
              <Label>{$_('nav.login')}</Label>
            </Button>
          </NavItem>
        {/if}

        {#if $session.user}
          <NavItem title="Avatar" link="users/{$session.user.id}?tab=user">
            <UserGraphic border="0px 0px 0px 3px var(--prime)" dense width="40" height="40" user={$session.user} />
          </NavItem>
        {:else}
          <NavItem title="Avatar">
            <UserGraphic border="0px 0px 0px 3px var(--prime)" dense width="40" height="40" />
          </NavItem>
        {/if}

        <li class="locale-switcher">
          <LocaleSwitcher />
        </li>
      </Nav>
    </form>
    <slot />
  {/if}
</Modal>
<LoadingModal backgroundColor="#ffffff" opacity=".45">
  <Jumper size="60" color="var(--flash)" unit="px" />
</LoadingModal>

<Snackbar
  snackbarLifetimeMs={snackbarLifetime}
  bind:this={snackbar}
  labelText={message}
  on:MDCSnackbar:closed={handleClosed}
  on:MDCSnackbar:opened={handleOpened}
>
  <Label />
  <Actions>
    {#if action}
      <Button on:click={() => goto(path)}>{action}</Button>
    {/if}
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  .button-first-line {
    position: absolute;
    font-size: 0.46rem;
    top: 20px;
    width: 84%;
    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  :global(.is-login-page) .main-menu :global(button) {
    transform: translateY(-60px);
    transition: all 0.4s ease-out;
  }
  .main-menu :global(button) {
    transform: translateY(0px);
    transition: all 0.4s ease-in;
  }
  .main-menu :global(button) {
    height: 74px;
    width: 130px;
  }
  .main-menu :global(button .no-break) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
