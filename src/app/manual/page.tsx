'use client';

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    CircleDollarSign, 
    CalendarClock, 
    Bot, 
    Zap, 
    TrendingUp, 
    ShieldCheck, 
    BadgePercent
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
                        Bem-vindo ao Sistema de Elite
                    </CardTitle>
                    <CardDescription>
                        Este guia foi projetado para transformar você em um mestre na operação do LK RAMOS. 
                        Siga os passos abaixo para dominar cada funcionalidade.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="dashboard" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><LayoutDashboard className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">1. Dashboard: A Torre de Comando</p>
                                <p className="text-xs text-muted-foreground">Visão geral de produção e tendências</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>O Dashboard é sua ferramenta de decisão rápida.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Cards de Status</strong>: Mostram o volume financeiro. Note os <strong>Sparklines</strong> que indicam a tendência dos últimos 7 dias.</li>
                            <li><strong>Indicador de Calor (<Zap className="inline h-3 w-3 text-orange-500" />)</strong>: Se um card brilhar em laranja, o setor está com volume 20% acima da média.</li>
                            <li><strong>Meta Mensal</strong>: Clique no ícone de lápis para ajustar sua meta. O progresso é atualizado em tempo real com contratos "Pagos".</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="customers" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600"><Users className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">2. Gestão de Clientes & IA</p>
                                <p className="text-xs text-muted-foreground">Cadastros ultra-rápidos e dossiês</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Gerencie sua base com o poder da IA.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/30 rounded-lg border">
                                <p className="font-bold flex items-center gap-2 mb-2"><Bot className="h-4 w-4 text-primary" /> Novo Cliente com IA</p>
                                <p className="text-xs">Cole o texto do WhatsApp e a IA extrai Nome, CPF e Endereço automaticamente.</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border">
                                <p className="font-bold flex items-center gap-2 mb-2"><FileText className="h-4 w-4 text-primary" /> Documentos Permanentes</p>
                                <p className="text-xs">Salve RG e CPF uma única vez na central do cliente; eles estarão em todas as propostas futuras.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="followups" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><CalendarClock className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">3. Mecanismo de Retornos (CRM)</p>
                                <p className="text-xs text-muted-foreground">Nunca mais esqueça de ligar para um cliente</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Organize seu dia de vendas.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Agendamento</strong>: Vincule retornos a clientes ou crie novos leads.</li>
                            <li><strong>Notificações</strong>: O sino avisa sobre retornos atrasados ou para hoje.</li>
                            <li><strong>Ações Rápidas</strong>: Marque como concluído ou reagende com um clique.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="proposals" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600"><TrendingUp className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">4. Esteira de Propostas</p>
                                <p className="text-xs text-muted-foreground">Gestão visual do fluxo de caixa</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Acompanhe o dinheiro em movimento.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Status Interativo</strong>: Mude o status diretamente na tabela clicando no badge.</li>
                            <li><strong>Monitoramento de Saldo</strong>: Portabilidades sem saldo há 5 dias brilham em vermelho.</li>
                            <li><strong>Duplicação</strong>: Use "Duplicar Proposta" para clientes com múltiplos produtos.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="financial" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600"><CircleDollarSign className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">5. Controle Financeiro</p>
                                <p className="text-xs text-muted-foreground">Baixas e análise de parceiros</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Inteligência financeira aplicada.</p>
                        <div className="space-y-4">
                            <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-l-primary">
                                <p className="font-bold flex items-center gap-2"><Bot className="h-4 w-4" /> Conciliação com IA</p>
                                <p className="text-xs mt-1">Cole o texto do relatório de pagamento e a IA identifica divergências de valor automaticamente.</p>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-l-green-500">
                                <p className="font-bold flex items-center gap-2"><BadgePercent className="h-4 w-4" /> Eficiência por Parceiro</p>
                                <p className="text-xs mt-1">Descubra qual promotora paga mais rápido e qual tem o melhor ticket médio.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Links Rápidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/customers?action=new"><Bot className="mr-2 h-3 w-3" /> Cadastro via IA</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/financial"><CircleDollarSign className="mr-2 h-3 w-3" /> Conciliar Relatório</a>
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-muted/20 border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm font-bold">Atalho de Produtividade</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                    <p>Use <strong>⌘ + K</strong> (ou Ctrl+K) para abrir a Pesquisa Global e encontrar qualquer registro em segundos.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}