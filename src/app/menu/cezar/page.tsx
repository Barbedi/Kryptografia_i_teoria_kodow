"use client";
import { useState } from "react";
import Link from "next/dist/client/link";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function CezarPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [shift, setShift] = useState<number>(3);

  const handleOpenFile = async () => {
    const result = await window.api.file.open();
    if (!result) return;
    setFileName(result.path.split("\\").pop() ?? "nieznany");
    setFileContent(result.content);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(25, Math.max(0, parseInt(e.target.value) || 0));
    setShift(value);
  };

  const handleEncrypt = async () => {
    if (!fileContent) return;
    const result = await window.api.rust.encryptCezar(fileContent, shift);
    setFileContent(result);
  };

  const handleDecrypt = async () => {
    if (!fileContent) return;
    const result = await window.api.rust.decryptCezar(fileContent, shift);
    setFileContent(result);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="mt-5 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
        Szyfr Cezara
      </h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <p className="text-white text-lg">1. Wybierz plik:</p>
        <button
          onClick={handleOpenFile}
          className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white placeholder-white/70 backdrop-blur-md 
                     border border-white/20 focus:outline-none transition-all duration-300 
                     hover:shadow-xl hover:scale-105 focus:shadow-2xl shadow-white/50"
        >
          Wybierz plik
        </button>

        {fileName && (
          <p className="text-gray-300 text-sm">📄 Wybrano: {fileName}</p>
        )}
        <p className="text-white text-lg mb-2 mt-3">2. Wprowadź przesunięcie:</p>
        <input
          type="number"
          min="0"
          max="25"
          value={shift}
          onChange={handleChange}
          placeholder="Podaj liczbę przesunięcia (np. 3)"
          className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white placeholder-white/70 
                     backdrop-blur-md border border-white/20 focus:outline-none transition-all duration-300 
                     focus:shadow-lg hover:shadow-lg hover:scale-105 focus:scale-105 text-center shadow-white/50"
        />
        <p className="text-white text-lg mt-4">3. Co zrobić:</p>
        <div className="flex flex-row gap-6">
          <div
            onClick={handleEncrypt}
            className="cursor-pointer w-48 h-48 bg-white/30 text-white backdrop-blur-md 
                       border border-white/20 rounded-3xl transition-all duration-300 
                       hover:bg-white/25 hover:scale-105 focus:shadow-lg hover:shadow-2xl flex flex-col justify-center items-center"
          >
            <LockIcon sx={{ fontSize: 45 }} className="mb-3 text-white drop-shadow-md" />
            <span className="text-2xl font-semibold">Szyfruj</span>
          </div>

          <div
            onClick={handleDecrypt}
            className="cursor-pointer w-48 h-48 bg-white/30 text-white backdrop-blur-md 
                       border border-white/20 rounded-3xl transition-all duration-300 
                       hover:bg-white/25 hover:scale-105 focus:shadow-lg hover:shadow-2xl flex flex-col justify-center items-center"
          >
            <LockOpenIcon sx={{ fontSize: 45 }} className="mb-3 text-white drop-shadow-md" />
            <span className="text-2xl font-semibold">Odszyfruj</span>
          </div>
        </div>
        <p className="text-white text-lg mt-4">4. Wynik:</p>
        <div className="w-full h-48 bg-white/30 border border-white/20 text-white rounded-3xl backdrop-blur-md 
                        hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center justify-center">
          <textarea
            readOnly
            value={fileContent ?? "Brak danych do wyświetlenia."}
            className="w-full h-full p-4 bg-transparent resize-none text-white outline-none"
          />
        </div>
      </div>
      <Link
        href="/menu"
        className="inline-block mt-6 px-8 py-3 bg-white/30 border border-white/20 backdrop-blur-md 
                   text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 
                   duration-300 transition-all hover:shadow-xl shadow-white/50"
      >
        Powrót
      </Link>
    </div>
  );
}
