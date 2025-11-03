use napi_derive::napi;
use base64::{engine::general_purpose, Engine as _};
use crate::aes_tables::{S_BOX, RCON}; // importujemy z crate, nie z local mod

#[napi]
pub fn encrypt_aes(text: String, key: String) -> String {
    aes_ecb(text, key, false)
}

#[napi]
pub fn decrypt_aes(text: String, key: String) -> String {
    aes_ecb(text, key, true)
}

fn aes_ecb(text: String, key: String, decrypt: bool) -> String {

    let key_bytes = key.as_bytes();
    assert_eq!(key_bytes.len(), 16, "Klucz AES musi mieć dokładnie 16 bajtów");

    let expanded_keys = key_expansion(key_bytes);

    let mut padded_bytes = text.as_bytes().to_vec();
    while padded_bytes.len() % 16 != 0 {
        padded_bytes.push((16 - (padded_bytes.len() % 16)) as u8);
    }

    let mut output = Vec::new();
    for chunk in padded_bytes.chunks(16) {
        let mut block = [0u8; 16];
        block.copy_from_slice(chunk);
        let encrypted_block = aes_block(block, &expanded_keys, decrypt);
        output.extend_from_slice(&encrypted_block);
    }

    general_purpose::STANDARD.encode(&output)
}

fn aes_block(block: [u8; 16], round_keys: &[[[u8; 4]; 4]; 11], _decrypt: bool) -> [u8; 16] {
    let mut state = [[0u8; 4]; 4];

    for i in 0..16 {
        state[i % 4][i / 4] = block[i];
    }

    add_round_key(&mut state, &round_keys[0]);

    for round in 1..10 {
        sub_bytes(&mut state);
        shift_rows(&mut state);
        mix_columns(&mut state);
        add_round_key(&mut state, &round_keys[round]);
    }

    sub_bytes(&mut state);
    shift_rows(&mut state);
    add_round_key(&mut state, &round_keys[10]);

    let mut result = [0u8; 16];
    for c in 0..4 {
        for r in 0..4 {
            result[c * 4 + r] = state[r][c];
        }
    }
    result
}

fn key_expansion(key: &[u8]) -> [[[u8; 4]; 4]; 11] {
    let mut round_keys = [[[0u8; 4]; 4]; 11];
    let mut w = [[0u8; 4]; 44];

    for i in 0..4 {
        w[i].copy_from_slice(&key[4 * i..4 * i + 4]);
    }

    for i in 4..44 {
        let mut temp = w[i - 1];
        if i % 4 == 0 {
            temp = sub_word(rot_word(temp));
            temp[0] ^= RCON[i / 4 - 1];
        }
        for j in 0..4 {
            w[i][j] = w[i - 4][j] ^ temp[j];
        }
    }

    for r in 0..11 {
        for c in 0..4 {
            for row in 0..4 {
                round_keys[r][row][c] = w[r * 4 + c][row];
            }
        }
    }

    round_keys
}

fn add_round_key(state: &mut [[u8; 4]; 4], round_key: &[[u8; 4]; 4]) {
    for r in 0..4 {
        for c in 0..4 {
            state[r][c] ^= round_key[r][c];
        }
    }
}

fn sub_bytes(state: &mut [[u8; 4]; 4]) {
    for r in 0..4 {
        for c in 0..4 {
            state[r][c] = S_BOX[state[r][c] as usize];
        }
    }
}

fn shift_rows(state: &mut [[u8; 4]; 4]) {
    for r in 1..4 {
        state[r].rotate_left(r);
    }
}

fn mix_columns(state: &mut [[u8; 4]; 4]) {
    for c in 0..4 {
        let col = [state[0][c], state[1][c], state[2][c], state[3][c]];
        state[0][c] = gf_mul(col[0], 2) ^ gf_mul(col[1], 3) ^ col[2] ^ col[3];
        state[1][c] = col[0] ^ gf_mul(col[1], 2) ^ gf_mul(col[2], 3) ^ col[3];
        state[2][c] = col[0] ^ col[1] ^ gf_mul(col[2], 2) ^ gf_mul(col[3], 3);
        state[3][c] = gf_mul(col[0], 3) ^ col[1] ^ col[2] ^ gf_mul(col[3], 2);
    }
}

fn gf_mul(mut a: u8, mut b: u8) -> u8 {
    let mut res = 0u8;
    for _ in 0..8 {
        if b & 1 != 0 {
            res ^= a;
        }
        let hi_bit = a & 0x80 != 0;
        a <<= 1;
        if hi_bit {
            a ^= 0x1B; 
        }
        b >>= 1;
    }
    res
}

fn rot_word(word: [u8; 4]) -> [u8; 4] {
    [word[1], word[2], word[3], word[0]]
}

fn sub_word(word: [u8; 4]) -> [u8; 4] {
    [
        S_BOX[word[0] as usize],
        S_BOX[word[1] as usize],
        S_BOX[word[2] as usize],
        S_BOX[word[3] as usize],
    ]
}

