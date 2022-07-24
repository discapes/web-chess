<script>
  // @ts-ignore
  import { Chessboard, fenToObj, objToFen } from "@discape/chessboardjs";
  import { Chess } from "chess.js";
  import { onMount } from "svelte";
  import * as jsChessEngine from "js-chess-engine";
  import Button from "./Button.svelte";
  import Slider from "./Slider.svelte";

  const boardId = "myBoard";
  let gameOver = false;
  let difficulty = 2;

  onMount(newGame);

  function newGame() {
    document.body.style.setProperty("--black-check-color", "");
    document.body.style.setProperty("--white-check-color", "");
    const game = new Chess();
    const markedMoves = [];
    const highlighted = [];
    const engine = new jsChessEngine.Game();

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
        engine.move(source, target);
        setTimeout(async () => {
          const aiMove = engine.aiMove(difficulty);
          const from = Object.entries(aiMove)[0][0].toLowerCase();
          const to = Object.entries(aiMove)[0][1].toLowerCase();
          game.move({ from, to, promotion: "q" });
          board.position(game.fen());
          highlightMove(from, to);
          document.body.style.setProperty("--white-check-color", game.in_check() ? "red" : "");
          document.body.style.setProperty("--black-check-color", "");
          gameOver = game.game_over();
        }, 1000);
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
</script>

<main class="-z-20 font-sans bg-gradient-to-r from-purple-100 to-pink-100 h-screen overflow-auto flex flex-col justify-center items-center">
  <h1>web-chess</h1>
  <div class="w-96" id={boardId} />
  <div class="flex justify-center items-center w-80">
    <Button on:click={newGame} invisible={gameOver} />
    <div class="grow"><Slider bind:value={difficulty} min={0} max={4} initialValue={2}/></div>
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
