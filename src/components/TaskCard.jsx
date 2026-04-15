import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TaskCard.module.css';

const PRIORITY_BADGE = {
  alta: styles.badgeAlta,
  media: styles.badgeMedia,
  baixa: styles.badgeBaixa,
};

const PRIORITY_LABEL = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

export default function TaskCard({ task, onToggle, onEdit, onDelete, staggerIndex = 0 }) {
  const navigate = useNavigate();
  const [localCompleted, setLocalCompleted] = useState(task.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setLocalCompleted(task.completed);
    setEditTitle(task.title);
  }, [task.completed, task.title]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setLocalCompleted((p) => !p);
    onToggle(task);
  };

  const handleEditStart = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEditSave = (e) => {
    e.stopPropagation();
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) onEdit({ ...task, title: trimmed });
    else setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleEditKey = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') handleEditSave(e);
    if (e.key === 'Escape') { setEditTitle(task.title); setIsEditing(false); }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsExiting(true);
  };

  const handleAnimationEnd = () => {
    if (isExiting) onDelete(task.id);
  };

  const handleCardClick = () => {
    if (!isEditing) navigate(`/tasks/${task.id}`);
  };

  const date = new Date(task.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });

  const cardClass = [
    styles.card,
    localCompleted ? styles.cardCompleted : '',
    isExiting ? styles.cardExiting : '',
  ].join(' ').trim();

  return (
    <div
      className={cardClass}
      onClick={handleCardClick}
      onAnimationEnd={handleAnimationEnd}
      style={{ '--i': staggerIndex }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <button
        className={`${styles.checkbox} ${localCompleted ? styles.checkboxDone : ''}`}
        onClick={handleToggle}
        aria-label={localCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
      >
        {localCompleted && (
          <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className={styles.body}>
        <div className={styles.titleWrap}>
          {isEditing ? (
            <input
              className={styles.editInput}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleEditKey}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <>
              <span className={`${styles.titleText} ${localCompleted ? styles.titleDone : ''}`}>
                {task.title}
              </span>
              {localCompleted && <span className={styles.strikeBar} />}
            </>
          )}
        </div>

        {task.description && <p className={styles.desc}>{task.description}</p>}

        <div className={styles.meta}>
          <span className={`${styles.badge} ${localCompleted ? styles.badgeDone : styles.badgePending}`}>
            {localCompleted ? 'Concluída' : 'Pendente'}
          </span>
          {task.priority && (
            <span className={`${styles.badge} ${PRIORITY_BADGE[task.priority] || ''}`}>
              {PRIORITY_LABEL[task.priority] || task.priority}
            </span>
          )}
          <span className={styles.date}>{date}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={handleEditStart}
          aria-label="Editar"
          title="Editar tarefa"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className={`${styles.iconBtn} ${styles.iconBtnDel}`}
          onClick={handleDeleteClick}
          aria-label="Excluir"
          title="Excluir tarefa"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
