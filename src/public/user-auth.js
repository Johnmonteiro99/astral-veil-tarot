import { getCurrentUser, requireAllowedAccount, signIn, signUp } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const authCard = document.querySelector('[data-auth-card]');
const form = document.querySelector('[data-user-auth-form]');
const message = document.querySelector('[data-auth-message]');
const modeButtons = Array.from(document.querySelectorAll('[data-auth-mode]'));
const modeSwitch = document.querySelector('.mode-switch');
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
const signupConfirmationPanel = document.querySelector('[data-signup-confirmation]');
const signupConfirmationEmail = document.querySelector('[data-signup-confirmation-email]');
const signupBackLoginButton = document.querySelector('[data-signup-back-login]');
const signupResendButton = document.querySelector('[data-signup-resend]');
const signupResendStatus = document.querySelector('[data-signup-resend-status]');
const termsText = document.querySelector('.terms-text');
const normalAuthRegions = [loginWelcome, modeSwitch, form, termsText].filter(Boolean);
const returnToStorageKey = 'astralVeilReturnTo';
const defaultPublicAuthRedirect = '/';
const blockedPublicReturnPaths = new Set([
  '/account.html',
  '/account',
  '/admin.html',
  '/admin',
  '/admin-login.html',
  '/admin/login',
]);

let authMode = 'login';
let authView = 'signin';
let isSendingPasswordReset = false;
let pendingConfirmationEmail = '';

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

    if (
      /\/auth\.html$/i.test(normalizedPath) ||
      normalizedPath === '/login' ||
      normalizedPath === '/signup' ||
      blockedPublicReturnPaths.has(normalizedPath)
    ) {
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

function setAuthSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  modeButtons.forEach((button) => {
    button.disabled = isSubmitting;
  });
}

function setSignupResendStatus(text = '', type = '') {
  if (!signupResendStatus) {
    return;
  }

  signupResendStatus.textContent = text;
  signupResendStatus.dataset.messageType = type;
  signupResendStatus.hidden = !text;
}

function getEmailConfirmationRedirectUrl() {
  const redirectUrl = new URL('/login', window.location.href);

  redirectUrl.searchParams.set('notice', 'email_confirmed');
  return redirectUrl.href;
}

function clearSignupConfirmationState() {
  pendingConfirmationEmail = '';

  if (signupConfirmationEmail) {
    signupConfirmationEmail.hidden = true;
    signupConfirmationEmail.textContent = '';
  }

  setSignupResendStatus('');
}

function setAuthView(nextView, { clearMessage = true } = {}) {
  const normalizedView = nextView === 'confirmation'
    ? 'confirmation'
    : nextView === 'signup'
      ? 'signup'
      : 'signin';
  const isConfirmation = normalizedView === 'confirmation';
  const isSignup = normalizedView === 'signup';

  authView = normalizedView;

  if (!isConfirmation) {
    authMode = isSignup ? 'signup' : 'login';
    clearSignupConfirmationState();
  }

  authCard?.classList.toggle('is-confirmation', isConfirmation);
  authCard?.setAttribute('data-auth-view', normalizedView);

  normalAuthRegions.forEach((element) => {
    element.hidden = isConfirmation;
  });

  if (signupConfirmationPanel) {
    signupConfirmationPanel.hidden = !isConfirmation;
  }

  modeButtons.forEach((button) => {
    const isActive = !isConfirmation && (
      (button.dataset.authMode === 'signup') === isSignup
    );
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  displayNameField.hidden = !isSignup || isConfirmation;
  displayNameField.querySelector('input').disabled = !isSignup || isConfirmation;
  authOptions.hidden = isSignup || isConfirmation;

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

  if (clearMessage) {
    setMessage('');
  }
}

function hideSignupConfirmation() {
  setAuthView(authMode === 'signup' ? 'signup' : 'signin');
}

function showSignupConfirmation(email) {
  pendingConfirmationEmail = email;
  setMessage('', '');
  setAuthView('confirmation', { clearMessage: false });

  if (signupConfirmationEmail) {
    signupConfirmationEmail.textContent = `Confirmation sent to ${email}`;
    signupConfirmationEmail.hidden = false;
  }

  if (signupConfirmationPanel) {
    signupConfirmationPanel.hidden = false;
    signupConfirmationPanel.focus?.({ preventScroll: true });
  }
}

function getFriendlyAuthError(error, mode = authMode) {
  const rawMessage = String(error?.message || '').trim();

  if (mode === 'signup' && /already|registered|exists|duplicate|identity/i.test(rawMessage)) {
    return 'An account may already exist with this email. Try signing in or resetting your password.';
  }

  if (rawMessage) {
    return rawMessage;
  }

  return mode === 'signup'
    ? 'Something went wrong. Please try again.'
    : 'We could not sign you in. Please check your email and password.';
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
  const resetUrl = new URL('/account', window.location.href);

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

  if (notice === 'email_confirmed') {
    return 'Your email has been confirmed. Sign in to enter Astral Veil.';
  }

  return '';
}

function setMode(nextMode) {
  setAuthView(nextMode === 'signup' ? 'signup' : 'signin');
}

async function redirectIfSignedIn() {
  const { user, error } = await getCurrentUser();

  if (error) {
    setMessage('We could not check your current session. Please try again.', 'error');
    return;
  }

  if (user) {
    const account = await requireAllowedAccount({ signOutBanned: true });

    if (!account.allowed && account.reason === 'banned') {
      setMessage(account.message, 'error');
      return;
    }

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
  const requestMode = authMode;

  if (!email || !password) {
    setMessage('Please enter your email and password.', 'error');
    return;
  }

  hideSignupConfirmation();
  setAuthSubmitting(true);
  setMessage(requestMode === 'signup' ? 'Creating your account...' : 'Signing you in...');

  const result = requestMode === 'signup'
    ? await signUp(email, password, {
      displayName,
      emailRedirectTo: getEmailConfirmationRedirectUrl(),
    })
    : await signIn(email, password);

  if (result.error) {
    console.error(`${requestMode === 'signup' ? 'Sign up' : 'Sign in'} failed:`, result.error);
    setAuthSubmitting(false);
    setMessage(getFriendlyAuthError(result.error, requestMode), 'error');
    return;
  }

  if (requestMode === 'signup' && !result.data?.session) {
    setAuthSubmitting(false);
    showSignupConfirmation(email);
    return;
  }

  const account = await requireAllowedAccount({ signOutBanned: true });

  if (!account.allowed && account.reason === 'banned') {
    setAuthSubmitting(false);
    setMessage(account.message, 'error');
    return;
  }

  setMessage(requestMode === 'signup' ? 'Welcome to Astral Veil.' : 'Signed in. Opening Astral Veil...', 'success');
  redirectAfterAuth();
});

signupBackLoginButton?.addEventListener('click', () => {
  const emailInput = form.querySelector('input[name="email"]');
  const email = pendingConfirmationEmail;

  setMode('login');
  passwordInput.value = '';

  if (emailInput && email) {
    emailInput.value = email;
    emailInput.focus({ preventScroll: true });
  }
});

signupResendButton?.addEventListener('click', async () => {
  const email = pendingConfirmationEmail;
  const supabase = getSupabaseClient();

  if (!email) {
    setSignupResendStatus('Enter your email and try signing up again.', 'error');
    return;
  }

  if (!supabase) {
    setSignupResendStatus('Confirmation email is not available right now. Please try again later.', 'error');
    return;
  }

  signupResendButton.disabled = true;
  setSignupResendStatus('Sending confirmation email...');

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: getEmailConfirmationRedirectUrl(),
    },
  });

  signupResendButton.disabled = false;

  if (error) {
    console.error('Signup confirmation resend failed:', error);
    setSignupResendStatus(getFriendlyAuthError(error, 'signup'), 'error');
    return;
  }

  setSignupResendStatus('A new confirmation link has been sent.', 'success');
});

if (!isSupabaseConfigured()) {
  submitButton.disabled = true;
  setMessage('Account access is not configured for this environment.', 'error');
} else {
  const initialAuthMode = window.location.pathname.replace(/\/$/, '') === '/signup' ||
    new URLSearchParams(window.location.search).get('mode') === 'signup'
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
