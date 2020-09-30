<div class="puzzle">
  <h1>Super 15 Puzzle</h1>
  <div class='grid'>
    {#each react_list as item (item)}
    <div animate:flip={{duration: 200}} class="item" class:hidden={item == 0}>
      {item}
    </div>
    {/each}
  </div>
  <div class="history">
    {#each history as h}
      <div class="item" flag={h.flag}>
        {way2arrow(h.way)}
      </div>
    {/each}
  </div>

  <button class="button" on:click={solve}>
    solve
  </button>
  <button class="button" on:click={() => history = []}>
    clear history
  </button>
</div>

<svelte:window on:keydown={keypress} />

<script>
  import { wait_wasm, solve15puzzle, generate_table } from './rust'
  import { flip } from 'svelte/animate';
  import { interval, of, from, zip } from 'rxjs'
  import { delay, map } from 'rxjs/operators'
import { onMount } from 'svelte';

  let ls = '123456789ABCDEF0'
  let history = []

  $: react_list = ls.split("").map(c => {
    return {
      'A': 10,
      'B': 11,
      'C': 12,
      'D': 13,
      'E': 14,
      'F': 15,
    }[c] || +c
  })

  $: history_render = history.map(w => ({
    '4': '↑',
    '1': '←',
    '-1': '→',
    '-4': '↓'
  }[w.way]))

  function way2arrow(w) {
    return {
      '4': '↑',
      '1': '←',
      '-1': '→',
      '-4': '↓'
    }[w]
  }

  function swap_idx(idx1, idx2) {
    let mn = Math.min(idx1, idx2)
    let mx = Math.max(idx1, idx2)
    return ls.slice(0, mn) + ls[mx] + ls.slice(mn+1, mx) + ls[mn] + ls.slice(mx + 1)
  }

  function move_item(t) {
    const pos = ls.indexOf('0')
    const [i, j] = [Math.floor(pos / 4), pos % 4]
    if (t === -4 && i > 0) return swap_idx(pos, pos + t)
    if (t === -1 && j > 0) return swap_idx(pos, pos + t)
    if (t === 1 && j < 3) return swap_idx(pos, pos + t)
    if (t === 4 && i < 3) return swap_idx(pos, pos + t)
  }
  
  function try_move_item(way, flag=0) {
    const new_ls = move_item(way)
    if (new_ls) {
      ls = new_ls
      history = [...history, { way, flag }]
    }
  }

  let is_block_input = false;
  function keypress(e) {
    if (is_block_input) return;
    const ways = {
      ArrowUp: 4,
      ArrowLeft: 1,
      ArrowRight: -1,
      ArrowDown: -4,
    }
    const way = ways[e.key];
    try_move_item(way, 0)
  }

  function solve() {
    if (is_block_input) return;
    is_block_input = true;
    const ans = solve15puzzle(ls).split("")
    
    zip(from(ans), interval(200))
      .pipe(
        map(v => v[0]),
        map(c => ({
          'U': -4,
          'L': -1,
          'R': 1,
          'D': 4
        }[c]))
      )
      .subscribe(
        (w) => try_move_item(w, 1), 
        (e) => console.error(e), 
        () => is_block_input = false
      )
      
  }
  
</script>

<style>
  * {
    user-select: none;
  }
  h1 {
    text-align: center;
    padding-bottom: 1rem;
  }
  .puzzle {
    font-family: system-ui;
    width: max(375px, 50vmin);
    margin: auto;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  .grid {
    width: max(375px, 50vmin);
    height: max(375px, 50vmin);
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 5px;
    margin: auto;
  }
  .grid > .item {
    border-radius: 7px;
    background-color: blanchedalmond;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .item.hidden {
    opacity: 0;
  }
  .history {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .history > .item {
    padding: 4px;
    font-size: 2rem;
  }
  .history > .item[flag='0'] {
    color:rgb(211, 211, 211);
  }
  .history > .item[flag='1'] {
    color: rgb(63, 203, 141);
  }
  .button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    background-color: #e8e9e4;
  }
</style>