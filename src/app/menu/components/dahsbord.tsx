"use client";
import { useState } from "react";
import TerminalIcon from "@mui/icons-material/Terminal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useLogs } from "../context/Log";

import { usePathname } from "next/navigation";

export default function RightDashboard() {
  const [open, setOpen] = useState(false);
  const { logs, addLog } = useLogs();
  const pathname = usePathname();

  const handleSaveLogs = async () => {
    addLog("Rozpoczynam zapis logów...", "info");
    const now = new Date().toLocaleTimeString();
    const logContent =
      `[${now}] [INFO]: Rozpoczynam zapis logów...` +
      "\n" +
      logs
        .map(
          (log) =>
            `[${log.timestamp}] [${log.type.toUpperCase()}]: ${log.text}`,
        )
        .join("\n");

    const date = new Date().toISOString().split("T")[0];
    const name = pathname?.split("/").pop() || "unknown";
    const fileName = `logs_${name}_${date}.txt`;

    try {
      // @ts-expect-error showSaveFilePicker is not yet in standard TS lib
      if (window.showSaveFilePicker) {
        // @ts-expect-error showSaveFilePicker is not yet in standard TS lib
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "Text Files",
              accept: { "text/plain": [".txt"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(logContent);
        await writable.close();
        addLog(`Logi zapisane do pliku: ${fileName}`, "success");
      } else {
        const blob = new Blob([logContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLog(`Logi zapisane do pliku: ${fileName}`, "success");
      }
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        addLog(
          "Zapisywanie logów zostało przerwane przez użytkownika.",
          "warning",
        );
      } else {
        addLog(
          `Nie udało się zapisać logów: ${error instanceof Error ? error.message : String(error)}`,
          "error",
        );
      }
    }
  };

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
          <div className="flex justify-center items-center">
            <h2 className="text-xl font-bold mb-5">Konsola</h2>
          </div>
          <div className="h-[85vh] overflow-y-auto space-y-2 text-sm text-white/90">
            {logs.map((log, i) => {
              let colorClass = "text-white/90";
              let Icon = null;

              if (log.type === "error") {
                colorClass = "text-red-400";
                Icon = ReportIcon;
              }
              if (log.type === "success") {
                colorClass = "text-green-400";
                Icon = CheckCircleIcon;
              }
              if (log.type === "warning") {
                colorClass = "text-yellow-400";
                Icon = WarningIcon;
              }
              if (log.type === "info") {
                Icon = InfoIcon;
              }

              return (
                <div
                  key={i}
                  className={`bg-white/10 p-2 rounded-md ${colorClass} flex items-start gap-2`}
                >
                  <span className="text-xs text-gray-400 mt-1">
                    [{log.timestamp}]
                  </span>
                  <div className="flex-1 break-words">
                    {Icon && (
                      <Icon
                        fontSize="small"
                        className="mr-1 -mt-0.5 align-middle"
                      />
                    )}
                    {log.text}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row gap-2 justify-center items-center mb-4  ">
            <button
              className="w-full bg-red-500/20 hover:bg-red-500/40 transition-colors  text-white p-2 rounded-md mt-4"
              onClick={() => setOpen(false)}
            >
              <CancelIcon
                className="mr-1 justify-center items-center flex flex-row"
                fontSize="small"
              />
              Zamknij
            </button>
            <button
              className="w-full bg-green-500/20 hover:bg-green-500/40 transition-colors  text-white p-2 rounded-md mt-4"
              onClick={handleSaveLogs}
            >
              <SaveAltIcon
                className="mr-1 justify-center items-center flex flex-row"
                fontSize="small"
              />
              Zapisz
            </button>
          </div>
          s
        </div>
      </div>
    </>
  );
}
