"use client"

import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
    Palette, 
    ShieldCheck, 
    Bot,
    Camera,
    Sparkles,
    Search,
    Zap,
    Layout,
    UserCheck,
    CloudSun,
    MessageSquareText,
    Check,
    Landmark,
    FileCheck2,
    Database,
    Binary,
    Tags,
    Trophy,
    Share2,
    SmilePlus,
    Pencil,
    Star,
    Cake,
    ListTodo,
    AlertTriangle,
    LinkIcon,
    ArrowRight,
    HardDrive,
    SearchX,
    Lock,
    NotebookTabs,
    UploadCloud,
    Wallet,
    Clock,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ManualPage() {
  return (
    <AppLayout>
      <PageHeader title="Guia de Operação LK RAMOS" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
        <div className="lg:col-span-3 space-y-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
                
                {/* 1. INTELIGÊNCIA ARTIFICIAL E VENDAS */}
                <AccordionItem value="ai-features" className="border-2 rounded-2xl bg-card px-4 shadow-sm border-primary/10">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-100 text-orange-600"><Zap className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">1. Ecossistema de IA e Vendas</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Consultoria, Visão e Persuasão</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-4 text-sm leading-relaxed">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-xl bg-orange-50/5 border border-orange-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-orange-600" />
                                    <h4 className="font-bold">Análise Estratégica IA</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">Dentro da ficha do cliente, o botão "Gerar Consultoria" entrega uma análise profunda. A IA cruza dicas de datas de contratos para sugerir o momento exato de um refinanciamento.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Camera className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-bold">OCR Multimodal (Fotos e PDFs)</h4>
                                </div>
                                <p className="text-xs text-muted-foreground">O cadastro via IA suporta **PDFs Oficiais**. Você pode subir extratos bancários e a IA extrairá Nome, CPF e Benefícios instantaneamente.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 2. REGRAS DE PORTABILIDADE E AUDITORIA */}
                <AccordionItem value="portability-rules" className="border-2 rounded-2xl bg-card px-4 shadow-sm border-red-500/20">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-100 text-red-600"><SearchX className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">2. Ferramenta de Auditoria de Portabilidade</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Blindagem contra Retrabalho</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-4 text-sm leading-relaxed">
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                <h4 className="font-bold text-red-700 flex items-center gap-2 mb-2">
                                    <Check className="h-4 w-4" /> Nº de Contrato Obrigatório
                                </h4>
                                <p className="text-xs text-muted-foreground">Ao selecionar o produto **Portabilidade**, o campo "Nº Contrato Portado (Origem)" torna-se **obrigatório**. O sistema não permite salvar a proposta sem essa identificação única.</p>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                                <h4 className="font-bold text-orange-700 flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4" /> Alerta de Reprova Anterior
                                </h4>
                                <p className="text-xs text-muted-foreground">O sistema possui um **radar histórico**. Ao digitar o número do contrato, ele verifica instantaneamente se esse contrato já foi reprovado antes. Se sim, um alerta vermelho aparecerá no topo do formulário exibindo o motivo da reprova anterior.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. GESTÃO DE PARCEIROS & SEGURANÇA */}
                <AccordionItem value="management-secure" className="border-2 rounded-2xl bg-card px-4 shadow-sm border-blue-500/20">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><Lock className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">3. Gestão de Parceiros & Senhas AES-256</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Criptografia Militar e Colaboração</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-4 text-sm leading-relaxed">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-xl bg-blue-50/5 border border-blue-200">
                                <h4 className="font-bold text-blue-700 flex items-center gap-2 mb-2"><ShieldCheck className="h-4 w-4" /> Criptografia Blindada</h4>
                                <p className="text-xs text-muted-foreground">Suas senhas bancárias são criptografadas via **AES-256-GCM** antes de saírem do seu navegador. Somente você consegue descriptografar.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-50/5 border border-green-200">
                                <h4 className="font-bold text-green-700 flex items-center gap-2 mb-2"><NotebookTabs className="h-4 w-4" /> Mural Colaborativo</h4>
                                <p className="text-xs text-muted-foreground">A aba de **Notícias** e **Links Úteis** é pública para sua equipe. Tudo o que você publicar aparecerá para seus sócios instantaneamente.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. TEMPORIZADOR DE NOTÍCIAS (NOVO) */}
                <AccordionItem value="news-timer" className="border-2 rounded-2xl bg-card px-4 shadow-sm border-orange-500/20">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-100 text-orange-600"><Clock className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">4. Temporizador Inteligente de Avisos</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Publicações com data de validade</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-4 text-sm leading-relaxed">
                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-200">
                            <h4 className="font-bold text-orange-700 flex items-center gap-2 mb-2"><Clock className="h-4 w-4" /> Expiração Automática</h4>
                            <p className="text-xs text-muted-foreground">
                                Agora você pode definir uma **Data de Remoção** ao criar uma notícia. 
                                <br/><br/>
                                • **Aviso Temporário**: Defina a data e a notícia sumirá do mural sozinha após o prazo (ex: comunicado de feriado).
                                <br/>
                                • **Aviso Permanente**: Deixe o campo vazio e a notícia ficará no mural até que você a exclua manualmente.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 5. DOCUMENTAÇÃO & ESPAÇO */}
                <AccordionItem value="docs-storage" className="border-2 rounded-2xl bg-card px-4 shadow-sm border-purple-500/20">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><UploadCloud className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">5. Central Multimídia & Gestão de Espaço</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Controle total de arquivos e armazenamento</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-4 text-sm leading-relaxed">
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <div className="h-5 w-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                                <p><strong>Upload PNG/JPG/PDF</strong>: Suporte total para fotos de WhatsApp e extratos digitais com visualização rápida no sistema.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0"><Trash2 className="h-3 w-3" /></div>
                                <p><strong>Exclusão Física</strong>: Ao remover um anexo, o sistema exclui o arquivo **fisicamente do servidor**, liberando espaço em tempo real.</p>
                            </li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                {/* 6. FINANÇAS & ALERTAS */}
                <AccordionItem value="finance-alerts" className="border-2 rounded-2xl bg-card px-4 shadow-sm border-emerald-500/20">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600"><Wallet className="h-5 w-5" /></div>
                            <div className="text-left">
                                <p className="font-bold text-sm">6. Fluxo de Caixa & Alertas de Despesas</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Saúde financeira operacional</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-4 text-sm leading-relaxed">
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <h4 className="font-bold text-emerald-700 flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4" /> Alertas no Dashboard</h4>
                            <p className="text-xs text-muted-foreground">O painel principal monitora a aba **Financeiro/Despesas**. Contas pendentes ou atrasadas aparecerão no seu resumo matinal como alertas críticos.</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>

        {/* BARRA LATERAL DE ATALHOS */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-3 w-3 fill-current" /> Atalhos Mestres
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">Busca Global</p>
                        <p className="text-xs font-bold">CTRL + K</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">Símbolos/Emojis</p>
                        <p className="text-xs font-bold">Win + .</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">Recolher Menu</p>
                        <p className="text-xs font-bold">CTRL + B</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-green-500/20 bg-green-500/5">
                <HardDrive className="absolute top-2 right-2 h-4 w-4 text-green-600/30" />
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-green-600">Armazenamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                        <span className="text-[10px] font-black uppercase">5 GB Gratuitos</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-2 leading-tight">
                        Capacidade para milhares de dossiês. Excluir anexos libera espaço em tempo real.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
