
import type { Customer, Proposal, ProductType, ProposalStatus, CommissionStatus } from './types';

export const customers: Omit<Customer, 'userId'>[] = [
  // This data is now managed in Firestore. This is kept for reference or fallback if needed.
];

export const proposals: Proposal[] = [
  // This data is now managed in Firestore. This is kept for reference or fallback if needed.
];

// This function is no longer the primary source of data.
// Data will be fetched from Firestore and joined in the component.
export const getProposalsWithCustomerData = () => {
  return proposals.map(proposal => {
    const customer = customers.find(c => c.id === proposal.customerId);
    // In a real app, you'd fetch this from a database.
    // If a customer is not found, we should handle it gracefully.
    const customerData = customer || { id: proposal.customerId, name: 'Cliente Desconhecido', cpf: '', phone: '', email: '', birthDate: '', observations: '', userId: '' };
    return {
      ...proposal,
      customer: customerData,
    }
  });
};
