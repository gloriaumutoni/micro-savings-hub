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
        <div>
          <h3 className="font-semibold text-gray-900 text-base group-hover:text-green-700 transition-colors">
            {group.name}
          </h3>
          {group.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {group.description}
            </p>
          )}
        </div>
        <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
          {group.currency}
        </span>
      </div>

      <ProgressBar value={saved} target={target} currency={group.currency} />

      <p className="text-xs text-gray-400 mt-3">Created {formattedDate}</p>
    </div>
  );
};
