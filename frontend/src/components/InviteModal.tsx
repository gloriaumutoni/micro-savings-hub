import { useState } from "react";
import { generateInvite } from "../services/api";

interface InviteModalProps {
  groupId: string;
  onClose: () => void;
}

export const InviteModal = ({ groupId, onClose }: InviteModalProps) => {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await generateInvite(groupId);
      setInviteUrl(`${window.location.origin}/join/${token}`);
    } catch {
      setError("Failed to generate invite link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Invite Members</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {!inviteUrl ? (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Generate a one-time invite link to share with someone. The link expires in 7 days and
              can only be used once.
            </p>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? "Generating…" : "Generate link"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Share this link. It expires in 7 days and works once.
            </p>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-5">
              <span className="text-xs text-gray-600 truncate flex-1 font-mono">{inviteUrl}</span>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-green-600 hover:text-green-700 whitespace-nowrap"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};
