"use client";
import { useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLogs } from "../context/Log";


const ECDHPage = () => {
  const { addLog } = useLogs();
  const [error, setError] = useState<string | null>(null);
  const [ownPublicKey, setOwnPublicKey] = useState("");
  const [ownPrivateKey, setOwnPrivateKey] = useState("");
  const [remotePublicKey, setRemotePublicKey] = useState("");
  const [sharedSecret, setSharedSecret] = useState("");

  const generateKeys = async () => {
    addLog("Generowanie pary kluczy ECDH...", "info");
   



    addLog("Wygenerowano klucze ECDH!", "success");
  };

  const calculateSecret = async () => {
    try {
      addLog("Obliczanie wspólnego sekretu...", "info");

     

      addLog("Wspólny sekret obliczony!", "success");

    } catch (error) {
      setError("❌ Błąd podczas obliczania sekretu.");
      addLog("❌ Błąd podczas obliczania sekretu.", "error");
    }
  };

  const resetAll = () => {
    addLog("Reset danych ECDH...", "clear");
    setOwnPublicKey("");
    setOwnPrivateKey("");
    setRemotePublicKey("");
    setSharedSecret("");
  };

  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="mt-5 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
        ECDH — Uzgadnianie klucza
      </h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        
        <p className="text-white text-lg">1. Wygeneruj swoją parę kluczy:</p>
        <button 
          onClick={generateKeys} 
          className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white backdrop-blur-md 
                     border border-white/20 focus:outline-none transition-all duration-300 
                     hover:shadow-xl hover:scale-105 focus:shadow-2xl shadow-white/50"
        >
          🔑 Generuj moje klucze
        </button>

        {ownPublicKey && (
          <div className="w-full">
            <p className="text-gray-300 text-sm mb-2">Twój klucz publiczny (udostępnij drugiej stronie):</p>
            <textarea 
              readOnly 
              value={ownPublicKey} 
              className="w-full p-3 rounded-2xl bg-white/10 text-white min-h-[80px] 
                         border border-white/20 focus:outline-none resize-none"
            />
          </div>
        )}

        <div className="w-full h-0.5 bg-white/20 my-2 rounded-2xl"></div>

        <p className="text-white text-lg">2. Wprowadź klucz publiczny drugiej strony:</p>
        <textarea 
          value={remotePublicKey} 
          onChange={(e) => setRemotePublicKey(e.target.value)}
          placeholder="Wklej klucz publiczny drugiej strony..."
          className="w-full p-3 rounded-2xl bg-white/20 text-white placeholder-white/70 min-h-[80px] 
                     border border-white/20 focus:outline-none transition-all duration-300 
                     hover:shadow-lg focus:shadow-xl resize-none"
        />

        <div className="w-full h-0.5 bg-white/20 my-2 rounded-2xl"></div>

        <p className="text-white text-lg">3. Oblicz wspólny sekret:</p>
        <button 
          onClick={calculateSecret} 
          className="w-full py-3 px-4 rounded-3xl bg-white/30 text-white backdrop-blur-md 
                     border border-white/20 focus:outline-none transition-all duration-300 
                     hover:shadow-xl hover:scale-105 focus:shadow-2xl shadow-white/50"
        >
          ⚡ Oblicz wspólny sekret
        </button>

        {sharedSecret && (
          <div className="w-full">
            <p className="text-gray-300 text-sm mb-2">Wspólny sekret:</p>
            <textarea 
              readOnly 
              value={sharedSecret}
              className="w-full p-3 rounded-2xl bg-white/10 text-white min-h-[80px] 
                         border border-white/20 focus:outline-none resize-none"
            />
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

      </div>

      <div className="flex gap-4 mt-8">
        <Link 
          href="/menu" 
          className="flex items-center px-6 py-2 bg-white/30 rounded-2xl text-white 
                     backdrop-blur-md border border-white/20 transition-all duration-300 
                     hover:shadow-lg hover:scale-105"
        >
          <ArrowBackIcon className="mr-2" /> Powrót
        </Link>
        <button 
          onClick={resetAll} 
          className="flex items-center px-6 py-2 bg-red-500/40 rounded-2xl text-white 
                     backdrop-blur-md border border-red-500/20 transition-all duration-300 
                     hover:shadow-lg hover:scale-105"
        >
          <DeleteIcon className="mr-2" /> Wyczyść
        </button>
      </div>
    </div>
  );
};

export default ECDHPage;
