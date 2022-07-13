<script>
  import logo from "./assets/svelte.png";
  import Counter from "./lib/Counter.svelte";
  import { Chessboard, fenToObj, objToFen } from "../../chessboardjs-npm/dist/build/chessboard.mjs";
  import { onMount } from "svelte";

  const config = {
    position: "start",
    draggable: true,
    sparePieces: true,
    pieceTheme: 'https://unpkg.com/@discape/chessboardjs@1.1.0/dist/img/chesspieces/wikipedia/{piece}.png',
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
  };

  onMount(() => {
    let chessboard = Chessboard("myBoard", config);
  });
</script>

<main>
  <div id="myBoard" style="width: 400px" />

  <img src={logo} alt="Svelte Logo" />
  <h1>Hello world!</h1>

  <Counter />

  <p>
    Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.
  </p>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for the officially supported framework, also powered by Vite!
  </p>
</main>

<style>
  :global(.spare-pieces-7492f) {
    display: flex;
    justify-content: center;
  }

  :global(.piece-wrapper) {
    position: relative;
    display: inline-block;
    z-index: 100;
  }

  :global(.spare-count) {
    border: 1px solid #ccc;
    padding: 0 4px;
    border-radius: 37%;
    font-size: 12px;
    position: absolute;
    z-index: 1;
    background: #fff;
    right: 0;
    bottom: 1px;
  }

  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>