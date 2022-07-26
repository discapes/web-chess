<script>
  // @ts-ignore
  import { Chessboard, fenToObj, objToFen } from "@discape/chessboardjs";
  import { RandomGame, StockfishGame } from "./chess";
  import Button from "./Button.svelte";
  import Slider from "./Slider.svelte";

  const boardId = "myBoard";
  let difficulty = 2;

  function setCheckedKing(king) {
    document.body.style.setProperty("--black-check-color", king === "b" ? "red" : "");
    document.body.style.setProperty("--white-check-color", king === "w" ? "red" : "");
  }

  async function newGame() {
    const game = difficulty === 0 ? new RandomGame() : new StockfishGame(difficulty);
    const markedMoves = [];
    const highlighted = [];
    setCheckedKing("");

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
      onDrop(from, to) {
        removeMarkedMoves();
        const move = game.tryMove(from, to);
        if (!move) return "snapback";

        highlightMove(from, to);
        setCheckedKing(game.getCheckedKing());

        if (!game.isOver())
          game.waitForOpponent().then((move) => {
            board.position(game.getFen());
            setCheckedKing(game.getCheckedKing());
            highlightMove(move.from, move.to);
          });
      },
      onSnapEnd: () => board.position(game.getFen()),
      onDragStart: (source, piece) => game.ready && !game.isOver() && piece[0] === game.getMyColor() && game.isMyTurn(),
      onMouseoverSquare: (square) =>
        game.isMyTurn() &&
        game.getAvailableMoves({ square, verbose: true }).forEach((m) => {
          const elem = getSquare(m.to);
          elem.classList.add("dot-middle");
          markedMoves.push(elem);
        }),
      onMouseoutSquare: removeMarkedMoves,
    });
  }
</script>

<main class="overflow-auto font-sans bg-gradient-to-r from-purple-100 to-pink-100 h-screen">
  <div class="p-3 flex flex-col items-center min-w-full">
    <h1>web-chess</h1>
    <div class="w-96" id={boardId} />
    <div class="flex justify-center items-center w-96">
      <Button on:click={newGame} >New&nbsp;game</Button>
      <div class="grow flex w-full flex-col flex-nowrap">
        <Slider id="difficultyslider" bind:value={difficulty} min={0} max={8} />
        <div class="pl-2 pb">New game difficulty: { difficulty }</div>
      </div>   
    </div>
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
