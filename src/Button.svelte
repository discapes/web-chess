<script>
	export let invisible = false;
</script>

<div class:invisible={invisible} class="inline-block z-10 overflow-visible px-5 p-5">
  <button on:click class="button-56"><slot></slot></button>
</div>
