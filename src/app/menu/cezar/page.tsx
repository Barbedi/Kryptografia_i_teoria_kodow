"use client";
import { useState } from "react";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function CezarPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleOpenFile = async () => {
    const result = await window.api.file.open();
    if (result) {
      console.log("📂 Plik otwarty:", result.path);
      console.log("🧾 Zawartość:", result.content.slice(0, 100));
    }
    if (!result) return;

    setFileName(result.path.split("\\").pop() ?? "nieznany");
    setFileContent(result.content);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-4 ">
      <h1 className="mt-5 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
        Szyfr Cezara
      </h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-white text-lg">1. Wybierz plik:</p>

        <button
          onClick={handleOpenFile}
          className="px-6 py-3 bg-white/30 border text-lg border-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 duration-300 transition-all hover:shadow-xl shadow-white/50"
        >
          Wybierz plik
        </button>

        {fileName && (
          <p className="text-gray-300 text-sm">Wybrano: {fileName}</p>
        )}
        <p className="text-white text-lg">2. Co zrobić:</p>
        <div className="flex flex-row gap-6">
          <div className="w-48 h-48 bg-white/30 border border-white/20 text-white rounded-3xl backdrop-blur-md hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center justify-center">
            <div className="flex flex-col justify-center items-center ">
              <LockIcon
                sx={{ fontSize: 45 }}
                className="w-16 h-16 mb-3 text-white drop-shadow-md"
              />
              <span className="text-2xl font-semibold">Szyfruj</span>
            </div>
          </div>
          <div className="w-48 h-48 bg-white/30 border border-white/20 text-white rounded-3xl backdrop-blur-md hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center justify-center">
            <div className="flex flex-col justify-center items-center ">
              <LockOpenIcon
                sx={{ fontSize: 45 }}
                className="w-16 h-16 mb-3 text-white drop-shadow-md"
              />
              <span className="text-2xl font-semibold">Odszyfruj</span>
            </div>
          </div>
        </div>
        <p className="text-white text-lg">3. Wynik:</p>
      </div>

      <Link
        className="inline-block mt-4 px-8 py-3 bg-white/30 border text-lg border-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 duration-300 transition-all hover:shadow-xl shadow-white/50"
        href="/menu"
      >
        Powrót
      </Link>
    </div>
  );
}
