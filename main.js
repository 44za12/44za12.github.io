const MAX_USER_ITEMS = 6;
const AES_KEY_SIZE = 256;
const AES_NONCE_SIZE = 12;
const TAG_SIZE = 16;
const SALT_SIZE = 16;

async function encrypt(items) {
  if (Object.keys(items).length > MAX_USER_ITEMS) {
    throw new Error("Too many items");
  }
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  let buffer = new Uint8Array([].concat(Array.from(salt)));
  console.log("Encrypting, initial buffer:", buffer);
  let offset = SALT_SIZE;

  for (let [password, message] of Object.entries(items)) {
    const keyMaterial = await getPasswordKey(password);
    const key = await deriveKey(keyMaterial, salt);
    const nonce = window.crypto.getRandomValues(new Uint8Array(AES_NONCE_SIZE));
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      encodedMessage
    );
    let dataToAppend = new Uint8Array(
      4 + AES_NONCE_SIZE + encryptedData.byteLength
    );
    new DataView(dataToAppend.buffer).setUint32(
      0,
      encryptedData.byteLength,
      true
    );
    dataToAppend.set(nonce, 4);
    dataToAppend.set(new Uint8Array(encryptedData), 4 + AES_NONCE_SIZE);
    buffer = concatTypedArrays(buffer, dataToAppend);
  }
  console.log("Final encrypted hex:", bufferToHex(buffer));
  return bufferToHex(buffer);
}

async function decrypt(password, encryptedHex) {
  const encryptedData = hexToBuffer(encryptedHex);
  console.log("Decrypting, hex input:", encryptedHex);
  console.log("Buffer from hex:", encryptedData);
  const salt = encryptedData.slice(0, SALT_SIZE);
  const keyMaterial = await getPasswordKey(password);
  const key = await deriveKey(keyMaterial, salt);

  let offset = SALT_SIZE;
  while (offset < encryptedData.length) {
    if (offset + 4 > encryptedData.length) break;
    const ciphertextLength = new DataView(
      encryptedData.buffer,
      encryptedData.byteOffset + offset,
      4
    ).getUint32(0, true);

    offset += 4;

    if (offset + ciphertextLength > encryptedData.length) {
      console.error("Ciphertext slice is out of bounds.");
      break;
    }

    if (offset + AES_NONCE_SIZE + ciphertextLength > encryptedData.length)
      break;
    const nonce = encryptedData.slice(offset, offset + AES_NONCE_SIZE);
    offset += AES_NONCE_SIZE;

    const ciphertext = encryptedData.slice(offset, offset + ciphertextLength);
    offset += ciphertextLength;

    try {
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: nonce },
        key,
        ciphertext
      );
      const decoder = new TextDecoder();
      console.log("Decrypted data:", decoder.decode(decryptedData));
      return decoder.decode(decryptedData);
    } catch (e) {
      console.error("Decryption error:", e);
      continue;
    }
  }

  return null;
}

async function getPasswordKey(password) {
  const encoder = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
}

async function deriveKey(keyMaterial, salt) {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 1000000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: AES_KEY_SIZE },
    false,
    ["encrypt", "decrypt"]
  );
}

function bufferToHex(buffer) {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function concatTypedArrays(a, b) {
  let c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

function hexToBuffer(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}
