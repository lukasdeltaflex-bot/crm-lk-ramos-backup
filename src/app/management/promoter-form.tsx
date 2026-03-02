'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Building2, Phone, User as UserIcon } from 'lucide-react';
import { handlePhoneMask } from '@/lib/utils';

const promoterSchema = z.object({
  name: z.string().min(2, 'O nome da promotora é obrigatório.'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  observations: z.string().optional(),
});

type PromoterFormValues = z.infer<typeof promoterSchema>;

interface PromoterFormProps {
  initialData?: any;
  onSubmit: (data: PromoterFormValues) => void;
  isSaving?: boolean;
}

export function PromoterForm({ initialData, onSubmit, isSaving = false }: PromoterFormProps) {
  const form = useForm<PromoterFormValues>({
    resolver: zodResolver(promoterSchema),
    defaultValues: initialData || {
      name: '',
      contactName: '',
      phone: '',
      whatsapp: '',
      observations: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-primary" /> Nome da Promotora *</FormLabel>
              <FormControl><Input placeholder="Ex: Master Promotora" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><UserIcon className="h-3.5 w-3.5 text-primary" /> Pessoa de Contato</FormLabel>
              <FormControl><Input placeholder="Ex: Maria Clara (Gerente)" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> Telefone Fixo</FormLabel>
                    <FormControl><Input placeholder="(00) 0000-0000" {...field} onChange={(e) => field.onChange(handlePhoneMask(e.target.value))} /></FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-green-600" /> WhatsApp Direto</FormLabel>
                    <FormControl><Input placeholder="(00) 00000-0000" {...field} onChange={(e) => field.onChange(handlePhoneMask(e.target.value))} /></FormControl>
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anotações sobre a Promotora</FormLabel>
              <FormControl><Textarea placeholder="Prazos, taxas médias, horários de corte..." {...field} /></FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSaving} className="rounded-full px-8 h-12 font-black uppercase text-xs tracking-widest shadow-xl">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gravando...</> : <><Save className="mr-2 h-4 w-4" /> Salvar Cadastro</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}