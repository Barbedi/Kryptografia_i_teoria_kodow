import Link from "next/link";

interface CardProps {
  title: string;
  url: string;
}

const Card = ({ title, url }: CardProps) => {
  return (
    <div className=" border-white/20 rounded-xl w-full max-w-sm sm:w-64 md:w-56 lg:w-64 p-4 sm:p-6 bg-white/30 backdrop-blur-xl  border">
      <h2 className="text-lg text-center sm:text-xl font-bold text-white mb-2">
        {title}
      </h2>
      <Link
        href={url}
        className="inline-block w-full text-center mt-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-secondary/30 border text-sm sm:text-base border-none backdrop-blur-md text-white rounded-2xl hover:bg-secondary/60 hover:scale-105 active:scale-95 duration-300 transition-all"
        aria-label="Przejdź do menu głównego"
      >
        Rozpocznij
      </Link>
    </div>
  );
};
export default Card;
