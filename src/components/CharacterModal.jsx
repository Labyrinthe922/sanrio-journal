import {useEffect, useRef} from 'react';
import {Visual} from './Visual.jsx';

export default function CharacterModal({character, onClose, onMove}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const onMoveRef = useRef(onMove);

  onCloseRef.current = onClose;
  onMoveRef.current = onMove;

  useEffect(() => {
    const returnFocusTo = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.classList.add('modal-open');

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onMoveRef.current(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onMoveRef.current(-1);
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) {
          event.preventDefault();
          dialogRef.current?.focus();
          return;
        }

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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      if (returnFocusTo instanceof HTMLElement && returnFocusTo.isConnected) {
        returnFocusTo.focus();
      }
    };
  }, []);

  return <div className="modal-backdrop" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section
      className="profile-modal"
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button ref={closeButtonRef} className="modal-close" onClick={onClose} aria-label="关闭">×</button>
      <div className="modal-art"><Visual character={character} large/></div>
      <div className="modal-copy">
        <span className="eyebrow">CHARACTER PROFILE · {character.colorName}</span>
        <h2 id="modal-title">{character.en}</h2>
        <div className="zh-name">{character.zh}</div>
        <div className="tag-row">{character.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div>
        <p className="modal-description">{character.full}</p>
        <blockquote>“{character.editor}”</blockquote>
        <p className="color-line"><span style={{background: character.color}}/> 代表色 · {character.colorName}</p>
        <a className="text-button" href={character.official} target="_blank" rel="noreferrer">查看官方角色资料 ↗</a>
        <div className="modal-controls">
          <button onClick={() => onMove(-1)}>← 上一个角色</button>
          <button onClick={() => onMove(1)}>下一个角色 →</button>
        </div>
      </div>
    </section>
  </div>;
}
