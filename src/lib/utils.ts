import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Checks if a phone number is likely a WhatsApp number.
 * Heuristic: checks if the number (after DDD) has 9 digits.
 * @param phone The phone number string, e.g., "(11) 98765-4321".
 * @returns True if it's likely a WhatsApp number.
 */
export function isWhatsApp(phone: string): boolean {
    if (!phone) return false;
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has 11 digits (DDD + 9 digits for mobile)
    return digitsOnly.length === 11;
}

/**
 * Generates a WhatsApp click-to-chat URL.
 * @param phone The phone number string.
 * @returns The WhatsApp URL.
 */
export function getWhatsAppUrl(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, '');
    // Assumes country code is Brazil (55)
    return `https://wa.me/55${digitsOnly}`;
}
