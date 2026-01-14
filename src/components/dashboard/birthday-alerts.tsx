
'use client';

import { customers } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BellRing, UserCheck } from 'lucide-react';
import { customerBirthdayAlert } from '@/ai/flows/customer-birthday-alert';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type AlertMessage = {
  customerName: string;
  alertMessage: string;
};

function BirthdayAlertItem({ alert }: { alert: AlertMessage }) {
  return (
    <Alert>
      <BellRing className="h-4 w-4" />
      <AlertTitle>{alert.customerName}</AlertTitle>
      <AlertDescription>{alert.alertMessage}</AlertDescription>
    </Alert>
  );
}

export function BirthdayAlerts() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const upcoming75 = customers.filter(c => getAge(c.dateOfBirth) >= 74);

  useEffect(() => {
    async function fetchAlerts() {
      if (upcoming75.length > 0) {
        const alertPromises = upcoming75.map(customer => 
          customerBirthdayAlert({
            customerName: customer.name,
            customerAge: 75,
          }).then(response => ({
            customerName: customer.name,
            alertMessage: response.alertMessage,
          }))
        );
        const results = await Promise.all(alertPromises);
        setAlerts(results);
      }
      setLoading(false);
    }
    fetchAlerts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Alertas de Aniversário (75 anos)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {upcoming75.map(c => (
              <div key={c.id} className="p-4 border rounded-lg">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          alerts.map((alert) => (
            <BirthdayAlertItem key={alert.customerName} alert={alert} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4">
             <UserCheck className="h-8 w-8 mb-2" />
            <p>Nenhum cliente próximo dos 75 anos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
