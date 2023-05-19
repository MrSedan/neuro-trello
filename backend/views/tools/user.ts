import * as crypto from "crypto";

export function validPassword(
    password: string,
    pass_hash: string,
    salt: string
): boolean {
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return hash === pass_hash;
}
