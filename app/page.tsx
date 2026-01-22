'use client';

import Link from 'next/link';
import { WalletButton } from '@/components/WalletButton';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ADMIN_ADDRESS } from '@/lib/constants';

export default function HomePage() {
  const account = useCurrentAccount();
  const isAdmin = account?.address === ADMIN_ADDRESS;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #dbeafe 100%)' }}>
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center bg-white bg-opacity-50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold" style={{ 
          background: 'linear-gradient(to right, #9333ea, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Kapogian NFT
        </h1>
        <div className="flex items-center gap-4">
          {/* Admin Button - Only visible to admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🔐 Admin Panel
            </Link>
          )}
          <WalletButton />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-6xl font-bold mb-6" style={{
          background: 'linear-gradient(to right, #9333ea, #ec4899, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Generate Your Unique Character
        </h2>
        
        <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
          Create 1-of-1 AI-generated characters, mint them as NFTs on SUI, 
          and receive exclusive physical merchandise!
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center items-center">
          {account ? (
            <Link
              href="/generate"
              className="px-8 py-4 text-white font-bold rounded-xl text-lg transition-all hover:scale-105 shadow-lg"
              style={{ background: 'linear-gradient(to right, #9333ea, #ec4899)' }}
            >
              ✨ Start Creating
            </Link>
          ) : (
            <div className="text-gray-600">
              👆 Connect your wallet to get started
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-bold text-xl mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Generate unique characters using advanced AI technology
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="font-bold text-xl mb-2">Physical Merch</h3>
            <p className="text-gray-600">
              Get exclusive merchandise with every NFT minted
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="font-bold text-xl mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your shipping data is encrypted on-chain
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-20 bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Pricing</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">NFT + 1 Merch Item</span>
              <span className="font-bold text-2xl text-purple-600">20 SUI</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Upgrade to All 4 Items</span>
              <span className="font-bold text-2xl text-pink-600">+10 SUI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}