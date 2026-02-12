import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ThemeProvider } from '@/components/theme-provider';
import { InteractionFixer } from '@/components/interaction-fixer';
import { TooltipProvider } from '@/components/ui/tooltip';

setDefaultOptions({ locale: ptBR });

export const metadata: Metadata = {
  title: 'LK RAMOS',
  description: 'Gerenciador de propostas e clientes para correspondentes bancários.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <InteractionFixer />
            <FirebaseClientProvider>
              {children}
            </FirebaseClientProvider>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
