import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from './authSlice';
import { validateLogin, validateRegister } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import { Input, Alert } from '../../components/ui/FormFields';

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-8">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-crimson-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <span className="text-3xl">💍</span>
            <span className="font-display font-bold text-2xl text-white">
              Shaadi<span className="text-gold-400">Bio</span>
            </span>
          </Link>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-2xl text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="text-center mt-4 text-sm text-white/70">{footer}</div>}
      </div>
    </div>
  );
}

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [user]);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    dispatch(loginUser(form));
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to your ShaadiBio account"
      footer={<>Don't have an account? <Link to="/register" className="text-gold-400 hover:text-gold-300 font-semibold">Sign Up Free</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign In
        </Button>
        <div className="text-center">
          <Link to="/create" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Continue as guest →
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [user]);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateRegister(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    dispatch(registerUser(form));
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Start creating beautiful biodatas for free"
      footer={<>Already have an account? <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold">Sign In</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min 6 characters"
          error={errors.password}
          autoComplete="new-password"
        />
        <p className="text-xs text-gray-400">
          By registering, you agree to our privacy-first approach. We never share your data.
        </p>
        <Button type="submit" fullWidth loading={loading} size="lg">
          Create Free Account
        </Button>
        <div className="text-center">
          <Link to="/create" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Continue as guest →
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
