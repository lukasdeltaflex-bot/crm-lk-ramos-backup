
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  productTypes,
  proposalStatuses,
  approvingBodies,
  banks,
  commissionStatuses,
} from '@/lib/config-data';
import { Badge } from '@/components/ui/badge';
import { ListChecks } from 'lucide-react';

function renderList(title: string, items: readonly string[]) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader title="Configurações" />
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <ListChecks className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
              <CardTitle>Gerenciamento de Opções</CardTitle>
              <CardDescription>
                Visualize as listas de opções usadas em todo o sistema. Em
                breve, você poderá editar, adicionar ou remover itens.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {renderList('Tipos de Produto', productTypes)}
            {renderList('Status da Proposta', proposalStatuses)}
            {renderList('Status da Comissão', commissionStatuses)}
            {renderList('Órgãos Aprovadores', approvingBodies)}
            {renderList('Bancos', banks)}
          </Accordion>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
