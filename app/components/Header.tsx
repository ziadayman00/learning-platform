import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import DesktopNav from "./DesktopNav";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <DesktopNav isLoggedIn={!!session?.user} />
          <MobileMenu isLoggedIn={!!session?.user} />
        </div>
      </div>
    </header>
  );
}