<script context="module">
  import { goto } from "@sapper/app";

  export async function preload(page) {
    let token = page.query.token;
    if (token) {
      return {
        token
      };
    }
  }
</script>

<script>
  import {onMount} from "svelte";

  export let token;

  onMount(() => {
    goto(`login/?token=${token}`)
  })
</script>
