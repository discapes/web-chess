import App from './App.svelte'
import '../node_modules/@discape/chessboardjs/dist/build/chessboard.min.css';
import './app.css';

const app = new App({
  target: document.getElementById('app')
})

export default app
