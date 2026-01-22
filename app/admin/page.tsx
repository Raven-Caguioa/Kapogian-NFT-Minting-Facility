'use client';

/**
 * Admin Dashboard - View and Decrypt Orders
 */

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { WalletButton } from '@/components/WalletButton';
import { getOwnedReceipts, markAsShipped } from '@/lib/sui';
import { decryptShippingInfo, type ShippingInfo } from '@/lib/encryption';
import { CONTRACT_ADDRESSES, ORDER_STATUS } from '@/lib/constants';

interface Receipt {
  objectId: string;
  nftId: string;
  buyer: string;
  itemsSelected: string;
  encryptedShippingInfo: string;
  status: number;
  paymentAmount: number;
  createdAt: number;
}

export default function AdminPage() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPrivateKey, setAdminPrivateKey] = useState('');
  const [decryptedOrders, setDecryptedOrders] = useState<{ [id: string]: ShippingInfo }>({});
  const [error, setError] = useState('');

  // Check if current wallet is admin
  const isAdmin = account?.address === CONTRACT_ADDRESSES.TREASURY_WALLET;

  useEffect(() => {
    if (isAdmin) {
      loadReceipts();
    }
  }, [isAdmin]);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      // In production, you'd query all receipts from the blockchain
      // For now, we'll use the admin wallet's receipts as a demo
      const owned = await getOwnedReceipts(CONTRACT_ADDRESSES.TREASURY_WALLET);
      
      // Parse receipt data
      const parsed = owned.map((obj: any) => ({
        objectId: obj.data.objectId,
        nftId: obj.data.content.fields.nft_id,
        buyer: obj.data.content.fields.buyer,
        itemsSelected: obj.data.content.fields.items_selected,
        encryptedShippingInfo: obj.data.content.fields.encrypted_shipping_info,
        status: obj.data.content.fields.status,
        paymentAmount: obj.data.content.fields.payment_amount,
        createdAt: obj.data.content.fields.created_at,
      }));

      setReceipts(parsed);
    } catch (err) {
      console.error('Failed to load receipts:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async (receiptId: string, encryptedData: string) => {
    if (!adminPrivateKey) {
      setError('Please enter your private key first');
      return;
    }

    try {
      const decrypted = await decryptShippingInfo(encryptedData, adminPrivateKey);
      setDecryptedOrders({ ...decryptedOrders, [receiptId]: decrypted });
      setError('');
    } catch (err) {
      setError('Failed to decrypt. Check your private key.');
    }
  };

  const handleMarkShipped = async (receiptObjectId: string) => {
    try {
      await markAsShipped({ receiptObjectId, signAndExecute });
      await loadReceipts();
      alert('Marked as shipped!');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <WalletButton />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to admin wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #dbeafe 100%)' }}>
      <nav className="p-6 flex justify-between items-center bg-white bg-opacity-50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <WalletButton />
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Private Key Input */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h3 className="font-bold mb-4">Admin Private Key (For Decryption)</h3>
          <input
            type="password"
            placeholder="Enter your private key to decrypt shipping info"
            value={adminPrivateKey}
            onChange={(e) => setAdminPrivateKey(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            🔒 Your private key is never sent to any server
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Orders ({receipts.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : receipts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {receipts.map((receipt) => (
                    <tr key={receipt.objectId}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono">
                          {receipt.nftId.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono">
                          {receipt.buyer.slice(0, 6)}...{receipt.buyer.slice(-4)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {receipt.itemsSelected}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            receipt.status === ORDER_STATUS.DELIVERED
                              ? 'bg-green-100 text-green-800'
                              : receipt.status === ORDER_STATUS.SHIPPED
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {receipt.status === ORDER_STATUS.DELIVERED
                            ? 'Delivered'
                            : receipt.status === ORDER_STATUS.SHIPPED
                            ? 'Shipped'
                            : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() =>
                            handleDecrypt(receipt.objectId, receipt.encryptedShippingInfo)
                          }
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                        >
                          Decrypt
                        </button>
                        {receipt.status === ORDER_STATUS.PENDING && (
                          <button
                            onClick={() => handleMarkShipped(receipt.objectId)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            Mark Shipped
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Decrypted Data Display */}
        {Object.keys(decryptedOrders).length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold mb-4">Decrypted Shipping Information</h3>
            {Object.entries(decryptedOrders).map(([id, info]) => (
              <div key={id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Name:</strong> {info.name}</p>
                <p><strong>Address:</strong> {info.address}</p>
                <p><strong>Phone:</strong> {info.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}