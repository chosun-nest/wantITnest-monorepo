// 관심분야 필터링 모달
import React, { useState } from "react";

interface TagFilterModalProps {
  onClose: () => void;
  onApply: (selectedTags: string[]) => void;
}

const categories = [
  {
    title: "🖥️ 개발•프로그래밍",
    tags: [
      "풀스택", "웹 개발", "프론트엔드", "백엔드", "모바일 앱 개발",
      "프로그래밍 언어", "알고리즘•자료구조", "데이터베이스", "데브옵스•인프라",
      "소프트웨어 테스트", "개발도구", "웹 퍼블리싱", "데스크톱 앱 개발",
      "VR/AR", "개발•프로그래밍 자격증", "개발•프로그래밍 기타"
    ]
  },
  {
    title: "🤖 인공지능",
    tags: ["AI활용", "머신러닝•딥러닝", "컴퓨터 비전", "자연어 처리", "인공지능 기타"]
  },
  {
    title: "🥼 데이터 사이언스",
    tags: ["데이터 분석", "데이터 엔지니어링", "데이터 사이언스 자격증", "데이터 사이언스 기타"]
  },
  {
    title: "🎮 게임 개발",
    tags: ["게임 프로그래밍", "게임 기획", "게임 아트•그래픽", "게임 개발 기타"]
  },
  {
    title: "🛡️ 보안•네트워크",
    tags: ["보안", "네트워크", "시스템•운영체제", "클라우드", "블록체인", "보안•네트워크 자격증", "보안•네트워크 기타"]
  },
  {
    title: "💽 하드웨어",
    tags: ["컴퓨터구조", "임베디드•IoT", "반도체", "로봇공학", "모빌리티", "하드웨어 자격증", "하드웨어 기타"]
  },
  {
    title: "🎨 디자인•아트",
    tags: ["CAD•3D 모델링", "UX/UI", "그래픽 디자인", "사진•영상", "사운드", "디자인 자격증", "디자인 기타"]
  }
];

export default function TagFilterModal({ onClose, onApply }: TagFilterModalProps) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40">
      <div className="w-full max-w-3xl max-h-[80vh] bg-white rounded-xl shadow-lg overflow-y-auto p-8 relative">
        <h2 className="text-xl font-bold mb-4 text-[#002F6C]">관심분야</h2>

        {/* 검색창 */}
        <input
          type="text"
          placeholder="관심분야 검색"
          className="w-full p-3 mb-6 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 필터 목록 */}
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.title}>
              <p className="font-semibold text-[15px] mb-2">{cat.title}</p>
              <div className="flex flex-wrap gap-2">
                {cat.tags
                  .filter((tag) => tag.includes(search))
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full border text-sm transition
                        ${selectedTags.includes(tag)
                          ? "bg-[#002F6C] text-white border-[#002F6C]"
                          : "border-gray-300 hover:bg-gray-100"}
                      `}
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-between mt-10">
          <button
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            onClick={() => setSelectedTags([])}
          >
            초기화
          </button>
          <div className="space-x-2">
            <button
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              onClick={onClose}
            >
              닫기
            </button>
            <button
              className="px-4 py-2 rounded bg-[#002F6C] text-white hover:bg-[#001f4d]"
              onClick={() => onApply(selectedTags)}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
