<script>
  // @ts-ignore
  import { Chessboard, fenToObj, objToFen } from "@discape/chessboardjs";
  import { onMount } from "svelte";

  onMount(() => {
    let chessboard = Chessboard("myBoard", {
      position: "start",
      draggable: true,
      sparePieces: true,
      pieceTheme: "https://unpkg.com/@discape/chessboardjs@1.1.0/dist/img/chesspieces/wikipedia/{piece}.png",
      spareCounts: {
        wK: 1,
        wQ: 1,
        wR: 1,
        wB: 1,
        wN: 1,
        wP: 1,
        bK: 1,
        bQ: 1,
        bR: 1,
        bB: 1,
        bN: 1,
        bP: 1,
      },
      scaleDrag: 1.2,
      cacheImages: true,
    });
  });
</script>

<main>
  <h1>web-chess</h1>
  <div class="w-96" id="myBoard" />
</main>

<style lang="postcss">
  @tailwind base;
  @tailwind utilities;

  main {
    @apply font-sans bg-gradient-to-r from-purple-100 to-pink-100 h-screen overflow-y-auto flex flex-col justify-center items-center p-10;
  }

  :global(img) {
    height: 16rem;
    width: 16rem;
  }

  :global(p){
    max-width: 30rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  :global(h1) {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 30rem;
  }

  /* :global(h1) {
    display: block;
    font-weight: bold;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
  } */

  :global(h2) {
    display: block;
    font-weight: bold;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
  }

  :global(h3) {
    display: block;
    font-weight: bold;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  :global(h4) {
    display: block;
    font-weight: bold;
    font-size: 1em;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
  }
  :global(h5) {
    display: block;
    font-weight: bold;
    font-size: 0.83em;
    margin-block-start: 1.67em;
    margin-block-end: 1.67em;
  }

  :global(h6) {
    display: block;
    font-weight: bold;
    font-size: 0.67em;
    margin-block-start: 2.33em;
    margin-block-end: 2.33em;
  }

  :global(a){
    color: blue;
  }
</style>
