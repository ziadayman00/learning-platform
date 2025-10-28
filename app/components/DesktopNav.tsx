import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { AuthButtons } from './AuthButtons';
import { NavLinks } from './Navlinks';

export default async function DesktopNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="hidden md:flex items-center gap-8">
      <NavLinks isLoggedIn={!!session?.user} />
      <AuthButtons />
    </nav>
  );
}