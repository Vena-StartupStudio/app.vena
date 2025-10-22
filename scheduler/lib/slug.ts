import crypto from "node:crypto";

export function slugify(input: string, maxLength = 40) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, maxLength);
}

export function randomToken(length = 40) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}
