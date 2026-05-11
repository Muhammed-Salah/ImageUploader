import { createHash } from "crypto";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export const ADMIN_USERNAME = "mhmpattikkad";
// This is the SHA-256 hash of "MHM@786"
export const ADMIN_PASSWORD_HASH = "7c5bd1fd7b8ef92ecb0b4628cfd14e819db316b4c7073270d3f519111266e34a";

export function verifyPassword(password: string): boolean {
  return hashPassword(password) === ADMIN_PASSWORD_HASH;
}
