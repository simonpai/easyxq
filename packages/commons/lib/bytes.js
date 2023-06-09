const inBrowser = typeof window !== 'undefined';

export const btoa = inBrowser ? window.btoa : str => Buffer.from(str, 'binary').toString('base64');
export const atob = inBrowser ? window.atob : str => Buffer.from(str, 'base64').toString('binary');

export function arrayBufferToBase64(buffer) {
  let binary = '';
  for (const byte of new Uint8Array(buffer)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(string) {
  const binary = atob(string);
  const len = binary.length;
  const array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    array.fill(binary.charCodeAt(i), i, i + 1);
  }
  return array.buffer;
}
