
'use client';

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
    LayoutDashboard, 
    Palette, 
    Shapes, 
    Monitor, 
    Zap, 
    Wallet, 
    Eye, 
    TrendingUp, 
    ShieldCheck, 
    Sparkles, 
    Database, 
    CloudUpload,
    FileBadge,
    Bot,
    MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManualPage() {
  return (
    <AppLayout>
      <PageHeader title="Manual de Operação LK RAMOS" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="text-primary" />
                        Sistema de Gestão de Elite
                    </CardTitle>
                    <CardDescription>
                        Este guia foi projetado para transformar você em um mestre na operação do LK RAMOS. 
                        Domine cada funcionalidade de última geração e branding próprio.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="appearance" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><Palette className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">1. Estúdio de Branding & Aura Visual</p>
                                <p className="text-xs text-muted-foreground">Logo próprio, estilos de container e texturas</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Personalize o sistema para que ele tenha a cara da sua marca.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Branding Próprio</strong>: Em Configurações, suba sua logomarca. Ela substituirá o logo padrão no menu e aparecerá em todos os relatórios PDF oficiais.</li>
                            <li><strong>Aura Visual</strong>: Escolha o estilo dos containers entre <strong>Glassmorphism</strong> (vidro fosco), <strong>Profundo</strong> (sombras de luxo) ou <strong>Flat</strong> (minimalista).</li>
                            <li><strong>Laboratório de Design</strong>: Use o novo simulador em tempo real na aba Aparência para testar como os botões e cards ficam com cada combinação de estilo.</li>
                            <li><strong>Texturas de Fundo</strong>: Adicione padrões como <strong>Dots</strong> (pontos) ou <strong>Grid</strong> (grelha) para dar uma sensação de acabamento profissional às páginas.</li>
                            <li><strong>Controle de Intensidade</strong>: Escolha entre tons <strong>Sóbrios</strong> (pastéis executivos) ou <strong>Vibrantes</strong> (cores vivas).</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dashboard" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><LayoutDashboard className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">2. Radar de Vendas & Inteligência</p>
                                <p className="text-xs text-muted-foreground">Retenção de clientes e avisos da IA</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>O Dashboard monitora oportunidades ocultas na sua base de dados.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Radar de Vendas</strong>: Identifica automaticamente clientes com contratos pagos há mais de 12 meses. É o momento de oferecer refinanciamento.</li>
                            <li><strong>Inteligência Diária</strong>: Consolida retornos agendados e alertas de clientes próximos de 75 anos.</li>
                            <li><strong>Relatório Diário via IA</strong>: O botão "Resumo E-mail" gera um relatório estratégico e envia para o seu e-mail cadastrado.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dre" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100 text-red-600"><Wallet className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">3. Controle Financeiro & Fluxo de Caixa</p>
                                <p className="text-xs text-muted-foreground">Gestão de gastos e conciliação bancária</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Mantenha a saúde financeira da sua operação sob controle total.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Lançamento de Despesas</strong>: Registre custos operacionais e gerencie a situação (Pago/Pendente).</li>
                            <li><strong>Categorias Customizadas</strong>: Crie categorias próprias (Ex: Marketing, Salários) em Configurações.</li>
                            <li><strong>Conciliação com IA</strong>: Use a ferramenta "Conciliar IA" no Financeiro para processar relatórios de pagamento colando apenas o texto do banco/promotora.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="preview" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-600"><Eye className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">4. Visualizador de Documentos Instantâneo</p>
                                <p className="text-xs text-muted-foreground">Conferência sem necessidade de downloads</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Agilize sua conferência de propostas e mantenha a conformidade com a LGPD.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Ícone do Olho</strong>: Presente em todos os anexos. Permite ver imagens e PDFs em um modal flutuante seguro.</li>
                            <li><strong>Documentos Fixos</strong>: Na ficha do cliente, você pode salvar o RG/CPF permanentemente. Eles aparecerão em todas as futuras propostas desse cliente automaticamente.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Ações de Elite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/settings?tab=appearance"><Monitor className="mr-2 h-3 w-3 text-blue-500" /> Branding Próprio</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/settings?tab=appearance"><MousePointer2 className="mr-2 h-3 w-3 text-orange-500" /> Testar Simulador</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/settings?tab=appearance"><Sparkles className="mr-2 h-3 w-3 text-purple-500" /> Aura Glassmorphism</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/financial?tab=expenses"><Wallet className="mr-2 h-3 w-3 text-red-500" /> Lançar Gasto</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/summary"><Bot className="mr-2 h-3 w-3 text-green-500" /> Relatório IA</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}

    