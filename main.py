import struct
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

# Constants
MAX_USER_ITEMS = 6
AES_KEY_SIZE = 32
AES_NONCE_SIZE = 12
TAG_SIZE = 16
SALT_SIZE = 16


def encrypt(items):
    if len(items) > MAX_USER_ITEMS:
        raise ValueError("Too many items")
    total_size = sum(
        len(message.encode()) + AES_NONCE_SIZE + TAG_SIZE + 4
        for message in items.values()
    )

    # Create buffer of calculated size with random padding
    buffer = bytearray(total_size + SALT_SIZE)
    buffer[:SALT_SIZE] = get_random_bytes(SALT_SIZE)

    offset = SALT_SIZE

    for password, message in items.items():
        # Derive encryption key from password
        salt = buffer[:SALT_SIZE]
        key = PBKDF2(password, salt, AES_KEY_SIZE, count=1000000)

        # Generate a random nonce for each item
        nonce = get_random_bytes(AES_NONCE_SIZE)

        # Encrypt item
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        ciphertext, tag = cipher.encrypt_and_digest(message.encode())

        # Store encrypted item and nonce in buffer
        message_size = len(message.encode())
        struct.pack_into("<I", buffer, offset, message_size)
        offset += 4
        buffer[offset : offset + AES_NONCE_SIZE] = nonce
        offset += AES_NONCE_SIZE
        buffer[offset : offset + len(ciphertext)] = ciphertext
        offset += len(ciphertext)
        buffer[offset : offset + TAG_SIZE] = tag
        offset += TAG_SIZE

    return buffer


def decrypt(password, encrypted_data):
    salt = encrypted_data[:SALT_SIZE]
    key = PBKDF2(password, salt, AES_KEY_SIZE, count=1000000)

    offset = SALT_SIZE

    while offset < len(encrypted_data):
        message_size = struct.unpack_from("<I", encrypted_data, offset)[0]
        offset += 4

        # Check if offset is at the end of encrypted data
        if offset >= len(encrypted_data):
            break

        nonce = encrypted_data[offset : offset + AES_NONCE_SIZE]
        offset += AES_NONCE_SIZE
        ciphertext = encrypted_data[offset : offset + message_size]
        offset += message_size
        tag = encrypted_data[offset : offset + TAG_SIZE]
        offset += TAG_SIZE

        # Attempt decryption
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        try:
            plaintext = cipher.decrypt_and_verify(ciphertext, tag)
            return plaintext.decode()
        except ValueError as e:
            print("Decryption Error:", e)
            continue

    return None


items = {"password1": "Data1", "password2": "Data2", "password3": "Data3"}
encrypted_data = encrypt(items)
print("Encrypted Data:", encrypted_data.hex())

# Debugging the decryption process
print("Salt:", encrypted_data[:SALT_SIZE].hex())
print("Encrypted Data Length:", len(encrypted_data))
decrypted_data = decrypt("password3", encrypted_data)
print("Decrypted Data:", decrypted_data)


def main():
    # Accept ciphertext and password as input
    ciphertext_hex = input("Enter ciphertext in hexadecimal format: ")
    password = input("Enter password: ")

    # Convert ciphertext from hexadecimal string to bytes
    ciphertext = bytes.fromhex(ciphertext_hex)

    # Decrypt data
    decrypted_data = decrypt(
        password,
        ciphertext,
    )

    # Print decrypted data
    if decrypted_data:
        print("Decrypted Data:", decrypted_data)
    else:
        print("No data decrypted.")


main()
