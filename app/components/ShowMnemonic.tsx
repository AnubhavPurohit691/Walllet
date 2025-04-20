"use client";
import React, { useState } from 'react';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

function deriveSolanaWallet(mnemonic: string, index: number) {
  const seed = mnemonicToSeedSync(mnemonic);
  const path = `m/44'/501'/${index}'/0'`;
  const seedHex = seed.toString('hex');
  const { key } = derivePath(path, seedHex);
  const keypair = nacl.sign.keyPair.fromSeed(key);

  return {
    index,
    publicKey: bs58.encode(keypair.publicKey),
    secretKey: bs58.encode(keypair.secretKey),
  };
}

export default function ShowMnemonic({ mnemonic }: { mnemonic: string }) {
  const [show, setShow] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);

  const generateWallets = (mnemonic: string, count = 5) => {
    const generated: any[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(deriveSolanaWallet(mnemonic, i));
    }
    setWallets(generated);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-red-700">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="bg-blue-600  px-4 py-2 rounded hover:bg-blue-700"
      >
        {show ? 'Hide Mnemonic' : 'Show Mnemonic'}
      </button>

      {show && (
        <div className="mt-4">
          <p className="font-semibold">Mnemonic seed:</p>
          <p className="bg-gray-100 p-2 rounded break-words">{mnemonic}</p>

          <button
            onClick={() => generateWallets(mnemonic)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Generate Wallets
          </button>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Derived Wallets:</h2>
          {wallets.map((wallet) => (
            <div key={wallet.index} className="p-3 mb-3 border rounded bg-gray-50">
              <p><strong>Index:</strong> {wallet.index}</p>
              <p><strong>Public Key:</strong> {wallet.publicKey}</p>
              <p><strong>Secret Key:</strong> {wallet.secretKey}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
