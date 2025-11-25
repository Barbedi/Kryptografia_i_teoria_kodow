"use client";

import { useState } from "react";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLogs } from "../context/Log";

const RSAPage = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showGeneratedKeys, setShowGeneratedKeys] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [manual, setManual] = useState(false);

  const { addLog } = useLogs();

  const generateKeys = async () => {
    addLog("Generowanie nowej pary kluczy RSA...", "info");
    try {
      const keys = await window.api.rust.generateRSAKeys();
      setPublicKey(`${keys.e},${keys.n}`);
      setPrivateKey(`${keys.d},${keys.n}`);

      setShowGeneratedKeys(true);
      addLog("Wygenerowano klucze RSA pomyślnie.", "success");
    } catch {
      const msg = "Błąd generowania kluczy RSA.";
      setResult(msg);
      addLog(msg, "error");
    }
  };
  const handleEncrypt = async () => {
    if (!message || !publicKey) {
      const msg = "Błąd: brak danych lub klucza publicznego.";
      setResult(msg);
      addLog(msg, "error");
      return;
    }

    addLog("Rozpoczynam szyfrowanie RSA...", "info");
    try {
      const [e, n] = publicKey.split(",");
      const cipher = await window.api.rust.encryptRSA(message, n, e);
      setResult(cipher);
      addLog("Zakończono szyfrowanie.", "success");
    } catch {
      const msg = "Błąd podczas szyfrowania RSA.";
      setResult(msg);
      addLog(msg, "error");
    }
  };

  const handleDecrypt = async () => {
    if (!message || !privateKey) {
      const msg = "Błąd: brak szyfrogramu lub klucza prywatnego.";
      setResult(msg);
      addLog(msg, "error");
      return;
    }

    addLog("Rozpoczynam odszyfrowywanie RSA...", "info");
    try {
      const [d, n] = privateKey.split(",");
      const plain = await window.api.rust.decryptRSA(message, n, d);
      setResult(plain);
      addLog("Zakończono odszyfrowywanie.", "success");
    } catch {
      const msg = "Błąd podczas odszyfrowywania RSA.";
      setResult(msg);
      addLog(msg, "error");
    }
  };

  const handleCleanup = () => {
    addLog("Czyszczenie danych i resetowanie stanu...", "clear");
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
            onClick={() => setManual(true)}
            className={`px-6 py-2 text-white rounded-2xl ${manual ? "bg-white/40" : "bg-white/20"}`}
          >
            Wpisz klucze
          </button>

          <button
            onClick={() => setManual(false)}
            className={`px-6 py-2 text-white rounded-2xl ${!manual ? "bg-white/40" : "bg-white/20"}`}
          >
            Wygeneruj klucze
          </button>
        </div>
        <>
          {manual && (
            <div className="flex flex-col gap-4 w-full">
              <p className="text-white text-center font-semibold">
                Wpisz swoje klucze:
              </p>

              <div>
                <span className="text-white/80 text-sm">
                  Klucz publiczny (e,n):
                </span>
                <input
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="w-full py-3 px-4 rounded-2xl bg-white/30 text-white"
                  placeholder="np. 65537,123456789..."
                />
              </div>

              <div>
                <span className="text-white/80 text-sm">
                  Klucz prywatny (d,n):
                </span>
                <input
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="w-full py-3 px-4 rounded-2xl bg-white/30 text-white"
                  placeholder="np. 987654321,123456789..."
                />
              </div>
            </div>
          )}
          {!showGeneratedKeys && !manual && (
            <button
              onClick={generateKeys}
              className="w-full py-3 px-4 bg-white/30 rounded-3xl text-white hover:bg-white/40 
                   transition-all duration-300 hover:scale-105"
            >
              Generuj klucze...
            </button>
          )}

          {showGeneratedKeys && !manual && (
            <div className="flex flex-col gap-4 w-full">
              <p className="text-white text-center font-semibold">
                Wygenerowano:
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-white/80 text-sm font-semibold block mb-1">
                    Klucz publiczny (e, n):
                  </span>
                  <input
                    readOnly
                    value={publicKey}
                    onClick={(e) => e.currentTarget.select()}
                    className="w-full py-3 px-4 rounded-2xl bg-white/30 text-white text-sm 
                           backdrop-blur-md border border-white/20 focus:outline-none cursor-pointer
                           hover:bg-white/40 transition-all"
                    title="Kliknij aby zaznaczyć"
                  />
                </div>

                <div>
                  <span className="text-white/80 text-sm font-semibold block mb-1">
                    Klucz prywatny (d, n):
                  </span>
                  <input
                    readOnly
                    value={privateKey}
                    onClick={(e) => e.currentTarget.select()}
                    className="w-full py-3 px-4 rounded-2xl bg-white/30 text-white text-sm 
                           backdrop-blur-md border border-white/20 focus:outline-none cursor-pointer
                           hover:bg-white/40 transition-all"
                    title="Kliknij aby zaznaczyć"
                  />
                </div>
              </div>
            </div>
          )}
        </>
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
