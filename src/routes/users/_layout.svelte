<script context="module">
  import * as api from 'api';
  import { users } from '../../stores/userStore';
  import { videos } from '../../stores/videoStore';

  export async function preload({ query }, { user }) {
    let usersData, videoData;

    const resUsers = await api.get('users', user && user.token);

    if (resUsers.success) {
      users.update(resUsers.data);
      usersData = resUsers.data;
    } else {
      this.error((resUsers.data && resUsers.data.code) || resUsers.status, resUsers.message || resUsers.responseText);
    }

    const resVideos = await api.get('videos', user && user.token);

    if (resVideos.success) {
      videos.update(resVideos.data);
      videoData = resVideos.data;
    } else {
      this.error(
        (resVideos.data && resVideos.data.code) || resVideos.status,
        resVideos.message || resVideos.responseText
      );
    }

    return { usersData, videoData, ...query };
  }
</script>

<script>
  import { stores, goto } from '@sapper/app';
  import { onMount, getContext } from 'svelte';
  import { infos } from '../../stores/infoStore';
  import { post } from 'utils';
  import Layout from './layout.svelte';
  import { InfoChips, SimpleUserCard, Ticker } from 'components';
  import { proxyEvent } from 'utils';
  import Button, { Icon } from '@smui/button';
  import Fab, { Label } from '@smui/fab';
  import Textfield from '@smui/textfield';
  import { Icon as TextfieldIcon } from '@smui/textfield/icon';
  import HelperText from '@smui/textfield/helper-text';
  import List from '@smui/list';
  import Dialog, { Title as DialogTitle, Content, Actions, InitialFocus } from '@smui/dialog';
  import { _, locale } from 'svelte-i18n';

  const { page, session } = stores();
  const { getSnackbar, configSnackbar } = getContext('snackbar');
  const TAB = 'time';

  export let segment; // user.id (or slug) in case we start from a specific user e.g. /users/23
  // from preload
  export let usersData = [];
  export let videoData = [];
  export let tab = TAB;

  let code;
  let currentUser;
  let username;
  let active;
  let expires;
  let hasExpired;
  let token;
  let tokenId;
  let tokenVal;
  let magicLink;
  let selectionIndex;
  let search = '';
  let snackbar;
  let message;
  let infoDialog;
  let generateTokenDialog;
  let activateUserDialog;
  let resolveAllDialog;
  let renewedTokenDialog;
  let removeTokenDialog;
  let redirectDialog;
  let user = $session.user;

  // from preload
  users.update(usersData);
  videos.update(videoData);

  $: selectionUserId = segment;
  $: currentUser = ((id) => $users.filter((usr) => usr.id === id))(selectionUserId)[0];
  $: ((usr) => {
    username = usr && usr.name;
    active = (usr && usr.active) || false;
    token = usr && usr.token;
    tokenId = (token && token.id) || null;
    tokenVal = (token && token.token) || '';
    expires = usr && usr.expires;
    hasExpired = (expires && expires * 1000 < +new Date().getTime()) || false;
    magicLink = (tokenVal && `http://${$page.host}/login?token=${tokenVal}&lang=${$locale}`) || '';
  })(currentUser);
  $: filteredUsers = $users.filter((user) => user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1);
  $: tab = ((t) => (!t && TAB) || t)(tab);
  $: userIssues =
    ($infos.has(selectionUserId) && $infos.get(selectionUserId).params.filter((info) => info.type === 'issue')) || [];

  onMount(() => {
    snackbar = getSnackbar();
    let renewed;
    if ((renewed = localStorage.getItem('renewed')) && renewed == ($session.user && $session.user.id)) {
      renewedTokenDialog.open();
    }

    // window.addEventListener('MDCChip:interaction', chipInteractionHandler);
    window.addEventListener('INFO:open:ResolveAllDialog', resolveAllHandler);
    window.addEventListener('INFO:open:InfoDialog', infoDialogHandler);
    window.addEventListener('INFO:user:Activate', activateUserHandler);
    window.addEventListener('INFO:token:Remove', removeTokenHandler);
    window.addEventListener('INFO:token:Generate', generateTokenHandler);
    window.addEventListener('INFO:token:Redirect', tokenRedirectHandler);

    return () => {
      // window.removeEventListener('MDCChip:interaction', chipInteractionHandler);
      window.removeEventListener('INFO:open:ResolveAllDialog', resolveAllHandler);
      window.removeEventListener('INFO:open:InfoDialog', infoDialogHandler);
      window.removeEventListener('INFO:user:Activate', activateUserHandler);
      window.removeEventListener('INFO:token:Remove', removeTokenHandler);
      window.removeEventListener('INFO:token:Generate', generateTokenHandler);
      window.removeEventListener('INFO:token:Redirect', tokenRedirectHandler);
    };
  });

  async function extendSession() {
    console.log('extending session...');
    const res = await post('auth/session', {});
    if (res) {
      proxyEvent('session:extend', { expires: res.expires });
    }
  }

  async function addUser() {
    await goto('users/add');
  }

  async function generateToken() {
    const res = await api.post(`tokens?lang=${$locale}`, { user_id: currentUser.id }, user.token);

    let message;
    if (res.success) {
      users.put({ ...res.data });
      message = res.message;
      configSnackbar(message);
      snackbar.open();
      return res;
    } else {
      try {
        // validation message
        let message = res.data.errors.token._isUnique || res.data.massage || 'Error';
        configSnackbar(message);
      } catch (e) {}
      snackbar.open();
    }
  }

  async function removeToken() {
    const res = await api.del(`tokens/${tokenId}?lang=${$locale}`, user.token);
    if (res.success) {
      users.put({ ...currentUser, ...res.data });
      configSnackbar(res.message);
      snackbar.open();
    } else {
      configSnackbar(res.message);
      snackbar.open();
    }
  }

  async function activateUser(state = {}) {
    let data = 'active' in state ? state : { active: !active };
    const res = await api.put(`users/${selectionUserId}?lang=${$locale}`, data, user && user.token);

    message = res.message || res.data.message || res.statusText;
    code = (res.data && res.data.code) || res.status;

    if (res) {
      (res.success && users.put({ ...currentUser, ...data })) || (active = !active);
      configSnackbar(message);
      snackbar.open();
    }
  }

  function resolveAll() {
    for (const info of userInfos) {
      proxyEvent(info.eventType, { silent: true });
    }
  }

  function resolveAllHandler(e) {
    resolveAllDialog.open();
  }

  function activateUserHandler(e) {
    (e.detail.silent && activateUser({ active: true })) || activateUserDialog.open();
  }

  function generateTokenHandler(e) {
    (e.detail.silent && generateToken()) || generateTokenDialog.open();
  }

  function removeTokenHandler(e) {
    removeTokenDialog.open();
  }

  function tokenRedirectHandler(e) {
    redirectDialog.open();
  }

  function infoDialogHandler(e) {
    infoDialog.open();
  }

  async function resolveAllDialogCloseHandler(e) {
    if (e.detail.action === 'approved') {
      resolveAll();
    }
  }

  async function activateUserDialogCloseHandler(e) {
    if (e.detail.action === 'approved') {
      activateUser({ active: true });
    }
  }

  async function generateTokenDialogCloseHandler(e) {
    if (e.detail.action === 'approved') {
      generateToken();
    }
  }

  async function removeTokenDialogCloseHandler(e) {
    if (e.detail.action === 'approved') {
      removeToken();
    }
  }

  async function renewTokenDialogCloseHandler(e) {
    if (e.detail.action === 'approved') {
      localStorage.removeItem('renewed');
    }
  }

  function redirectDialogCloseHandler(e) {
    if (/^(https?|ftp|torrent|image|irc):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i.test(e.detail.action))
      location.href = e.detail.action;
  }

  function chipInteractionHandler(e) {
    console.log('chipInteractionHandler', e);
  }
</script>

<Layout sidebar>
  <slot />
  <div class="sidebar" slot="side" style="flex: 1;">
    <div class="flex flex-col p-2">
      <Textfield
        variant="filled"
        withTrailingIcon
        bind:value={search}
        label={$_('text.search-user')}
        input$aria-controls="helper-text"
        input$aria-describedby="helper-text"
      >
        <TextfieldIcon tabindex="1" class="material-icons" on:click={() => (search = '')}
          >{search.length && 'close'}</TextfieldIcon
        >
      </Textfield>
      <HelperText id="helper-text">tippe etwas um Namen zu finden</HelperText>
    </div>
    {#if $users.length}
      <List class="users-list" twoLine avatarList singleSelection bind:selectedIndex={selectionIndex}>
        {#each filteredUsers as user (user.id)}
          <a rel="prefetch" href="users/{user.id}?tab={tab}">
            <SimpleUserCard class="flex" {selectionUserId} {user} />
          </a>
        {/each}
      </List>
    {:else}
      <div class="paper-container flex justify-center">
        <div>{$_('text.user-not-found')}</div>
      </div>
    {/if}
  </div>
  <div slot="ad"><Ticker /></div>
  <div slot="footer">
    <InfoChips staggered {selectionUserId} />
  </div>
</Layout>
<Dialog bind:this={infoDialog} aria-labelledby="info-title" aria-describedby="info-content">
  <DialogTitle id="info-title">Was ist ein Token?</DialogTitle>
  <Content id="info-content">
    <div class="item">Ein Token ist eine kryptische Zeichenkette mit verschlüsselten (Anmelde-) Informationen.</div>
    <div class="item">
      <details>
        <summary>Beispiel</summary>
        <pre>
          eyJ0eXAiiJKV1QiLCJhbGciOiJIUzI1NiJ9.as...
        </pre>
      </details>
      <details>
        <summary>Wofür wird der Token verwendet?</summary>
        <p>
          Der Token wird zur Authentifizierung verwendet. D.h. das übliche fehlerbehaftete Eintippen von
          Benutzernamen/Passwort entfällt und es kann sofort losgelegt werden. Der Token beinhaltet verschlüsselte
          Parameter wie Gültigkeitsdauer und Benutzername. Kann am Server eine Zuordnung stattfinden, wird der
          entsprechende Benutzer angemeldet.
        </p>
      </details>
      <details>
        <summary>Wie gehe ich weiter vor?</summary>
        <p>
          Benutzen Sie den Button
          <i class="button">{$_('text.generate-token')}</i>, um einen <i>magischen Link</i> zu erzeugen. Dadurch wird auch
          automatisch der Account freigeschaltet. Die Gültigkeit des generierten Token richtet sich automatisch nach der
          Buchungsdauer des zuletzt auslaufenden Videos.
        </p>
        <p>
          Beachten Sie, dass bei <strong>Hinzubuchen weiterer Videos</strong> auch dringend ein neuer Token generiert
          und ausgehändigt werden muss. Nur dadurch wird sichergestellt, dass sich der Benutzer über den gesamten
          Buchungszeitraums hinweg am Portal anmelden kann.
          <strong
            >Ist ein Token verfallen, ist danach auch eine konventionelle Anmeldung per Anmeldeformular nicht mehr
            möglich.</strong
          > Etwaige noch aktive Inhalte können in diesem Fall von Ihrem Kunden nicht mehr genutzt werden!
        </p>
        <p>
          <strong
            >Stellen Sie jederzeit sicher, dass Ihre KlientInnen im Besitz des aktuellen Tokens sind. Er ist
            gewissermassen der <i>Schlüssel</i> zu den gebuchten Inhalten.</strong
          >
        </p>
      </details>
      <details>
        <summary>Was tun bei Verdacht auf Missbrauch des Tokens?</summary>
        <p>
          Generieren Sie in diesem Fall über den Button
          <i class="button">{$_('text.generate-token')}</i>
          einen neuen Token. Alle zuvor generierten Token werden dadurch unbrauchbar.
        </p>
        <p>
          Verwenden Sie den Button
          <i class="button">{$_('text.remove-token')}</i>, um das Konto zu sperren. Alternativ können Sie auch
          <i>Deactivate User</i>
          anklicken. In beiden Fällen ist eine Anmeldung nicht mehr möglich.
        </p>
      </details>
    </div>
    <div class="item">
      <h4>{$_('text.transfer-to-third-parties')}</h4>
      <Icon class="material-icons leading">warning</Icon>
      <p>
        Jeder im Besitz dieses Links verfügt automatisch über Zugriff auf gespeicherte Benutzerdaten, einschliesslich
        gebuchter Inhalte. Gehen Sie daher äusserst achtsam mit dem Token (Link) um und geben Sie den Link keinesfalls
        an Dritte weiter.
      </p>
    </div>
    <div class="item">
      <h4>{$_('text.validity')}</h4>
      <p>
        Die Gültigkeit des Tokens richtet sich jeweils nach dem Buchungsende des spätesten Videos. Falls gerade keine
        Videos gebucht sind, aber dennoch ein neuer Token angefordert wird, hat dieser eine generelle Gültigkeit von 30
        Tagen.
      </p>
    </div>
  </Content>
  <Actions>
    <Button action="approved" default use={[InitialFocus]}>
      <Label>{$_('text.close')}</Label>
    </Button>
  </Actions>
</Dialog>
<Dialog
  bind:this={resolveAllDialog}
  aria-labelledby="info-title"
  aria-describedby="info-content"
  on:MDCDialog:closed={resolveAllDialogCloseHandler}
>
  {#if userIssues.length}
    <DialogTitle id="info-title">{$_('text.content-inaccessible')}</DialogTitle>
    <Content id="info-content">
      <div class="item">
        <p>Der Benutzer <strong>{username}</strong> kann momentan nicht auf die von ihm gebuchten Inhalte zugreifen.</p>
        <p>Sollen die folgenden Aktionen ausgeführt werden?</p>
      </div>
      <div class="list">
        <ul class="reasons-list">
          {#each userIssues as issue}
            <li>{$_(issue.label)}</li>
          {/each}
        </ul>
      </div>
    </Content>
    <Actions>
      <Button action="none">
        <Label>{$_('text.cancel')}</Label>
      </Button>
      <Button action="approved" variant="unelevated" default use={[InitialFocus]}>
        <Label>{$_('text.resolve-conflicts')}</Label>
      </Button>
    </Actions>
  {:else}
    <Content id="info-content">
      <div class="item">
        {$_('text.issues-fixed')}
      </div>
    </Content>
    <Actions>
      <Button action="none" variant="unelevated" default use={[InitialFocus]}>
        <Label>{$_('text.close')}</Label>
      </Button>
    </Actions>
  {/if}
</Dialog>
<Dialog
  bind:this={activateUserDialog}
  aria-labelledby="info-title"
  aria-describedby="info-content"
  on:MDCDialog:closed={activateUserDialogCloseHandler}
>
  <DialogTitle id="info-title">{username} {active ? 'deaktivieren' : 'aktivieren'}</DialogTitle>
  <Content id="info-content">
    <div class="item">
      <p>Soll Benutzer <strong>{username}</strong> {active ? 'deaktiviert' : 'aktiviert'} werden?</p>
    </div>
  </Content>
  <Actions>
    <Button action="none">
      <Label>{$_('text.cancel')}</Label>
    </Button>
    <Button action="approved" variant="unelevated" default use={[InitialFocus]}>
      <Label>{active ? $_('text.deactivate-user') : $_('text.activate-user')}</Label>
    </Button>
  </Actions>
</Dialog>
<Dialog
  bind:this={generateTokenDialog}
  aria-labelledby="info-title"
  aria-describedby="info-content"
  on:MDCDialog:closed={generateTokenDialogCloseHandler}
>
  <DialogTitle id="info-title">{$_('text.generate-token')}</DialogTitle>
  <Content id="info-content">
    <div class="item">
      {#if token && !hasExpired}
        <Icon class="material-icons leading">warning</Icon>
        <p>Der bisherige Token wird dadurch unbrauchbar!</p>
      {/if}
      <p>{@html $_('messages.transfer-token-reminder', { values: { name: username } })}</p>
    </div>
  </Content>
  <Actions>
    <Button action="none">
      <Label>{$_('text.cancel')}</Label>
    </Button>
    <Button action="approved" variant="unelevated" default use={[InitialFocus]}>
      <Label>{$_('text.generate-token')}</Label>
    </Button>
  </Actions>
</Dialog>
<Dialog
  bind:this={removeTokenDialog}
  aria-labelledby="info-title"
  aria-describedby="info-content"
  on:MDCDialog:closed={removeTokenDialogCloseHandler}
>
  <DialogTitle id="info-title">Token löschen</DialogTitle>
  <Content id="info-content">
    <Icon class="material-icons leading">warning</Icon>
    <div class="item">Achtung, durch Löschen des Token wird der Account gesperrt!</div>
  </Content>
  <Actions>
    <Button action="none">
      <Label>{$_('text.cancel')}</Label>
    </Button>
    <Button action="approved" variant="unelevated" default use={[InitialFocus]}>
      <Label>{$_('text.delete-token-and-deactivate-account')}</Label>
    </Button>
  </Actions>
</Dialog>
<Dialog
  bind:this={redirectDialog}
  aria-labelledby="event-title"
  aria-describedby="event-content"
  on:MDCDialog:closed={redirectDialogCloseHandler}
>
  <DialogTitle id="event-title">{$_('text.magic-link')}</DialogTitle>
  <Content id="event-content">
    {#if userIssues.length}
      <p>{@html $_('messages.login-will-fail', { values: { name: username } })}</p>
      <div class="reasons">
        {#each userIssues as issue}
          <Button
            style="display: block;"
            variant="raised"
            on:click={() => proxyEvent(issue.eventType, { silent: true })}
          >
            <Label>{$_(issue.label)}</Label>
          </Button>
        {/each}
      </div>
    {/if}
    <p>{$_('messages.you-will-be-logged-out')}</p>
  </Content>
  <Actions>
    <Button action="none">
      <Label>{$_('text.cancel')}</Label>
    </Button>
    <Button variant="unelevated" action={magicLink} use={[InitialFocus]}>
      <Label class="token-button-label"
        >{hasExpired || !active ? $_('text.continue-anyways') : $_('text.switch-user')}</Label
      >
    </Button>
  </Actions>
</Dialog>
<Dialog
  bind:this={renewedTokenDialog}
  aria-labelledby="info-title"
  aria-describedby="info-content"
  on:MDCDialog:closed={renewTokenDialogCloseHandler}
>
  <DialogTitle id="info-title">{$_('text.token-updated')}</DialogTitle>
  <Content id="info-content">
    <div class="item">
      <p>{$_('text.token-was-renewed')}</p>
    </div>
  </Content>
  <Actions>
    <Button action="none">
      <Label>{$_('text.close')}</Label>
    </Button>
    <Button action="approved" variant="unelevated" default use={[InitialFocus]}>
      <Label>{$_('text.got-it')}</Label>
    </Button>
  </Actions>
</Dialog>
{#if $session.role === 'Administrator'}
  <div class="fab-add-user">
    <Fab class="floating-fab" color="primary" on:click={addUser} extended>
      <Label>{$_('text.new-user')}</Label>
      <Icon class="material-icons">person_add</Icon>
    </Fab>
  </div>
{/if}

<style>
  .paper-container {
    display: flex;
    flex: 1;
    justify-content: center;
  }
  .fab-add-user {
    position: absolute;
  }
  [slot='footer'] {
    color: var(--text-light-grey);
    font-size: 0.8em;
  }
  :global(.datapicker--open) .fab-add-user,
  :global(.add-user-view--open) .fab-add-user {
    display: none;
  }
  :global(.grid:not(.sidebar) .grid-item.side) {
    display: none;
  }
  h4 {
    margin: revert;
  }
  pre {
    overflow: auto;
    padding: 1.5rem 2rem;
    margin: 0.8rem 0 2.4rem;
    /* max-width: var(--code-w); */
    border-radius: var(--border-r);
    box-shadow: 1px 1px 1px rgba(68, 68, 68, 0.12) inset;
    background: var(--background);
  }
  .reasons > :global(*) {
    display: block;
    margin: 1em 0;
  }
  .reasons-list {
    list-style: disc;
    margin: 1em 0;
  }
  .reasons-list li {
    margin-left: 1em;
    font-weight: 600;
  }
</style>
