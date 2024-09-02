<script lang="ts">
  import { Input } from 'flowbite-svelte';
  import PrevPageIcon from '@images/arrow-left.png';
  import NextPageIcon from '@images/arrow-right.png';
  import RefreshIcon from '@images/refresh.png';
  import CloseIcon from '@images/close.png';
  import MaximizeIcon from '@images/maximize.png';
  import MinimizeIcon from '@images/minimize.png';
  import NewWindowIcon from '@images/new-window.png';

  import NavBtn from './btn.svelte';

  let url = '';

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

<div class="navbar flex box-border w-full">
  <div class="flex flex-1 items-center gap-1">
    <div class="flex flex-1 justify-between items-center gap-1">
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
    <div class="flex flex-1 items-center justify-between gap-1">
      <div>
        <NavBtn on:click={onClickRefresh} icon={RefreshIcon} />
      </div>
      <div>
        <NavBtn on:click={onClickMinimize} icon={MinimizeIcon} />
        <NavBtn on:click={onClickMaximize} icon={MaximizeIcon} />
        <NavBtn on:click={onClickClose} icon={CloseIcon} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .navbar {
    height: 50px;
    padding-left: 80px;
    padding-right: 10px;
  }
</style>
