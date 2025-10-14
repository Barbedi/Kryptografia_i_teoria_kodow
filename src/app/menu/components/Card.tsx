import Link from "next/link";

interface CardProps {
  title: string;
  url: string;
}

const Card = ({ title, url }: CardProps) => {
  return (
    <div className="border-white/20 rounded-xl w-full max-w-sm sm:w-64 md:w-56 lg:w-76 p-4 sm:p-6 bg-white/30 backdrop-blur-xl border">
      <h2 className="text-lg text-center sm:text-xl font-bold text-white mb-4">
        {title}
      </h2>
      <Link
        href={url}
        className="inline-block w-full py-3 px-4 rounded-2xl bg-transparent text-white 
                   backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all duration-300 
                   hover:shadow-xl hover:scale-105 active:scale-95 text-center shadow-white/50 font-medium"
        aria-label={`Przejdź do ${title}`}
      >
        Rozpocznij
      </Link>
    </div>
  );
};

export default Card;
