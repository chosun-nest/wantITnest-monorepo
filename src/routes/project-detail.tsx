import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockProjects } from "../constants/mock-projects";
import { mockParticipants } from "../constants/mock-project-participants";
import CommentSection from "../components/project/commentsection";
import ParticipantCardBox from "../components/project/ParticipantCardBox";
import ApplicationModal from "../components/project/ApplicationModal";
import useResponsive from "../hooks/responsive";
import { Participant } from "../types/participant";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useResponsive();

  // 로그인 사용자 ID (나중엔 context 등에서 가져오면 됨)
  const currentUserId = 1;

  const project = mockProjects.find((p) => p.id === Number(id));
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState(project?.status || "모집중");
  const [participantCount, setParticipantCount] = useState(project?.participants || "0/6");

  if (!project) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto pt-36">
        <h1 className="mb-4 text-2xl font-bold text-blue-900">프로젝트 상세보기</h1>
        <p>프로젝트 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-4 text-white rounded bg-slate-800"
        >
          ← 뒤로 가기
        </button>
      </div>
    );
  }

  const handleAccept = (user: Participant) => {
    const updated = [...participants, user];
    setParticipants(updated);

    const [curr, max] = participantCount.split("/").map(Number);
    const newCount = curr + 1;
    const updatedCount = `${newCount}/${max}`;
    setParticipantCount(updatedCount);

    if (newCount >= max) {
      setProjectStatus("모집완료");
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 pt-36 pb-10 flex ${isMobile ? "flex-col gap-4" : "flex-row gap-8"}`}>
      {/* 왼쪽 영역 */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              projectStatus === "모집중"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {projectStatus} · 참여 {participantCount}
          </span>
          <h1 className={`font-bold text-blue-900 ${isMobile ? "text-lg" : "text-xl md:text-2xl"}`}>
            {project.title}
          </h1>
        </div>

        <div className={`flex ${isMobile ? "flex-col gap-1" : "justify-between items-center mt-1"}`}>
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
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 w-fit">
            + 팔로우
          </button>
        </div>

        <div className="mt-1 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>작성일: {project.date}</span>
          <span>· 조회수: {project.views}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="mb-6 leading-relaxed text-gray-700 whitespace-pre-line">
          {project.content}
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="px-5 py-4 mb-6 border rounded bg-gray-50">
          <CommentSection />
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-white rounded bg-slate-800"
          >
            ← 뒤로 가기
          </button>
        </div>
      </div>

      {/* 오른쪽 참여자 영역 */}
      <div className={`w-full ${isMobile ? "mt-6" : "lg:w-[280px] shrink-0"}`}>
        <ParticipantCardBox
          project={project}
          participants={participants}
          onOpenModal={() => setIsModalOpen(true)}
          onAccept={handleAccept}
          currentUserId={currentUserId}
        />
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <ApplicationModal
          onClose={() => setIsModalOpen(false)}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
}