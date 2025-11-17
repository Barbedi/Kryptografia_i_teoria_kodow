use napi_derive::napi;
use num_bigint::{BigUint, RandBigInt};
use num_traits::{One, Zero};
use rand::thread_rng;


fn mod_pow(mut base: BigUint, mut exp: BigUint, modulus: &BigUint) -> BigUint {
    let mut result = BigUint::one();
    base %= modulus;

    while exp > BigUint::zero() {
        if (&exp & BigUint::one()) == BigUint::one() {
            result = (&result * &base) % modulus;
        }
        exp >>= 1;
        base = (&base * &base) % modulus;
    }
    result
}

fn miller_rabin(n: &BigUint, k: usize) -> bool {
    if n <= &BigUint::from(3u32) {
        return true;
    }
    if n % 2u32 == BigUint::zero() {
        return false;
    }

    let mut d = n - 1u32;
    let mut r = 0;

    while &d % 2u32 == BigUint::zero() {
        d >>= 1;
        r += 1;
    }

    let mut rng = thread_rng();

    'outer: for _ in 0..k {
        let a = rng.gen_biguint_range(&BigUint::from(2u32), &(n - 2u32));
        let mut x = mod_pow(a.clone(), d.clone(), n);

        if x == BigUint::one() || x == (n - 1u32) {
            continue;
        }

        for _ in 0..r - 1 {
            x = mod_pow(x.clone(), BigUint::from(2u32), n);
            if x == n - 1u32 {
                continue 'outer;
            }
        }
        return false;
    }

    true
}

pub fn generate_prime(bits: usize) -> BigUint {
    let mut rng = thread_rng();

    loop {
        let mut p = rng.gen_biguint(bits as u64);
        p.set_bit((bits - 1) as u64, true);
        p |= BigUint::one();

        if miller_rabin(&p, 20) {
            return p;
        }
    }
}

pub fn generate_p_and_q() -> (BigUint, BigUint) {
    let p = generate_prime(512);
    let mut q = generate_prime(512);

    while p == q {
        q = generate_prime(512);
    }

    (p, q)
}

fn gcd(mut a: BigUint, mut b: BigUint) -> BigUint {
    while b != BigUint::zero() {
        let temp = b.clone();
        b = a % b;
        a = temp;
    }
    a
}

pub fn choose_e(phi: &BigUint) -> BigUint {
    let e = BigUint::from(65537u32);

    if gcd(e.clone(), phi.clone()) == BigUint::one() {
        return e;
    }
    let mut candidate = BigUint::from(3u32);

    while gcd(candidate.clone(), phi.clone()) != BigUint::one() {
        candidate += 2u32;
    }

    candidate
}

fn mod_inverse(e: &BigUint, phi: &BigUint) -> BigUint {
    let mut t = BigUint::zero();
    let mut new_t = BigUint::one();
    let mut r = phi.clone();
    let mut new_r = e.clone();

    while new_r != BigUint::zero() {
        let quotient = &r / &new_r;
        let temp_t = new_t.clone();
        let product = &quotient * &new_t;
        new_t = if t >= product {
            t - product
        } else {
            phi - (product - t) % phi
        };
        t = temp_t;

        let temp_r = new_r.clone();
        new_r = r - &quotient * &new_r;
        r = temp_r;
    }

    if r > BigUint::one() {
        panic!("Brak modularnej odwrotności — e i φ(n) nie są względnie pierwsze!");
    }

    t % phi
}
#[napi]
pub fn generate_rsa_keys() -> RsaKeyPair {
    let (p, q) = generate_p_and_q();

    let n = &p * &q;
    let phi = (&p - 1u32) * (&q - 1u32);

    let e = choose_e(&phi);
    let d = mod_inverse(&e, &phi);

    RsaKeyPair { n: n.to_string(), e: e.to_string(), d: d.to_string() }
}


#[napi(object)]
pub struct RsaKeyPair {
    pub n: String,
    pub e: String,
    pub d: String,
}

#[napi]
pub fn rsa_encrypt(message: String, n: String, e: String) -> String {
    let n_big = BigUint::parse_bytes(n.as_bytes(), 10).expect("Nieprawidłowy klucz publiczny n");
    let e_big = BigUint::parse_bytes(e.as_bytes(), 10).expect("Nieprawidłowy klucz publiczny e");

    let message_bytes = message.as_bytes();
    let mut encrypted_blocks = Vec::new();

    for &byte in message_bytes {
        let m = BigUint::from(byte);
        let c = mod_pow(m, e_big.clone(), &n_big);
        encrypted_blocks.push(c.to_string());
    }

    encrypted_blocks.join(",")
}

#[napi]
pub fn rsa_decrypt(cipher: String, n: String, d: String) -> String {
    let n_big = BigUint::parse_bytes(n.as_bytes(), 10).expect("Nieprawidłowy klucz prywatny n");
    let d_big = BigUint::parse_bytes(d.as_bytes(), 10).expect("Nieprawidłowy klucz prywatny d");

    let encrypted_blocks: Vec<&str> = cipher.split(',').collect();
    let mut decrypted_bytes = Vec::new();

    for block in encrypted_blocks {
        if block.is_empty() {
            continue;
        }
        let c = BigUint::parse_bytes(block.as_bytes(), 10).expect("Nieprawidłowy zaszyfrowany blok");
        let m = mod_pow(c, d_big.clone(), &n_big);
        let byte_vec = m.to_bytes_be();
        if let Some(&byte) = byte_vec.last() {
            decrypted_bytes.push(byte);
        }
    }

    String::from_utf8_lossy(&decrypted_bytes).to_string()
}


