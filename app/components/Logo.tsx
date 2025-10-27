import { Geist } from 'next/font/google';
import Link from 'next/link';

const logoFont = Geist({
  weight: ['800'],
  subsets: ['latin'],
});

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <span className={`${logoFont.className} text-3xl font-bold text-black tracking-tight group-hover:text-gray-700 transition-colors`}>
        Skillify
      </span>
      <div className="ml-1.5 w-2 h-2 bg-black rounded-full group-hover:bg-gray-700 transition-colors"></div>
    </Link>
  );
}