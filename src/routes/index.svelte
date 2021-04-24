<script>
  import { stores } from '@sapper/app';
  import { Blurb, Hero } from '@sveltejs/site-kit';
  import Layout from './layout.svelte';
  import FormField from '@smui/form-field';
  import Textfield from '@smui/textfield';
  import Checkbox from '@smui/checkbox';
  import { _ } from 'svelte-i18n';

  let { session } = stores();

  $: continueWith = $session.user
    ? { title: $_('text.yourCourses'), url: 'videos' }
    : { title: $_('text.login'), url: 'login' };
</script>

<svelte:head>
  <title>Physiotherapy Online | Home</title>
</svelte:head>

<Layout>
  <Hero title="Physio Dips" tagline="" outline="logo.svg" logotype="logo-type.svg" />

  <Blurb>
    <div class="" slot="one">
      <a href=".">
        <h2>{$_('blocks.p1.header')}</h2>
        <p>
          {$_('blocks.p1.text1')}
        </p>
      </a>
    </div>

    <a href="/{continueWith.url}" slot="two">
      <h2>{$_('blocks.p2.header')}</h2>
      <p>{$_('blocks.p2.text')}</p>

      <span class="learn-more">{continueWith.title}</span>
    </a>

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
