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
        <div className="flex items-center gap-3 mb-2 flex-wrap">
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
          <button className="text-sm border px-3 py-1 rounded hover:bg-gray-100 w-fit">
            + 팔로우
          </button>
        </div>

        <div className="mt-1 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>작성일: {project.date}</span>
          <span>· 조회수: {project.views}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
          {project.content}
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="border rounded px-5 py-4 bg-gray-50 mb-6">
          <CommentSection />
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded"
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