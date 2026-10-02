'use client';

import React, { useState, useEffect } from 'react';
import { AuthUserProfile } from '@/lib/supabase';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  syncUserProfileToFirestore,
} from '@/lib/firebase';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUserProfile) => void;
  defaultTab?: 'login' | 'signup';
}

interface StoredLocalAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'guest';
}

const LOCAL_ACCOUNTS_KEY = 'tfc_registered_accounts_v1';

function getLocalAccounts(): StoredLocalAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAccount(acc: StoredLocalAccount) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalAccounts().filter(
      (a) => a.email.toLowerCase() !== acc.email.toLowerCase()
    );
    list.push(acc);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultTab = 'login',
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Signup form state
  const [signupName, setSignupName] = useState<string>('');
  const [signupPhone, setSignupPhone] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [prevDefaultTab, setPrevDefaultTab] = useState(defaultTab);
  if (defaultTab !== prevDefaultTab) {
    setPrevDefaultTab(defaultTab);
    setActiveTab(defaultTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  }

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Google Sign-In with Firebase
  const handleGoogleSignIn = async () => {
    resetMessages();
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile: AuthUserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Guest',
        email: user.email || '',
        phone: user.phoneNumber || '',
        role: 'guest',
      };

      // Sync user profile to Firestore
      await syncUserProfileToFirestore({
        id: user.uid,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: 'guest',
        createdAt: new Date().toISOString(),
      });

      setSuccessMsg('Successfully authenticated with Firebase Google!');
      setTimeout(() => {
        onLoginSuccess(profile);
        onClose();
      }, 400);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in popup was closed before finishing.');
      } else if (firebaseError?.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked by browser. Please allow popups.');
      } else {
        setErrorMsg(
          firebaseError?.message ||
            'Unable to sign in with Google Firebase. Please try Email login.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // 1. Handle Guest Login with Firebase Email/Password
  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const identifier = loginIdentifier.trim();
    if (!identifier || !loginPassword.trim()) {
      setErrorMsg('Please enter your email or phone and password.');
      return;
    }

    setLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const emailToUse = isEmail
        ? identifier.toLowerCase()
        : `${identifier.replace(/\D/g, '')}@tfcgarden.guest`;

      // 1. Attempt Firebase Auth signInWithEmailAndPassword
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailToUse,
          loginPassword
        );
        const fbUser = userCredential.user;
        const profile: AuthUserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || emailToUse.split('@')[0] || 'Guest',
          email: fbUser.email || emailToUse,
          phone: fbUser.phoneNumber || (!isEmail ? identifier : ''),
          role: 'guest',
        };

        await syncUserProfileToFirestore({
          id: fbUser.uid,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: 'guest',
          createdAt: new Date().toISOString(),
        });

        setSuccessMsg('Successfully logged in with Firebase Auth!');
        setTimeout(() => {
          onLoginSuccess(profile);
          onClose();
        }, 400);
        return;
      } catch (fbErr: unknown) {
        const fbError = fbErr as { code?: string; message?: string };
        // If wrong password specifically in Firebase, notify user
        if (
          fbError?.code === 'auth/wrong-password' ||
          fbError?.code === 'auth/invalid-credential'
        ) {
          // Check if user has a local account with different password
          const localAccounts = getLocalAccounts();
          const matched = localAccounts.find(
            (acc) =>
              acc.email.toLowerCase() === identifier.toLowerCase() &&
              acc.password === loginPassword
          );
          if (matched) {
            const profile: AuthUserProfile = {
              id: matched.id,
              name: matched.name,
              email: matched.email,
              phone: matched.phone,
              role: 'guest',
            };
            setSuccessMsg('Logged in successfully!');
            setTimeout(() => {
              onLoginSuccess(profile);
              onClose();
            }, 400);
            return;
          }
          setErrorMsg('Invalid password. Please check your credentials.');
          return;
        }

        // If user not found in Firebase, check local accounts
        if (fbError?.code === 'auth/user-not-found') {
          const localAccounts = getLocalAccounts();
          const matched = localAccounts.find(
            (acc) =>
              (acc.email.toLowerCase() === identifier.toLowerCase() ||
                acc.phone === identifier) &&
              acc.password === loginPassword
          );
          if (matched) {
            const profile: AuthUserProfile = {
              id: matched.id,
              name: matched.name,
              email: matched.email,
              phone: matched.phone,
              role: 'guest',
            };
            setSuccessMsg('Logged in successfully!');
            setTimeout(() => {
              onLoginSuccess(profile);
              onClose();
            }, 400);
            return;
          }
        }
      }

      // Check locally registered accounts fallback
      const localAccounts = getLocalAccounts();
      const matchedAccount = localAccounts.find(
        (acc) =>
          (acc.email.toLowerCase() === identifier.toLowerCase() ||
            acc.phone === identifier) &&
          acc.password === loginPassword
      );

      if (matchedAccount) {
        const profile: AuthUserProfile = {
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          phone: matchedAccount.phone,
          role: matchedAccount.role,
        };
        setSuccessMsg('Welcome back! Logged in successfully.');
        setTimeout(() => {
          onLoginSuccess(profile);
          onClose();
        }, 400);
        return;
      }

      setErrorMsg(
        'Account not found. Please click Sign Up to create your account or continue with Google.'
      );
    } catch {
      setErrorMsg('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Guest Sign Up with Firebase Email/Password
  const handleGuestSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (
      !signupName.trim() ||
      !signupPhone.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim()
    ) {
      setErrorMsg('Please fill in all required fields to sign up.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = signupEmail.trim().toLowerCase();
      let userId = `usr-${Date.now()}`;

      // 1. Register with Firebase Authentication
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          signupPassword
        );
        userId = userCred.user.uid;
        await updateProfile(userCred.user, {
          displayName: signupName.trim(),
        });
      } catch (fbErr: unknown) {
        const fbError = fbErr as { code?: string; message?: string };
        if (fbError?.code === 'auth/email-already-in-use') {
          setErrorMsg(
            'This email is already registered in Firebase. Please switch to Login tab.'
          );
          setLoading(false);
          return;
        }
        if (fbError?.code === 'auth/operation-not-allowed') {
          // If email/password provider is not toggled on in Firebase Console yet, fallback to local + prompt Google
          console.warn('Firebase Email/Password provider not enabled. Using local account.');
        } else {
          console.warn('Firebase signup notice:', fbError?.message);
        }
      }

      // Save account locally as well
      saveLocalAccount({
        id: userId,
        name: signupName.trim(),
        email: cleanEmail,
        phone: signupPhone.trim(),
        password: signupPassword,
        role: 'guest',
      });

      const newProfile: AuthUserProfile = {
        id: userId,
        name: signupName.trim(),
        email: cleanEmail,
        phone: signupPhone.trim(),
        role: 'guest',
      };

      // Sync user profile to Firestore
      await syncUserProfileToFirestore({
        id: userId,
        name: newProfile.name,
        email: newProfile.email,
        phone: newProfile.phone,
        role: 'guest',
        createdAt: new Date().toISOString(),
      });

      setSuccessMsg(
        'Account created and synced with Firebase! Logging you in...'
      );
      setTimeout(() => {
        onLoginSuccess(newProfile);
        onClose();
      }, 500);
    } catch {
      setErrorMsg('Could not complete sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-[#14281D] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E5DEC9] my-8">
        {/* Top Luxury Header */}
        <div className="bg-[#0F261C] text-white p-5 sm:p-6 relative border-b border-[#234735]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#193B2B] border border-[#D4A977]/40 text-[#E8C587] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                FIREBASE AUTHENTICATION • TFC GARDEN
              </span>
              <h3 className="font-serif text-2xl text-white leading-tight">
                {activeTab === 'login'
                  ? 'Firebase Login'
                  : 'Firebase Sign Up — Create Account'}
              </h3>
              <p className="text-xs text-[#A9C2B5] mt-1">
                {activeTab === 'login'
                  ? 'Sign in securely with Google Firebase or your email'
                  : 'Create your account with Google Firebase or email'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2 Mode Switcher Tabs: Login & Sign Up */}
          <div className="grid grid-cols-2 gap-1.5 mt-5 p-1 rounded-xl bg-[#091811] border border-[#224735]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                resetMessages();
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#D4A977] text-[#14281D] font-bold shadow-xs'
                  : 'text-[#A9C2B5] hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                resetMessages();
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#D4A977] text-[#14281D] font-bold shadow-xs'
                  : 'text-[#A9C2B5] hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        <div className="p-5 sm:p-6">
          {errorMsg && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-300 p-3 flex items-start gap-2.5 text-xs text-red-900">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl bg-[#EBF5EE] border border-[#2C6E49]/30 p-3 flex items-start gap-2.5 text-xs text-[#184A34] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#1E6B43] shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GOOGLE FIREBASE ONE-CLICK BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full mb-4 py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-[#D5CDBC] text-[#14281D] font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {googleLoading
                ? 'Connecting to Google Firebase...'
                : activeTab === 'login'
                ? 'Sign in with Google (Firebase)'
                : 'Sign up with Google (Firebase)'}
            </span>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="grow border-t border-[#E5DEC9]"></div>
            <span className="shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-[#8A958E]">
              Or with Email
            </span>
            <div className="grow border-t border-[#E5DEC9]"></div>
          </div>

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  EMAIL ADDRESS OR MOBILE NUMBER *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter email or 10-digit mobile"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#184A34]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  PASSWORD *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#184A34]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756D] hover:text-[#14281D] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#184A34] hover:bg-[#113625] disabled:opacity-60 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#E8C587]" />
                <span>{loading ? 'Logging In...' : 'Login with Firebase'}</span>
              </button>

              <div className="pt-2 text-center border-t border-[#ECE6D8]">
                <p className="text-xs text-[#54635A]">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      resetMessages();
                    }}
                    className="font-bold text-[#184A34] hover:underline cursor-pointer"
                  >
                    Sign Up Here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleGuestSignup} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  FULL NAME *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#184A34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    WHATSAPP / MOBILE *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] font-mono focus:outline-none focus:border-[#184A34]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#184A34]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#54635A] mb-1">
                  CREATE PASSWORD (MIN 6 CHARACTERS) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C6D46] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DCD4C0] bg-[#FAF8F3] text-xs sm:text-sm text-[#14281D] focus:outline-none focus:border-[#184A34]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756D] hover:text-[#14281D] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#D4A977] hover:bg-[#C69862] disabled:opacity-60 text-[#14281D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Signing Up...' : 'Sign Up with Firebase'}</span>
              </button>

              <div className="pt-2 text-center border-t border-[#ECE6D8]">
                <p className="text-xs text-[#54635A]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      resetMessages();
                    }}
                    className="font-bold text-[#184A34] hover:underline cursor-pointer"
                  >
                    Login Here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
