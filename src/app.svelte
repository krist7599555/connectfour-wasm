<div id='app' class='flex flex-col justify-center items-center h-screen'>
  winner = {winner}
  <div class="app-board">
    {#each board as row, i}
    <div class="app-stack">
        {#each row as itm, j}
          <div class={`player-${itm}`} on:click={() => winner === 0 && push(i, current_player)}>
            
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="w-80vmin mt-2 w-full flex justify-between">
    <div id='app-current-player' class={`player-1 px-4 py-2 rounded border text-white player-${current_player}`}>
      current player
    </div>
    <div>
      <button id='undo' on:click={() => undo()} class="px-4 py-2 rounded border">undo</button>
      <button id='ai-1' on:click={() => ai1 = !ai1} class="px-4 py-2 rounded border" class:player-1={ai1}>AI 1</button>
      <button id='ai-2' on:click={() => ai2 = !ai2} class="px-4 py-2 rounded border" class:player-2={ai2}>AI 2</button>
    </div>
  </div>
</div>

<script lang='ts'>
  import { wait_wasm, solve, winner as wasm_winner } from './rust'
  import indexOf from 'lodash/indexOf';
  import flatten from 'lodash/flatten';
  import isEmpty from 'lodash/isEmpty';

  type Empty = 0;
  type Player = 1 | 2;
  type Item = Empty | Player;

  const empty: Empty = 0;

  let ai1 = false;
  let ai2 = false;
  let lock  = false;
  let current_player: Player = 1;

  $: if (!lock && current_player == 1 && ai1) {
    ai(current_player)
  }
  $: if (!lock && current_player == 2 && ai2) {
    ai(current_player)
  }

  const history: { row: number, col: number, turn: 1 | 2 }[] = []
  let board: Item[][] = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  $: winner = 0;

  function check_winner() {
    winner = wasm_winner(flatten(board) as any)
  }

  function push(row: number, turn?: Player) {
    if (winner !== 0) return false;
    if (!turn) turn = current_player;
    const col = indexOf(board[row], empty);
    if (col == -1) return false;
    
    board[row][col] = turn;
    history.push({ row, col, turn })
    toggle_current_player();
    check_winner();
    return true;
  }

  function pop() {
    if (isEmpty(history)) return false;
    const { row, col, turn } = history.pop();
    board[row][col] = empty;
    toggle_current_player();
    check_winner();
    return true;
  }
  function toggle_current_player() {
    current_player ^= 3;
    return current_player
  }

  // appStacksEl.on('click', function () {
  //   const idx = jquery(this).index();
  //   push(idx)
  // })

  function undo() {
    pop()
  }

  async function ai(player: number) {
    lock = true;
    await wait_wasm;
    setTimeout(() => {
      console.log(board)
      const idx = solve(flatten(board) as any, player);
      console.log(["solve", idx])
      push(idx)
      lock = false;
    }, 0);
  }
</script>

<style lang='scss'>
.w-80vmin {
  width: 80vmin;
}
.app-board {
  height: 80vmin;
  width: 80vmin;
  background-color: beige;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.app-stack {
  width: 14.28%;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  &:hover {
    background-color: rgb(214, 214, 208);
  }
  > * { 
    height: 14.28%;
    background: rgba(110, 110, 110, 0.192); 
    border-radius: 8px;
    transform: scale(0.98);
  }
}
.player-1 { background: rgb(209, 32, 61) !important; }
.player-2 { background: rgb(39, 39, 199) !important; }

#ai.loading {
  opacity: 0.5;
  background-color: #eeeeee;
}
</style>