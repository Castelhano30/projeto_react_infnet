import TaskCard from './TaskCard';
import LoadingSkeleton from './LoadingSkeleton';
import styles from './TaskList.module.css';

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Pendentes' },
  { value: 'done', label: 'Concluídas' },
];

export default function TaskList({ tasks, loading, filter, sortBy, onToggle, onEdit, onDelete, onFilterChange, onSortChange }) {
  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ''}`}
              onClick={() => onFilterChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="date">Ordenar por data</option>
          <option value="title">Ordenar por título</option>
          <option value="priority">Ordenar por prioridade</option>
        </select>

        <span className={styles.count}>
          {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>Nenhuma tarefa encontrada</p>
          <p className={styles.emptySubtitle}>
            {filter === 'all'
              ? 'Adicione sua primeira tarefa usando o formulário acima.'
              : filter === 'active'
              ? 'Nenhuma tarefa pendente no momento.'
              : 'Nenhuma tarefa concluída ainda.'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
