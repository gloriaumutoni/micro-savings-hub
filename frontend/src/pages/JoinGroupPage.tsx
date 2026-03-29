import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinViaInvite } from "../services/api";

type Status = "joining" | "success" | "error";

const ERROR_MESSAGES: Record<number, string> = {
  404: "This invite link is invalid.",
  409: "You are already a member of this group.",
  410: "This invite link has expired or already been used.",
};

export const JoinGroupPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("joining");
  const [groupId, setGroupId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");

  useEffect(() => {
    if (!token) return;
    joinViaInvite(token)
      .then(({ groupId }) => {
        setGroupId(groupId);
        setStatus("success");
      })
      .catch((err) => {
        const code: number = err?.response?.status ?? 0;
        setErrorMsg(ERROR_MESSAGES[code] ?? "Something went wrong.");
        setStatus("error");
      });
  }, [token]);

  if (status === "joining") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl">🌿</span>
          <p className="text-gray-400 mt-4 animate-pulse">Joining group…</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <span className="text-5xl">🎉</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">You're in!</h2>
          <p className="text-sm text-gray-400 mt-2">
            You have successfully joined the savings group.
          </p>
          <button
            onClick={() => navigate(groupId ? `/groups/${groupId}` : "/")}
            className="mt-6 w-full bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 transition"
          >
            View group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
        <span className="text-5xl">😕</span>
        <h2 className="text-xl font-bold text-gray-900 mt-4">Couldn't join group</h2>
        <p className="text-sm text-gray-400 mt-2">{errorMsg}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 transition"
        >
          Go to my groups
        </button>
      </div>
    </div>
  );
};
