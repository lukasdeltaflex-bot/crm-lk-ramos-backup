import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { SidebarNav } from '@/components/sidebar-nav';
import { Header } from '@/components/header';
import { AuthGuard } from './auth/auth-guard';
import { Separator } from './ui/separator';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
      <AuthGuard>
        <SidebarProvider>
            <Sidebar className="print:hidden" collapsible="icon">
            <SidebarRail />
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav />
            </SidebarContent>
            </Sidebar>
            <SidebarInset className="print:m-0 print:p-0 flex flex-col">
            <Header className="print:hidden" />
            <main className="flex-1 p-4 sm:p-6 print:p-0">{children}</main>
            
            <footer className="mt-auto py-4 px-6 border-t bg-muted/20 text-[10px] text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2 print:hidden">
                <p>© {currentYear} LK RAMOS Gestão de Propostas. Todos os direitos reservados.</p>
                <div className="flex gap-4">
                    <a href="/terms" className="hover:text-primary transition-colors">Termos de Uso</a>
                    <a href="/privacy" className="hover:text-primary transition-colors">Privacidade</a>
                </div>
            </footer>
            </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
  );
}
