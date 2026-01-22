
/**
 * Admin Encryption Keypair Generator
 * Run this ONCE to generate your admin keypair
 * 
 * Usage: node generate-keypair.js
 */

const EthCrypto = require('eth-crypto');

console.log('🔐 Generating Admin Encryption Keypair...\n');

// Generate keypair
const identity = EthCrypto.createIdentity();

console.log('✅ Keypair Generated!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 COPY THESE VALUES TO YOUR .env.local FILE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('# Admin Public Key (Frontend - SAFE to expose)');
console.log(`NEXT_PUBLIC_ADMIN_PUBLIC_KEY=${identity.publicKey}\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🔒 PRIVATE KEY (KEEP SECRET - Store securely!)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`ADMIN_PRIVATE_KEY=${identity.privateKey}\n`);

console.log('⚠️  SECURITY WARNINGS:');
console.log('1. NEVER commit the private key to Git');
console.log('2. Store private key in a password manager');
console.log('3. Only the admin needs the private key');
console.log('4. Public key goes in NEXT_PUBLIC_ env var (frontend)\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Copy the values above to your .env.local file');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');