use napi_derive::napi;
use base64::{engine::general_purpose, Engine as _};
use crate::aes_tables::{S_BOX, INV_S_BOX, RCON};
use crate::aes_rounds::*;

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

    let input_bytes = if decrypt {
        general_purpose::STANDARD.decode(&text).expect("Nieprawidłowy format base64")
    } else {
        text.as_bytes().to_vec()
    };

    let mut padded_bytes = input_bytes;
    if !decrypt {
        while padded_bytes.len() % 16 != 0 {
            padded_bytes.push((16 - (padded_bytes.len() % 16)) as u8);
        }
    }

    let mut output = Vec::new();
    for chunk in padded_bytes.chunks(16) {
        let mut block = [0u8; 16];
        block.copy_from_slice(chunk);
        let processed_block = aes_block(block, &expanded_keys, decrypt);
        output.extend_from_slice(&processed_block);
    }

    if decrypt {
        if let Some(&pad_len) = output.last() {
            if pad_len as usize <= 16 && output.len() >= pad_len as usize {
                output.truncate(output.len() - pad_len as usize);
            }
        }
        String::from_utf8_lossy(&output).to_string()
    } else {
        general_purpose::STANDARD.encode(&output)
    }
}

fn aes_block(block: [u8; 16], round_keys: &[[[u8; 4]; 4]; 11], decrypt: bool) -> [u8; 16] {
    let mut state = [[0u8; 4]; 4];

    for i in 0..16 {
        state[i % 4][i / 4] = block[i];
    }

    if decrypt {
        add_round_key(&mut state, &round_keys[10]);

        for round in (1..10).rev() {
            inv_shift_rows(&mut state);
            inv_sub_bytes(&mut state);
            add_round_key(&mut state, &round_keys[round]);
            inv_mix_columns(&mut state);
        }

        inv_shift_rows(&mut state);
        inv_sub_bytes(&mut state);
        add_round_key(&mut state, &round_keys[0]);
    } else {
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
    }

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

