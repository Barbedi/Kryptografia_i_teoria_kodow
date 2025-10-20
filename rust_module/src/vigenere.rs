use napi_derive::napi;

#[napi]
pub fn encrypt_vigenere(text: String, key: String) -> String {
    vigenere(text, key, false)
}

#[napi]
pub fn decrypt_vigenere(text: String, key: String) -> String {
    vigenere(text, key, true)
}

fn vigenere(text: String, key: String, decrypt: bool) -> String {
    let key: Vec<u8> = key
        .to_ascii_lowercase()
        .bytes()
        .filter(|b| b.is_ascii_lowercase())
        .map(|b| b - b'a')
        .collect();

    if key.is_empty() {
        return text;
    }

    let mut i = 0;
    text.chars()
        .map(|c| {
            if c.is_ascii_alphabetic() {
                let key = key[i % key.len()];
                i += 1;
                let s = if decrypt { 26 - key } else { key };
                let base = if c.is_ascii_lowercase() { b'a' } else { b'A' };
                (((c as u8 - base + s) % 26) + base) as char
            } else {
                c
            }
        })
        .collect()
}
