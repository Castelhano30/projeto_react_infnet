import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../store/authSlice';
import styles from './LoginPage.module.css';

const EMPTY_REGISTER = { name: '', email: '', password: '', confirm: '' };
const EMPTY_REG_ERRORS = { name: '', email: '', password: '', confirm: '' };

function RegisterModal({ onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(EMPTY_REG_ERRORS);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const validate = () => {
    const errs = { ...EMPTY_REG_ERRORS };
    let valid = true;

    if (!form.name.trim()) { errs.name = 'O nome é obrigatório'; valid = false; }
    if (!form.email.trim()) {
      errs.email = 'O e-mail é obrigatório'; valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Insira um e-mail válido'; valid = false;
    }
    if (!form.password) {
      errs.password = 'A senha é obrigatória'; valid = false;
    } else if (form.password.length < 6) {
      errs.password = 'A senha deve ter no mínimo 6 caracteres'; valid = false;
    }
    if (!form.confirm) {
      errs.confirm = 'Confirme sua senha'; valid = false;
    } else if (form.confirm !== form.password) {
      errs.confirm = 'As senhas não coincidem'; valid = false;
    }

    setFieldErrors(errs);
    return valid;
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (fieldErrors[field]) setFieldErrors((p) => ({ ...p, [field]: '' }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password }));
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(onClose, 1800);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Criar conta">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Criar conta</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Fechar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className={styles.successMsg}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p>Conta criada com sucesso!</p>
            <span>Fazendo login automaticamente...</span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && (
              <div className={styles.alertError} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-name">Nome</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input id="reg-name" type="text" className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`} placeholder="Seu nome completo" value={form.name} onChange={handleChange('name')} autoComplete="name" />
              </div>
              {fieldErrors.name && <span className={styles.errorMsg}>{fieldErrors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-email">E-mail</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input id="reg-email" type="email" className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`} placeholder="seu@email.com" value={form.email} onChange={handleChange('email')} autoComplete="email" inputMode="email" />
              </div>
              {fieldErrors.email && <span className={styles.errorMsg}>{fieldErrors.email}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-password">Senha</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input id="reg-password" type={showPass ? 'text' : 'password'} className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`} placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange('password')} autoComplete="new-password" />
                <button type="button" className={styles.togglePassword} onClick={() => setShowPass((p) => !p)} aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && <span className={styles.errorMsg}>{fieldErrors.password}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-confirm">Confirmar senha</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input id="reg-confirm" type={showPass ? 'text' : 'password'} className={`${styles.input} ${fieldErrors.confirm ? styles.inputError : ''}`} placeholder="Repita a senha" value={form.confirm} onChange={handleChange('confirm')} autoComplete="new-password" />
              </div>
              {fieldErrors.confirm && <span className={styles.errorMsg}>{fieldErrors.confirm}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <><span className={styles.spinner} />Criando conta...</>
              ) : 'Criar conta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = () => {
    const errs = { email: '', password: '' };
    let valid = true;

    if (!email.trim()) {
      errs.email = 'O e-mail é obrigatório';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Insira um e-mail válido';
      valid = false;
    }

    if (!password) {
      errs.password = 'A senha é obrigatória';
      valid = false;
    } else if (password.length < 6) {
      errs.password = 'A senha deve ter no mínimo 6 caracteres';
      valid = false;
    }

    setFieldErrors(errs);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ email: email.trim(), password }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
    if (error) dispatch(clearError());
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoText}>T</span>
          </div>
          <h1 className={styles.appName}>To-do List</h1>
          <p className={styles.subtitle}>Acesse sua conta para gerenciar suas tarefas</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && (
            <div className={styles.alertError} role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                placeholder="seu@email.com"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                inputMode="email"
              />
            </div>
            {fieldErrors.email && <span className={styles.errorMsg}>{fieldErrors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && <span className={styles.errorMsg}>{fieldErrors.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner} />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <button type="button" className={styles.registerBtn} onClick={() => setShowRegister(true)}>
            Cadastrar
          </button>
        </form>

      </div>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}
