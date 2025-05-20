import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProjectApply() {
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};

  const [message, setMessage] = useState("");
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const fieldOptions = ["프론트엔드", "백엔드", "디자이너", "AI / 데이터 분석"];

  useEffect(() => {
    if (!project) {
      alert("잘못된 접근입니다.");
      navigate(-1);
    }
  }, [project, navigate]);

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("지원 동기를 작성해주세요!");
      return;
    }
    if (!selectedField) {
      alert("희망 분야를 선택해주세요!");
      return;
    }
    alert(`'${selectedField}' 분야로 지원이 완료되었습니다!`);
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-36 pb-20">
      <div className="bg-gray-50 shadow-md rounded-lg p-10">
        <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-900">
          {project?.title || "프로젝트 인원 구해요"}에 지원 동기 작성
        </h2>

        <h3 className="text-base font-semibold mb-2">✅ 희망하는 분야를 선택해 주세요</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {fieldOptions.map((field) => (
            <button
              key={field}
              onClick={() => setSelectedField(field)}
              className={`px-3 py-1 rounded-full border text-sm transition-all duration-150
                ${selectedField === field
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              #{field}
            </button>
          ))}
        </div>

        <h3 className="text-base font-semibold mb-2">✏️ 지원 동기를 작성해 주세요</h3>
        <textarea
          className="w-full h-56 p-4 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="본인이 왜 이 프로젝트에 지원하는지 간단히 소개해주세요. 지금까지의 경험, 열정, 관심 분야 등을 자유롭게 작성해도 좋아요!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={400}
        />
        <div className="text-sm text-gray-500 text-right mt-1">{message.length} / 400</div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-700"
          >
            ← 뒤로 가기
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            지원하기
          </button>
        </div>
      </div>
    </div>
  );
}