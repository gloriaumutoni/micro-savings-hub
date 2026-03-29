import { useNavigate } from "react-router-dom";
import type { Group } from "../types";
import { ProgressBar } from "./ProgressBar";

interface GroupCardProps {
  group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const navigate = useNavigate();
  const saved = parseFloat(group.totalSaved);
  const target = parseFloat(group.targetAmount);

  const formattedDate = new Date(group.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={() => navigate(`/groups/${group.id}`)}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-700 transition-colors truncate">
            {group.name}
          </h3>
          {group.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{group.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {group.status === "closed" && (
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              Closed
            </span>
          )}
          <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
            {group.currency}
          </span>
        </div>
      </div>

      <ProgressBar value={saved} target={target} currency={group.currency} />

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-400">Created {formattedDate}</p>
        {group.userRole === "owner" && (
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
            Owner
          </span>
        )}
      </div>
    </div>
  );
};
