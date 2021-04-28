<script>
  import 'components/landing-form-controls.scss';
  import * as api from 'api';
  import { onMount, getContext } from 'svelte';
  import { stores } from '@sapper/app';
  import { Blurb, Hero } from '@sveltejs/site-kit';
  import Layout from './layout.svelte';
  import Textfield from '@smui/textfield';
  import Select, { Option } from '@smui/select';
  import Button, { Icon } from '@smui/button';
  import { _, locale } from 'svelte-i18n';

  const { session } = stores();
  const { getSnackbar, configSnackbar } = getContext('snackbar');

  let name = '';
  let email = '';
  let message = '';
  let invalidEmail = true;
  let value;
  let snackbar;

  $: user = $session.user ? { name: $session.user.name, email: $session.user.email } : { user: { name, email } };
  $: ((user) => {
    name = (user && user.name) || name;
    email = (user && user.email) || email;
  })($session.user);
  $: options = [
    { key: '', label: '' },
    { key: 'send-more', label: $_('text.request-more-information') },
    {
      key: 'message',
      label: $_('text.user-message'),
    },
  ];
  $: content = value === 'message' ? message : '';
  $: continueWith = $session.user
    ? { title: $_('text.yourCourses'), url: 'videos' }
    : { title: $_('text.login'), url: 'login' };
  $: valid = value && name && email && !invalidEmail;
  $: valid = value === 'message' ? !!message : valid;

  onMount(() => {
    value = options[0].key;
    snackbar = getSnackbar();
  });

  async function submit(e) {
    let res, data;
    data = { ...user, subject: options.find((option) => option.key === value).label, content };
    res = await api.post(`sents/add?lang=${$locale}`, data, $session.user && $session.user.token);
    if (res.success) {
      configSnackbar($_('text.thank-you-for-your-message'));
      reset();
    } else {
      configSnackbar($_('text.message-sent-failed'));
    }
    snackbar.open();
  }

  function reset() {
    value = options[0].key;
    message = '';
    name = '';
    email = '';
  }
</script>

<svelte:head>
  <title>Physiotherapy Online | Home</title>
</svelte:head>

<Layout>
  <Hero title="Physio Dips" tagline="" outline="logo.svg" logotype="logo-type.svg" />

  <Blurb>
    <a href="." class="" slot="one">
      <h2>{$_('blocks.p1.header')}</h2>
      <p>
        {$_('blocks.p1.text1')}
      </p>
    </a>

    <div class="flex flex-col flex-1 justify-between" slot="two">
      <h2>{$_('blocks.p2.header')}</h2>
      <div class="flex-1">
        {#if !value}
          <p>{$_('blocks.p2.text')}</p>
          <a href="/{continueWith.url}" class="learn-more">{continueWith.title}</a>
        {:else}
          <p>{$_('blocks.p7.text')}</p>
        {/if}
      </div>
      <form method="post" on:submit|preventDefault={submit} class="user-info-form flex-col justify-between">
        {#if value}
          {#if value && value === 'message'}
            <Textfield class="user-message" textarea bind:value={message} style="width:100%;  " />
          {/if}
          <div class="user-info flex justify-between" style="width: 100%;">
            <Textfield bind:value={name} label="" style="flex: 0.49">
              <span slot="label">
                <Icon class="material-icons" style="font-size: 1em; line-height: normal; vertical-align: middle;"
                  >person</Icon
                >
                {$_('text.name')}
              </span>
            </Textfield>
            <Textfield
              bind:value={email}
              bind:invalid={invalidEmail}
              type="email"
              label=""
              updateInvalid
              input$autocomplete="email"
              style="flex: 0.49"
            >
              <span slot="label">
                <Icon class="material-icons" style="font-size: 1em; line-height: normal; vertical-align: middle;"
                  >email</Icon
                >
                {$_('text.email')}
              </span>
            </Textfield>
          </div>
        {/if}
        <div class="" style="width: 100%;">
          <Select class="info-select" bind:value label={$_('text.are-you-interested')}>
            {#each options as option (option.key)}
              <Option value={option.key}>{option.label}</Option>
            {/each}
          </Select>
          <Button class="submit" disabled={!valid}>
            <Icon class="material-icons">send</Icon>
          </Button>
        </div>
      </form>
    </div>

    <div class="description" slot="what">
      <p>{$_('blocks.p3.text')}</p>

      <p>{$_('blocks.p4.text')}</p>
    </div>

    <div style="grid-area: start; display: flex; flex-direction: column; min-width: 0" slot="how">
      <p style="margin: 0 0 1em 0; min-width: 0; min-height: 0">{$_('blocks.p3.text')}</p>
    </div>
  </Blurb>
</Layout>

<style>
</style>
