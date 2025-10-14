use napi_derive::napi;

#[napi]
pub fn encrypt_cezar(text: String, shift: u8) -> String {
    cezar(&text, shift, false)
}

#[napi]
pub fn decrypt_cezar(text: String, shift: u8) -> String {
    cezar(&text, shift, true)
}

fn cezar(text: &str, shift: u8, decrypt: bool) -> String {
    let shift = if decrypt { 26 - (shift % 26) } else { shift % 26 };

    text.chars()
        .map(|c| match c {
            'a'..='z' => (((c as u8 - b'a' + shift) % 26) + b'a') as char,
            'A'..='Z' => (((c as u8 - b'A' + shift) % 26) + b'A') as char,
            _ => c,
        })
        .collect()
}
