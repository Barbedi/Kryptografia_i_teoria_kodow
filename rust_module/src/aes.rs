fn aes(text: String, key: String, decrypt: bool) -> String {
    let bytes = text.as_bytes();
    let key_bytes = key.as_bytes();

    assert_eq!(bytes.len(), 16);
    assert_eq!(key_bytes.len(), 16);

    let mut macierz = [[0u8; 4]; 4];
    let mut klucz = [[0u8; 4]; 4];

    for i in 0..16 {
        macierz[i % 4][i / 4] = bytes[i];
        klucz[i % 4][i / 4] = key_bytes[i];
    }

    for round in 0..10 {
        // a) SubBytes
        for r in 0..4 {
            for c in 0..4 {
                macierz[r][c] = S_BOX[macierz[r][c] as usize];
            }
        }

        // b) ShiftRows
        for r in 1..4 {
            macierz[r].rotate_left(r);
        }

        // c) MixColumns (tylko dla rund 1–9)
        if round != 9 {
            mix_columns(&mut macierz);
        }

        // d) AddRoundKey (na razie ten sam klucz)
        for r in 0..4 {
            for c in 0..4 {
                macierz[r][c] ^= klucz[r][c];
            }
        }

    }
    .collect()

}
