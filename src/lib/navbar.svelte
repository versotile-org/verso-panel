<script lang="ts">
  import PrevPageIcon from '@images/arrow-left.png';
  import NextPageIcon from '@images/arrow-right.png';
  import CloseIcon from '@images/close.png';
  import MaximizeIcon from '@images/maximize.png';
  import MinimizeIcon from '@images/minimize.png';
  import NewWindowIcon from '@images/new-window.png';
  import BookmarkIcon from '@images/bookmark.png';
  import BookmarkedIcon from '@images/bookmarked.png';
  import DownloadIcon from '@images/downloads.png';
  import RefreshIcon from '@images/refresh.png';
  import { Input } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import NavBtn from './btn.svelte';
  import TabBar, {
    type Tab,
    type TabActivateRequest,
    type TabCloseRequest,
    type TabCreateResponse,
    type TabId,
  } from './tabbar.svelte';
  import BookmarkBar, { type Bookmark } from './bookmarkbar.svelte';

  let navbarEl: HTMLDivElement | null = null;
  let navbarUrl: string = '';

  // Window Dragging
  let startDragging: boolean = false;

  // History menu state
  let longPressTimer: number | null = null;
  let isLongPressing = false;

  // Navigation buttons enable state
  let prevBtnEnabled = false;
  let nextBtnEnabled = false;

  // Show / Hide Download Button
  let showDownloadBtn = false;

  // System information
  const isMac = window.navigator.userAgent.includes('Mac');

  // Inject navbar function into global window object. Expose functions to backend.
  Object.assign(window, {
    navbar: {
      setNavBtnEnabled: (prev: boolean, next: boolean) => {
        prevBtnEnabled = prev;
        nextBtnEnabled = next;
      },
      setNavbarUrl: (newUrl: string) => {
        const tab = tabs[activeTabIdx];
        tab.url = newUrl;
        navbarUrl = newUrl;
      },
      addTab: (id_raw: string, active: boolean) => {
        tabs.push({ name: 'new tab', id: JSON.parse(id_raw), url: '' });
        if (active) {
          activeTabIdx = tabs.length - 1;
        }
      },
      closeTab: (id_raw: string) => {
        let id: TabId = JSON.parse(id_raw);
        let idx = tabs.findIndex((tab) => {
          return (
            tab.id.namespace_id === id.namespace_id && tab.id.index === id.index
          );
        });
        if (idx !== -1) {
          tabs = tabs.filter((tab, i) => i !== idx);
          if (tabs.length > 0) {
            activeTabIdx = calcNewIdxAfterClosed(idx);
            return JSON.stringify(tabs[activeTabIdx].id);
          } else {
            // closing window
            return '';
          }
        }
      },
      setTabTitle: (id_raw: string, title: string | null) => {
        let id: TabId = JSON.parse(id_raw);
        let tab = tabs.find((tab) => {
          return (
            tab.id.namespace_id === id.namespace_id && tab.id.index === id.index
          );
        });
        if (tab) {
          if (title !== null) {
            tab.name = title;
          } else {
            let url = new URL(tab.url);
            tab.name = url.hostname;
          }
          tabs = tabs; // trigger svelte to re-render
        }
      },
      showDownloadBtn: (show: boolean) => {
        showDownloadBtn = show;
      },
    },
  });

  onMount(() => {
    if (isMac) {
      navbarEl?.classList.add('macos');
    }
  });

  /* Event handlers */

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
  function onClickBookmark() {
    window.prompt('BOOKMARK');
  }
  function onClickDownload() {
    window.prompt('DOWNLOAD');
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
  function onPanelMouseDown(ev: MouseEvent) {
    /* Draggable window */
    if (ev.buttons === 1) {
      // on macOS, this drag window must trigger before native drag happened, otherwise, it will crash.
      if (isMac) {
        console.log('dragging window');
        window.prompt('DRAG_WINDOW');
        return;
      }

      // on Linux, mouse release event will not fire after dragging window,
      // so we need to ensure it's acatually dragging window. Otherwise, double click on panel will not work.
      console.log('start dragging window');
      startDragging = true;
    }
  }
  function onPanelMouseUp(ev: MouseEvent) {
    /* Draggable window */
    // on Linux and Windows, if left mouse button is released and dragging is started, reset dragging state
    if ((ev.buttons & 1) === 0 && startDragging) {
      console.log('cancel dragging window');
      startDragging = false;
    }
  }
  function onPanelMouseMove(ev: MouseEvent) {
    /* Draggable window */
    // on Linux and Windows, we use mouse move event to detect if the user is actually dragging window.
    if (!isMac && startDragging) {
      console.log('dragging window');
      window.prompt('DRAG_WINDOW');
      startDragging = false;
    }
  }
  function onPanelDbClick() {
    console.log('double click on panel');
    window.prompt('DBCLICK_PANEL');
  }

  function requestBookmark() {
    const response = window.prompt('UPDATE_BOOKMARK')
    if (response !== null) {
      const status = JSON.parse(response) as { [url: string]: Bookmark }
      bookmarks = Object.values(status)
    }
  }

  setInterval(() => {
    requestBookmark()
  }, 2000)

  /* tabs */

  let activeTabIdx = 0;
  let tabs: Tab[] = [];

  /* bookmarks */
  let bookmarks: Bookmark[] = [];

  // TODO: get tab name / set index;
  function onClickNewTab() {
    console.log('click new tab');

    let resp: TabCreateResponse = JSON.parse(
      window.prompt('NEW_TAB') ?? '{ "success": false, id: null }'
    );
    if (!resp.success || !resp.id) {
      return;
    }

    tabs.push({ name: 'new tab', id: resp.id, url: '' });
    tabs = tabs; // trigger svelte to re-render

    activeTabIdx = Math.max(0, tabs.length - 1);
  }
  function onCloseTab(idx: CustomEvent<number>) {
    let removeTab = tabs[idx.detail];
    let request: TabCloseRequest = {
      id: removeTab.id,
    };
    window.prompt(`CLOSE_TAB:${JSON.stringify(request)}`);

    tabs = tabs.filter((tab, _) => tab.id !== removeTab.id);
    let newActiveTabIdx = calcNewIdxAfterClosed(idx.detail);
    activateTab(newActiveTabIdx);
  }
  function onActivateTab(idx: CustomEvent<number>) {
    activateTab(idx.detail);
  }
  function onClickNavigateBookmark(idx: CustomEvent<number>) {
    navigateBookmark(idx.detail);
  }
  function onClickBookmarkManager() {
    openBookmarkManager();
  }
  function activateTab(idx: number) {
    if (idx >= tabs.length || idx < 0) {
      console.error(`Invalid tab index: ${idx}`);
      return;
    }

    const tab = tabs[idx];
    let request: TabActivateRequest = {
      id: tab.id,
    };

    activeTabIdx = idx;
    // update navbar url
    navbarUrl = tab.url;

    window.prompt(`ACTIVATE_TAB:${JSON.stringify(request)}`);
  }
  function navigateBookmark(idx: number) {
    if (idx >= bookmarks.length || idx < 0) {
      console.error(`Invalid bookmark index: ${idx}`);
      return;
    }

    const bookmark = bookmarks[idx];
    window.prompt(`NAVIGATE_TO:${bookmark.url}`);
  }
  function openBookmarkManager()
  {
    window.prompt('OPEN_BOOKMARK_MANAGER');
  }
  function calcNewIdxAfterClosed(idx: number) {
    if (idx < activeTabIdx) {
      return activeTabIdx - 1;
    } else if (idx === activeTabIdx) {
      return Math.min(activeTabIdx, tabs.length - 1);
    }
    return activeTabIdx;
  }

  /* Browser history */
  function onNavBtnMouseDown(ev: MouseEvent, action: 'Prev' | 'Next') {
    if (ev.button !== 0) return; // Only handle left click

    isLongPressing = true;

    longPressTimer = window.setTimeout(() => {
      if (isLongPressing) {
        const rect = (ev.target as HTMLElement).getBoundingClientRect();
        const request = {
          action,
          position: {
            x: rect.left,
            y: rect.bottom + 5,
          },
        };
        window.prompt(`OPEN_HISTORY_MENU:${JSON.stringify(request)}`);
      }
    }, 500);
  }

  function onNavBtnMouseUp() {
    isLongPressing = false;
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function onNavBtnMouseLeave() {
    isLongPressing = false;
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }
</script>

<div>
  <div
    class="navbar flex box-border w-full items-center gap-1"
    bind:this={navbarEl}
    on:mousemove={onPanelMouseMove}
    on:mousedown|self={onPanelMouseDown}
    on:mouseup|self={onPanelMouseUp}
    on:dblclick|self={onPanelDbClick}
  >
    <div
      class="flex flex-1 justify-between gap-1 items-center"
      on:mousedown|self={onPanelMouseDown}
      on:mouseup|self={onPanelMouseUp}
      on:dblclick|self={onPanelDbClick}
    >
      <div class="flex gap-1 items-center">
        <NavBtn
          on:click={onClickPrev}
          icon={PrevPageIcon}
          disabled={!prevBtnEnabled}
          on:mousedown={(e) => onNavBtnMouseDown(e, 'Prev')}
          on:mouseup={onNavBtnMouseUp}
          on:mouseleave={onNavBtnMouseLeave}
        />
        <NavBtn
          on:click={onClickForward}
          icon={NextPageIcon}
          disabled={!nextBtnEnabled}
          on:mousedown={(e) => onNavBtnMouseDown(e, 'Next')}
          on:mouseup={onNavBtnMouseUp}
          on:mouseleave={onNavBtnMouseLeave}
        />
      </div>
      <div>
        <NavBtn on:click={onClickNewWindow} icon={NewWindowIcon} />
      </div>
    </div>
    <div class="flex-2 w-1/2">
      <Input
        type="text"
        placeholder="Search or enter website name"
        bind:value={navbarUrl}
        on:keydown={(e) => e.code === 'Enter' && onEnterNavigation(navbarUrl)}
      />
    </div>
    <div
      class="flex flex-1 justify-between items-center gap-1"
      on:mousedown|self={onPanelMouseDown}
      on:mouseup|self={onPanelMouseUp}
      on:dblclick|self={onPanelDbClick}
    >
      <div>
        <NavBtn on:click={onClickRefresh} icon={RefreshIcon} />
      </div>
      <div class="flex gap-1 items-center">
        {#if showDownloadBtn}
          <NavBtn on:click={onClickDownload} icon={DownloadIcon} />
        {/if}
        {#if bookmarks.filter((b) => b.url === tabs[activeTabIdx].url).length === 0}
          <div>
            <NavBtn on:click={onClickBookmark} icon={BookmarkIcon} />
          </div>
        {:else}
          <div>
            <NavBtn on:click={onClickBookmark} icon={BookmarkedIcon} />
          </div>
        {/if}
      </div>
      <div class="window-actions items-center flex gap-1">
        <NavBtn on:click={onClickMinimize} icon={MinimizeIcon} />
        <NavBtn on:click={onClickMaximize} icon={MaximizeIcon} />
        <NavBtn on:click={onClickClose} icon={CloseIcon} />
      </div>
    </div>
  </div>
  {#if bookmarks.length > 0}
    <BookmarkBar {bookmarks} on:navigate-bookmark={onClickNavigateBookmark} on:open-bookmark-manager={onClickBookmarkManager}/>
  {/if}
  {#if tabs.length > 1}
    <TabBar
      {tabs}
      activeIdx={activeTabIdx}
      on:close-tab={onCloseTab}
      on:activate-tab={onActivateTab}
    />
  {/if}
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
