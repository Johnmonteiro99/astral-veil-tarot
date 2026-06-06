import { getCurrentUser, signIn, signUp } from '../services/auth.js';
import { isSupabaseConfigured } from '../services/supabase-client.js';

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
const returnToStorageKey = 'astralVeilReturnTo';
const defaultPublicAuthRedirect = 'index.html';
const blockedPublicReturnPaths = new Set([
  '/account.html',
  '/admin.html',
  '/admin-login.html',
]);

let authMode = 'login';

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
  passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
  submitButton.textContent = isSignup ? 'Sign Up' : 'Log In';
  modeTitle.textContent = isSignup ? 'Sign Up' : 'Log In';
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
  setMessage('Password reset will be available soon.', 'success');
});

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
    submitButton.disabled = false;
    const fallback = authMode === 'signup'
      ? 'We could not create that account. Please check your details and try again.'
      : 'We could not sign you in. Please check your email and password.';
    setMessage(result.error.message || fallback, 'error');
    return;
  }

  redirectAfterAuth();
});

if (!isSupabaseConfigured()) {
  submitButton.disabled = true;
  setMessage('Account access is not configured for this environment.', 'error');
} else {
  setMode('login');
  redirectIfSignedIn();
}
