import { useState } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import styles from './TasksPage.module.css';

export default function TasksPage() {
  const { tasks, loading, error, filter, sortBy, addTask, editTask, removeTask, toggleTask, changeFilter, changeSort } = useTasks();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (taskData) => {
    await addTask(taskData);
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Minhas Tarefas</h1>
              <p className={styles.subtitle}>Gerencie e organize suas tarefas do dia a dia</p>
            </div>
            <button className={styles.addBtn} onClick={() => setShowForm((p) => !p)}>
              {showForm ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancelar
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Adicionar Tarefa
                </>
              )}
            </button>
          </div>
        </div>

        {showForm && (
          <div className={styles.formWrapper}>
            <TaskForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {error && (
          <div className={styles.errorAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Erro ao carregar tarefas. Tente novamente.
          </div>
        )}

        <div className={styles.listSection}>
          <TaskList
            tasks={tasks}
            loading={loading}
            filter={filter}
            sortBy={sortBy}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={removeTask}
            onFilterChange={changeFilter}
            onSortChange={changeSort}
          />
        </div>
      </div>
    </div>
  );
}
