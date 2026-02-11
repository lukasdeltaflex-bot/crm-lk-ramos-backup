"use client"

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
    Palette, 
    ShieldCheck, 
    Wallet, 
    Eye, 
    Filter,
    Pipette,
    BookOpen,
    Zap,
    Type,
    MoveHorizontal,
    Bot,
    Shapes,
    TrendingUp,
    Layout,
    PanelLeft,
    Search
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
                        Plataforma de Gestão Industrial de Elite
                    </CardTitle>
                    <CardDescription>
                        Este guia foi projetado para transformar você em um mestre na operação do LK RAMOS. 
                        Domine cada funcionalidade de última geração e branding próprio.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="branding" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Palette className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">1. Estúdio de Branding & Laboratório 360°</p>
                                <p className="text-xs text-muted-foreground">Preview isolado, logo própria e identidade total da marca</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>O LK RAMOS permite que o sistema tenha a alma da sua marca através de ferramentas de customização avançada.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Laboratório de Visualização (Sandbox)</strong>: Experimente cores e fontes em um ambiente seguro. As mudanças só afetam o sistema quando você clicar em "Aplicar Globalmente".</li>
                            <li><strong>Branding Próprio</strong>: Faça o upload da sua logomarca. Ela aparecerá com destaque no menu lateral e em todos os relatórios PDF oficiais (Dossiês e Fechamentos).</li>
                            <li><strong>Paleta Premium</strong>: Mais de 60 tonalidades calibradas para aplicação global instantânea.</li>
                            <li><strong>Barra Lateral Independente</strong>: Escolha entre os modos <strong>Dark</strong> (Industrial), <strong>Light</strong> (Clean) ou <strong>Padrão</strong> para o menu de navegação.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="typography" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><Type className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">2. Tipografia Expandida & Arredondamento</p>
                                <p className="text-xs text-muted-foreground">Estilos de elite e precisão de arredondamento industrial</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Ajuste a personalidade do sistema através do Estúdio de Precisão.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>25+ Famílias de Fontes</strong>: Escolha entre estilos como <strong>Industrial (Bebas)</strong>, <strong>Futurista (Orbitron)</strong>, <strong>Real (Cinzel)</strong> ou <strong>Minimalista (Outfit)</strong>.</li>
                            <li><strong>Arredondamento Cirúrgico</strong>: 8 níveis de precisão, do <strong>Reto Industrial (0px)</strong> para um visual agressivo até o <strong>Cápsula (32px)</strong> para suavidade moderna.</li>
                            <li><strong>Intensidade de Brilho</strong>: 4 níveis de intensidade que afetam como as cores de status brilham nos cards e badges.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="motion" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600"><MoveHorizontal className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">3. Ritmo & Motion Design</p>
                                <p className="text-xs text-muted-foreground">Controle da velocidade de resposta e animações</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>O <strong>Ritmo</strong> define quão rápido os elementos aparecem e se movem na sua tela.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Instantâneo</strong>: Rapidez absoluta, sem delays de transição. Ideal para alta produtividade.</li>
                            <li><strong>Sutil/Atmosférico</strong>: O equilíbrio perfeito entre beleza e velocidade.</li>
                            <li><strong>Cinematográfico</strong>: Transições suaves e luxuosas que elevam a experiência visual.</li>
                            <li><strong>Botão de Teste</strong>: Use o botão "Testar Ritmo" no Laboratório para sentir a velocidade antes de aplicar.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="navigation" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600"><Filter className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">4. Navegação Cromática & Sparklines</p>
                                <p className="text-xs text-muted-foreground">Sincronização entre cards, abas e gráficos de tendência</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>O sistema utiliza cores para guiar seu olhar através da esteira de propostas.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Sincronização de Status</strong>: A cor que você define no Laboratório é aplicada rigorosamente ao <strong>Card do Dashboard</strong>, ao <strong>Botão de Filtro (Abas)</strong> e aos <strong>Badges da Tabela</strong>.</li>
                            <li><strong>Sparklines (Tendência)</strong>: As mini-linhas gráficas nos cards mostram a oscilação da sua produção nos últimos 7 dias, permitindo identificar picos ou quedas de produtividade.</li>
                            <li><strong>Cálculo de Performance</strong>: Indicadores percentuais automáticos comparam o desempenho do mês atual com o mês anterior.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="alerts" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100 text-red-600"><Zap className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">5. Monitoramento Industrial & Pulsação</p>
                                <p className="text-xs text-muted-foreground">Alertas agressivos para prazos críticos e retenção</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Ferramentas de alerta que garantem que nenhuma pendência seja esquecida.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Pulsação de Alerta (Aura Vermelha)</strong>: Qualquer <strong>Portabilidade</strong> em status "Aguardando Saldo" com 5 ou mais dias úteis emitirá um brilho pulsante no Dashboard e na Tabela.</li>
                            <li><strong>Radar de Vendas</strong>: Identifica automaticamente clientes com contratos pagos há mais de 12 meses, sugerindo oportunidades de retenção ou refinanciamento.</li>
                            <li><strong>Inteligência Diária</strong>: O resumo IA processa aniversários, comissões pendentes e retornos agendados todas as manhãs.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="productivity" className="border rounded-xl bg-card px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-600"><Search className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold">6. Produtividade & Comandos Rápidos</p>
                                <p className="text-xs text-muted-foreground">Busca global, comandos de teclado e visualização segura</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4 text-sm leading-relaxed">
                        <p>Agilize seu fluxo de trabalho com ferramentas de acesso rápido.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Busca Inteligente (⌘K / Ctrl+K)</strong>: Pressione o atalho para abrir a busca global. Encontre clientes por CPF/Nome ou propostas por número instantaneamente.</li>
                            <li><strong>Visualizador de Documentos</strong>: Utilize o ícone do <strong>Olho (Eye)</strong> para conferir RGs, CPFs e contracheques sem precisar baixá-los para o seu computador.</li>
                            <li><strong>Documentos Permanentes</strong>: Salve os documentos fixos na ficha do cliente. Eles ficarão disponíveis automaticamente em todas as futuras propostas deste CPF.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Atalhos de Elite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/settings?tab=appearance"><Type className="mr-2 h-3 w-3 text-blue-500" /> Estúdio de Fontes</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/settings?tab=appearance"><Pipette className="mr-2 h-3 w-3 text-pink-500" /> Cores de Status</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/settings?tab=appearance"><MoveHorizontal className="mr-2 h-3 w-3 text-purple-500" /> Motion Design</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/summary"><Bot className="mr-2 h-3 w-3 text-green-500" /> Relatório IA</a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8" asChild>
                        <a href="/financial?tab=expenses"><Wallet className="mr-2 h-3 w-3 text-orange-500" /> Livro de Despesas</a>
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="text-xs font-bold uppercase">Suporte Técnico</CardTitle>
                </CardHeader>
                <CardContent className="text-[10px] text-muted-foreground leading-relaxed">
                    Em caso de dúvidas operacionais ou necessidade de suporte exclusivo, utilize os canais oficiais do LK RAMOS.
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
