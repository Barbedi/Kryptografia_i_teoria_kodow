use crate::aes_tables::{S_BOX, INV_S_BOX};


pub fn add_round_key(state: &mut [[u8; 4]; 4], round_key: &[[u8; 4]; 4]) {
    for r in 0..4 {
        for c in 0..4 {
            state[r][c] ^= round_key[r][c];
        }
    }
}

pub fn sub_bytes(state: &mut [[u8; 4]; 4]) {
    for r in 0..4 {
        for c in 0..4 {
            state[r][c] = S_BOX[state[r][c] as usize];
        }
    }
}

pub fn shift_rows(state: &mut [[u8; 4]; 4]) {
    for r in 1..4 {
        state[r].rotate_left(r);
    }
}

pub fn mix_columns(state: &mut [[u8; 4]; 4]) {
    for c in 0..4 {
        let col = [state[0][c], state[1][c], state[2][c], state[3][c]];
        state[0][c] = gf_mul(col[0], 2) ^ gf_mul(col[1], 3) ^ col[2] ^ col[3];
        state[1][c] = col[0] ^ gf_mul(col[1], 2) ^ gf_mul(col[2], 3) ^ col[3];
        state[2][c] = col[0] ^ col[1] ^ gf_mul(col[2], 2) ^ gf_mul(col[3], 3);
        state[3][c] = gf_mul(col[0], 3) ^ col[1] ^ col[2] ^ gf_mul(col[3], 2);
    }
}

pub fn gf_mul(mut a: u8, mut b: u8) -> u8 {
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

pub fn rot_word(word: [u8; 4]) -> [u8; 4] {
    [word[1], word[2], word[3], word[0]]
}

pub fn sub_word(word: [u8; 4]) -> [u8; 4] {
    [
        S_BOX[word[0] as usize],
        S_BOX[word[1] as usize],
        S_BOX[word[2] as usize],
        S_BOX[word[3] as usize],
    ]
}

pub fn inv_sub_bytes(state: &mut [[u8; 4]; 4]) {
    for r in 0..4 {
        for c in 0..4 {
            state[r][c] = INV_S_BOX[state[r][c] as usize];
        }
    }
}

pub fn inv_shift_rows(state: &mut [[u8; 4]; 4]) {
    for r in 1..4 {
        state[r].rotate_right(r);
    }
}

pub fn inv_mix_columns(state: &mut [[u8; 4]; 4]) {
    for c in 0..4 {
        let col = [state[0][c], state[1][c], state[2][c], state[3][c]];
        state[0][c] = gf_mul(col[0], 0x0e) ^ gf_mul(col[1], 0x0b) ^ gf_mul(col[2], 0x0d) ^ gf_mul(col[3], 0x09);
        state[1][c] = gf_mul(col[0], 0x09) ^ gf_mul(col[1], 0x0e) ^ gf_mul(col[2], 0x0b) ^ gf_mul(col[3], 0x0d);
        state[2][c] = gf_mul(col[0], 0x0d) ^ gf_mul(col[1], 0x09) ^ gf_mul(col[2], 0x0e) ^ gf_mul(col[3], 0x0b);
        state[3][c] = gf_mul(col[0], 0x0b) ^ gf_mul(col[1], 0x0d) ^ gf_mul(col[2], 0x09) ^ gf_mul(col[3], 0x0e);
    }
}