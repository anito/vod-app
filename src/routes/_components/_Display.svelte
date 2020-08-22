<script>
    export let data;

    console.log(data)
</script>

<div class="wrapper">
    <ul>
    {#each data as d}
        <li>d</li>
    {/each}
    </ul>
</div>