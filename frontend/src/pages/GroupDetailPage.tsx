import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Group } from "../types";
import { fetchGroup, closeGroup, leaveGroup, removeMember } from "../services/api";
import { useAuth } from "../context/useAuth";
import { ProgressBar } from "../components/ProgressBar";
import { ContributeModal } from "../components/ContributeModal";
import { EditGroupModal } from "../components/EditGroupModal";
import { InviteModal } from "../components/InviteModal";
import { UserMenu } from "../components/UserMenu";

const formatAmount = (amount: string | number, currency: string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return (
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(num) +
    " " +
    currency
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const GroupDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContribute, setShowContribute] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadGroup = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGroup(id);
      setGroup(data);
    } catch {
      setError("Group not found or the server is unreachable.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const handleClose = async () => {
    if (!group || !window.confirm("Close this group? No further contributions will be allowed."))
      return;
    setActionLoading(true);
    setActionError(null);
    try {
      await closeGroup(group.id);
      await loadGroup();
    } catch {
      setActionError("Failed to close the group.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!group || !window.confirm("Leave this group?")) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await leaveGroup(group.id);
      navigate("/");
    } catch {
      setActionError("Failed to leave the group.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!group || !window.confirm(`Remove ${memberEmail} from this group?`)) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await removeMember(group.id, memberId);
      await loadGroup();
    } catch {
      setActionError("Failed to remove member.");
    } finally {
      setActionLoading(false);
    }
  };

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
        <p className="text-red-500">{error ?? "Something went wrong."}</p>
        <button
          onClick={() => navigate("/")}
          className="text-green-600 text-sm font-medium hover:underline"
        >
          ← Back to groups
        </button>
      </div>
    );
  }

  const isOwner = group.userRole === "owner";
  const isClosed = group.status === "closed";
  const contributions = group.contributions ?? [];
  const members = group.members ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
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
          <UserMenu />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Group summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              {isClosed && (
                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                  Closed
                </span>
              )}
            </div>
            <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100 shrink-0">
              {group.currency}
            </span>
          </div>

          {group.description && <p className="text-sm text-gray-500 mb-4">{group.description}</p>}

          <div className="mt-4">
            <ProgressBar
              value={parseFloat(group.totalSaved)}
              target={parseFloat(group.targetAmount)}
              currency={group.currency}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>Created {formatDate(group.createdAt)}</span>
            {group.endDate && <span>Ends {formatDateShort(group.endDate)}</span>}
            <span className="capitalize">Your role: {group.userRole}</span>
          </div>

          {actionError && <p className="text-sm text-red-500 mt-3">{actionError}</p>}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            {!isClosed && (
              <button
                onClick={() => setShowContribute(true)}
                className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
              >
                + Record Contribution
              </button>
            )}
            {isOwner && !isClosed && (
              <>
                <button
                  onClick={() => setShowInvite(true)}
                  className="border border-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Invite member
                </button>
                <button
                  onClick={() => setShowEdit(true)}
                  className="border border-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleClose}
                  disabled={actionLoading}
                  className="border border-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
                >
                  Close group
                </button>
              </>
            )}
            {!isOwner && (
              <button
                onClick={handleLeave}
                disabled={actionLoading}
                className="border border-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
              >
                Leave group
              </button>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Members</h2>
            <span className="text-xs text-gray-400">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
          </div>

          {members.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No members found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {m.email}
                      {m.id === user?.id && (
                        <span className="ml-1.5 text-xs text-gray-400">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {m.role === "owner" ? "Owner" : "Member"} · Joined{" "}
                      {formatDateShort(m.joinedAt)}
                    </p>
                  </div>
                  {isOwner && m.role !== "owner" && !isClosed && (
                    <button
                      onClick={() => handleRemoveMember(m.id, m.email)}
                      disabled={actionLoading}
                      className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contribution history */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Contribution History</h2>
            <span className="text-xs text-gray-400">
              {contributions.length} record
              {contributions.length !== 1 ? "s" : ""}
            </span>
          </div>

          {contributions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No contributions yet.{" "}
              {!isClosed && (
                <button
                  onClick={() => setShowContribute(true)}
                  className="text-green-600 font-medium hover:underline"
                >
                  Record the first one.
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 text-left">Member</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contributions.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-800">{c.userEmail}</td>
                      <td className="px-5 py-3 text-right text-green-700 font-semibold">
                        + {formatAmount(c.amount, group.currency)}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-400">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {showEdit && group && (
        <EditGroupModal
          group={group}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            setGroup((g) => (g ? { ...g, ...updated } : g));
            setShowEdit(false);
          }}
        />
      )}

      {showInvite && group && (
        <InviteModal groupId={group.id} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
};
