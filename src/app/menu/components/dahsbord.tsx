"use client";
import { useState } from "react";
import TerminalIcon from '@mui/icons-material/Terminal';
import { useLogs } from "../context/Log";

export default function RightDashboard() {
  const [open, setOpen] = useState(false);
   const { logs } = useLogs();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 bg-black text-white p-3 rounded-full z-[9999]"
      >
        <TerminalIcon />
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-transparent  z-[9998]"
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-[#111] text-white shadow-2xl z-[10000] 
        transition-transform duration-300 
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4">
            <div className="flex justify-center items-centerl">
          <h2 className="text-xl font-bold mb-5">Konsola</h2>
            </div>
             <div className="h-[85vh] overflow-y-auto space-y-2 text-sm text-white/90">
    {logs.map((line, i) => (
      <div key={i} className="bg-white/10 p-2 rounded-md">
        {line}
      </div>
    ))}
  </div>
        </div>
      </div>
    </>
  );
}
