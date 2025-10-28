'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

interface NavLinksProps {
  onClick?: () => void;
  isLoggedIn?: boolean; // Add this prop
}

export function NavLinks({ onClick, isLoggedIn }: NavLinksProps) {
  const pathname = usePathname();

  const links: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About' },
    ...(isLoggedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : []), // Add dashboard if logged in
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={`
            relative text-sm font-medium transition-colors duration-200
            ${isActive(link.href) ? 'text-black' : 'text-gray-500 hover:text-black'}
          `}
        >
          {link.label}
          {isActive(link.href) && (
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-black" />
          )}
        </Link>
      ))}
    </>
  );
}