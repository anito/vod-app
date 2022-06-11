<script>
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { sitename } from "stores";
  import Button, { Group, Label, Icon } from "@smui/button";
  import { VideoManager, ImageManager, Component } from "components";
  import { Header } from "components";
  import { extendSession } from "utils";
  import { _ } from "svelte-i18n";

  const TABS = ["videos", "images"];

  let { page, session } = stores();
  $: tab =
    ((query) => query.tab && TABS.find((itm) => itm === $page.query.tab))(
      $page.query
    ) || TABS[0];

  onMount(() => {
    $session.role === "Administrator" && changeTab(tab);
    extendSession();
  });

  async function changeTab(tab) {
    await goto(`videos?tab=${tab}`);
    return false;
  }
</script>

<svelte:head>
  <title>{$sitename} | Video-Kurse</title>
</svelte:head>

{#if "Administrator" === $session.role}
  <div class="videos-grid {tab}">
    <div class="grid-item one">
      <Group variant="unelevated">
        <Button
          class="focus:outline-none focus:shadow-outline"
          on:click={() => changeTab(TABS[0])}
          variant={tab === TABS[0] ? "unelevated" : ""}
        >
          <Icon class="material-icons">video_settings</Icon>
          <Label>Videos</Label>
        </Button>

        <Button
          class="focus:outline-none focus:shadow-outline"
          on:click={() => changeTab(TABS[1])}
          variant={tab === TABS[1] ? "unelevated" : ""}
        >
          <Icon class="material-icons">collections</Icon>
          <Label>Posters</Label>
        </Button>
      </Group>
    </div>

    <div class="grid-item two">
      {#if tab === TABS[0]}
        <VideoManager />
      {/if}
      {#if tab === TABS[1]}
        <ImageManager />
      {/if}
    </div>
  </div>
{:else}
  <Component>
    <div slot="header">
      <div class="grid grid-cols-2">
        <span class="ml-2">
          <Header h="6" mdc>{$_("text.your-classes")}</Header>
        </span>
        <span class="justify-self-end mr-2">
          <Header h="5" mdc>
            {@html ($session.user && $session.user.name) || ""}
          </Header>
        </span>
      </div>
    </div>
    <div class="p-8">
      <VideoManager />
    </div>
  </Component>
{/if}

<style>
  .videos-grid {
    display: grid;
    grid-template-areas:
      "one"
      "two";
    grid-template-rows: var(--toolbar-h) auto;
    grid-template-columns: 1fr;
    grid-gap: var(--grid-gap);
    align-items: initial;
    overflow: hidden;
  }
  .grid-item {
    background: var(--back-grid-item);
    padding-left: 0.4rem;
  }
  .one {
    grid-area: one;
    display: flex;
    align-items: center;
    height: var(--toolbar-h);
  }
  .two {
    grid-area: two;
    overflow: auto;
  }
</style>
