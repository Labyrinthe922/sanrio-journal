import {useEffect, useReducer, useRef} from 'react';
import './TetrisGame.css';

const WIDTH = 10;
const HEIGHT = 20;
const SHAPES = [
  {color: '#8ebad2', cells: [[1, 1, 1, 1]]},
  {color: '#e9c879', cells: [[1, 1], [1, 1]]},
  {color: '#a899ce', cells: [[0, 1, 0], [1, 1, 1]]},
  {color: '#82ad9a', cells: [[0, 1, 1], [1, 1, 0]]},
  {color: '#d98e98', cells: [[1, 1, 0], [0, 1, 1]]},
  {color: '#8d91b9', cells: [[1, 0, 0], [1, 1, 1]]},
  {color: '#d9a47c', cells: [[0, 0, 1], [1, 1, 1]]},
];

const emptyBoard = () => Array.from({length: HEIGHT}, () => Array(WIDTH).fill(null));
const makePiece = () => {
  const choice = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const cells = choice.cells.map(row => [...row]);
  return {cells, color: choice.color, x: Math.floor((WIDTH - cells[0].length) / 2), y: 0};
};
const initialState = {board: emptyBoard(), piece: null, score: 0, lines: 0, running: false, gameOver: false};

function canPlace(board, piece, x, y, cells = piece.cells) {
  return cells.every((row, dy) => row.every((filled, dx) => !filled || (
    x + dx >= 0 && x + dx < WIDTH && y + dy < HEIGHT &&
    (y + dy < 0 || !board[y + dy][x + dx])
  )));
}

function lockPiece(state, nextPiece) {
  const board = state.board.map(row => [...row]);
  state.piece.cells.forEach((row, dy) => row.forEach((filled, dx) => {
    const x = state.piece.x + dx;
    const y = state.piece.y + dy;
    if (filled && y >= 0 && y < HEIGHT) board[y][x] = state.piece.color;
  }));
  const kept = board.filter(row => row.some(cell => !cell));
  const cleared = HEIGHT - kept.length;
  while (kept.length < HEIGHT) kept.unshift(Array(WIDTH).fill(null));
  const gameOver = !canPlace(kept, nextPiece, nextPiece.x, nextPiece.y);
  return {
    ...state,
    board: kept,
    piece: gameOver ? null : nextPiece,
    score: state.score + [0, 100, 300, 500, 800][cleared],
    lines: state.lines + cleared,
    running: !gameOver,
    gameOver,
  };
}

function reducer(state, action) {
  if (action.type === 'RESTART') {
    return {...initialState, board: emptyBoard(), piece: action.piece, running: true};
  }
  if (action.type === 'START') {
    const piece = state.piece || action.piece;
    if (!piece || !canPlace(state.board, piece, piece.x, piece.y)) {
      return {...state, piece: null, running: false, gameOver: true};
    }
    return {...state, piece, running: true, gameOver: false};
  }
  if (action.type === 'PAUSE') return {...state, running: false};
  if (!state.running || !state.piece) return state;

  if (action.type === 'MOVE') {
    const x = state.piece.x + action.direction;
    return canPlace(state.board, state.piece, x, state.piece.y)
      ? {...state, piece: {...state.piece, x}}
      : state;
  }
  if (action.type === 'ROTATE') {
    const cells = state.piece.cells[0].map((_, index) => state.piece.cells.map(row => row[index]).reverse());
    for (const offset of [0, -1, 1, -2, 2]) {
      if (canPlace(state.board, state.piece, state.piece.x + offset, state.piece.y, cells)) {
        return {...state, piece: {...state.piece, cells, x: state.piece.x + offset}};
      }
    }
    return state;
  }
  if (action.type === 'DROP' || action.type === 'TICK') {
    const y = state.piece.y + 1;
    return canPlace(state.board, state.piece, state.piece.x, y)
      ? {...state, piece: {...state.piece, y}}
      : lockPiece(state, action.nextPiece);
  }
  return state;
}

function drawBoard(state) {
  const board = state.board.map(row => [...row]);
  if (state.piece) state.piece.cells.forEach((row, dy) => row.forEach((filled, dx) => {
    const x = state.piece.x + dx;
    const y = state.piece.y + dy;
    if (filled && y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH) board[y][x] = state.piece.color;
  }));
  return board;
}

export default function TetrisGame({onClose}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  const onCloseRef = useRef(onClose);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  stateRef.current = state;
  onCloseRef.current = onClose;

  useEffect(() => {
    const returnFocusTo = document.activeElement;
    document.body.classList.add('tetris-open');
    closeButtonRef.current?.focus();
    const onKeyDown = event => {
      const current = stateRef.current;
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled)');
        if (focusable?.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
      } else if (event.code === 'Space') {
        event.preventDefault();
        event.stopPropagation();
        if (current.running) dispatch({type: 'PAUSE'});
        else if (!current.gameOver) dispatch({type: 'START', piece: makePiece()});
      } else if (current.running) {
        const actions = {
          ArrowLeft: {type: 'MOVE', direction: -1},
          ArrowRight: {type: 'MOVE', direction: 1},
          ArrowUp: {type: 'ROTATE'},
          ArrowDown: {type: 'DROP'},
        };
        if (actions[event.key]) {
          event.preventDefault();
          event.stopPropagation();
          dispatch({...actions[event.key], nextPiece: makePiece()});
        }
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.classList.remove('tetris-open');
      if (returnFocusTo instanceof HTMLElement && returnFocusTo.isConnected) returnFocusTo.focus();
    };
  }, []);

  useEffect(() => {
    if (!state.running) return undefined;
    const timer = window.setInterval(() => dispatch({type: 'TICK', nextPiece: makePiece()}), 620);
    return () => window.clearInterval(timer);
  }, [state.running]);

  const board = drawBoard(state);
  const startOrResume = () => dispatch({type: 'START', piece: makePiece()});
  const move = direction => dispatch({type: 'MOVE', direction, nextPiece: makePiece()});

  return <div className="tetris-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section ref={dialogRef} className="tetris-dialog" role="dialog" aria-modal="true" aria-labelledby="tetris-title">
      <button ref={closeButtonRef} className="tetris-close" onClick={onClose} aria-label="关闭小游戏">×</button>
      <header className="tetris-header">
        <span className="eyebrow">A LITTLE PAUSE · MINI GAME</span>
        <h2 id="tetris-title">
          <span className="tetris-mark tetris-mark-title" aria-hidden="true"><i/><i/><i/><i/></span>
          <span>SANRIO <em>BLOCK PARTY</em></span>
        </h2>
        <p>俄罗斯方块 · 排满整行即可消除并得分</p>
      </header>
      <div className="tetris-content">
        <div className="tetris-board-wrap">
          <div className="tetris-board" role="grid" aria-label="俄罗斯方块游戏区域">
            {board.flatMap((row, y) => row.map((color, x) => <span
              className={`tetris-cell${color ? ' filled' : ''}`}
              key={`${y}-${x}`}
              role="gridcell"
              style={color ? {'--block-color': color} : undefined}
            />))}
            {(!state.running || state.gameOver) && <div className="tetris-overlay-message">
              <strong>{state.gameOver ? '游戏结束' : state.piece ? '已暂停' : '准备好了吗？'}</strong>
              <span>{state.gameOver ? '重新开始，再挑战一次。' : state.piece ? '点击继续，或按空格键。' : '按下开始，开启方块时间。'}</span>
            </div>}
          </div>
        </div>
        <aside className="tetris-side">
          <div className="tetris-score"><span>当前分数</span><strong>{state.score}</strong><small>消除行数 · {state.lines}</small></div>
          <div className="tetris-actions">
            {!state.running && <button className="tetris-primary" onClick={state.gameOver ? () => dispatch({type: 'RESTART', piece: makePiece()}) : startOrResume}>{state.gameOver ? '重新开始' : state.piece ? '继续游戏' : '开始游戏'}</button>}
            {state.running && <button className="tetris-primary" onClick={() => dispatch({type: 'PAUSE'})}>暂停</button>}
            <button className="tetris-secondary" onClick={() => dispatch({type: 'RESTART', piece: makePiece()})}>重新开始</button>
          </div>
          <p className="tetris-key-guide">← → 移动<br/>↑ 旋转方块<br/>↓ 加速下落<br/>空格 暂停 / 继续</p>
          <div className="tetris-touch" aria-label="触控游戏控制">
            <button onClick={() => move(-1)} aria-label="向左移动">←</button>
            <button onClick={() => dispatch({type: 'ROTATE', nextPiece: makePiece()})} aria-label="旋转方块">↻</button>
            <button onClick={() => dispatch({type: 'DROP', nextPiece: makePiece()})} aria-label="加速下落">↓</button>
            <button onClick={() => move(1)} aria-label="向右移动">→</button>
          </div>
        </aside>
      </div>
    </section>
  </div>;
}
