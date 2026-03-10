import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * 🔒 PÁGINA DE PRIVACIDADE (SERVER COMPONENT)
 * Renderização otimizada no servidor para máxima estabilidade no App Hosting.
 */
export default function PrivacyPage() {
  return (
    <AppLayout>
      <PageHeader title="Política de Privacidade" />
      <Card className="border-2">
        <CardContent className="pt-6">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <h3 className="text-lg font-bold text-foreground">1. Proteção de Dados (LGPD)</h3>
              <p>A LK RAMOS está em total conformidade com a Lei Geral de Proteção de Dados (LGPD). Os dados de clientes inseridos no sistema são tratados com o mais alto nível de segurança e confidencialidade.</p>
              
              <h3 className="text-lg font-bold text-foreground">2. Coleta de Informações</h3>
              <p>Coletamos apenas os dados estritamente necessários para a operacionalização de propostas bancárias, como CPF, Nome, Dados de Benefício e Contato.</p>
              
              <h3 className="text-lg font-bold text-foreground">3. Armazenamento e Segurança</h3>
              <p>Todos os dados são armazenados de forma criptografada nos servidores do Firebase (Google Cloud), garantindo proteção contra acessos não autorizados.</p>
              
              <h3 className="text-lg font-bold text-foreground">4. Compartilhamento</h3>
              <p>Não compartilhamos, vendemos ou alugamos dados de usuários ou de seus clientes para terceiros sob nenhuma circunstância, exceto quando necessário para a finalização de propostas junto a bancos oficiais.</p>
              
              <h3 className="text-lg font-bold text-foreground">5. Seus Direitos</h3>
              <p>O usuário proprietário da conta tem o direito de exportar, anonimizar ou excluir qualquer dado inserido no sistema a qualquer momento através das ferramentas de gestão disponíveis na plataforma.</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </AppLayout>
  );
}