import { AuthButtons } from './AuthButtons';
import { NavLinks } from './Navlinks';

export default function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <NavLinks />
      <AuthButtons />
    </nav>
  );
}