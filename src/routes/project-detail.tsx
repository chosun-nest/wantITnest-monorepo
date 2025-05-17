import { useParams, useNavigate } from "react-router-dom";
import { mockProjects } from "../constants/mock-projects";
import CommentSection from "../components/project/commentsection";
import ParticipantCardBox from "../components/project/ParticipantCardBox";
import useResponsive from "../hooks/responsive";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useResponsive();

  const project = mockProjects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-10">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">프로젝트 상세보기</h1>
        <p>프로젝트 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded"
        >
          ← 뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-36 pb-10 flex flex-col lg:flex-row gap-8">
      {/* 왼쪽 본문 영역 */}
      <div className="flex-1">
        {/* 제목과 상태 뱃지 */}
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              project.status === "모집중"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {project.status} · 참여 {project.participants}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-blue-900">
            {project.title}
          </h1>
        </div>

        {/* 작성자 프로필 라인 */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/manager-bird.png"
              alt="프로필"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold text-[16px] text-gray-900">
              {project.author.name}
            </span>
          </div>
          <button className="text-sm border px-3 py-1 rounded hover:bg-gray-100">
            + 팔로우
          </button>
        </div>

        {/* 작성일 & 조회수 */}
        <div className="mt-1 text-[15px] text-gray-600 flex gap-2">
          <span>작성일: {project.date}</span>
          <span>· 조회수: {project.views}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 본문 */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {project.content}
        </p>

        {/* 댓글 */}
        <div className="border rounded px-5 py-4 bg-gray-50 mb-6">
          <CommentSection />
        </div>

        {/* 뒤로 가기 버튼만 유지 */}
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded"
          >
            ← 뒤로 가기
          </button>
        </div>
      </div>

      {/* 오른쪽 참여자 카드 영역 */}
      <div className="w-full lg:w-[280px] shrink-0">
        {/* 상단 버튼 + 제목 */}
        <ParticipantCardBox />
      </div>
    </div>
  );
}