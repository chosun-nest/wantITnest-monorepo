import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById, deleteProject } from "../api/project/ProjectAPI";
import CommentSection from "../components/project/commentsection";
import ParticipantCardBox from "../components/project/ParticipantCardBox";
import ApplicationModal from "../components/project/ApplicationModal";
import useResponsive from "../hooks/responsive";
import { Participant } from "../types/participant";
import type { ProjectDetail } from "../types/api/project-board";

// 💡 ParticipantCardBox에 넘길 전체 타입에 맞춰 재구성
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useResponsive();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState<"모집중" | "모집완료">("모집중");

  const currentUserId = 1;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(Number(id));
        setProject(data);
        setProjectStatus("모집중"); // 기본값 (백엔드 없으므로 가정)
      } catch (error) {
        console.error("프로젝트 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleAccept = (user: Participant) => {
    const updated = [...participants, user];
    setParticipants(updated);

    const max = mappedProject?.maxMember ?? 0;
    if (updated.length >= max) {
      setProjectStatus("모집완료");
    }
  };

  const handleEdit = () => {
    navigate(`/project-edit/${id}`);
  };

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

  const mappedProject =
    project && {
      id: project.projectId,
      projectTitle: project.projectTitle,
      projectLeaderId: project.author.id,
      projectDescription: project.projectDescription,
      projectStartDate: project.createdAt,
      projectEndDate: project.updatedAt,
      maxMember: 6, // 백엔드 없으면 기본값 (ex. 6)
      closed: false, // 모집 완료 여부 - 임시 false

      // 프론트 가공 필드
      title: project.projectTitle,
      content: project.projectDescription,
      date: project.createdAt,
      author: project.author,
      participants: `${participants.length}/${6}`,
      status: projectStatus,
      views: project.viewCount ?? 0,
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
        <h1
          className={`font-bold text-blue-900 mb-2 ${
            isMobile ? "text-lg" : "text-xl md:text-2xl"
          }`}
        >
          {project.projectTitle}
        </h1>

        {/* 작성자 */}
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
              {project.author.name}
            </span>
          </div>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 w-fit">
            + 팔로우
          </button>
        </div>

        <div className="mt-1 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>생성일: {project.createdAt}</span>
          <span>수정일: {project.updatedAt}</span>
        </div>

        {/* 수정 / 삭제 */}
        {project.author.id === currentUserId && (
          <div className="flex gap-2 mt-4">
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
