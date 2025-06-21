import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";
import { setUser, selectCurrentUserId } from "../store/slices/userSlice";
import { getMemberProfile } from "../api/profile/ProfileAPI";
import { getProjectById, deleteProject } from "../api/project/ProjectAPI";

import CommentSection from "../components/project/commentsection";
import ParticipantCardBox from "../components/project/ParticipantCardBox";
import ApplicationModal from "../components/project/ApplicationModal";
import ConfirmModal from "../components/common/ConfirmModal";
import useResponsive from "../hooks/responsive";
import type { ProjectDetail } from "../types/api/project-board";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useResponsive();

  const accessToken = useSelector(selectAccessToken);
  const currentUserId = useSelector(selectCurrentUserId);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!accessToken) {
        setAuthError(true);
        setLoading(false);
        return;
      }

      try {
        const user = await getMemberProfile();
        dispatch(setUser({
          memberId: user.memberId,
          memberName: user.memberName,
          memberRole: user.memberRole,
        }));

        const data = await getProjectById(Number(id));
        setProject(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("프로젝트 상세 조회 실패:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id, accessToken]);

  const handleEdit = () => navigate(`/project/${id}/edit`);

  const handleDelete = async () => {
    try {
      await deleteProject(Number(id));
      setShowDeleteConfirm(false);
      alert("삭제 완료되었습니다.");
      navigate("/project-board");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto text-center pt-36">
        ⏳ 로딩 중입니다...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto font-semibold text-center text-red-500 pt-36">
        🔒 로그인 후 프로젝트 정보를 확인할 수 있습니다.
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto text-center text-gray-600 pt-36">
        ❌ 해당 프로젝트를 찾을 수 없습니다.
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-white rounded bg-slate-800"
          >
            ← 뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const isAuthor = project.author.id === currentUserId;

  return (
    <div className={`max-w-6xl mx-auto px-4 pt-36 pb-10 flex ${isMobile ? "flex-col gap-4" : "flex-row gap-8"}`}>
      {/* 왼쪽: 본문 영역 */}
      <div className="flex-1">
        <h1 className={`font-bold text-blue-900 mb-2 ${isMobile ? "text-lg" : "text-xl md:text-2xl"}`}>
          {project.projectTitle}
        </h1>

        {/* 작성자 정보 */}
        <div className={`flex ${isMobile ? "flex-col gap-1" : "justify-between items-center mt-1"}`}>
          <div className="flex items-center gap-2">
            <img src="/assets/images/manager-bird.png" alt="프로필" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-[16px] text-gray-900">{project.author.name}</span>
          </div>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 w-fit">
            + 팔로우
          </button>
        </div>

        <div className="mt-2 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>생성일: {project.createdAt}</span>
          <span>수정일: {project.updatedAt}</span>
        </div>

        {/* 수정 / 삭제 */}
        {isAuthor && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm text-white bg-yellow-400 rounded hover:bg-yellow-500"
            >
              ✏️ 수정
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              🗑 삭제
            </button>
          </div>
        )}

        <hr className="my-4 border-gray-300" />

        {/* 설명, 태그 */}
        <div className="mb-6 leading-relaxed text-gray-700 whitespace-pre-line">
          {project.projectDescription}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* 아래 항목은 타입에 없으므로 주석 처리하거나 추후 확장 */}
        {/* 
        <div className="mb-6 text-sm text-gray-500">
          모집 상태: <strong>{project.status}</strong> / 참여 인원: {project.currentMember} / {project.maxMember}
        </div>
        */}

        <div className="px-5 py-4 mb-6 border rounded bg-gray-50">
          <CommentSection boardType="PROJECT" postId={project.projectId} />
        </div>

        <div className="mt-4">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-white rounded bg-slate-800">
            ← 뒤로 가기
          </button>
        </div>
      </div>

      {/* 오른쪽: 참여자 카드 or 지원 버튼 */}
      <div className={`w-full ${isMobile ? "mt-6" : "lg:w-[280px] shrink-0"}`}>
        <ParticipantCardBox
          project={project}
          participants={[]} // 서버 연동 시 대체 예정
          onOpenModal={() => setIsModalOpen(true)}
          onAccept={() => {}}
          currentUserId={currentUserId!}
        />
      </div>

      {/* 모달들 */}
      {isModalOpen && (
        <ApplicationModal
          onClose={() => setIsModalOpen(false)}
          onAccept={() => {}}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="프로젝트 삭제"
          message="정말 이 프로젝트를 삭제하시겠습니까?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
