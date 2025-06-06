import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById, Project } from "../api/project/ProjectAPI";
import CommentSection from "../components/project/commentsection";
import ParticipantCardBox from "../components/project/ParticipantCardBox";
import ApplicationModal from "../components/project/ApplicationModal";
import useResponsive from "../hooks/responsive";
import { Participant } from "../types/participant";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useResponsive();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [projectStatus, setProjectStatus] = useState<"모집중" | "모집완료">("모집중");
  const [participantCount, setParticipantCount] = useState("0/0");

  const currentUserId = 1;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(Number(id));
        setProject(data);

        const max = data.maxMember;
        const curr = Math.floor(Math.random() * (max + 1)); // 예시용
        setParticipantCount(`${curr}/${max}`);
        setProjectStatus(data.closed ? "모집완료" : "모집중");

        const dummyParticipants: Participant[] = [
          { id: 1, name: "홍길동", role: "프론트엔드", followers: 3 },
          { id: 2, name: "김개발", role: "백엔드", followers: 5 },
        ];
        setParticipants(dummyParticipants);
      } catch (error) {
        console.error("프로젝트 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto pt-36 text-center">
        ⏳ 로딩 중입니다...
      </div>
    );
  }

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
    setParticipantCount(`${newCount}/${max}`);

    if (newCount >= max) {
      setProjectStatus("모집완료");
    }
  };

  // ✅ 타입 보정: ParticipantCardBox용으로 가공
  const mappedProject = {
    ...project,
    id: project.projectId,
    title: project.projectTitle,
    content: project.projectDescription,
    date: project.projectStartDate,
    author: { id: project.projectLeaderId, name: `유저#${project.projectLeaderId}` },
    participants: participantCount,
    views: 123, // 임시
    status: projectStatus,
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
            {project.projectTitle}
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
              유저#{project.projectLeaderId}
            </span>
          </div>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 w-fit">
            + 팔로우
          </button>
        </div>

        <div className="mt-1 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>시작일: {project.projectStartDate}</span>
          <span>~ 마감일: {project.projectEndDate}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="mb-6 leading-relaxed text-gray-700 whitespace-pre-line">
          {project.projectDescription}
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
          project={mappedProject}
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