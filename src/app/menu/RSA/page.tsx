"use client";

import { useState } from "react";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RSAPage = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [showGeneratedKeys, setShowGeneratedKeys] = useState(false);
  const [keyMode, setKeyMode] = useState<"text" | "generate">("text");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const generateKeys = () => {
    const examplePublic = "65537, 3233";
    const examplePrivate = "2753, 3233";

    setPublicKey(examplePublic);
    setPrivateKey(examplePrivate);
    setShowGeneratedKeys(true);
  };

  const handleEncrypt = () => {
    if (!message || !publicKey) {
      setResult("Błąd: brak danych lub klucza publicznego.");
      return;
    }

    setResult("SZYFROGRAM (mock RSA)");
  };

  const handleDecrypt = () => {
    if (!message || !privateKey) {
      setResult("Błąd: brak danych lub klucza prywatnego.");
      return;
    }

    setResult("ODSZYFROWANY TEKST (mock RSA)");
  };

  const handleCleanup = () => {
    setPublicKey("");
    setPrivateKey("");
    setMessage("");
    setResult("");
    setShowGeneratedKeys(false);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="mt-5 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
        Szyfr RSA
      </h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <p className="text-white text-lg">1. Klucze:</p>

        <div className="flex gap-4">
          <button
            onClick={() => setKeyMode("text")}
            className={`px-6 py-2 text-white rounded-2xl ${
              keyMode === "text"
                ? "bg-white/40 border-2 border-white/60"
                : "bg-white/20"
            }`}
          >
            Wpisz klucze
          </button>

          <button
            onClick={() => setKeyMode("generate")}
            className={`px-6 py-2 text-white rounded-2xl ${
              keyMode === "generate"
                ? "bg-white/40 border-2 border-white/60"
                : "bg-white/20"
            }`}
          >
            Wygeneruj klucze
          </button>
        </div>
        {keyMode === "text" && (
          <>
            <p className="text-white text-lg mt-3">Wpisz klucze:</p>

            <div className="flex flex-row gap-4">
              <input
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white placeholder-white/70 
                     backdrop-blur-md border border-white/20 transition-all duration-300 
                     hover:shadow-xl hover:scale-105"
                placeholder="Klucz publiczny "
                type="text"
              />

              <input
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white placeholder-white/70 
                     backdrop-blur-md border border-white/20 transition-all duration-300 
                     hover:shadow-xl hover:scale-105"
                placeholder="Klucz prywatny "
                type="text"
              />
            </div>
          </>
        )}
        {keyMode === "generate" && (
          <>
            {!showGeneratedKeys && (
              <button
                onClick={generateKeys}
                className="w-full py-3 px-4 bg-white/30 rounded-3xl text-white hover:bg-white/40 
                   transition-all duration-300 hover:scale-105"
              >
                Generuj klucze...
              </button>
            )}

            {showGeneratedKeys && (
              <div className="flex flex-col gap-4 w-full">
                <p className="text-white text-center">Wygenerowane klucze:</p>

                <div className="flex flex-row gap-4">
                  <input
                    readOnly
                    value={publicKey}
                    className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white backdrop-blur-md"
                  />

                  <input
                    readOnly
                    value={privateKey}
                    className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white backdrop-blur-md"
                  />
                </div>
              </div>
            )}
          </>
        )}
        <p className="text-white text-lg mt-4">2. Wiadomość:</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Wpisz tekst do zaszyfrowania lub szyfrogram..."
          className="w-full min-h-[120px] p-4 bg-white/20 text-white rounded-3xl backdrop-blur-md 
                     border border-white/20 resize-none focus:outline-none"
        />
        <p className="text-white text-lg mt-4">3. Co zrobić:</p>

        <div className="flex flex-row gap-6">
          <div
            onClick={handleEncrypt}
            className="cursor-pointer w-48 h-48 hover:scale-105 bg-white/30 text-white backdrop-blur-md 
              border border-white/20 rounded-3xl transition-all duration-300 
              hover:bg-white/25 flex flex-col justify-center items-center"
          >
            <LockIcon sx={{ fontSize: 45 }} className="mb-3" />
            <span className="text-2xl font-semibold">Szyfruj</span>
          </div>

          <div
            onClick={handleDecrypt}
            className="cursor-pointer w-48 h-48 hover:scale-105 bg-white/30 text-white backdrop-blur-md 
              border border-white/20 rounded-3xl transition-all duration-300 
              hover:bg-white/25 flex flex-col justify-center items-center"
          >
            <LockOpenIcon sx={{ fontSize: 45 }} className="mb-3" />
            <span className="text-2xl font-semibold">Odszyfruj</span>
          </div>
        </div>
        <p className="text-white text-lg mt-4">4. Wynik:</p>

        <div
          className="w-full h-48 bg-white/30 border border-white/20 text-white 
                        rounded-3xl backdrop-blur-md"
        >
          <textarea
            readOnly
            value={result || "Brak danych do wyświetlenia."}
            className="w-full h-full p-4 bg-transparent resize-none text-white outline-none"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Link
          href="/menu"
          className="px-6 py-2 bg-white/30 border border-white/20 backdrop-blur-md 
                   text-white rounded-2xl hover:bg-white/25 hover:scale-105"
        >
          <ArrowBackIcon className="inline-block mr-1 mb-1" />
          Powrót
        </Link>

        <button
          onClick={handleCleanup}
          className="px-6 py-2 bg-red-600/30 border border-red-600/20 backdrop-blur-md 
                     text-white rounded-2xl hover:bg-red-600/40 hover:scale-105"
        >
          <DeleteIcon className="inline-block mr-1 mb-1" />
          Wyczyść
        </button>
      </div>
    </div>
  );
};

export default RSAPage;
