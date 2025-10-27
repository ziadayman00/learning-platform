'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-transparent"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] px-0"
      >
        <SheetHeader className="px-8 pb-8 border-b">
          <SheetTitle>
            <Link 
              href="/" 
              onClick={() => setOpen(false)}
              className="flex items-center group"
            >
              <span className="text-2xl font-bold text-black tracking-tight group-hover:text-gray-700 transition-colors">
                Skillify
              </span>
              <div className="ml-2 w-2 h-2 bg-black rounded-full group-hover:bg-gray-700 transition-colors"></div>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex flex-col px-8 py-8 space-y-2">
            {links.map((link) => {
              const active = isActive(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    text-2xl font-medium py-3 transition-colors duration-200
                    ${active ? 'text-black' : 'text-gray-400 hover:text-black'}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons - Pushed to bottom */}
          <div className="mt-auto px-8 py-8 border-t space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base" 
              asChild
            >
              <Link href="/signin" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button 
              className="w-full h-12 text-base bg-black hover:bg-gray-800" 
              asChild
            >
              <Link href="/signup" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}