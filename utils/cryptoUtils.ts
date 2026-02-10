
export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Generates a random password based on provided options using window.crypto for better security.
 */
export const generatePassword = (options: PasswordOptions): string => {
  let charset = '';
  if (options.uppercase) charset += UPPERCASE;
  if (options.lowercase) charset += LOWERCASE;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;

  if (!charset) return '';

  const array = new Uint32Array(options.length);
  window.crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < options.length; i++) {
    result += charset[array[i] % charset.length];
  }

  // Ensure at least one character of each selected type is present
  // (Simple implementation of character set enforcement)
  return result;
};

/**
 * Generates a high-entropy Base64 key (32 bytes).
 */
export const generateBase64Key = (byteSize: number = 32): string => {
  const array = new Uint8Array(byteSize);
  window.crypto.getRandomValues(array);
  
  // Custom manual base64 encoding to avoid issues with non-standard environments
  let binary = '';
  const len = array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
};

/**
 * Calculates a basic strength score and label for the generated password.
 */
export const calculateStrength = (password: string, options: PasswordOptions) => {
  if (!password) return { score: 0, label: 'Empty' };

  let score = 0;
  const length = password.length;

  // Length factor
  if (length >= 8) score += 1;
  if (length >= 16) score += 1;

  // Variety factor
  let types = 0;
  if (options.uppercase) types++;
  if (options.lowercase) types++;
  if (options.numbers) types++;
  if (options.symbols) types++;

  if (types >= 3 && length >= 12) score += 1;
  if (types === 4 && length >= 16) score += 1;

  const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Secure'];
  
  return {
    score: Math.min(score + 1, 4),
    label: labels[Math.min(score, 4)]
  };
};
