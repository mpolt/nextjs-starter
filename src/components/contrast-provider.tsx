"use client";

import * as React from "react";

export type ContrastMode = "default" | "high";

const STORAGE_KEY = "jobs-contrast";

type ContrastContextValue = {
  contrast: ContrastMode;
  setContrast: (mode: ContrastMode) => void;
};

const ContrastContext = React.createContext<ContrastContextValue | undefined>(
  undefined
);

function applyContrastClass(mode: ContrastMode) {
  document.documentElement.classList.toggle("contrast", mode === "high");
}

function getInitialContrast(): ContrastMode {
  if (typeof window === "undefined") {
    return "default";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "default" || stored === "high") {
    return stored;
  }

  if (window.matchMedia("(prefers-contrast: more)").matches) {
    return "high";
  }

  return "default";
}

export function ContrastProvider({ children }: { children: React.ReactNode }) {
  const [contrast, setContrastState] = React.useState<ContrastMode>("default");

  React.useEffect(() => {
    const initial = getInitialContrast();
    setContrastState(initial);
    applyContrastClass(initial);
  }, []);

  const setContrast = React.useCallback((mode: ContrastMode) => {
    setContrastState(mode);
    applyContrastClass(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const value = React.useMemo(
    () => ({ contrast, setContrast }),
    [contrast, setContrast]
  );

  return (
    <ContrastContext.Provider value={value}>{children}</ContrastContext.Provider>
  );
}

export function useContrast() {
  const context = React.useContext(ContrastContext);
  if (!context) {
    throw new Error("useContrast must be used within ContrastProvider");
  }
  return context;
}
