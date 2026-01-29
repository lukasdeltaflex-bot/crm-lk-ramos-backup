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

export function getAge(birthDate: string): number {
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return 0;
  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Checks if a phone number is likely a WhatsApp number.
 */
export function isWhatsApp(phone: string): boolean {
    if (!phone) return false;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 11;
}

/**
 * Generates a WhatsApp click-to-chat URL.
 */
export function getWhatsAppUrl(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, '');
    return `https://wa.me/55${digitsOnly}`;
}

/**
 * Validates a Brazilian CPF mathematically.
 */
export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // Block same digits sequences like 111...

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits.charAt(10))) return false;

  return true;
}

/**
 * Calculates the number of business days (Mon-Fri) between a start date and now.
 */
export function calculateBusinessDays(startDate: Date): number {
    let count = 0;
    const curDate = new Date(startDate);
    const now = new Date();
    curDate.setDate(curDate.getDate() + 1);
    curDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    while (curDate <= now) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}
