<script context="module">
  import { waitLocale } from 'svelte-i18n';

  export async function preload() {
    return waitLocale();
  }
</script>

<script>
  import { stores, goto } from '@sapper/app';
  import { onMount, setContext } from 'svelte';
  import isMobile from 'ismobilejs';
  import { Icons, Modal } from 'components';
  import Button, { Icon } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Snackbar, { Actions } from '@smui/snackbar';
  import { Label } from '@smui/common';
  import {
    post,
    createRedirectSlug,
    proxyEvent,
    extendSession as sessionExtendHandler,
    locationSearch,
    svg,
    __session__
  } from 'utils';
  import { fabs, flash, settings, theme, ticker, urls, videos, videoEmitter } from 'stores';
  import { Jumper } from 'svelte-loading-spinners';
  import * as api from 'api';
  import {
    UserGraphic,
    LoadingModal,
    LocaleSwitcher,
    FrameworkSwitcher,
    Nav,
    NavItem
  } from 'components';
  import { svg_manifest } from 'svg_manifest';
  import { _, locale } from 'svelte-i18n';
  import { serverConfig } from 'config';
  import { writable } from 'svelte/store';

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
  let emphasize;
  let isMounted = false;

  settings.update({ Session: $session });

  // load configuration from server
  serverConfig();

  const mounted = writable(isMounted);
  setContext('mounted', {
    mounted
  });

  setContext('snackbar', {
    getSnackbar: () => snackbar,
    configSnackbar
  });

  setContext('settings', settings);

  setContext('fab', {
    setFab: (fab) => $session.role === 'Administrator' && fabs.update(fab),
    restoreFab: () => fabs.restore()
  });

  $: user = $session.user;
  $: person = svg(svg_manifest.person, $theme.primary);
  $: logo = svg(svg_manifest.logo_vod, $theme.primary);
  $: root && ((user) => root.classList.toggle('loggedin', user))(!!$session.user);
  $: root &&
    ((isAdmin) => root.classList.toggle('admin', isAdmin))($session.role === 'Administrator');
  $: ((seg) => {
    root && ((seg && root.classList.remove('home')) || (!seg && root.classList.add('home')));
  })(segment);
  $: isMobileDevice = isMobile().any;
  $: snackbarLifetime = action ? 6000 : snackbarLifetimeDefault;
  $: $session.user &&
    (loggedInButtonTextSecondLine = $_('text.logged-in-button-second-line', {
      values: { name: $session.user.name }
    }));
  $: location = locationSearch($page);

  onMount(() => {
    root = document.documentElement;

    window.addEventListener('session:start', sessionStartHandler);
    window.addEventListener('session:started', sessionStartedHandler);
    window.addEventListener('session:extend', sessionExtendHandler);
    window.addEventListener('session:extended', sessionExtendedHandler);
    window.addEventListener('session:end', sessionEndHandler);
    window.addEventListener('session:ended', sessionEndedHandler);
    window.addEventListener('session:recover', sessionRecoverHandler);
    isMobileDevice && root.classList.add('ismobile');

    checkSession();

    let styles = window.getComputedStyle(root);
    theme.set({
      primary: styles.getPropertyValue('--prime'),
      secondary: styles.getPropertyValue('--second')
    });

    $mounted = true;
    return () => {
      root.classList.remove('ismobile');
      window.removeEventListener('session:start', sessionStartHandler);
      window.removeEventListener('session:started', sessionStartedHandler);
      window.removeEventListener('session:extend', sessionExtendHandler);
      window.removeEventListener('session:extended', sessionExtendedHandler);
      window.removeEventListener('session:end', sessionEndHandler);
      window.removeEventListener('session:ended', sessionEndedHandler);
      window.removeEventListener('session:recover', sessionRecoverHandler);
    };
  });

  /**
   * Saves changes on video
   * @param item
   */
  async function put(item, snack) {
    const res = await api.put(`videos/${item.id}?locale=${$locale}`, item, user?.jwt);
    if (res?.success) {
      if (snack) {
        let message = res.message || res.data.message;
        snackbar.isOpen && snackbar.close();
        configSnackbar(message);
        snackbar.open();
      }
      videos.put(item);
    }
  }

  async function del(item, snack) {
    const res = await api.del(`videos/${item.id}?locale=${$locale}`, user?.jwt);
    if (res?.success) {
      if (snack) {
        let message = res.message || res.data.message;
        snackbar.isOpen && snackbar.close();
        configSnackbar(message);
        snackbar.open();
      }

      urls.del(item.id);
      videos.del(item.id);
    }
  }

  videoEmitter.subscribe((t) => {
    if ('put' === t.method) {
      put(t.data, t.snack);
    }
    if ('del' === t.method) {
      del(t.data, t.snack);
    }
  });

  function submit(e) {
    if ($session.user) {
      loggedInButtonTextSecondLine = $_('text.one-moment');
      proxyEvent('session:end');
    }
  }

  function configSnackbar(msg, link) {
    try {
      snackbar.close();
    } catch (e) {}
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

  async function sessionStartHandler({ detail }) {
    const { message } = detail;
    await post('auth/proxy', { ...detail }).then((res) => {
      const { user, groups, expires, renewed } = { ...res };

      $session.user = user;
      $session.role = user.group.name;
      $session.groups = groups;
      $session.expires = expires;

      renewed && localStorage.setItem('renewed', renewed);
      proxyEvent('session:started', { expires });

      flash.update({
        message,
        type: 'success',
        timeout: 2000,
        permanent: false
      });

      configSnackbar(
        $_('text.external-login-welcome-message', {
          values: { name: user.name }
        })
      );
      snackbar.open();
    });
  }

  function sessionStartedHandler(e) {
    if (__session__.started) return;

    // ticker.start($session.expires);

    unsubscribeTicker = ticker.subscribe((val) => {
      if (val === 0) {
        proxyEvent('session:end', { path: '/login' });
      }
    });
  }

  function sessionExtendedHandler(e) {
    $session.expires = e.detail.expires;
    ticker.start($session.expires);
  }

  async function sessionEndHandler(e) {
    if (!$session.user) return;
    // logout from backend
    const res = await post(`auth/logout?locale=${$locale}`);
    if (res?.success) {
      // logout from node session
      proxyEvent('session:ended', { ...e.detail.data });
      message = res.message;

      configSnackbar(message);
      snackbar.open();
    }
  }

  function sessionEndedHandler(e) {
    unsubscribeTicker && unsubscribeTicker();

    $session.user = null;
    $session.role = null;
    $session.groups = null;
    $session.expires = null;

    setTimeout(
      (path) => {
        goto(`${path}${createRedirectSlug($page)}`);
      },
      1000,
      e.detail.path || '/'
    );
  }

  function sessionRecoverHandler() {
    if (!$session.user || $session.expires < Date.now) return;
    proxyEvent('session:started');
  }

  function checkSession() {
    proxyEvent('session:recover');
  }
</script>

<Icons />

<Modal>
  {#if $locale}
    <form class="main-menu" on:submit|stopPropagation|preventDefault={submit} method="post">
      <Nav {segment} {page} {logo}>
        {#if $session.user}
          <NavItem href="/videos" title="Videothek" segment="videos">
            <Icon class="material-icons" style="vertical-align: middle;">video_library</Icon>
            <Label>{$_('nav.library')}</Label>
          </NavItem>
        {/if}

        {#if $session.role === 'Administrator'}
          <NavItem href="/users" title="Administration" segment="users">
            <Icon class="material-icons" style="vertical-align: middle;">settings</Icon>
            <Label>Admin</Label>
          </NavItem>
        {/if}

        {#if $session.user}
          <NavItem segment="login">
            <Button
              variant="raised"
              class="sign-in-out button-logout v-emph v-emph-bounce {emphasize}"
              on:mouseenter={() => (emphasize = 'v-emph-active')}
              on:mouseleave={() => (emphasize = '')}
            >
              <span class="button-first-line v-emph-primary v-emph-down">Logout</span>
              <Label class="no-break v-emph-secondary v-emph-up">
                {@html loggedInButtonTextSecondLine}
              </Label>
            </Button>
          </NavItem>
        {:else}
          <NavItem href="/login{location}">
            <Button color="secondary" variant="raised" class="sign-in-out button-login">
              <Label>{$_('nav.login')}</Label>
            </Button>
          </NavItem>
        {/if}

        {#if $session.user}
          <NavItem title="Avatar" href="/users/{$session.user.id}?tab=user">
            <UserGraphic
              borderSize="3"
              borderColor="--prime"
              dense
              size="40"
              user={$session.user}
              badge={{
                icon: 'settings',
                color: '--prime',
                size: 'small',
                position: 'BOTTOM_RIGHT'
              }}
            />
          </NavItem>
        {:else}
          <NavItem title="Avatar">
            <UserGraphic borderSize="3" borderColor="--prime" dense size="40" fallback={person} />
          </NavItem>
        {/if}

        <NavItem button title={$_('text.choose-locale')}>
          <LocaleSwitcher />
        </NavItem>

        <NavItem button title="{$_('text.choose-framework')}x">
          <FrameworkSwitcher />
        </NavItem>
      </Nav>
    </form>
    <slot />
  {/if}
</Modal>
<LoadingModal backgroundColor="#ffffff" opacity=".45" wait="400">
  <Jumper size="200" color="var(--flash)" unit="px" />
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
    width: 84%;
    text-overflow: ellipsis;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  .main-menu :global(button.sign-in-out) {
    height: 74px;
    width: 130px;
  }
  :global(.is-login-page) .main-menu :global(button.sign-in-out) {
    transform: translateY(-60px);
    transition: all 0.4s ease-out;
  }
  .main-menu :global(button.sign-in-out) {
    transform: translateY(0px);
    transition: all 0.4s ease-in;
  }
  .main-menu :global(button.sign-in-out .no-break) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
