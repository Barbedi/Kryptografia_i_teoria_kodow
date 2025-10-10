


import Link from 'next/link';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Kryptografia i teoria kodów
        </h1>
        <Link 
          href="/menu"
          className="inline-block mt-8 px-8 py-3 bg-secondary/30 text-white rounded-2xl hover:bg-secondary hover:scale-105 duration-300 transition-all shadow-lg backdrop-blur-sm border border-white/20"
          aria-label="Przejdź do menu głównego"
        >
          Rozpocznij
        </Link>
      </div>
    </main>
  );
}

export default Home;