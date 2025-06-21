import { useState } from "react";
import RoleToggleBadge from "./RoleToggleBadge";

interface RecruitRoleCardProps {
  defaultRole?: string;
  authorName: string;
  profileImageUrl?: string;
  onRoleChange?: (newRole: string) => void;
}

const defaultProfile = "/assets/default-profile.png"; // 예시 경로

export default function RecruitRoleCard({
  defaultRole = "frontend",
  authorName,
  profileImageUrl,
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

      <div className="flex items-center gap-2">
        <img
          src={profileImageUrl || defaultProfile}
          alt="profile"
          className="w-8 h-8 rounded-full border"
        />
        <span className="font-medium">{authorName}</span>
      </div>
    </div>
  );
}
