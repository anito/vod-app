<script>
	import { Blurb, Hero, Section } from '@sveltejs/site-kit';
	import Layout from './layout.svelte';

</script>

<style>

</style>

<svelte:head>
	<title>Physiotherapy Online | Home</title>
</svelte:head>

<Layout>
	<Hero
		title="Physio Dips"
		tagline=""
		outline="logo.svg"
		logotype="logo-type.svg"
	/>

	<Blurb>
		<a href="blog/write-less-code" slot="one">
			<h2>Test 1</h2>
			<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus animi labore maxime quos architecto, dolore ducimus vero molestiae dicta? Repellat accusantium dignissimos assumenda at voluptas rerum exercitationem explicabo asperiores sed?</p>

			<span class="learn-more">learn more</span>
		</a>

		<a href="blog/virtual-dom-is-pure-overhead" slot="two">
			<h2>Test 2</h2>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita eum dolorem, est perspiciatis laborum nihil veniam pariatur tempore voluptas quia debitis ut iste, officiis non explicabo accusamus mollitia quos quasi?</p>

			<span class="learn-more">learn more</span>
		</a>

		<div class="description" slot="what">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta assumenda dolor harum autem accusantium quam deleniti voluptatum suscipit numquam non! Quas deserunt voluptatem autem quisquam tempore natus sint laborum deleniti.</p>

			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam ullam provident quo adipisci voluptatum corporis iusto deserunt, commodi autem, temporibus dicta quis voluptatibus, praesentium ratione quisquam molestias a quidem aspernatur.</p>

		</div>

		<div style="grid-area: start; display: flex; flex-direction: column; min-width: 0" slot="how">
			<p style="margin: 0 0 1em 0; min-width: 0; min-height: 0">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similique libero ut, ad quidem eos architecto laborum illum nesciunt eius quis quos inventore accusamus excepturi aperiam consectetur, qui, dolorum possimus sequi.</p>
		</div>
	</Blurb>
</Layout>