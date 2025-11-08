import crypto from "crypto";
function generateSecret(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

console.log(generateSecret(40));
