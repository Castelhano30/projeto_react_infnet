import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const STORAGE_KEY = 'todo_tasks';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(loadFromStorage()), 400);
  });
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { getState }) => {
  const newTask = {
    ...taskData,
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [newTask, ...getState().tasks.items];
  saveToStorage(updated);
  return newTask;
});

export const updateTask = createAsyncThunk('tasks/update', async (task, { getState }) => {
  const patched = { ...task, updatedAt: new Date().toISOString() };
  const updated = getState().tasks.items.map((t) => (t.id === task.id ? patched : t));
  saveToStorage(updated);
  return patched;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { getState }) => {
  const updated = getState().tasks.items.filter((t) => t.id !== id);
  saveToStorage(updated);
  return id;
});

const setError = (state, action) => {
  state.loading = false;
  state.error = action.error.message ?? 'Erro desconhecido.';
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: 'all',
    sortBy: 'date',
  },
  reducers: {
    setFilter: (state, action) => { state.filter = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    clearTasksError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTasks.rejected, setError)
      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createTask.rejected, setError)
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTask.rejected, setError)
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, setError);
  },
});

export const { setFilter, setSortBy, clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;
