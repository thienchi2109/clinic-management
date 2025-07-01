'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Pill,
  FileText,
  Bot,
  Stethoscope,
} from 'lucide-react';
import { Button } from '../ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/inventory', label: 'Inventory', icon: Pill },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
            <Link href="/">
              <Stethoscope className="h-6 w-6" />
            </Link>
          </Button>
          <h1 className="whitespace-nowrap text-lg font-headline font-semibold group-data-[collapsible=icon]:hidden">
            Clinic Management
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
