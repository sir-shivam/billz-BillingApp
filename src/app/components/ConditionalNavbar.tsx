"use client";

import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const noNavbarRoutes = ['/login', '/signup'];

  if (noNavbarRoutes.includes(pathname)) return null;

  return <Navbar />;
}
