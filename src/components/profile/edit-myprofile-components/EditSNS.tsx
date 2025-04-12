{/* SNS 링크 입력 필드 */}
import React from "react";

interface Props {
  isEditing: boolean;
  sns: string[];
  onChange: (sns: string[]) => void;
}

export default function EditSNS({ isEditing, sns, onChange }: Props) {
  return (
    <div className="flex items-start mb-4">
      <label className="w-28 text-sm font-semibold mt-2">SNS 링크</label>
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-2">
            {["Github", "LinkedIn"].map((label, i) => (
              <div className="flex items-center gap-2" key={i}>
                <span className="w-20 text-sm font-semibold">{label}</span>
                <input
                  type="text"
                  value={sns[i] || ""}
                  onChange={(e) => {
                    const copy = [...sns];
                    copy[i] = e.target.value;
                    onChange(copy);
                  }}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 mt-2">
            {sns[0] && <a href={sns[0]} target="_blank" rel="noreferrer">
              <img src="/assets/images/github-logo.png" alt="GitHub" className="w-8 h-8 hover:opacity-80" />
            </a>}
            {sns[1] && <a href={sns[1]} target="_blank" rel="noreferrer">
              <img src="/assets/images/LinkedIn-logo.png" alt="LinkedIn" className="w-9 h-8 hover:opacity-80" />
            </a>}
          </div>
        )}
      </div>
    </div>
  );
}
