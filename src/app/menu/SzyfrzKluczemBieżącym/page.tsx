import Link from "next/dist/client/link";



const BeaufortPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="mt-5 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
        Szyfr z Kluczem Bieżącym
      </h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>
      <Link
        href="/menu"
        className="inline-block mt-6 px-8 py-3 bg-white/30 border border-white/20 backdrop-blur-md 
                   text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 
                   duration-300 transition-all hover:shadow-xl shadow-white/50"
      >
        Powrót
      </Link>
    </div>
  )
}

export default BeaufortPage;
