"use client";

import { createContext, useContext, useState } from "react";

export type LogType = "info" | "success" | "error" | "warning" | "clear";

export interface LogEntry {
  text: string;
  type: LogType;
  timestamp: string;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (text: string, type?: LogType) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | null>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (text: string, type: LogType = "info") => {
    const timestamp = new Date().toLocaleTimeString("pl-PL");
    setLogs((prev) => [{ text, type, timestamp }, ...prev]);
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
