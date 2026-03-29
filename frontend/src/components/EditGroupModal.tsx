import { useState } from "react";
import type { Group, UpdateGroupPayload } from "../types";
import { updateGroup } from "../services/api";

interface EditGroupModalProps {
  group: Group;
  onClose: () => void;
  onUpdated: (updated: Group) => void;
}

export const EditGroupModal = ({ group, onClose, onUpdated }: EditGroupModalProps) => {
  const [form, setForm] = useState<UpdateGroupPayload>({
    name: group.name,
    description: group.description ?? "",
    targetAmount: parseFloat(group.targetAmount),
    endDate: group.endDate ? group.endDate.slice(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setError("Group name is required.");
      return;
    }
    if (form.targetAmount !== undefined && form.targetAmount <= 0) {
      setError("Target amount must be a positive number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: UpdateGroupPayload = {
        name: form.name?.trim(),
        description: form.description?.trim() || undefined,
        targetAmount: form.targetAmount,
        endDate: form.endDate || undefined,
      };
      const updated = await updateGroup(group.id, payload);
      onUpdated(updated);
    } catch {
      setError("Failed to update group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Edit Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
            <input
              type="text"
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount ({group.currency}) *
            </label>
            <input
              type="number"
              min="1"
              value={form.targetAmount ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  targetAmount: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={form.endDate ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
