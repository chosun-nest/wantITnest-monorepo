import { useState, useEffect } from "react";
import RecruitRoleCard from "./RecruitRoleCard";

interface RecruitCardData {
  id: number;
  role: string;
  authorName: string;
}

interface RecruitRoleListProps {
  onChange: (cards: RecruitCardData[]) => void;
  authorName: string;
}

export default function RecruitRoleList({
  onChange,
  authorName,
}: RecruitRoleListProps) {
  const [cards, setCards] = useState<RecruitCardData[]>([]);

  // ✅ 디폴트 카드 1개 (작성자)
  useEffect(() => {
    const defaultCard: RecruitCardData = {
      id: 1,
      role: "frontend",
      authorName,
    };
    setCards([defaultCard]);
  }, [authorName]);

  // ✅ 카드 배열 변경 시 상위로 전달
  useEffect(() => {
    onChange(cards);
  }, [cards, onChange]);

  const handleAddCard = () => {
    const newId = cards.length > 0 ? cards[cards.length - 1].id + 1 : 1;
    const newCard: RecruitCardData = {
      id: newId,
      role: "frontend",
      authorName: "모집중", // ✅ 추가 카드는 '모집중'으로 고정
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleChangeRole = (id: number, newRole: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, role: newRole } : card
      )
    );
  };

  return (
    <div className="bg-blue-50 p-4 rounded-md w-full md:w-[300px]">
      <h3 className="text-md font-semibold mb-2">모집 분야</h3>

      <div className="space-y-3 mb-4">
        {cards.map((card) => (
          <RecruitRoleCard
            key={card.id}
            defaultRole={card.role}
            authorName={card.authorName}
            onRoleChange={(role) => handleChangeRole(card.id, role)}
          />
        ))}
      </div>

      <button
        onClick={handleAddCard}
        className="w-full text-2xl text-center py-1 border rounded-full bg-white hover:bg-gray-100"
      >
        ＋
      </button>
    </div>
  );
}
