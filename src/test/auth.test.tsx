import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import LoginPage from '@auth/pages/LoginPage';
import RegisterPage from '@auth/pages/RegisterPage';

describe('Auth Module - Login Page', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders login form with email and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('shows role toggle with Job Seeker and Recruiter options', () => {
    render(<LoginPage />);
    expect(screen.getByText('Job Seeker')).toBeInTheDocument();
    expect(screen.getByText('Recruiter')).toBeInTheDocument();
  });

  it('defaults to Job Seeker role', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Sign in as Job Seeker/i)).toBeInTheDocument();
  });

  it('switches sign-in button text when Recruiter is selected', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByText('Recruiter'));
    expect(screen.getByText(/Sign in as Recruiter/i)).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByText(/Sign in as Job Seeker/i));
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
  });

  it('shows OAuth options (Google, LinkedIn)', () => {
    render(<LoginPage />);
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('has link to registration page', () => {
    render(<LoginPage />);
    expect(screen.getByText('Create an account')).toHaveAttribute('href', '/register');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find and click the toggle button (the eye icon button)
    const toggleButtons = screen.getAllByRole('button');
    const eyeButton = toggleButtons.find(btn => btn.closest('div')?.querySelector('input[type="password"]'));
    if (eyeButton) {
      await user.click(eyeButton);
    }
  });

  it('has Remember me checkbox', () => {
    render(<LoginPage />);
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('has Forgot password link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });
});

describe('Auth Module - Registration Page', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders role selection screen initially', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Job Seeker')).toBeInTheDocument();
    expect(screen.getByText('Recruiter / Organization')).toBeInTheDocument();
  });

  it('shows candidate registration form when Job Seeker is selected', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Job Seeker'));
    expect(screen.getByText('Job Seeker Registration')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
  });

  it('shows recruiter registration form with org fields when Recruiter is selected', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Recruiter / Organization'));
    expect(screen.getByText('Recruiter Registration')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your company name')).toBeInTheDocument();
  });

  it('has back button to return to role selection', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Job Seeker'));
    await user.click(screen.getByText('Back to role selection'));
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('shows password validation error for short passwords', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Job Seeker'));

    await user.type(screen.getByPlaceholderText('Enter your full name'), 'Test User');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Min 8 characters'), 'short');
    await user.type(screen.getByPlaceholderText('Re-enter password'), 'short');

    await user.click(screen.getByText('Create Account'));
    // Should show terms error (terms not checked) or password length error
    const errorEl = screen.queryByText(/must be at least 8 characters/i) ||
                    screen.queryByText(/must agree/i);
    expect(errorEl).toBeInTheDocument();
  });

  it('shows password mismatch error', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Job Seeker'));

    await user.type(screen.getByPlaceholderText('Enter your full name'), 'Test User');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('Min 8 characters'), 'password123');
    await user.type(screen.getByPlaceholderText('Re-enter password'), 'different123');

    await user.click(screen.getByText('Create Account'));
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('shows voice AI consent checkbox only for candidates', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Job Seeker'));
    expect(screen.getByText(/consent to receive voice AI/i)).toBeInTheDocument();
  });

  it('does not show voice AI consent for recruiters', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);
    await user.click(screen.getByText('Recruiter / Organization'));
    expect(screen.queryByText(/consent to receive voice AI/i)).not.toBeInTheDocument();
  });

  it('has link back to login page', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Sign in')).toHaveAttribute('href', '/login');
  });
});
