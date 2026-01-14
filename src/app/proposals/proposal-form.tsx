
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { customers, productTypes, proposalStatuses, approvingBodies } from '@/lib/data';
import type { Proposal } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const proposalSchema = z.object({
  customerId: z.string({ required_error: 'Selecione um cliente.' }),
  product: z.string({ required_error: 'Selecione um produto.' }),
  table: z.string().min(1, 'A tabela é obrigatória.'),
  term: z.coerce.number().min(1, 'O prazo é obrigatório.'),
  installmentAmount: z.coerce.number().min(0, 'O valor da parcela é obrigatório.'),
  netAmount: z.coerce.number().min(0, 'O valor líquido é obrigatório.'),
  grossAmount: z.coerce.number().min(0, 'O valor bruto é obrigatório.'),
  status: z.string({ required_error: 'Selecione um status.' }),
  approvingBody: z.string().min(1, 'O órgão aprovador é obrigatório.'),
  commissionValue: z.coerce.number().min(0, 'O valor da comissão é obrigatório.'),
  commissionPercentage: z.coerce.number().min(0, 'A porcentagem da comissão é obrigatória.'),
  promoter: z.string().min(1, 'A promotora é obrigatória.'),
  bank: z.string().min(1, 'O banco é obrigatório.'),
  dateDigitized: z.date({ required_error: 'A data de digitação é obrigatória.' }),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

interface ProposalFormProps {
  proposal?: Proposal;
  onSubmit: () => void;
}

export function ProposalForm({ proposal, onSubmit }: ProposalFormProps) {
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      ...proposal,
      dateDigitized: proposal?.dateDigitized ? new Date(proposal.dateDigitized) : new Date(),
    } as any,
  });

  function handleFormSubmit(data: ProposalFormValues) {
    console.log(data);
    toast({
      title: 'Proposta Salva!',
      description: 'A nova proposta foi salva com sucesso.',
    });
    onSubmit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 py-4">
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <div className="space-y-4">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {proposalStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="table"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Tabela</FormLabel>
                    <FormControl>
                    <Input placeholder="Tabela A" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Prazo (meses)</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="84" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>

          <FormField
            control={form.control}
            name="approvingBody"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Órgão Aprovador</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione o órgão" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {approvingBodies.map((body) => (
                        <SelectItem key={body} value={body}>
                            {body}
                        </SelectItem>
                        ))}
                         <SelectItem value="Outro">Outro (especificar)</SelectItem>
                    </SelectContent>
                    </Select>
                    {form.watch('approvingBody') === 'Outro' && (
                        <FormControl className="mt-2">
                             <Input placeholder="Especifique o órgão" {...field} />
                        </FormControl>
                    )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="grossAmount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Bruto</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="30000" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="netAmount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Líquido</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="25000" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="installmentAmount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Parcela</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="450.50" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="commissionValue"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Comissão</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="1500" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="commissionPercentage"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Comissão (%)</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="promoter"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Promotora</FormLabel>
                    <FormControl>
                    <Input placeholder="Promotora X" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Banco</FormLabel>
                    <FormControl>
                    <Input placeholder="Banco A" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>

          <FormField
            control={form.control}
            name="dateDigitized"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Digitação</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button type="submit">Salvar Proposta</Button>
        </div>
      </form>
    </Form>
  );
}
