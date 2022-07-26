// @ts-nocheck
import { Chess } from "chess.js";

class ChessGame {
	chessjs = new Chess();
	getAvailableMoves = (...args) => this.chessjs.moves(...args);
	getCheckedKing = () => this.chessjs.in_check() ? this.chessjs.turn() : false;
	isOver = () => this.chessjs.game_over();
	getFen = () => this.chessjs.fen();
	isMyTurn = () => this.chessjs.turn() === "w";
	getTurn = () => this.chessjs.turn();
	getMyColor = () => "w";

	constructor() {
		if (this.constructor === ChessGame) {
			throw new Error("Can't instantiate abstract class!");
		}
	}

	async waitForOpponent() {
		throw new Error("Method not implemented!");
	}
	tryMove() {
		throw new Error("Method not implemented!");
	}
}

export class RandomGame extends ChessGame {
	ready = true;
	tryMove = (from, to) => this.chessjs.move({ to, from, promotion: 'q'});

	async waitForOpponent() {
		const moves = this.chessjs.moves({verbose: true});
		const move = moves[Math.floor(Math.random() * moves.length)];
		this.chessjs.move(move);
		return { from: move.from, to: move.to };
	}
}

export class StockfishGame extends ChessGame {

	resolveBestMove;
	bestMovePromise = new Promise(res => this.resolveBestMove = res);;
	ready = false;
	sf;
	config;

	constructor(skillLevel) {
		super();
		this.config = getSkillConfig(skillLevel);
		Stockfish().then(sf => {
			sf.msg = (msg) => {
				console.log('> ' + msg)
				sf.postMessage(msg);
			}
			sf.addMessageListener(messageListener.bind(this));
			if (skillLevel > 4) sf.msg(`setoption name Use NNUE value false`)
			sf.msg(`setoption name Skill Level value ${this.config.skilllevel}`);
			sf.msg("isready");
			sf.msg("ucinewgame");
			this.sf = sf;

			function messageListener(line) {
				try {
					if (!line.startsWith("info depth"));
					console.log(': ' + line);
					if (line === "readyok") this.ready = true;

					if (line.startsWith("bestmove")) {
						const moveStr = line.split(' ')[1];
						const from = moveStr[0] + moveStr[1];
						const to = moveStr[2] + moveStr[3];
						const promotion = moveStr[4];
						console.log(`found best move ${from} to ${to} with ${promotion} promotion`);
						this.chessjs.move({ from, to, promotion });
						this.resolveBestMove({ from, to });
						this.bestMovePromise = new Promise(res => this.resolveBestMove = res);
					}
				} catch (e) {
					console.error(e);
				}
			}
		});
	}

	tryMove(from, to) {
		console.log(`trying move ${from}${to}`)
		const valid = this.chessjs.move({
			from,
			to,
			promotion: 'q',
		})
		console.log(valid ? `valid` : `invalid`);
		if (!valid) return false;
		this.sf.msg(`position fen ${this.getFen()}`);
		this.sf.msg(`go movetime ${this.config.movetime} depth ${this.config.depth}`);
		return true;
	}

	waitForOpponent() {
		return this.bestMovePromise;
	}
}

function getSkillConfig(oneToEight) {
	if (oneToEight > 8 || oneToEight < 1) throw new Error("Skill level must be 1-8");
	const cfgs = [
		[50, -9, 5],
		[100, -5, 5],
		[150, -1, 5],
		[200, 3, 5],
		[300, 7, 5],
		[400, 11, 8],
		[500, 16, 13],
		[1000, 20, 22],
	];
	const [ movetime, skilllevel, depth ] = cfgs[oneToEight - 1];
	return { movetime, skilllevel, depth };
}