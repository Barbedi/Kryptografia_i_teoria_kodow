import Link from "next/link";
import Card from "./components/Card";

const menu = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <h1 className="mt-5 text-xl md:text-2xl font-bold text-white drop-shadow-lg">
        Wybierz:
      </h1>
      <div className="w-96 h-0.5 bg-white/40 mt-1 mb-6 rounded-2xl"></div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card title="Szyfr Cezara" url="/menu/cezar" />

      </div>
      <Link className="inline-block mt-4 px-8 py-3 bg-white/30 border text-lg border-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/25 hover:scale-105 active:scale-95 duration-300 transition-all hover:shadow-xl shadow-white/50" href="/">
        Przejdź do Menu
      </Link>
    </div>
  );
};
export default menu;
