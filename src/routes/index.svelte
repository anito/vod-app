<script>
	import { Blurb, Hero, Section } from '@sveltejs/site-kit';

</script>

<style>

</style>

<svelte:head>
	<title>Physiotherapy Online | Home</title>
</svelte:head>

<Hero
	title="Physio Dips"
	tagline=""
	outline="logo.svg"
	logotype="logo-type.svg"
/>

<Blurb>
	<a href="blog/write-less-code" slot="one">
		<h2>Write less code</h2>
		<p>Build boilerplate-free components using languages you already know — HTML, CSS and JavaScript</p>

		<span class="learn-more">learn more</span>
	</a>

	<a href="blog/virtual-dom-is-pure-overhead" slot="two">
		<h2>No virtual DOM</h2>
		<p>Svelte compiles your code to tiny, framework-less vanilla JS — your app starts fast and stays fast</p>

		<span class="learn-more">learn more</span>
	</a>

	<a href="blog/svelte-3-rethinking-reactivity" slot="three">
		<h2>Truly reactive</h2>
		<p>No more complex state management libraries — Svelte brings reactivity to JavaScript itself</p>

		<span class="learn-more">learn more</span>
	</a>

	<div class="description" slot="what">
		<p>Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the <em>browser</em>, Svelte shifts that work into a <em>compile step</em> that happens when you build your app.</p>

		<p>Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes.</p>

		<p><a href="blog/svelte-3-rethinking-reactivity">Read the introductory blog post</a> to learn more.</p>
	</div>

	<div style="grid-area: start; display: flex; flex-direction: column; min-width: 0" slot="how">
		<pre class="language-bash" style="margin: 0 0 1em 0; min-width: 0; min-height: 0">
npx degit <a href="https://github.com/sveltejs/template" style="user-select: initial;">sveltejs/template</a> my-svelte-project
<span class="token comment"># or download and extract <a href="https://github.com/sveltejs/template/archive/master.zip">this .zip file</a></span>
cd my-svelte-project

npm install
npm run dev
		</pre>

		<p style="flex: 1">See the <a href="blog/the-easiest-way-to-get-started">quickstart guide</a> for more information.</p>

		<p class="cta"><a rel="prefetch" href="tutorial">Learn Svelte</a></p>
	</div>
</Blurb>



