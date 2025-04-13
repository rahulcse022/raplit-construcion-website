import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency in Indian rupee format
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the ₹ symbol
 * @returns Formatted currency string
 */
export function formatIndianCurrency(amount: number, showSymbol = true): string {
  // Convert to string and split on decimal
  const [wholePart, decimalPart] = amount.toString().split(".");
  
  // Add commas for Indian numbering system (1,23,456)
  let formattedWholePart = "";
  const digits = wholePart.split("");
  
  // Process digits from right to left
  for (let i = digits.length - 1, count = 0; i >= 0; i--, count++) {
    // Add comma after first 3 digits, then after every 2 digits
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      formattedWholePart = "," + formattedWholePart;
    }
    formattedWholePart = digits[i] + formattedWholePart;
  }
  
  // Combine with decimal part if exists
  const formattedAmount = decimalPart 
    ? `${formattedWholePart}.${decimalPart}` 
    : formattedWholePart;
  
  // Add symbol if requested
  return showSymbol ? `₹${formattedAmount}` : formattedAmount;
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Gets the file extension from a file path or URL
 * @param filePath - The file path or URL
 * @returns The file extension (without the dot)
 */
export function getFileExtension(filePath: string): string {
  return filePath.split(".").pop()?.toLowerCase() || "";
}

/**
 * Converts a string to title case
 * @param str - The string to convert
 * @returns The string in title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

/**
 * Generates a random session ID
 * @returns A random session ID string
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Debounces a function
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns True if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number (basic validation)
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation for phone numbers
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}
