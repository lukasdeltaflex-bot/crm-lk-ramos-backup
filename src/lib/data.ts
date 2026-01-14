import type { Customer, Proposal, ProductType, ProposalStatus } from './types';

export const customers: Customer[] = [
  { id: '1', name: 'João da Silva', cpf: '111.222.333-44', benefit: '123456789-0', phone: '(11) 98765-4321', email: 'joao.silva@example.com', dateOfBirth: '1955-03-15' },
  { id: '2', name: 'Maria Oliveira', cpf: '222.333.444-55', benefit: '234567890-1', phone: '(21) 91234-5678', email: 'maria.oliveira@example.com', dateOfBirth: '1949-11-20' },
  { id: '3', name: 'Carlos Pereira', cpf: '333.444.555-66', benefit: '345678901-2', phone: '(31) 95555-4444', email: 'carlos.pereira@example.com', dateOfBirth: '1960-07-01' },
  { id: '4', name: 'Ana Costa', cpf: '444.555.666-77', benefit: '456789012-3', phone: '(41) 98888-7777', email: 'ana.costa@example.com', dateOfBirth: '1952-01-30' },
  { id: '5', name: 'Pedro Martins', cpf: '555.666.777-88', benefit: '567890123-4', phone: '(51) 97777-6666', email: 'pedro.martins@example.com', dateOfBirth: '1949-08-10' },
  { id: '6', name: 'Sandra Santos', cpf: '666.777.888-99', benefit: '678901234-5', phone: '(61) 96666-5555', email: 'sandra.santos@example.com', dateOfBirth: '1968-12-05' },
  { id: '7', name: 'Bruno Lima', cpf: '777.888.999-00', benefit: '789012345-6', phone: '(71) 95432-1098', email: 'bruno.lima@example.com', dateOfBirth: '1970-02-25' },
  { id: '8', name: 'Lúcia Ferreira', cpf: '888.999.000-11', benefit: '890123456-7', phone: '(81) 99876-5432', email: 'lucia.ferreira@example.com', dateOfBirth: '1958-09-18' },
  { id: '9', name: 'Ricardo Almeida', cpf: '999.000.111-22', benefit: '901234567-8', phone: '(91) 98765-1234', email: 'ricardo.almeida@example.com', dateOfBirth: '1963-05-22' },
  { id: '10', name: 'Fernanda Rocha', cpf: '000.111.222-33', benefit: '012345678-9', phone: '(11) 91111-2222', email: 'fernanda.rocha@example.com', dateOfBirth: '1954-10-12' },
];

const productTypes: ProductType[] = ['Margem', 'Margem CLT', 'Saque Complementar', 'Cartão - Plástico', 'Port', 'Refin Port', 'Refin', 'Saque FGTS'];
const proposalStatuses: ProposalStatus[] = ['Em Andamento', 'Pago', 'Aguardando Saldo', 'Rejeitado', 'Saldo Pago', 'Pendente'];


export const proposals: Proposal[] = [
  {
    id: 'p1', proposalNumber: 'PRO123456', customerId: '1', product: 'Margem', table: 'Tabela A', term: 84,
    installmentAmount: 350.50, netAmount: 15000, grossAmount: 29442, status: 'Pago', commissionValue: 750,
    commissionPaid: true, commissionPercentage: 5, promoter: 'Promotora X', bank: 'Banco A', dateDigitized: '2023-01-10', dateApproved: '2023-01-12', datePaid: '2023-01-15', commissionPaymentDate: '2023-02-01'
  },
  {
    id: 'p2', proposalNumber: 'PRO123457', customerId: '2', product: 'Port', table: 'Tabela B', term: 72,
    installmentAmount: 500.00, netAmount: 20000, grossAmount: 36000, status: 'Pendente', commissionValue: 1200,
    commissionPaid: false, commissionPercentage: 6, promoter: 'Promotora Y', bank: 'Banco B', dateDigitized: '2023-02-05', dateApproved: '2023-02-10'
  },
  {
    id: 'p3', proposalNumber: 'PRO123458', customerId: '3', product: 'Refin', table: 'Tabela C', term: 84,
    installmentAmount: 200.00, netAmount: 8000, grossAmount: 16800, status: 'Em Andamento', commissionValue: 400,
    commissionPaid: false, commissionPercentage: 5, promoter: 'Promotora Z', bank: 'Banco C', dateDigitized: '2023-03-01'
  },
  {
    id: 'p4', proposalNumber: 'PRO123459', customerId: '4', product: 'Cartão - Plástico', table: 'Cartão Benefício', term: 1,
    installmentAmount: 0, netAmount: 1500, grossAmount: 1500, status: 'Rejeitado', commissionValue: 50,
    commissionPaid: false, commissionPercentage: 3.33, promoter: 'Promotora X', bank: 'Banco D', dateDigitized: '2023-03-15'
  },
  {
    id: 'p5', proposalNumber: 'PRO123460', customerId: '5', product: 'Saque Complementar', table: 'Saque RMC', term: 1,
    installmentAmount: 0, netAmount: 2500, grossAmount: 2500, status: 'Saldo Pago', commissionValue: 125,
    commissionPaid: true, commissionPercentage: 5, promoter: 'Promotora Y', bank: 'Banco E', dateDigitized: '2023-04-02', dateApproved: '2023-04-03', datePaid: '2023-04-05', commissionPaymentDate: '2023-05-01'
  },
  {
    id: 'p6', proposalNumber: 'PRO123461', customerId: '6', product: 'Refin Port', table: 'Tabela D', term: 84,
    installmentAmount: 450.75, netAmount: 18000, grossAmount: 37863, status: 'Aguardando Saldo', commissionValue: 900,
    commissionPaid: false, commissionPercentage: 5, promoter: 'Promotora Z', bank: 'Banco A', dateDigitized: '2023-04-20'
  },
  {
    id: 'p7', proposalNumber: 'PRO123462', customerId: '1', product: 'Refin', table: 'Tabela A', term: 84,
    installmentAmount: 150.00, netAmount: 5000, grossAmount: 12600, status: 'Pago', commissionValue: 250,
    commissionPaid: true, commissionPercentage: 5, promoter: 'Promotora X', bank: 'Banco B', dateDigitized: '2023-05-10', dateApproved: '2023-05-12', datePaid: '2023-05-16', commissionPaymentDate: '2023-06-01'
  },
  {
    id: 'p8', proposalNumber: 'PRO123463', customerId: '7', product: 'Margem', table: 'Tabela F', term: 84,
    installmentAmount: 1000.00, netAmount: 40000, grossAmount: 84000, status: 'Pendente', commissionValue: 2000,
    commissionPaid: false, commissionPercentage: 5, promoter: 'Promotora Y', bank: 'Banco C', dateDigitized: '2023-05-25', dateApproved: '2023-05-28'
  },
  {
    id: 'p9', proposalNumber: 'PRO123464', customerId: '8', product: 'Port', table: 'Tabela B', term: 60,
    installmentAmount: 800.00, netAmount: 30000, grossAmount: 48000, status: 'Em Andamento', commissionValue: 1800,
    commissionPaid: false, commissionPercentage: 6, promoter: 'Promotora Z', bank: 'Banco D', dateDigitized: '2023-06-01'
  },
  {
    id: 'p10', proposalNumber: 'PRO123465', customerId: '9', product: 'Margem', table: 'Tabela G', term: 84,
    installmentAmount: 650.00, netAmount: 25000, grossAmount: 54600, status: 'Saldo Pago', commissionValue: 1250,
    commissionPaid: true, commissionPercentage: 5, promoter: 'Promotora X', bank: 'Banco E', dateDigitized: '2023-06-10', dateApproved: '2023-06-12', datePaid: '2023-06-15', commissionPaymentDate: '2023-07-01'
  },
  {
    id: 'p11', proposalNumber: 'PRO123466', customerId: '10', product: 'Refin Port', table: 'Tabela E', term: 84,
    installmentAmount: 300.00, netAmount: 12000, grossAmount: 25200, status: 'Pendente', commissionValue: 600,
    commissionPaid: false, commissionPercentage: 5, promoter: 'Promotora Y', bank: 'Banco A', dateDigitized: '2023-07-02', dateApproved: '2023-07-05'
  },
  {
    id: 'p12', proposalNumber: 'PRO123467', customerId: '2', product: 'Cartão - Plástico', table: 'Cartão Benefício', term: 1,
    installmentAmount: 0, netAmount: 1800, grossAmount: 1800, status: 'Saldo Pago', commissionValue: 90,
    commissionPaid: true, commissionPercentage: 5, promoter: 'Promotora Z', bank: 'Banco B', dateDigitized: '2023-07-20', dateApproved: '2023-07-21', datePaid: '2023-07-22', commissionPaymentDate: '2023-08-01'
  }
];

// Helper to get full customer object from proposal
export const getProposalsWithCustomerData = () => {
  return proposals.map(proposal => {
    const customer = customers.find(c => c.id === proposal.customerId);
    if (!customer) {
        throw new Error(`Cliente com id ${proposal.customerId} não encontrado para a proposta ${proposal.id}`);
    }
    return {
      ...proposal,
      customer,
    }
  });
};
