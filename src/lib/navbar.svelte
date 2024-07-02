<script>
  import { Input } from 'flowbite-svelte';
  import PrevPageIcon from '@images/arrow-left.png';
  import NextPageIcon from '@images/arrow-right.png';
  import RefreshIcon from '@images/refresh.png';
  import CloseIcon from '@images/close.png';
  import MaximizeIcon from '@images/maximize.png';
  import MinimizeIcon from '@images/minimize.png';

  import NavBtn from './btn.svelte';

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
</script>

<div class="navbar box-border w-full">
  <div class="inline-block w-full">
    <div class="inline-block w-1/4">
      <NavBtn on:click={onClickPrev} icon={PrevPageIcon} />
      <NavBtn on:click={onClickForward} icon={NextPageIcon} />
      <NavBtn on:click={onClickRefresh} icon={RefreshIcon} />
    </div>
    <div class="inline-block w-1/2">
      <Input
        class="h-7"
        type="text"
        placeholder="Search or enter website name"
      />
    </div>
    <div class="float-right inline-block">
      <NavBtn on:click={onClickMinimize} icon={MinimizeIcon} />
      <NavBtn on:click={onClickMaximize} icon={MaximizeIcon} />
      <NavBtn on:click={onClickClose} icon={CloseIcon} />
    </div>
  </div>
</div>

<style lang="scss">
  .navbar {
    background-color: #fafafa;
    height: 38px;
    padding-top: 6px;
    padding-left: 80px;
    padding-right: 10px;
  }
</style>
