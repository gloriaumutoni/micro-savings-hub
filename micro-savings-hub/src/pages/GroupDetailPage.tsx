import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Group } from '../types';
import { fetchGroup } from '../services/api';
import { ProgressBar } from '../components/ProgressBar';
import { ContributeModal } from '../components/ContributeModal';

const formatAmount = (amount: string | number, currency: string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (
    new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 0 }).format(num) +
    ' ' +
    currency
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContribute, setShowContribute] = useState(false);

  const loadGroup = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGroup(id);
      setGroup(data);
    } catch {
      setError('Group not found or the server is unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGroup(); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading group…</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error ?? 'Something went wrong.'}</p>
        <button
          onClick={() => navigate('/')}
          className="text-green-600 text-sm font-medium hover:underline"
        >
          ← Back to groups
        </button>
      </div>
    );
  }

  const contributions = group.contributions ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-700 text-sm font-medium transition"
          >
            ← Back
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="text-sm font-bold text-gray-900">AfrikaSave</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">
              {group.currency}
            </span>
          </div>
          {group.description && (
            <p className="text-sm text-gray-500 mb-4">{group.description}</p>
          )}

          <div className="mt-4">
            <ProgressBar
              value={parseFloat(group.total_saved)}
              target={parseFloat(group.target_amount)}
              currency={group.currency}
            />
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
            <span>Created {formatDate(group.created_at)}</span>
            <button
              onClick={() => setShowContribute(true)}
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              + Record Contribution
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Contribution History</h2>
            <span className="text-xs text-gray-400">{contributions.length} record{contributions.length !== 1 ? 's' : ''}</span>
          </div>

          {contributions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No contributions yet.{' '}
              <button
                onClick={() => setShowContribute(true)}
                className="text-green-600 font-medium hover:underline"
              >
                Record the first one.
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Member</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contributions.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.member_name}</td>
                    <td className="px-5 py-3 text-right text-green-700 font-semibold">
                      + {formatAmount(c.amount, group.currency)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showContribute && group && (
        <ContributeModal
          group={group}
          onClose={() => setShowContribute(false)}
          onContributed={() => {
            setShowContribute(false);
            loadGroup();
          }}
        />
      )}
    </div>
  );
};
