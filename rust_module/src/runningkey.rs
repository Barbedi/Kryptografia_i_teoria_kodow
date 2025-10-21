use napi_derive::napi;

#[napi]
pub fn encrypt_running_key(text: String, key: String) -> String {
    running_key(text, key, false)
}

#[napi]
pub fn decrypt_running_key(text: String, key: String) -> String {
    running_key(text, key, true)
}

fn running_key(text: String, key: String, decrypt: bool) -> String {
    let key_bytes: Vec<u8> = key
        .to_ascii_lowercase()
        .bytes()
        .filter(|b| b.is_ascii_lowercase())
        .map(|b| b - b'a')
        .collect();

    if key.is_empty() {
        return text;
    }    

    let text_letters_count = text.chars().filter(|c| c.is_ascii_alphabetic()).count();

    if key_bytes.len() < text_letters_count {
        return format!(
            "Klucz za krótki (tekst ma {} liter, klucz tylko {}).",
            text_letters_count, key_bytes.len()
        );
    }

    let mut i = 0usize;
    let result: String = text
        .chars()
        .map(|c| {
            if c.is_ascii_alphabetic() {
                let k = key_bytes[i % key_bytes.len()];
                i += 1;

                let base = if c.is_ascii_lowercase() { b'a' } else { b'A' };
                let shift = if decrypt { (26u8 - k) % 26 } else { k };
                let rotated = ((c as u8 - base + shift) % 26) + base;
                rotated as char
            } else {
                c
            }
        })
        .collect();

    result
}
