<script>
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { sitename } from "stores";
  import { Info } from "components";
  import { users } from "stores";
  import { _ } from "svelte-i18n";

  const transitionParams = {
    delay: 0,
    duration: 200,
  };
  const flyTransitionParams = { ...transitionParams, x: -80 };

  let preSelectedIndex = 0;

  onMount(() => {
    if (!$users.length) return;

    let max = $users.length - 1;
    preSelectedIndex =
      preSelectedIndex < 0 || preSelectedIndex > max ? 0 : preSelectedIndex;

    goto(`users/${$users[preSelectedIndex].id}`);
  });
</script>

<svelte:head>
  <title>{$sitename} | Users</title>
</svelte:head>

<div class="flex justify-center items-center flex-1">
  <div class="flyer" transition:fly={flyTransitionParams}>
    <Info title={$_("text.loading-users")} />
  </div>
</div>

<style>
</style>
