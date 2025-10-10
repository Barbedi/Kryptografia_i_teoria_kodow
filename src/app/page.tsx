import Link from "next/link";

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Kryptografia i teoria kodów
        </h1>
        <Link
          href="/menu"
          className="inline-block mt-4 px-8 py-3 bg-white/30 border text-lg border-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 duration-300 transition-all hover:shadow-xl shadow-white/50"
          aria-label="Przejdź do menu głównego"
        >
          Rozpocznij
        </Link>
      </div>
    </main>
  );
};

export default Home;
