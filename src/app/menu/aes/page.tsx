"use client";
import { useState } from "react";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AesPage = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null); // osobne pole na wynik
  const [key, setKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"file" | "text">("text");

  const handleOpenFile = async () => {
    const result = await window.api.file.open();
    if (!result) return;
    setFileName(result.path.split("\\").pop() ?? "nieznany");
    setFileContent(result.content);
  };

  const validateKey = (value: string) => {
    setKey(value);
    setError(value.length !== 16 ? "Klucz musi mieć długość 16 znaków." : null);
  };

  const handleEncrypt = async () => {
    if (!fileContent || error) return;
    const encrypted = await window.api.rust.encrypt_aes(fileContent, key);
    setResult(encrypted); // zapisz wynik osobno
  };

  const handleDecrypt = async () => {
    if (!fileContent || error) return;
    const decrypted = await window.api.rust.decrypt_aes(fileContent, key);
    setResult(decrypted); // zapisz wynik osobno
  };

  const handleCleanup = () => {
    setFileContent(null);
    setFileName(null);
    setResult(null);
    setKey("");
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="mt-5 text-2xl font-bold text-white">Szyfr AES</h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <p className="text-white text-lg">1. Wybierz sposób wprowadzania:</p>
        <div className="flex gap-4">
          <button
            onClick={() => setInputMode("text")}
            className={`px-6 py-2 text-white rounded-2xl ${inputMode === "text" ? "bg-white/40 border-2 border-white/60" : "bg-white/20"}`}
          >
            Wpisz tekst
          </button>
          <button
            onClick={() => setInputMode("file")}
            className={`px-6 py-2 text-white rounded-2xl ${inputMode === "file" ? "bg-white/40 border-2 border-white/60" : "bg-white/20"}`}
          >
            Wybierz plik
          </button>
        </div>

        {inputMode === "text" ? (
          <>
            <p className="text-white text-lg mt-3">2. Wpisz tekst:</p>
            <textarea
              value={fileContent ?? ""}
              placeholder="Wpisz tekst do zaszyfrowania"
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full h-32 py-3 px-4 rounded-3xl bg-white/30 text-white placeholder-white/70 backdrop-blur-md 
                     border border-white/20 focus:outline-none transition-all duration-300 
                     hover:shadow-xl hover:scale-105 focus:shadow-2xl shadow-white/50 resize-none"
            />
          </>
        ) : (
          <>
            <p className="text-white text-lg mt-3">2. Wybierz plik:</p>
            <button
              onClick={handleOpenFile}
              className="w-full py-3 px-4 bg-white/30 rounded-3xl text-white"
            >
              Wybierz plik
            </button>
            {fileName && (
              <p className="text-gray-300 text-sm">Wybrano: {fileName}</p>
            )}
          </>
        )}

        <p className="text-white text-lg mt-3">3. Podaj klucz (16 znaków):</p>
        <input
          type="text"
          value={key}
          placeholder="Podaj klucz AES"
          onChange={(e) => validateKey(e.target.value)}
          className={`w-full py-3 px-4 rounded-3xl bg-white/30 text-white placeholder-white/70 
            backdrop-blur-md border ${error ? "border-red-500" : "border-white/20"} 
            focus:outline-none transition-all duration-300 
            focus:shadow-lg hover:shadow-lg hover:scale-105 focus:scale-105 
            text-center shadow-white/50`}
        />
        {error && <p className="text-red-400 text-sm -mt-2">{error}</p>}

        <p className="text-white text-lg mt-4">4. Co zrobić:</p>
        <div className="flex flex-row gap-6">
          <div
            onClick={!error ? handleEncrypt : undefined}
            className={`cursor-pointer w-48 h-48 ${
              error ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } bg-white/30 text-white backdrop-blur-md 
              border border-white/20 rounded-3xl transition-all duration-300 
              hover:bg-white/25 flex flex-col justify-center items-center`}
          >
            <LockIcon
              sx={{ fontSize: 45 }}
              className="mb-3 text-white drop-shadow-md"
            />
            <span className="text-2xl font-semibold">Szyfruj</span>
          </div>

          <div
            onClick={!error ? handleDecrypt : undefined}
            className={`cursor-pointer w-48 h-48 ${
              error ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } bg-white/30 text-white backdrop-blur-md 
              border border-white/20 rounded-3xl transition-all duration-300 
              hover:bg-white/25 flex flex-col justify-center items-center`}
          >
            <LockOpenIcon
              sx={{ fontSize: 45 }}
              className="mb-3 text-white drop-shadow-md"
            />
            <span className="text-2xl font-semibold">Odszyfruj</span>
          </div>
        </div>

        <p className="text-white text-lg mt-4">5. Wynik:</p>

        <div
          className="w-full h-48 bg-white/30 border border-white/20 text-white rounded-3xl backdrop-blur-md 
                        hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center justify-center"
        >
          <textarea
            readOnly
            value={result ?? "Brak danych do wyświetlenia."}
            className="w-full h-full p-4 bg-transparent resize-none text-white outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/menu"
          className="inline-block mt-4 px-6 py-2 bg-white/30 border border-white/20 backdrop-blur-md 
                   text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 
                   duration-300 transition-all hover:shadow-xl shadow-white/50"
        >
          <ArrowBackIcon className="inline-block mr-0.5 mb-1" />
          Powrót
        </Link>
        <button
          onClick={handleCleanup}
          className="mt-4 px-6 py-2 bg-red-600/30 border border-red-600/20 backdrop-blur-md 
                     text-white rounded-2xl hover:bg-red-600/40 hover:scale-105 active:scale-95 
                     duration-300 transition-all hover:shadow-xl shadow-red-500/50"
        >
          <DeleteIcon className="inline-block mr-0.5 mb-1" />
          Wyczyść
        </button>
      </div>
    </div>
  );
};

export default AesPage;
