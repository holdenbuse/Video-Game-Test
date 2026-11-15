import './style.css';
import { createGame } from './core/createGame.js';

const host = document.querySelector('#app');

try {
  const game = createGame(host);
  game.start();
} catch (error) {
  host.textContent = 'This browser could not start the 3D garden.';
  console.error(error);
}
