import Link from "next/link";

const Cezar = () => {
  return (
    <div>
      <h1>Szyfr Cezara</h1>
      <Link
        className="inline-block mt-4 px-8 py-3 bg-white/30 border text-lg border-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 duration-300 transition-all hover:shadow-xl shadow-white/50"
        href="/menu"
      >
        Przejdź do Menu
      </Link>
    </div>
  );
};
export default Cezar;
