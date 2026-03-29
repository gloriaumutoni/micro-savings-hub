import { useEffect, useState } from "react";
import type { Group } from "../types";
import { fetchGroups } from "../services/api";
import { GroupCard } from "../components/GroupCard";
import { CreateGroupModal } from "../components/CreateGroupModal";
import { UserMenu } from "../components/UserMenu";

export const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch {
      setError("Could not load groups. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">AfrikaSave</h1>
              <p className="text-xs text-gray-400">Community Savings Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreate(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm"
            >
              + New Group
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Savings Groups</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? "Loading…" : `${groups.length} group${groups.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-36"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-500 font-medium">No savings groups yet.</p>
            <p className="text-gray-400 text-sm mt-1">Create your first group to get started.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-5 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
            >
              Create Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadGroups();
          }}
        />
      )}
    </div>
  );
};
