import {useState} from 'react';
import {Link} from 'react-router-dom';
import TetrisGame from './TetrisGame.jsx';
import './FloatingActions.css';

export default function FloatingActions() {
  const [gameOpen, setGameOpen] = useState(false);

  return <>
    <div className="floating-actions" aria-label="快捷入口">
      <Link className="floating-action floating-story" to="/share" aria-label="前往留言墙" title="留言墙">
        <span className="floating-action-icon" aria-hidden="true">✎</span>
        <span>留言墙</span>
      </Link>
      <button className="floating-action floating-game" onClick={() => setGameOpen(true)} aria-label="打开小游戏" title="小游戏">
        <span className="floating-action-icon" aria-hidden="true">
          <span className="tetris-mark tetris-mark-launcher"><i/><i/><i/><i/></span>
        </span>
        <span>小游戏</span>
      </button>
    </div>
    {gameOpen && <TetrisGame onClose={() => setGameOpen(false)}/>}
  </>;
}
