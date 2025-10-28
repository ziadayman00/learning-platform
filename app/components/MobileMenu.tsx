'use client';

import { Menu, X, User, Settings, LogOut, ShoppingBag } from 'lucide-react';
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
import { useSession, signOut } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@radix-ui/react-dropdown-menu';

interface MobileMenuProps {
  isLoggedIn?: boolean;
}

export default function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  // Dynamic links based on login status
  const links = user
    ? [
        { href: '/', label: 'Home' },
        { href: '/courses', label: 'Courses' },
        { href: '/about', label: 'About' },
        { href: '/dashboard', label: 'Dashboard' },
      ]
    : [
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

          {/* Auth Section - Pushed to bottom */}
          <div className="mt-auto px-8 py-8 border-t">
            {isPending ? (
              <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="space-y-4">
                {/* User Profile */}
                <div className="flex items-center gap-3 pb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                    <AvatarFallback className="bg-black text-white font-medium">
                      {user.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium text-black truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <Separator />

                {/* User Menu Links */}
                <div className="space-y-1 pt-2">
                  <Link
                    href="/dashboard/purchases"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>My Courses</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </div>

                <Separator />

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
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
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}