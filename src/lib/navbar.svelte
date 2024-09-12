<script lang="ts">
  import PrevPageIcon from '@images/arrow-left.png';
  import NextPageIcon from '@images/arrow-right.png';
  import CloseIcon from '@images/close.png';
  import MaximizeIcon from '@images/maximize.png';
  import MinimizeIcon from '@images/minimize.png';
  import NewWindowIcon from '@images/new-window.png';
  import RefreshIcon from '@images/refresh.png';
  import { Input } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import NavBtn from './btn.svelte';

  let navbarEl: HTMLDivElement | null = null;
  let url = '';

  // Inject navbar function into global window object. Expose functions to backend.
  Object.assign(window, {
    navbar: {
      setNavbarUrl: (newUrl: string) => {
        url = newUrl;
      },
    },
  });

  onMount(() => {
    if (window.navigator.userAgent.includes('Mac')) {
      navbarEl?.classList.add('macos');
    }
  });

  // Event handlers

  function onClickPrev() {
    console.log('click prev');
    window.prompt('PREV');
  }
  function onClickForward() {
    console.log('click forward');
    window.prompt('FORWARD');
  }
  function onClickRefresh() {
    console.log('click refresh');
    window.prompt('REFRESH');
  }
  function onClickNewWindow() {
    console.log('click new window');
    window.prompt('NEW_WINDOW');
  }
  function onClickClose() {
    console.log('close');
    window.close();
  }
  function onClickMinimize() {
    console.log('minimize');
    window.prompt('MINIMIZE');
  }
  function onClickMaximize() {
    console.log('maximize');
    window.prompt('MAXIMIZE');
  }
  function onEnterNavigation(url: string) {
    console.log(`navigate to url: ${url}`);
    window.prompt(`NAVIGATE_TO:${url}`);
  }
</script>

<div
  class="navbar flex box-border w-full items-center gap-1"
  bind:this={navbarEl}
>
  <div class="flex flex-1 justify-between gap-1">
    <div>
      <NavBtn on:click={onClickPrev} icon={PrevPageIcon} />
      <NavBtn on:click={onClickForward} icon={NextPageIcon} />
    </div>
    <div>
      <NavBtn on:click={onClickNewWindow} icon={NewWindowIcon} />
    </div>
  </div>
  <div class="flex-2 w-1/2">
    <Input
      type="text"
      placeholder="Search or enter website name"
      bind:value={url}
      on:keydown={(e) => e.code === 'Enter' && onEnterNavigation(url)}
    />
  </div>
  <div class="flex flex-1 justify-between gap-1">
    <div>
      <NavBtn on:click={onClickRefresh} icon={RefreshIcon} />
    </div>
    <div class="window-actions">
      <NavBtn on:click={onClickMinimize} icon={MinimizeIcon} />
      <NavBtn on:click={onClickMaximize} icon={MaximizeIcon} />
      <NavBtn on:click={onClickClose} icon={CloseIcon} />
    </div>
  </div>
</div>

<style lang="scss">
  .navbar {
    font-family: Arial, sans-serif;
    height: 50px;
    padding-left: 10px;
    padding-right: 10px;
  }

  :global(.macos) {
    &.navbar {
      padding-left: 80px;
    }
    .window-actions {
      display: none;
    }
  }
</style>
