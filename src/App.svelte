<script>
  // @ts-ignore
  import { Chessboard, fenToObj, objToFen } from "@discape/chessboardjs";
  import { Chess } from "chess.js";
  import { onMount } from "svelte";
  import Button from "./Button.svelte";
  import Slider from "./Slider.svelte";

  const boardId = "myBoard";
  let gameOver = false;
  let difficulty = 2;
  const dev = false;
  console.log = () => 0;
  
  let stockfish;
  let resolveBestMove;

  
  onMount(async () => {
    stockfish = await Stockfish();
    const oldPostMessage = stockfish.postMessage.bind(stockfish);
    stockfish.postMessage = (...data) => (console.log(data), oldPostMessage(...data));
    stockfish.addMessageListener(sfMessageListener);
    // stockfish.addMessageListener((line) => {
    //   consoleText += line + "\n";
    //   setTimeout(() => {
    //     if (tf.scrollHeight - tf.scrollTop - tf.clientHeight > tf.clientHeight - 100) return;
    //     tf.scrollTop = tf.scrollHeight;
    //   }, 0);
    // });
  });

  function getBestMove() {
    stockfish.postMessage("go movetime 3");
    return new Promise(res => resolveBestMove = res);
  }
  function sfMessageListener(line) {
    console.log(line);
    if (line.startsWith("bestmove")) {
      const movestr = line.split(' ')[1];
      const from = movestr[0] + movestr[1];
      const to = movestr[2] + movestr[3];
      resolveBestMove({ from, to });
    }
  }

  async function newGame() {
    stockfish.postMessage("ucinewgame");
    stockfish.postMessage("position startpos");
    document.body.style.setProperty("--black-check-color", "");
    document.body.style.setProperty("--white-check-color", "");
    const game = new Chess();
    const markedMoves = [];
    const highlighted = [];

    const removeMarkedMoves = () => markedMoves.forEach((elem) => elem.classList.remove("dot-middle"));
    const removeHighlights = () => {
      highlighted.pop()?.classList.remove("highlight2-my");
      highlighted.pop()?.classList.remove("highlight1-my");
    };
    const getSquare = (square) => document.querySelector(`#${boardId} .square-${square}`);
    const highlightMove = (source, target) => {
      removeHighlights();
      const sourceElem = getSquare(source),
        targetElem = getSquare(target);
      sourceElem.classList.add("highlight1-my");
      targetElem.classList.add("highlight2-my");
      highlighted.push(sourceElem, targetElem);
    };

    const board = Chessboard(boardId, {
      position: "start",
      draggable: true,
      scaleDrag: 1.2,
      pieceTheme: "/wikipedia/{piece}.png",
      preloadImages: true,
      onDrop: (source, target) => {
        removeMarkedMoves();
        const move = game.move({
          from: source,
          to: target,
          promotion: "q",
        });
        if (!move) return "snapback";
        highlightMove(source, target);
        document.body.style.setProperty("--white-check-color", "");
        document.body.style.setProperty("--black-check-color", game.in_check() ? "red" : "");
        gameOver = game.game_over();
        stockfish.postMessage("position fen " + game.fen());
        setTimeout(async () => {
          const aiMove = await getBestMove();
          game.move({ from: aiMove.from, to: aiMove.to, promotion: "q" });
          board.position(game.fen());
          stockfish.postMessage("position fen " + game.fen())
          highlightMove(aiMove.from, aiMove.to);
          document.body.style.setProperty("--white-check-color", game.in_check() ? "red" : "");
          document.body.style.setProperty("--black-check-color", "");
          gameOver = game.game_over();
        }, 0);
      },
      onSnapEnd: () => board.position(game.fen()),
      onDragStart: (source, piece) => !game.game_over() && piece[0] === game.turn() && game.turn() === "w",
      onMouseoverSquare: (square) =>
        game.turn() === "w" &&
        game.moves({ square, verbose: true }).forEach((m) => {
          const elem = getSquare(m.to);
          elem.classList.add("dot-middle");
          markedMoves.push(elem);
        }),
      onMouseoutSquare: removeMarkedMoves,
    });
  }

  let tf;
  let inputValue = "";
  let consoleText = "";
  // function enterCommand() {
  //   const cmd = inputValue;
  //   inputValue = "";
  //   if (cmd) stockfish.postMessage(cmd);
  // }
</script>

<main class="overflow-auto font-sans bg-gradient-to-r from-purple-100 to-pink-100 h-screen">
  <div class="p-3 flex flex-col items-center min-w-full">
    {#if !dev}
      <h1>web-chess</h1>
      <div class="w-96" id={boardId} />
      <div class="flex justify-center items-center w-80">
        <Button on:click={newGame} />
        <div class="grow hidden"><Slider bind:value={difficulty} min={0} max={4} initialValue={2} /></div>
      </div>
    {:else}
      <pre bind:this={tf} class="w-11/12 h-96 overflow-auto border border-black p-5">{consoleText}</pre>
      <form class="m-5" on:submit|preventDefault={enterCommand}>
        <input bind:value={inputValue} />
      </form>
    {/if}
  </div>
</main>

<style lang="postcss">
  @tailwind base;
  @tailwind utilities;

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 1rem auto;
    max-width: 30rem;
  }
</style>
