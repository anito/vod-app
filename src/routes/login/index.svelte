<script>
  import { ListErrors } from "components";
  import { ListMessages } from "components";
  import { LoginForm } from "components";
  import { Header } from "@sveltejs/site-kit";
  import { flash } from "../../stores/flashStore";

  let errors = null;
  let message = null;

  $: flashMessage = $flash.message || "Login";
  $: flashType = $flash.type;
</script>

<style>
  :global(.error).login-header {
    color: var(--error);
  }
</style>

<svelte:head>
  <title>Physiotherapy Online | Login</title>
</svelte:head>

<Header h="2" mdc class="login-header m-2 lg:m-5 {flashType}">
  {flashMessage}
</Header>
<div class="flex justify-center m-8">
  <div class="">
    <div class="cols-3">
      <Header h="4" mdc class="m-2">Please Login</Header>
    </div>
    <div class="cols-3">
      <LoginForm />
    </div>
  </div>
</div>

<ListErrors {errors} />
<ListMessages {message} />
