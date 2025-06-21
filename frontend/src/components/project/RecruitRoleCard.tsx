import { useState } from "react";
import RoleToggleBadge from "./RoleToggleBadge";

interface RecruitRoleCardProps {
  defaultRole?: string;
  authorName: string;
  onRoleChange?: (newRole: string) => void;
}

export default function RecruitRoleCard({
  defaultRole = "frontend",
  authorName,
  onRoleChange,
}: RecruitRoleCardProps) {
  const [role, setRole] = useState(defaultRole);

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
      <RoleToggleBadge
        role={role}
        setRole={(newRole) => {
          setRole(newRole);
          onRoleChange?.(newRole);
        }}
      />

      <div className="flex items-center justify-end">
        <span className="font-medium">{authorName}</span>
      </div>
    </div>
  );
}
