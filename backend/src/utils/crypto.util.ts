import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'leadpilot_super_secret_encryption_key_32bytes!!';

// Ensure key length is exactly 32 bytes
const getKey = (): Buffer => {
  return crypto.scryptSync(SECRET_KEY, 'salt', 32);
};

export const encryptToken = (text: string): string => {
  if (!text) return text;
  const iv = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decryptToken = (encryptedData: string): string => {
  if (!encryptedData || !encryptedData.includes(':')) return encryptedData;
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) return encryptedData;
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt token:', err);
    return encryptedData;
  }
};
