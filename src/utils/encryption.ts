
// Key generation 
const generateKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
};

// Export key to base64 string
const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exported);
};

// Import key from base64 string
const importKey = async (base64Key: string): Promise<CryptoKey> => {
  const keyData = base64ToArrayBuffer(base64Key);
  return await window.crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "AES-GCM",
      length: 256,
    },
    false, // extractable
    ["encrypt", "decrypt"]
  );
};

// Encrypt data
export const encryptData = async (data: any): Promise<{ encrypted: string; keyString: string }> => {
  const key = await generateKey();
  const keyString = await exportKey(key);
  
  // Convert data to JSON string
  const jsonString = JSON.stringify(data);
  const encodedData = new TextEncoder().encode(jsonString);
  
  // Create initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedData
  );
  
  // Combine IV and encrypted data
  const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
  combinedData.set(iv);
  combinedData.set(new Uint8Array(encryptedData), iv.length);
  
  // Convert to base64 for URL-safe storage
  return {
    encrypted: arrayBufferToBase64(combinedData),
    keyString,
  };
};

// Decrypt data
export const decryptData = async (encryptedBase64: string, keyString: string): Promise<any> => {
  try {
    // Import the key
    const key = await importKey(keyString);
    
    // Convert base64 back to array buffer
    const encryptedData = base64ToArrayBuffer(encryptedBase64);
    
    // Extract IV from the beginning
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);
    
    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );
    
    // Parse the decrypted JSON string
    const decodedText = new TextDecoder().decode(decrypted);
    return JSON.parse(decodedText);
  } catch (error) {
    console.error("Failed to decrypt:", error);
    throw new Error("Failed to decrypt the message. It may be corrupted or tampered with.");
  }
};

// Parse URL hash to extract encrypted data and key
export const parseUrlHash = (hash: string): { data: string; key: string } | null => {
  if (!hash || hash.length < 2) return null; // No hash or just '#'
  
  // Remove the # at the beginning
  const hashContent = hash.substring(1);
  
  try {
    // Split by delimiter
    const parts = hashContent.split('.');
    if (parts.length !== 2) return null;
    
    return {
      data: parts[0],
      key: parts[1],
    };
  } catch (error) {
    console.error("Failed to parse URL hash:", error);
    return null;
  }
};

// Create URL hash from encrypted data and key
export const createUrlHash = (encryptedData: string, key: string): string => {
  return `#${encryptedData}.${key}`;
};

// Helper Functions
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')  // Convert '+' to '-'
    .replace(/\//g, '_')  // Convert '/' to '_'
    .replace(/=+$/, '');  // Remove trailing '='
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  // Convert URL-safe base64 back to regular base64
  const safeB64 = base64
    .replace(/-/g, '+')  // Convert '-' back to '+'
    .replace(/_/g, '/'); // Convert '_' back to '/'
  
  // Add padding if needed
  const paddedB64 = safeB64.padEnd(safeB64.length + (4 - safeB64.length % 4) % 4, '=');
  
  const binary = window.atob(paddedB64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};
