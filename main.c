#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/err.h>
#include <openssl/sha.h>

#define MAX_USER_ITEMS 6
#define AES_KEY_SIZE 32
#define AES_NONCE_SIZE 12
#define TAG_SIZE 16
#define SALT_SIZE 16

void handleErrors(void) {
    ERR_print_errors_fp(stderr);
    abort();
}

void derive_key(const char *password, const unsigned char *salt, unsigned char *key) {
    if (PKCS5_PBKDF2_HMAC(password, strlen(password), salt, SALT_SIZE, 1000000, EVP_sha256(), AES_KEY_SIZE, key) != 1) {
        handleErrors();
    }
}

int encrypt(const char *passwords[], const char *messages[], size_t num_items, unsigned char *buffer, size_t *buffer_len) {
    unsigned char salt[SALT_SIZE];
    unsigned char key[AES_KEY_SIZE];
    unsigned char nonce[AES_NONCE_SIZE];
    unsigned char tag[TAG_SIZE];
    int len, ciphertext_len;
    unsigned char *ciphertext;

    if (num_items > MAX_USER_ITEMS) {
        fprintf(stderr, "Too many items\n");
        return 0;
    }

    if (!RAND_bytes(salt, sizeof(salt))) handleErrors();
    memcpy(buffer, salt, SALT_SIZE);

    size_t offset = SALT_SIZE;

    for (size_t i = 0; i < num_items; i++) {
        derive_key(passwords[i], salt, key);

        if (!RAND_bytes(nonce, sizeof(nonce))) handleErrors();
        memcpy(buffer + offset, nonce, AES_NONCE_SIZE);
        offset += AES_NONCE_SIZE;

        EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
        if (!ctx) handleErrors();

        if (1 != EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL)) handleErrors();
        if (1 != EVP_EncryptInit_ex(ctx, NULL, NULL, key, nonce)) handleErrors();

        ciphertext = buffer + offset + 4;

        if (1 != EVP_EncryptUpdate(ctx, ciphertext, &len, (unsigned char *)messages[i], strlen(messages[i]))) handleErrors();
        ciphertext_len = len;

        if (1 != EVP_EncryptFinal_ex(ctx, ciphertext + len, &len)) handleErrors();
        ciphertext_len += len;

        if (1 != EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, TAG_SIZE, tag)) handleErrors();
        memcpy(buffer + offset + 4 + ciphertext_len, tag, TAG_SIZE);

        EVP_CIPHER_CTX_free(ctx);

        *((uint32_t *)(buffer + offset)) = ciphertext_len;
        offset += 4 + ciphertext_len + TAG_SIZE;
    }

    *buffer_len = offset;
    return 1;
}

int decrypt(const char *password, const unsigned char *buffer, size_t buffer_len, char *plaintext) {
    unsigned char salt[SALT_SIZE];
    unsigned char key[AES_KEY_SIZE];
    unsigned char nonce[AES_NONCE_SIZE];
    unsigned char tag[TAG_SIZE];
    unsigned char *ciphertext;
    int len, plaintext_len, ciphertext_len;
    size_t offset = SALT_SIZE;

    memcpy(salt, buffer, SALT_SIZE);
    derive_key(password, salt, key);

    while (offset < buffer_len) {
        memcpy(nonce, buffer + offset, AES_NONCE_SIZE);
        offset += AES_NONCE_SIZE;

        ciphertext_len = *((uint32_t *)(buffer + offset));
        offset += 4;

        ciphertext = (unsigned char *)(buffer + offset);
        offset += ciphertext_len;

        memcpy(tag, buffer + offset, TAG_SIZE);
        offset += TAG_SIZE;

        EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
        if (!ctx) handleErrors();

        if (1 != EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL)) handleErrors();
        if (1 != EVP_DecryptInit_ex(ctx, NULL, NULL, key, nonce)) handleErrors();
        if (1 != EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, TAG_SIZE, tag)) handleErrors();

        if (1 != EVP_DecryptUpdate(ctx, (unsigned char *)plaintext, &len, ciphertext, ciphertext_len)) handleErrors();
        plaintext_len = len;

        int ret = EVP_DecryptFinal_ex(ctx, (unsigned char *)plaintext + len, &len);
        EVP_CIPHER_CTX_free(ctx);

        if (ret > 0) {
            plaintext_len += len;
            plaintext[plaintext_len] = '\0';
            return 1;
        }
    }

    return 0;
}

int main() {
    char *items[MAX_USER_ITEMS] = {"Data1", "Data2", "Data3"};
    char *passwords[MAX_USER_ITEMS] = {"password1", "password2", "password3"};
    unsigned char encrypted_data[4096];
    size_t encrypted_data_len;
    char decrypted_data[256];

    if (!encrypt((const char **)passwords, (const char **)items, 3, encrypted_data, &encrypted_data_len)) {
        fprintf(stderr, "Encryption failed\n");
        return 1;
    }

    printf("Encrypted Data: ");
    for (size_t j = 0; j < encrypted_data_len; j++) {
        printf("%02x", encrypted_data[j]);
    }
    printf("\n");

    for (int i = 0; i < 3; i++) {
        if (decrypt(passwords[i], encrypted_data, encrypted_data_len, decrypted_data)) {
            printf("Decrypted Data with %s: %s\n", passwords[i], decrypted_data);
        } else {
            printf("Decryption failed for password %s\n", passwords[i]);
        }
    }

    return 0;
}
