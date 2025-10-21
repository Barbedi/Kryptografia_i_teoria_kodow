use napi_derive::napi;

#[napi]
pub fn encrypt_cezar(text: String, shift: u8) -> String {
    cezar(text, shift, false)
}

#[napi]
pub fn decrypt_cezar(text: String, shift: u8) -> String {
    cezar(text, shift, true)
}

fn cezar(text: String, shift: u8, decrypt: bool) -> String {
    let shift = if decrypt { 26 - (shift % 26) } else { shift % 26 };

    text.chars()
        .map(|c| {
            if c.is_ascii_alphabetic() {
                let base = if c.is_ascii_lowercase() { b'a' } else { b'A' };
                (((c as u8 - base + shift) % 26) + base) as char
            } else {
                c
            }
        })
        .collect()
}
