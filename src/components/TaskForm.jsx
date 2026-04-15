import { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';

const INITIAL_STATE = { title: '', description: '', priority: 'media' };

const ERRORS_INITIAL = { title: '' };

export default function TaskForm({ onSubmit, onCancel, initialData = null, loading = false }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(ERRORS_INITIAL);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'media',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors(ERRORS_INITIAL);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = { title: '' };
    if (!formData.title.trim()) {
      newErrors.title = 'O título da tarefa é obrigatório';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres';
    }
    setErrors(newErrors);
    return !newErrors.title;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    });
    if (!initialData) setFormData(INITIAL_STATE);
  };

  const isEditing = !!initialData;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.title}>{isEditing ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h3>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">
            Título <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            placeholder="Digite o título da tarefa"
            value={formData.title}
            onChange={handleChange}
            maxLength={120}
          />
          {errors.title && <span className={styles.errorMsg}>{errors.title}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            placeholder="Adicione uma descrição opcional..."
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
          />
        </div>

        <div className={`${styles.field}`}>
          <label className={styles.label} htmlFor="priority">
            Prioridade
          </label>
          <select
            id="priority"
            name="priority"
            className={styles.select}
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
      </div>

      <div className={styles.footer}>
        {onCancel && (
          <button type="button" className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? (
            'Salvando...'
          ) : isEditing ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Salvar Alterações
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
    </form>
  );
}
