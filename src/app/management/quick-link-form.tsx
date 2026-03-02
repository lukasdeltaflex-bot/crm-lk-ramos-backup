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
import { Loader2, Save, Globe, ExternalLink } from 'lucide-react';

const linkSchema = z.object({
  name: z.string().min(2, 'O nome do atalho é obrigatório.'),
  url: z.string().url('URL inválida.'),
});

type LinkFormValues = z.infer<typeof linkSchema>;

interface QuickLinkFormProps {
  initialData?: any;
  onSubmit: (data: LinkFormValues) => void;
  isSaving?: boolean;
}

export function QuickLinkForm({ initialData, onSubmit, isSaving = false }: QuickLinkFormProps) {
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: initialData || {
      name: '',
      url: '',
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
              <FormLabel>Nome do Atalho *</FormLabel>
              <FormControl><Input placeholder="Ex: Portal do INSS" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> URL Destino *</FormLabel>
              <FormControl><Input placeholder="https://..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSaving} className="rounded-full px-8 h-12 font-black uppercase text-xs tracking-widest shadow-xl">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...</> : <><Save className="mr-2 h-4 w-4" /> Adicionar Link</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}