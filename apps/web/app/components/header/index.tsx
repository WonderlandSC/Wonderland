'use client';

import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { Button } from '@repo/design-system/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@repo/design-system/components/ui/navigation-menu';
import { env } from '@repo/env';
import { Menu, MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Logo from './logo1.svg';

export const Header = () => {
  const navigationItems = [
    {
      title: 'Начало',
      href: '/',
      description: '',
    },
    {
      title: 'За нас',
      href: '/about',
      description: '',
    },
    {
      title: 'Product',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'Pricing',
          href: '/pricing',
        },
        {
          title: 'Pricing',
          href: '/pricing',
        },
        {
          title: 'Pricing',
          href: '/pricing',
        },
        {
          title: 'Pricing',
          href: '/pricing',
        },
      ],
    },
    {
      title: 'Blog',
      href: '/blog',
      description: '',
    },
    {
      title: 'Docs',
      href: env.NEXT_PUBLIC_DOCS_URL,
      description: '',
    },
  ];

  const [isOpen, setOpen] = useState(false);

  // Updated click outside handler to ignore the toggle button
  const handleClickOutside = (event: MouseEvent) => {
    const menu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');
    if (
      menu && 
      !menu.contains(event.target as Node) && 
      menuButton && 
      !menuButton.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    // Only add the event listener if the menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]); // Added isOpen as a dependency

  const handleMenuToggle = () => {
    setOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };
  
  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background">
      <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" asChild>
                          <Link href={item.href}>{item.title}</Link>
                        </Button>
                      </NavigationMenuLink>
                    </>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-10" asChild>
                              <Link href="/contact">Book a call today</Link>
                            </Button>
                          </div>
                          <div className="flex h-full flex-col justify-end text-sm">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                href={subItem.href}
                                key={subItem.title}
                                className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="h-4 w-4 text-muted-foreground" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2 lg:justify-center">
          <Link href="/">
          <Image
            src="https://cdn.jsdelivr.net/gh/Ethereumistic/wonderland-assets/logo/wonderland.png"
            alt="Logo"
            width={200}
            height={100}
            className=""
          />
          </Link>
        </div>
        <div className="flex w-full justify-end gap-4">
          <Button variant="default" className="hidden md:inline" asChild>
            <Link href="/contact">Контакти</Link>
          </Button>
          <div className="hidden border-r md:inline" />
          
          <Button variant="outline" asChild>
            <Link href={`${env.NEXT_PUBLIC_APP_URL}/sign-in`}>Вход</Link>
          </Button>
          <ModeToggle />
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button 
            id="mobile-menu-button"
            variant="ghost" 
            onClick={handleMenuToggle}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isOpen && (
            <div 
              id="mobile-menu" 
              className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg"
            >
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={handleLinkClick} // Close the menu on link click
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center justify-between"
                        onClick={handleLinkClick} // Close the menu on sub-item link click
                      >
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="h-4 w-4 stroke-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <ModeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};