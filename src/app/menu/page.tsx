import Link from "next/link";

const menu = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Kryptografia i teoria kodów-projekt</h1>
      <Link className="mt-6 px-4 py-2 bg-blue-500 text-white rounded" href="/">
        Przejdź do Menu
      </Link>
    </div>
  );
};
export default menu;
