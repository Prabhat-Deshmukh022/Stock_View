import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 p-8">
      <main className="flex flex-col items-center gap-8">
        <Image
          src="/coin_logo.svg"
          alt="WealthManager Logo"
          width={180}
          height={38}
          priority
          className="mb-2"
        />
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
          Welcome to StockView
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-xl mb-4">
          Track, analyze, and visualize your stock portfolio with ease. Get performance insights, diversification scores, and more—all in one place.
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow transition-colors text-lg"
        >
          Go to Dashboard
        </Link>
      </main>
      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center text-gray-500 text-sm">
        <a
          className="flex items-center gap-2 hover:underline"
          href="https://github.com/Prabhat-Deshmukh022/Stock_View"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          GitHub
        </a>
      </footer>
    </div>
    );
  }