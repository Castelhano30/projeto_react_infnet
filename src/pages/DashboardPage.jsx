import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, allTasks, loading, stats, toggleTask, editTask, removeTask } = useTasks();

  const recentTasks = allTasks.slice(0, 5);
  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const greetingName = user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
        <div className={styles.welcome}>
          <h1 className={styles.welcomeTitle}>
            Olá, <span className={styles.accent}>{greetingName}</span>!
          </h1>
          <p className={styles.welcomeSubtitle}>
            Aqui está um resumo das suas tarefas de hoje.
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconTotal}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.total}</div>
              <div className={styles.statLabel}>Total de Tarefas</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconActive}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.active}</div>
              <div className={styles.statLabel}>Pendentes</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconDone}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.completed}</div>
              <div className={styles.statLabel}>Concluídas</div>
            </div>
          </div>
        </div>

        {stats.total > 0 && (
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressTitle}>Progresso Geral</span>
              <span className={styles.progressPercent}>{progressPercent}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressBar} ${progressPercent === 100 ? styles.progressBarDone : ''}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tarefas Recentes</h2>
            <Link to="/tasks" className={styles.viewAllLink}>
              Ver todas →
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} />
          ) : recentTasks.length === 0 ? (
            <div className={styles.emptyDashboard}>
              <div className={styles.emptyDashboardIcon}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <h3 className={styles.emptyDashboardTitle}>Nenhuma tarefa ainda</h3>
              <p className={styles.emptyDashboardText}>
                Comece adicionando sua primeira tarefa e organize seu dia!
              </p>
              <Link to="/tasks" className={styles.ctaBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Adicionar Tarefa
              </Link>
            </div>
          ) : (
            recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={removeTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
