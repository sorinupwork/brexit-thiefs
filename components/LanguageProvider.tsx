"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Locale = "nl" | "en";

const STORAGE_KEY = "werkrecht_locale";
const LOCALE_EVENT = "werkrecht-locale-change";

interface LanguageActionsValue {
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

export interface LanguageContextValue extends LanguageActionsValue {
  locale: Locale;
}

const LanguageActionsContext = createContext<LanguageActionsValue | null>(null);

const listeners = new Set<() => void>();
let windowListenersAttached = false;

function notifyLocaleListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeLocale(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined" && !windowListenersAttached) {
    window.addEventListener("storage", notifyLocaleListeners);
    window.addEventListener(LOCALE_EVENT, notifyLocaleListeners);
    windowListenersAttached = true;
  }
  return () => {
    listeners.delete(callback);
    if (
      listeners.size === 0 &&
      typeof window !== "undefined" &&
      windowListenersAttached
    ) {
      window.removeEventListener("storage", notifyLocaleListeners);
      window.removeEventListener(LOCALE_EVENT, notifyLocaleListeners);
      windowListenersAttached = false;
    }
  };
}

function getSnapshot(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "en" ? "en" : "nl";
  } catch {
    return "nl";
  }
}

function getServerSnapshot(): Locale {
  return "nl";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors in restricted browsing modes
    }
    notifyLocaleListeners();
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(getSnapshot() === "nl" ? "en" : "nl");
  }, [setLocale]);

  const actions = useMemo(
    () => ({ setLocale, toggleLocale }),
    [setLocale, toggleLocale]
  );

  return (
    <LanguageActionsContext.Provider value={actions}>
      {children}
    </LanguageActionsContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const actions = useContext(LanguageActionsContext);
  if (!actions) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  // Subscribe in the consuming component so streamed <Suspense> boundaries
  // hydrate with getServerSnapshot() ("nl") before syncing to localStorage.
  const locale = useSyncExternalStore(
    subscribeLocale,
    getSnapshot,
    getServerSnapshot
  );

  return useMemo(
    () => ({
      locale,
      setLocale: actions.setLocale,
      toggleLocale: actions.toggleLocale,
    }),
    [locale, actions.setLocale, actions.toggleLocale]
  );
}
