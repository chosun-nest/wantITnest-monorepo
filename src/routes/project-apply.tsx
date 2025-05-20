import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProjectApply() {
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};

  const [message, setMessage] = useState("");

  // ✅ project가 없으면 자동으로 뒤로가기
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
    alert("지원이 완료되었습니다!");
    navigate(-1); // 뒤로 이동
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-36 pb-20">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-center mb-2 text-blue-900">
          {project?.title || "프로젝트 인원 구해요"}에 지원 동기 작성
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          본인이 왜 이 프로젝트에 지원하는지 간단히 소개해주세요. <br />
          지금까지의 경험, 열정, 관심 분야 등을 자유롭게 작성해도 좋아요!
        </p>

        <textarea
          className="w-full h-40 p-3 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="예: 프론트엔드에 관심이 많고 React로 몇 개의 토이 프로젝트를 진행해봤습니다. 이번 기회를 통해 함께 성장하고 싶어요!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

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