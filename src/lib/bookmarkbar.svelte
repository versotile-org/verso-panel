<script lang="ts" context="module">
  export interface Bookmark {
    name: string;
    url: string;
  }
  import NavBtn from './btn.svelte';
  import BookmarkManagerIcon from '@images/bookmark-manager.png';
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let bookmarks: Bookmark[] = [];
  function navigateBookmark(idx: number) {
    dispatch("navigate-bookmark", idx);
  }
  function navigateBookmarkManager() {
    dispatch("open-bookmark-manager");
  }
</script>

<div id="bookmark-bar" class="bookmark-bar">
  <NavBtn on:click={navigateBookmarkManager} icon={BookmarkManagerIcon} />
  {#each bookmarks as bookmark, index}
    <div
      class="bookmark bg-zinc-200 hover:bg-zinc-100 transition-[background-color] duration-100"
      on:click={() => {
        navigateBookmark(index);
      }}
    >
      {bookmark.name}
    </div>
  {/each}
</div>

<style lang="scss">
  .bookmark-bar {
    display: flex;
    background-color: inherit;
    height: 30px;
    flex-wrap: nowrap;
    gap: 1px;
  }
  .bookmark {
    display: flex;
    background-color: inherit;
    height: 30px;
    padding: 2px 16px;
    max-width: 20ch;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    align-items: center;
    cursor: default;
    user-select: none;
  }
  .bookmark:hover {
    display: flex;
    background-color: #dfdfdf;
  }
</style>
