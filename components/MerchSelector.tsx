'use client';

/**
 * Merch Selector Component
 */

import { useState } from 'react';
import { MERCH_OPTIONS, BUNDLE_OPTION, PRICING } from '@/lib/constants';
import { encryptShippingInfo, validateShippingInfo, type ShippingInfo } from '@/lib/encryption';

interface MerchSelectorProps {
  onSubmit: (data: {
    itemsSelected: string;
    encryptedShippingInfo: string;
    isBundle: boolean;
  }) => void;
  loading?: boolean;
}

export function MerchSelector({ onSubmit, loading }: MerchSelectorProps) {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [isBundle, setIsBundle] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    // Validate selection
    if (!isBundle && !selectedItem) {
      setErrors(['Please select at least one item']);
      return;
    }

    // Validate shipping info
    const validation = validateShippingInfo(shippingInfo);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setErrors([]);
      
      // Encrypt shipping info
      const encrypted = await encryptShippingInfo(shippingInfo);

      // Submit
      onSubmit({
        itemsSelected: isBundle ? BUNDLE_OPTION.id : selectedItem,
        encryptedShippingInfo: encrypted,
        isBundle,
      });
    } catch (err) {
      setErrors(['Failed to process shipping information']);
    }
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center">Select Your Merch</h2>

      {/* Bundle Option */}
      <div
        onClick={() => setIsBundle(!isBundle)}
        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
          isBundle
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-200 hover:border-purple-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{BUNDLE_OPTION.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{BUNDLE_OPTION.name}</h3>
              <p className="text-sm text-gray-600">Get all 4 items!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-purple-600">
              +{PRICING.BUNDLE_UPGRADE / 1_000_000} SUI
            </div>
            <div className="text-xs text-gray-500">Upgrade</div>
          </div>
        </div>
      </div>

      {/* Individual Items */}
      {!isBundle && (
        <div className="grid grid-cols-2 gap-4">
          {MERCH_OPTIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedItem === item.id
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-green-600 mt-1">Included</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipping Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Shipping Information</h3>
        
        <input
          type="text"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <textarea
          placeholder="Complete Address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 h-24"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((error, i) => (
            <div key={i} className="text-red-600 text-sm">• {error}</div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 text-white font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
        style={{ background: 'linear-gradient(to right, #9333ea, #ec4899)' }}
      >
        {loading ? 'Processing...' : `Confirm & Mint (${isBundle ? '30' : '20'} SUI)`}
      </button>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        🔒 Your shipping information is encrypted and only accessible by Kapogian admin
      </p>
    </div>
  );
}