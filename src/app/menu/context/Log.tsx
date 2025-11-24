"use client";

import { createContext, useContext, useState } from "react";

interface LogContextType {
  logs: string[];
  addLog: (text: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | null>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString("pl-PL");
    setLogs(prev => [`[${timestamp}] ${text}`, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error("useLogs must be used inside LogProvider");
  return ctx;
}
