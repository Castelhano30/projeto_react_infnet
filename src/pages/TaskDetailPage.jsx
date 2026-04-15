import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import styles from './TaskDetailPage.module.css';

const PRIORITY_LABELS = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
const PRIORITY_BADGE_CLASS = {
  alta: styles.badgePriorityAlta,
  media: styles.badgePriorityMedia,
  baixa: styles.badgePriorityBaixa,
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editTask, removeTask, toggleTask } = useTasks();
  const task = useSelector((state) => state.tasks.items.find((t) => t.id === id));

  const [isEditing, setIsEditing] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(false);

  useEffect(() => {
    if (task) setLocalCompleted(task.completed);
  }, [task]);

  const handleToggle = () => {
    setLocalCompleted((prev) => !prev);
    toggleTask(task);
  };

  const handleEdit = async (data) => {
    await editTask({ ...task, ...data });
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeTask(task.id);
    navigate('/tasks');
  };

  const formattedCreated = task
    ? new Date(task.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const formattedUpdated = task
    ? new Date(task.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  if (!task) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.inner}>
          <Link to="/tasks" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar para tarefas
          </Link>
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h2 className={styles.notFoundTitle}>Tarefa não encontrada</h2>
            <p className={styles.notFoundText}>
              A tarefa que você está procurando não existe ou foi removida.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
        <Link to="/tasks" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar para tarefas
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headerMain}>
              <h1 className={`${styles.taskTitle} ${localCompleted ? styles.taskTitleDone : ''}`}>
                {task.title}
              </h1>
              <div className={styles.badgeRow}>
                <span className={`${styles.badge} ${localCompleted ? styles.badgeDone : styles.badgePending}`}>
                  {localCompleted ? 'Concluída' : 'Pendente'}
                </span>
                {task.priority && (
                  <span className={`${styles.badge} ${PRIORITY_BADGE_CLASS[task.priority] || ''}`}>
                    Prioridade {PRIORITY_LABELS[task.priority] || task.priority}
                  </span>
                )}
              </div>
            </div>

            <button
              className={`${styles.toggleBtn} ${localCompleted ? styles.toggleBtnDone : styles.toggleBtnPending}`}
              onClick={handleToggle}
            >
              {localCompleted ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  Marcar Pendente
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Marcar Concluída
                </>
              )}
            </button>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Descrição</span>
              {task.description ? (
                <p className={styles.sectionValue}>{task.description}</p>
              ) : (
                <p className={`${styles.sectionValue} ${styles.sectionValueEmpty}`}>
                  Nenhuma descrição adicionada
                </p>
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <span className={styles.sectionLabel}>Criada em</span>
              <p className={styles.sectionValue}>{formattedCreated}</p>
            </div>

            {task.updatedAt !== task.createdAt && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Última atualização</span>
                <p className={styles.sectionValue}>{formattedUpdated}</p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className={styles.editFormWrapper}>
              <TaskForm
                initialData={task}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          )}

          <div className={styles.cardFooter}>
            <button
              className={styles.editToggleBtn}
              onClick={() => setIsEditing((p) => !p)}
            >
              {isEditing ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancelar Edição
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar Tarefa
                </>
              )}
            </button>

            <button className={styles.deleteBtn} onClick={handleDelete}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Excluir Tarefa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
