use napi::bindgen_prelude::*;
use napi_derive::napi; // 👈 to dodajemy

#[napi]
pub fn hello_world() -> String {
    "Hello World z Rust!".to_string()
}
