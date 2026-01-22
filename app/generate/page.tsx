'use client';

/**
 * Generate Page - Complete Flow: Generate → Preview → Select Merch → Mint
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CharacterGenerator } from '@/components/CharacterGenerator';
import { MerchSelector } from '@/components/MerchSelector';
import { WalletButton } from '@/components/WalletButton';
import { uploadCharacterToIPFS } from '@/lib/pinata';
import { mintCharacterNFT } from '@/lib/sui';
import { ENCRYPTION_CONFIG } from '@/lib/constants';

type Step = 'generate' | 'preview' | 'merch' | 'minting' | 'success';

interface CharacterData {
  imageBlob: Blob;
  name: string;
  description: string;
  attributes: any;
  imageUrl?: string;
  previewUrl?: string;
}

export default function GeneratePage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [step, setStep] = useState<Step>('generate');
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Redirect if not connected
  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #dbeafe 100%)' }}>
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Required</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to continue</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  const handleGenerated = (imageBlob: Blob, metadata: any) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(imageBlob);
    
    setCharacter({
      imageBlob,
      name: metadata.name,
      description: metadata.description,
      attributes: metadata.attributes,
      previewUrl,
    });
    
    setStep('preview');
  };

  const handleContinueToMerch = () => {
    setStep('merch');
  };

  const handleMint = async (merchData: {
    itemsSelected: string;
    encryptedShippingInfo: string;
    isBundle: boolean;
  }) => {
    if (!character) return;

    try {
      setStep('minting');
      setError('');

      console.log('🚀 Starting mint process...');

      // Step 1: Upload to IPFS
      console.log('📤 Uploading to IPFS...');
      const { imageUrl } = await uploadCharacterToIPFS(character.imageBlob, {
        name: character.name,
        description: character.description,
        attributes: character.attributes,
      });

      console.log('✅ IPFS upload complete:', imageUrl);

      // Step 2: Mint NFT on SUI
      console.log('⛓️ Minting on SUI blockchain...');
      const result = await mintCharacterNFT({
        name: character.name,
        description: character.description,
        imageUrl,
        attributes: JSON.stringify(character.attributes),
        itemsSelected: merchData.itemsSelected,
        encryptedShippingInfo: merchData.encryptedShippingInfo,
        encryptionPubkey: ENCRYPTION_CONFIG.adminPublicKey,
        signAndExecute,
      });

      console.log('✅ Mint successful!', result);
      
      setTxHash(result.digest);
      setStep('success');
    } catch (err: any) {
      console.error('❌ Mint failed:', err);
      setError(err.message || 'Failed to mint NFT. Please try again.');
      setStep('merch');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #dbeafe 100%)' }}>
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center bg-white bg-opacity-50 backdrop-blur-sm">
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back to Home
        </button>
        <WalletButton />
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {['Generate', 'Preview', 'Merch', 'Mint'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    ['generate', 'preview', 'merch', 'minting'].indexOf(step) >= i
                      ? 'text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  style={
                    ['generate', 'preview', 'merch', 'minting'].indexOf(step) >= i
                      ? { background: 'linear-gradient(to right, #9333ea, #ec4899)' }
                      : {}
                  }
                >
                  {i + 1}
                </div>
                <span className="ml-2 text-sm font-medium">{label}</span>
                {i < 3 && <div className="w-12 h-1 bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Generate */}
          {step === 'generate' && (
            <CharacterGenerator onGenerated={handleGenerated} />
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && character && (
            <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
              <h2 className="text-3xl font-bold text-center">Your Character</h2>
              
              {character.previewUrl && (
                <img
                  src={character.previewUrl}
                  alt={character.name}
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                />
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{character.name}</h3>
                <p className="text-gray-600 mb-4">{character.description}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('generate')}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                >
                  ← Regenerate
                </button>
                <button
                  onClick={handleContinueToMerch}
                  className="flex-1 py-4 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                  style={{ background: 'linear-gradient(to right, #9333ea, #ec4899)' }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Merch Selection */}
          {step === 'merch' && (
            <>
              <MerchSelector onSubmit={handleMint} loading={false} />
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                  {error}
                </div>
              )}
            </>
          )}

          {/* Step 4: Minting */}
          {step === 'minting' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="text-6xl mb-6 animate-bounce">⚡</div>
              <h2 className="text-2xl font-bold mb-4">Minting Your NFT...</h2>
              <p className="text-gray-600">
                Please wait while we upload to IPFS and mint on SUI blockchain
              </p>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold">Success!</h2>
              <p className="text-gray-600">
                Your character has been minted and your order receipt has been created!
              </p>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
                <p className="font-mono text-xs break-all">{txHash}</p>
              </div>

              <button
                onClick={() => router.push('/')}
                className="w-full py-4 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                style={{ background: 'linear-gradient(to right, #9333ea, #ec4899)' }}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}