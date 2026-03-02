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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Loader2, Save, ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';

const newsSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.'),
  subtitle: z.string().optional(),
  content: z.string().min(10, 'O conteúdo deve ser mais detalhado.'),
  coverUrl: z.string().optional(),
  status: z.enum(['Draft', 'Published']),
  date: z.string(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormProps {
  initialData?: any;
  onSubmit: (data: NewsFormValues) => void;
  isSaving?: boolean;
}

export function NewsForm({ initialData, onSubmit, isSaving = false }: NewsFormProps) {
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialData || {
      title: '',
      subtitle: '',
      content: '',
      coverUrl: '',
      status: 'Draft',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Notícia *</FormLabel>
                <FormControl><Input placeholder="Ex: Novo reajuste do INSS para 2025" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtítulo (Opcional)</FormLabel>
                <FormControl><Input placeholder="Breve resumo para o card" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Situação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger className="font-bold">
                            <SelectValue />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Draft">Rascunho</SelectItem>
                        <SelectItem value="Published">Publicado</SelectItem>
                    </SelectContent>
                    </Select>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Data de Publicação</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                </FormItem>
                )}
            />
          </div>

          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem de Capa</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-2">
                        <Input placeholder="https://..." {...field} />
                        <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {field.value ? <img src={field.value} className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 opacity-20" />}
                        </div>
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo Completo *</FormLabel>
                <FormControl>
                    <Textarea 
                        placeholder="Escreva a notícia aqui..." 
                        className="min-h-[300px] font-serif leading-relaxed text-base p-6" 
                        {...field} 
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSaving} className="rounded-full px-8 h-12 font-black uppercase text-xs tracking-widest shadow-xl">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="mr-2 h-4 w-4" /> Salvar Notícia</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}