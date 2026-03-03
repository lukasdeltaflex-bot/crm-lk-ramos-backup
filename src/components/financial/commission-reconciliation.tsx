
'use client';

import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
    Sparkles, 
    Loader2, 
    CheckCircle2, 
    XCircle, 
    Upload, 
    FileText, 
    AlertTriangle, 
    ArrowRightLeft,
    Search,
    X,
    FileType
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { reconcileCommissions } from '@/ai/flows/reconcile-commissions-flow';
import type { Proposal, Customer } from '@/lib/types';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, cn, cleanFirestoreData } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProposalWithCustomer = Proposal & { customer?: Customer };

interface ReconciliationResult {
  status: 'matched' | 'discrepancy' | 'not_found';
  reportCpf: string;
  reportProposalNum?: string;
  reportAmount: number;
  proposal?: ProposalWithCustomer;
  message: string;
}

export function CommissionReconciliation({ proposals, onFinished }: { proposals: ProposalWithCustomer[], onFinished: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [text, setText] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ReconciliationResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 4 * 1024 * 1024) {
            toast({ variant: 'destructive', title: 'Arquivo muito pesado', description: 'O limite é 4MB para análise IA.' });
            return;
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => setFileData(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  const handleStartProcess = async () => {
    if (!text.trim() && !fileData) {
      toast({ variant: 'destructive', title: 'Entrada vazia', description: 'Cole um texto ou suba um arquivo.' });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const extracted = await reconcileCommissions({ text: text || undefined, fileDataUri: fileData || undefined });
      
      const reconciliationResults: ReconciliationResult[] = [];
      
      extracted.commissions.forEach(item => {
        const cleanCpf = item.customerCpf.replace(/\D/g, '');
        
        let match = proposals.find(p => p.proposalNumber === item.proposalIdentifier);
        if (!match) {
            match = proposals.find(p => p.customer?.cpf?.replace(/\D/g, '') === cleanCpf && p.commissionStatus !== 'Paga');
        }

        if (match) {
          const diff = Math.abs(match.commissionValue - item.amountPaid);
          const isMatched = diff < 0.01;

          reconciliationResults.push({
            status: isMatched ? 'matched' : 'discrepancy',
            reportCpf: item.customerCpf,
            reportProposalNum: item.proposalIdentifier,
            reportAmount: item.amountPaid,
            proposal: match,
            message: isMatched 
                ? 'Conferência exata de valores.' 
                : `Divergência: Sistema ${formatCurrency(match.commissionValue)} vs Relatório ${formatCurrency(item.amountPaid)}`
          });
        } else {
          reconciliationResults.push({
            status: 'not_found',
            reportCpf: item.customerCpf,
            reportAmount: item.amountPaid,
            message: 'Proposta não localizada na esteira pendente.'
          });
        }
      });

      setResults(reconciliationResults);
      toast({ title: 'Análise Concluída!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro na IA', description: 'Não foi possível processar este formato.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBatch = async () => {
    if (!firestore || !user) return;
    
    const validItems = results.filter(r => r.status !== 'not_found');
    if (validItems.length === 0) return;

    setIsLoading(true);
    try {
        const now = new Date().toISOString();
        const promises = validItems.map(item => {
            const proposalRef = doc(firestore, 'loanProposals', item.proposal!.id);
            const isFullMatch = item.status === 'matched';
            
            return setDoc(proposalRef, cleanFirestoreData({
                commissionStatus: isFullMatch ? 'Paga' : 'Parcial',
                amountPaid: item.reportAmount,
                commissionPaymentDate: now,
                ownerId: user.uid
            }), { merge: true });
        });

        await Promise.all(promises);
        toast({ title: 'Baixa Concluída!', description: `${validItems.length} comissões atualizadas.` });
        
        // 🛡️ UX: Limpa dados e fecha após sucesso
        setResults([]);
        setText('');
        setFileData(null);
        setFileName(null);
        onFinished();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Erro ao salvar' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="p-6 space-y-6 flex-1 overflow-hidden flex flex-col">
        <Alert className="bg-primary/5 border-primary/20 rounded-2xl shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs font-black uppercase">Conciliação Inteligente V2</AlertTitle>
            <AlertDescription className="text-[10px] opacity-70 font-bold uppercase">
                Suba o PDF da promotora ou cole o texto. A IA fará o cruzamento de dados e valores automaticamente.
            </AlertDescription>
        </Alert>

        {results.length === 0 ? (
            <Tabs defaultValue="file" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-full h-12 p-1 shrink-0">
                    <TabsTrigger value="file" className="rounded-full gap-2 font-bold data-[state=active]:bg-background">
                        <FileType className="h-4 w-4" /> Relatório (PDF)
                    </TabsTrigger>
                    <TabsTrigger value="text" className="rounded-full gap-2 font-bold data-[state=active]:bg-background">
                        <FileText className="h-4 w-4" /> Colar Dados
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="flex-1 mt-4">
                    <div 
                        className={cn(
                            "h-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-10 transition-all cursor-pointer bg-muted/10 hover:bg-muted/20",
                            fileData && "border-primary/40 bg-primary/[0.02]"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {fileData ? (
                            <div className="text-center space-y-4">
                                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border-2 border-primary/20">
                                    <CheckCircle2 className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black uppercase text-sm tracking-tight">{fileName}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Pronto para conciliar</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFileData(null); setFileName(null); }} className="text-red-500 hover:text-red-600 font-bold text-xs uppercase">Remover</Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black uppercase text-sm tracking-tight">Relatório da Promotora</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Clique para selecionar PDF ou Imagem</p>
                                </div>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/*" onChange={handleFileSelect} />
                    </div>
                </TabsContent>

                <TabsContent value="text" className="flex-1 mt-4">
                    <Textarea 
                        placeholder="Cole aqui o texto bruto do relatório..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="h-full min-h-[300px] resize-none border-2 rounded-3xl p-6 font-mono text-xs"
                    />
                </TabsContent>
            </Tabs>
        ) : (
            <ScrollArea className="flex-1 border-2 rounded-[2rem] bg-muted/10 p-2 overflow-hidden">
                <div className="space-y-3 p-2 pb-6">
                    <div className="grid grid-cols-12 px-4 py-2 text-[9px] font-black uppercase text-muted-foreground tracking-widest border-b border-border/50">
                        <div className="col-span-4">Cliente / CPF</div>
                        <div className="col-span-3 text-center">Referência</div>
                        <div className="col-span-3 text-right">Comparação</div>
                        <div className="col-span-2 text-right">Status</div>
                    </div>
                    {results.map((res, idx) => (
                        <div key={idx} className={cn(
                            "grid grid-cols-12 items-center gap-4 p-4 rounded-2xl border-2 bg-background transition-all",
                            res.status === 'discrepancy' ? "border-orange-200 bg-orange-50/20" : 
                            res.status === 'not_found' ? "border-muted-foreground/10 opacity-60" : "border-green-100"
                        )}>
                            <div className="col-span-4">
                                <p className="font-black text-xs uppercase truncate">{res.proposal?.customer?.name || 'DESCONHECIDO'}</p>
                                <p className="text-[9px] font-bold text-muted-foreground mt-0.5">{res.reportCpf}</p>
                            </div>
                            <div className="col-span-3 text-center">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-[9px] font-black uppercase text-muted-foreground">
                                    <Search className="h-2.5 w-2.5" /> {res.reportProposalNum || '---'}
                                </div>
                            </div>
                            <div className="col-span-3 text-right">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground line-through opacity-40">
                                        {res.proposal ? formatCurrency(res.proposal.commissionValue) : '---'}
                                    </span>
                                    <span className={cn("text-xs font-black", res.status === 'discrepancy' ? "text-orange-600" : "text-green-600")}>
                                        {formatCurrency(res.reportAmount)}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                {res.status === 'matched' ? (
                                    <Badge className="bg-green-500 rounded-full h-6 w-6 p-0 flex items-center justify-center border-none shadow-sm"><CheckCircle2 className="h-4 w-4" /></Badge>
                                ) : res.status === 'discrepancy' ? (
                                    <Badge variant="outline" className="h-6 rounded-full border-orange-500 text-orange-600 font-black text-[8px] bg-white">PARCIAL</Badge>
                                ) : (
                                    <Badge variant="ghost" className="h-6 rounded-full text-muted-foreground p-0"><XCircle className="h-5 w-5" /></Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        )}
      </div>

      <DialogFooter className="p-6 border-t bg-background shrink-0">
        <div className="flex items-center justify-between w-full">
            <DialogClose asChild>
                <Button variant="ghost" className="rounded-full font-bold uppercase text-xs tracking-widest">Fechar</Button>
            </DialogClose>
            <div className="flex items-center gap-3">
                {results.length > 0 && (
                    <Button 
                        variant="outline" 
                        onClick={() => { setResults([]); setFileData(null); setFileName(null); setText(''); }}
                        className="rounded-full h-12 px-8 font-black uppercase text-xs tracking-widest border-2"
                    >
                        Limpar
                    </Button>
                )}
                <Button 
                    onClick={results.length > 0 ? handleConfirmBatch : handleStartProcess} 
                    disabled={isLoading || (!text.trim() && !fileData && results.length === 0)}
                    className={cn(
                        "rounded-full h-12 px-10 font-black uppercase text-xs tracking-widest shadow-xl transition-all border-none",
                        results.length > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary text-white"
                    )}
                >
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                    ) : results.length > 0 ? (
                        <><CheckCircle2 className="mr-2 h-4 w-4" /> Confirmar Baixas</>
                    ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Iniciar Conferência</>
                    )}
                </Button>
            </div>
        </div>
      </DialogFooter>
    </div>
  );
}
