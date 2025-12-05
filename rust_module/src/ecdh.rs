use napi_derive::napi;
use rand_core::{OsRng, RngCore};
use base64::{engine::general_purpose, Engine as _};
use sha2::{Sha256, Digest};
use x25519_dalek::{x25519, X25519_BASEPOINT_BYTES};

fn decode32(b64: &str) -> [u8; 32] {
    let bytes = general_purpose::STANDARD
        .decode(b64)
        .expect("Nieprawidłowy format Base64");
    if bytes.len() != 32 {
        panic!("Oczekiwano 32 bajtów klucza");
    }
    let mut out = [0u8; 32];
    out.copy_from_slice(&bytes);
    out
}

#[napi]
pub fn ecdh_generate_private_key() -> String {
    let mut private_key = [0u8; 32];
    OsRng.fill_bytes(&mut private_key);

    private_key[0] &= 248;
    private_key[31] &= 127;
    private_key[31] |= 64;
    general_purpose::STANDARD.encode(private_key)
}


#[napi]
pub fn ecdh_get_public_key(private_key_b64: String) -> String {
    let private_key = decode32(&private_key_b64);
    
    let public_key_bytes = x25519(private_key, X25519_BASEPOINT_BYTES);

    general_purpose::STANDARD.encode(public_key_bytes)
}


#[napi]
pub fn ecdh_compute_shared_secret(
    my_private_key_b64: String,
    peer_public_key_b64: String,
) -> String {
    let my_private_key = decode32(&my_private_key_b64);
    let peer_public_key = decode32(&peer_public_key_b64);
    
    let shared_secret = x25519(my_private_key, peer_public_key);

    general_purpose::STANDARD.encode(shared_secret)
}


#[napi]
pub fn ecdh_derive_key_sha256(shared_secret_b64: String) -> String {
    let secret_bytes = general_purpose::STANDARD
        .decode(shared_secret_b64)
        .expect("Nieprawidłowy sekret (Base64)");

    let mut hasher = Sha256::new();
    hasher.update(&secret_bytes);
    let hash = hasher.finalize();

 
    let mut out = String::with_capacity(hash.len() * 2);
    for b in hash {
        out.push_str(&format!("{:02x}", b));
    }
    out
}
