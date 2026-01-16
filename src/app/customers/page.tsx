'use client';
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { CustomerDataTable } from './data-table';
import { getColumns } from './columns';
import { Button } from '@/components/ui/button';
import { PlusCircle, Sparkles, Trash2, FileDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CustomerForm } from './customer-form';
import type { Customer } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, where, updateDoc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { customers as sampleCustomers, proposals as sampleProposals } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CustomerAiForm } from '@/components/customers/customer-ai-form';
import type { ExtractCustomerDataOutput } from '@/ai/flows/extract-customer-data-flow';
import { format, parse } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CustomerFormData = Partial<Omit<Customer, 'id' | 'userId' | 'numericId'>>;

export default function CustomersPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);
  const [defaultValues, setDefaultValues] = React.useState<CustomerFormData | undefined>(undefined);
  const [sheetMode, setSheetMode] = React.useState<'new' | 'edit'>('new');
  const [rowSelection, setRowSelection] = React.useState({});

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: customers, isLoading, error } = useCollection<Customer>(customersQuery);

  React.useEffect(() => {
    const seedData = async () => {
      if (firestore && user && customers?.length === 0) {
        console.log("Seeding initial data...");
        const batch = writeBatch(firestore);
        
        const customerRefs = new Map<string, string>();
        
        sampleCustomers.forEach((customerData, index) => {
            const docRef = doc(collection(firestore, 'customers'));
            const newCustomer: Customer = {
              ...customerData,
              id: docRef.id,
              numericId: Date.now() + index,
              userId: user.uid,
            };
            batch.set(docRef, newCustomer);
            customerRefs.set(`customer_${index}`, docRef.id);
        });

        sampleProposals.forEach((proposalData, index) => {
            const docRef = doc(collection(firestore, 'loanProposals'));
            const customerId = customerRefs.get(`customer_${index % sampleCustomers.length}`);
            if (customerId) {
              const newProposal = {
                  ...proposalData,
                  id: docRef.id,
                  userId: user.uid,
                  proposalNumber: `PRO${Date.now() + index}`,
                  customerId: customerId,
              };
              batch.set(docRef, newProposal);
            }
        });

        try {
          await batch.commit();
          toast({
            title: "Dados de exemplo criados!",
            description: "Clientes e propostas de exemplo foram adicionados.",
          });
        } catch (error) {
          console.error("Error seeding data: ", error);
        }
      }
    };
    if (!isLoading && customers) {
        seedData();
    }
  }, [firestore, user, customers, isLoading]);


  const handleNewCustomer = () => {
    setSelectedCustomer(undefined);
    setDefaultValues(undefined);
    setSheetMode('new');
    setIsSheetOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDefaultValues(undefined);
    setSheetMode('edit');
    setIsSheetOpen(true);
  };

  const handleAiFormSubmit = (aiData: ExtractCustomerDataOutput) => {
    const prefilledData: CustomerFormData = {
        ...aiData,
        birthDate: aiData.birthDate, // Keep as YYYY-MM-DD string
    };
    setSelectedCustomer(undefined);
    setDefaultValues(prefilledData);
    setSheetMode('new');
    setIsAiModalOpen(false);
    setIsSheetOpen(true);
  }
  const nonAnonymizedCustomers = customers?.filter(c => c.name !== 'Cliente Removido') || [];

  const handleExportToExcel = async () => {
    const { utils, writeFile } = await import('xlsx');
    const selectedIds = Object.keys(rowSelection);
    const selectedCustomers = nonAnonymizedCustomers.filter(c => selectedIds.includes(c.id));

    if (selectedCustomers.length === 0) {
        toast({
            variant: "destructive",
            title: "Nenhum cliente selecionado",
            description: "Selecione os clientes que deseja exportar.",
        });
        return;
    }

    const dataToExport = selectedCustomers.map(c => ({
        'ID': c.numericId,
        'Nome': c.name,
        'CPF': c.cpf,
        'Telefone': c.phone,
        'Nascimento': c.birthDate ? format(parse(c.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '-',
        'Cidade': c.city,
        'Estado': c.state,
    }));

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Clientes');

    worksheet['!cols'] = [
        { wch: 10 }, // ID
        { wch: 30 }, // Nome
        { wch: 15 }, // CPF
        { wch: 15 }, // Telefone
        { wch: 12 }, // Nascimento
        { wch: 20 }, // Cidade
        { wch: 10 }, // Estado
    ];

    writeFile(workbook, 'clientes.xlsx');
};

const handleExportToPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const selectedIds = Object.keys(rowSelection);
    const selectedCustomers = nonAnonymizedCustomers.filter(c => selectedIds.includes(c.id));

    if (selectedCustomers.length === 0) {
        toast({
            variant: "destructive",
            title: "Nenhum cliente selecionado",
            description: "Selecione os clientes que deseja exportar.",
        });
        return;
    }

    const doc = new jsPDF();
    const tableColumns = ['ID', 'Nome', 'CPF', 'Telefone', 'Nascimento', 'Cidade'];
    const tableRows = selectedCustomers.map(c => [
        c.numericId,
        c.name,
        c.cpf,
        c.phone,
        c.birthDate ? format(parse(c.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '-',
        c.city,
    ]);

    doc.text("Relatório de Clientes", 14, 15);
    autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 20,
    });

    doc.save('clientes.pdf');
};


  const handleAnonymizeCustomer = async (customerId: string) => {
    if (!firestore) return;
    const customerRef = doc(firestore, 'customers', customerId);
    const anonymizedData: Partial<Customer> = {
      name: 'Cliente Removido',
      numericId: 0,
      cpf: '000.000.000-00',
      benefitNumber: '0000000000',
      phone: '(00) 00000-0000',
      phone2: '',
      email: 'removido@removido.com',
      observations: `Dados do cliente anonimizados em ${new Date().toISOString()}`,
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    };
    
    setRowSelection({});

    try {
        await updateDoc(customerRef, anonymizedData);
        toast({
          title: 'Cliente Removido',
          description: 'Os dados do cliente foram anonimizados com sucesso. O histórico de propostas foi mantido.',
        });
    } catch(error) {
        console.error('Error anonymizing customer:', error);
        toast({
            variant: 'destructive',
            title: 'Erro ao remover',
            description: 'Não foi possível anonimizar o cliente.',
        });
    }
  };

  const handleAnonymizeSelected = () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0 || !firestore) return;

    // Clear selection immediately for better UX
    setRowSelection({});
    
    const batch = writeBatch(firestore);
    const anonymizedData: Partial<Customer> = {
        name: 'Cliente Removido',
        numericId: 0,
        cpf: '000.000.000-00',
        benefitNumber: '0000000000',
        phone: '(00) 00000-0000',
        phone2: '',
        email: 'removido@removido.com',
        observations: `Dados do cliente anonimizados em ${new Date().toISOString()}`,
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      };

    selectedIds.forEach((id) => {
      const docRef = doc(firestore, 'customers', id);
      batch.update(docRef, anonymizedData);
    });

    try {
      batch.commit();
      toast({
        title: 'Clientes Removidos',
        description: `${selectedIds.length} cliente(s) foram anonimizados com sucesso.`,
      });
    } catch (error) {
      console.error('Error anonymizing customers:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover',
        description: 'Ocorreu um erro ao remover os clientes selecionados.',
      });
    }
  };

  const handleFormSubmit = async (data: Omit<Customer, 'id' | 'userId' | 'numericId'>) => {
    if (!firestore || !user) return;

    try {
      if (sheetMode === 'edit' && selectedCustomer) {
        const customerToUpdate: Customer = {
          ...selectedCustomer,
          ...data,
        };
        await setDoc(doc(firestore, 'customers', selectedCustomer.id), customerToUpdate, { merge: true });
        toast({
          title: 'Cliente Atualizado!',
          description: `O cliente ${data.name} foi atualizado com sucesso.`,
        });
  
      } else {
        const newDocRef = doc(collection(firestore, 'customers'));
        const newCustomerWithId: Customer = {
          ...data,
          id: newDocRef.id,
          numericId: Date.now(),
          userId: user.uid,
        };
        await setDoc(newDocRef, newCustomerWithId);
        toast({
          title: 'Cliente Salvo!',
          description: `O cliente ${data.name} foi salvo com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar os dados do cliente.',
      });
    }
    
    setIsSheetOpen(false);
  };

  const columns = React.useMemo(() => getColumns({ onEdit: handleEditCustomer, onDelete: handleAnonymizeCustomer }), []);

  const getSheetTitle = () => {
    if (sheetMode === 'edit') return 'Editar Cliente';
    return 'Novo Cliente';
  };
  
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <PageHeader title="Clientes" />
        <div className="flex items-center gap-2">
            {selectedCount > 0 && (
                 <>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 />
                                Remover ({selectedCount})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso irá anonimizar permanentemente {selectedCount} cliente(s). O histórico de propostas será mantido.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAnonymizeSelected}>Remover</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <FileDown />
                                Exportar ({selectedCount})
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportToExcel}>
                                Exportar para Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportToPdf}>
                                Exportar para PDF (.pdf)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Sparkles />
                        Novo Cliente com IA
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Assistente de Cadastro de Cliente</DialogTitle>
                    </DialogHeader>
                    <CustomerAiForm onSubmit={handleAiFormSubmit} />
                </DialogContent>
            </Dialog>
            <Button onClick={handleNewCustomer}>
                <PlusCircle />
                Novo Cliente
            </Button>
        </div>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full max-w-3xl sm:max-w-3xl">
          <SheetHeader>
            <SheetTitle>{getSheetTitle()}</SheetTitle>
          </SheetHeader>
          <CustomerForm
            onSubmit={handleFormSubmit}
            customer={selectedCustomer}
            defaultValues={defaultValues}
          />
        </SheetContent>
      </Sheet>
      <CustomerDataTable 
        columns={columns} 
        data={nonAnonymizedCustomers} 
        isLoading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
       />
    </AppLayout>
  );
}
