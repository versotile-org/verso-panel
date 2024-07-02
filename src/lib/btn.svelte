<script>
  import { Button } from 'flowbite-svelte';
  export let icon;
  export let alt = '';
</script>

<Button
  on:click
  class="btn nav-btn bg-slate-50 hover:bg-slate-100 active:bg-slate-200 h-7 w-7 !p-2"
  ><img {alt} src={icon} /></Button
>

<style lang="scss">
</style>
