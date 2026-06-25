import { getCurrentUser, signIn, signUp } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const form = document.querySelector('[data-user-auth-form]');
const message = document.querySelector('[data-auth-message]');
const modeButtons = Array.from(document.querySelectorAll('[data-auth-mode]'));
const submitButton = document.querySelector('[data-auth-submit]');
const displayNameField = document.querySelector('[data-display-name-field]');
const modeTitle = document.querySelector('[data-auth-title]');
const modeCopy = document.querySelector('[data-auth-copy]');
const passwordInput = form.querySelector('input[name="password"]');
const passwordToggle = document.querySelector('[data-password-toggle]');
const forgotPasswordLink = document.querySelector('[data-forgot-password]');
const authOptions = document.querySelector('[data-auth-options]');
const loginWelcome = document.querySelector('[data-login-welcome]');
const forgotPasswordModal = document.querySelector('[data-forgot-password-modal]');
const forgotPasswordForm = document.querySelector('[data-forgot-password-form]');
const forgotPasswordInput = document.querySelector('[data-forgot-password-email]');
const forgotPasswordStatus = document.querySelector('[data-forgot-password-status]');
const forgotPasswordSubmit = document.querySelector('[data-forgot-password-submit]');
const forgotPasswordCancelButtons = Array.from(document.querySelectorAll('[data-forgot-password-cancel]'));
const returnToStorageKey = 'astralVeilReturnTo';
const defaultPublicAuthRedirect = 'index.html';
const blockedPublicReturnPaths = new Set([
  '/account.html',
  '/admin.html',
  '/admin-login.html',
]);

let authMode = 'login';
let isSendingPasswordReset = false;

function getSafeReturnTo(value) {
  if (!value) {
    return '';
  }

  const trimmedValue = String(value).trim();

  if (/^[a-z][a-z\d+.-]*:/i.test(trimmedValue) || trimmedValue.startsWith('//')) {
    return '';
  }

  try {
    const url = new URL(trimmedValue, window.location.origin);

    if (url.origin !== window.location.origin) {
      return '';
    }

    const normalizedPath = url.pathname.toLowerCase();

    if (/\/auth\.html$/i.test(normalizedPath) || blockedPublicReturnPaths.has(normalizedPath)) {
      return '';
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '';
  }
}

function getStoredReturnTo() {
  try {
    return sessionStorage.getItem(returnToStorageKey) || '';
  } catch {
    return '';
  }
}

function clearStoredReturnTo() {
  try {
    sessionStorage.removeItem(returnToStorageKey);
  } catch {
    return;
  }
}

function getAuthRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  const queryReturnTo = getSafeReturnTo(params.get('returnTo'));
  const storedReturnTo = getSafeReturnTo(getStoredReturnTo());

  return queryReturnTo || storedReturnTo || defaultPublicAuthRedirect;
}

function redirectAfterAuth({ replace = false } = {}) {
  const target = getAuthRedirectTarget();

  clearStoredReturnTo();

  if (replace) {
    window.location.replace(target);
    return;
  }

  window.location.assign(target);
}

function setMessage(text, type = '') {
  message.textContent = text;
  message.dataset.messageType = type;
  message.hidden = !text;
}

function setForgotPasswordStatus(text = '', type = '') {
  if (!forgotPasswordStatus) {
    return;
  }

  forgotPasswordStatus.textContent = text;
  forgotPasswordStatus.dataset.messageType = type;
  forgotPasswordStatus.hidden = !text;
}

function setForgotPasswordSaving(isSaving) {
  isSendingPasswordReset = isSaving;

  if (forgotPasswordSubmit) {
    forgotPasswordSubmit.disabled = isSaving;
    forgotPasswordSubmit.textContent = isSaving ? 'Sending...' : 'Send Reset Link';
  }

  forgotPasswordCancelButtons.forEach((button) => {
    button.disabled = isSaving;
  });
}

function setForgotPasswordModalOpen(isOpen) {
  if (!forgotPasswordModal) {
    return;
  }

  forgotPasswordModal.hidden = !isOpen;
  document.body.classList.toggle('auth-modal-open', isOpen);

  if (!isOpen) {
    forgotPasswordForm?.reset();
    forgotPasswordInput?.removeAttribute('aria-invalid');
    setForgotPasswordSaving(false);
    setForgotPasswordStatus('');
    forgotPasswordLink?.focus({ preventScroll: true });
    return;
  }

  setForgotPasswordStatus('');
  forgotPasswordInput?.focus({ preventScroll: true });
}

function getPasswordResetRedirectUrl() {
  const resetUrl = new URL('account.html', window.location.href);

  resetUrl.searchParams.set('changePassword', '1');
  resetUrl.hash = 'privacy-security';
  return resetUrl.href;
}

async function sendPasswordResetEmail(event) {
  event.preventDefault();

  const supabase = getSupabaseClient();
  const email = String(forgotPasswordInput?.value || '').trim();

  forgotPasswordInput?.removeAttribute('aria-invalid');

  if (!email) {
    forgotPasswordInput?.setAttribute('aria-invalid', 'true');
    setForgotPasswordStatus('Enter your account email.', 'error');
    return;
  }

  if (!supabase) {
    setForgotPasswordStatus('Password reset is not available right now. Please try again later.', 'error');
    return;
  }

  setForgotPasswordSaving(true);
  setForgotPasswordStatus('Sending reset link...');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getPasswordResetRedirectUrl(),
  });

  setForgotPasswordSaving(false);

  if (error) {
    console.error('Forgot password reset email failed:', error);
    setForgotPasswordStatus('We could not send the reset link. Please check the email address and try again.', 'error');
    return;
  }

  setForgotPasswordStatus('If an account exists for that email, a reset link has been sent.', 'success');
}

function getAuthNoticeMessage() {
  const notice = new URLSearchParams(window.location.search).get('notice');

  if (notice === 'account_deletion_requested') {
    return 'Your deletion request has been sent. Your Astral Veil account access is now pending review.';
  }

  if (notice === 'account_pending_deletion') {
    return 'This Astral Veil account is pending deletion review. Please contact support if this was unexpected.';
  }

  return '';
}

function setMode(nextMode) {
  authMode = nextMode === 'signup' ? 'signup' : 'login';
  const isSignup = authMode === 'signup';

  modeButtons.forEach((button) => {
    const isActive = button.dataset.authMode === authMode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  displayNameField.hidden = !isSignup;
  displayNameField.querySelector('input').disabled = !isSignup;
  authOptions.hidden = isSignup;
  if (loginWelcome) {
    loginWelcome.textContent = isSignup
      ? 'Begin your Astral Veil journey'
      : 'Welcome back to Astral Veil';
  }
  passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
  submitButton.textContent = isSignup ? 'Sign Up' : 'Sign In';
  modeTitle.textContent = isSignup ? 'Sign Up' : 'Sign In';
  modeCopy.textContent = isSignup
    ? 'Create an account to save your discoveries when progression opens.'
    : 'Return to your archive and keep your thread close.';
  setMessage('');
}

async function redirectIfSignedIn() {
  const { user, error } = await getCurrentUser();

  if (error) {
    setMessage('We could not check your current session. Please try again.', 'error');
    return;
  }

  if (user) {
    redirectAfterAuth({ replace: true });
  }
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.authMode));
});

passwordToggle.addEventListener('click', () => {
  const isPasswordVisible = passwordInput.type === 'text';
  passwordInput.type = isPasswordVisible ? 'password' : 'text';
  passwordToggle.setAttribute('aria-label', isPasswordVisible ? 'Show password' : 'Hide password');
});

forgotPasswordLink.addEventListener('click', (event) => {
  event.preventDefault();
  setForgotPasswordModalOpen(true);
});

forgotPasswordCancelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!isSendingPasswordReset) {
      setForgotPasswordModalOpen(false);
    }
  });
});

forgotPasswordForm?.addEventListener('submit', sendPasswordResetEmail);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const displayName = String(formData.get('display_name') || '').trim();

  if (!email || !password) {
    setMessage('Please enter your email and password.', 'error');
    return;
  }

  submitButton.disabled = true;
  setMessage(authMode === 'signup' ? 'Creating your account...' : 'Signing you in...');

  const result = authMode === 'signup'
    ? await signUp(email, password, { displayName })
    : await signIn(email, password);

  if (result.error) {
    console.error(`${authMode === 'signup' ? 'Sign up' : 'Sign in'} failed:`, result.error);
    submitButton.disabled = false;
    const fallback = authMode === 'signup'
      ? 'We could not create that account. Please check your details and try again.'
      : 'We could not sign you in. Please check your email and password.';
    setMessage(fallback, 'error');
    return;
  }

  redirectAfterAuth();
});

if (!isSupabaseConfigured()) {
  submitButton.disabled = true;
  setMessage('Account access is not configured for this environment.', 'error');
} else {
  const initialAuthMode = new URLSearchParams(window.location.search).get('mode') === 'signup'
    ? 'signup'
    : 'login';
  const noticeMessage = getAuthNoticeMessage();

  setMode(initialAuthMode);
  if (noticeMessage) {
    setMessage(noticeMessage, 'success');
  }
  redirectIfSignedIn();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && forgotPasswordModal && !forgotPasswordModal.hidden) {
    if (!isSendingPasswordReset) {
      setForgotPasswordModalOpen(false);
    }
  }
});
