import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProjectById,
  deleteProject,
  Project,
} from "../api/project/ProjectAPI";
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

  const currentUserId = 1;

  // 1. 프로젝트 데이터 불러오기
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(Number(id));
        setProject(data);
        setProjectStatus(data.closed ? "모집완료" : "모집중");
      } catch (error) {
        console.error("프로젝트 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // 2. 참가자 수락 처리
  const handleAccept = (user: Participant) => {
    const updated = [...participants, user];
    setParticipants(updated);

    const max = project?.maxMember ?? 0;
    if (updated.length >= max) {
      setProjectStatus("모집완료");
    }
  };

  // 3. 수정 버튼
  const handleEdit = () => {
    navigate(`/project-edit/${id}`);
  };

  // 4. 삭제 버튼
  const handleDelete = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteProject(Number(id));
      alert("삭제 완료되었습니다.");
      navigate("/project-board");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 5. UI용 프로젝트 가공
  const mappedProject = project && {
    ...project,
    id: project.projectId,
    title: project.projectTitle,
    content: project.projectDescription,
    date: project.projectStartDate,
    author: {
      id: project.projectLeaderId,
      name: `유저#${project.projectLeaderId}`,
    },
    participants: `${participants.length}/${project.maxMember}`,
    views: 123, // TODO: 백엔드에서 제공 시 연동
    status: projectStatus,
  };

  if (loading) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto pt-36 text-center">
        ⏳ 로딩 중입니다...
      </div>
    );
  }

  if (!project || !mappedProject) {
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

  return (
    <div
      className={`max-w-6xl mx-auto px-4 pt-36 pb-10 flex ${
        isMobile ? "flex-col gap-4" : "flex-row gap-8"
      }`}
    >
      {/* 왼쪽 영역 */}
      <div className="flex-1">
        {/* 프로젝트 제목 & 상태 */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              projectStatus === "모집중"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {projectStatus} · 참여 {participants.length}/{project.maxMember}
          </span>
          <h1
            className={`font-bold text-blue-900 ${
              isMobile ? "text-lg" : "text-xl md:text-2xl"
            }`}
          >
            {project.projectTitle}
          </h1>
        </div>

        {/* 🔧 작성자만 버튼 표시 */}
        {project.projectLeaderId === currentUserId && (
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              ✏️ 수정
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑 삭제
            </button>
          </div>
        )}

        {/* 작성자 정보 */}
        <div
          className={`flex ${
            isMobile ? "flex-col gap-1" : "justify-between items-center mt-1"
          }`}
        >
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

        {/* 날짜 */}
        <div className="mt-1 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>시작일: {project.projectStartDate}</span>
          <span>~ 마감일: {project.projectEndDate}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 설명 */}
        <div className="mb-6 leading-relaxed text-gray-700 whitespace-pre-line">
          {project.projectDescription}
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 댓글 */}
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

      {/* 오른쪽 참여자 카드 */}
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
