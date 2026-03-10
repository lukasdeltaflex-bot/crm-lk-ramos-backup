import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * 🔒 TERMOS DE USO (SERVER COMPONENT)
 * Renderização otimizada no servidor para máxima estabilidade no App Hosting.
 */
export default function TermsPage() {
  return (
    <AppLayout>
      <PageHeader title="Termos de Uso" />
      <Card className="border-2">
        <CardContent className="pt-6">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <h3 className="text-lg font-bold text-foreground">1. Aceitação dos Termos</h3>
              <p>Ao acessar o sistema LK RAMOS, você concorda em cumprir estes termos de serviço e todas as leis aplicáveis.</p>
              
              <h3 className="text-lg font-bold text-foreground">2. Propriedade Intelectual</h3>
              <p>O sistema LK RAMOS, incluindo seu código-fonte, design, logotipos e funcionalidades, é propriedade exclusiva de LK RAMOS e é protegido por leis de direitos autorais e propriedade intelectual brasileiras e internacionais.</p>
              
              <h3 className="text-lg font-bold text-foreground">3. Uso do Sistema</h3>
              <p>O uso deste sistema é restrito a usuários autorizados para fins de gestão de propostas bancárias. Qualquer tentativa de engenharia reversa, cópia de código ou uso não autorizado dos dados será processada judicialmente.</p>
              
              <h3 className="text-lg font-bold text-foreground">4. Responsabilidade</h3>
              <p>A LK RAMOS não se responsabiliza por erros decorrentes do preenchimento incorreto de dados por parte do usuário ou por instabilidades em serviços de terceiros (bancos e promotoras).</p>
              
              <h3 className="text-lg font-bold text-foreground">5. Alterações</h3>
              <p>Reservamo-nos o direito de modificar estes termos a qualquer momento, visando a melhoria contínua da segurança e do serviço prestado.</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
