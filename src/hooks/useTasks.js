import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setFilter,
  setSortBy,
} from '../store/tasksSlice';

const PRIORITY_ORDER = { alta: 0, media: 1, baixa: 2 };

export function useTasks() {
  const dispatch = useDispatch();
  const { items, loading, error, filter, sortBy } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const stats = useMemo(
    () =>
      items.reduce(
        (acc, t) => {
          acc.total += 1;
          if (t.completed) acc.completed += 1;
          else acc.active += 1;
          return acc;
        },
        { total: 0, completed: 0, active: 0 }
      ),
    [items]
  );

  const tasks = useMemo(() => {
    const filtered = items.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'done') return task.completed;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') {
        return (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [items, filter, sortBy]);

  const addTask = useCallback((task) => dispatch(createTask(task)), [dispatch]);
  const editTask = useCallback((task) => dispatch(updateTask(task)), [dispatch]);
  const removeTask = useCallback((id) => dispatch(deleteTask(id)), [dispatch]);
  const toggleTask = useCallback(
    (task) => dispatch(updateTask({ ...task, completed: !task.completed })),
    [dispatch]
  );
  const changeFilter = useCallback((f) => dispatch(setFilter(f)), [dispatch]);
  const changeSort = useCallback((s) => dispatch(setSortBy(s)), [dispatch]);

  return {
    tasks,
    allTasks: items,
    loading,
    error,
    filter,
    sortBy,
    stats,
    addTask,
    editTask,
    removeTask,
    toggleTask,
    changeFilter,
    changeSort,
  };
}
