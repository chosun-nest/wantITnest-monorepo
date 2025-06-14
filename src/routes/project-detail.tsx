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
  const isMobile = useResponsive();
  const dispatch = useDispatch();

  const accessToken = useSelector(selectAccessToken);
  const currentUserId = useSelector(selectCurrentUserId);
  const isAuthenticated = !!accessToken;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    getMemberProfile()
      .then((user) => {
        dispatch(
          setUser({
            memberId: user.memberId,
            memberName: user.memberName,
            memberRole: user.memberRole,
          })
        );
      })
      .catch((err) => console.error("유저 정보 불러오기 실패", err));
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const data = await getProjectById(Number(id));
        setProject(data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("프로젝트 상세 조회 실패:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProject();
    }
  }, [id, isAuthenticated]);

  const handleEdit = () => {
    navigate(`/project-edit/${id}`);
  };

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
      <div className="max-w-4xl px-4 pb-10 mx-auto pt-36 text-center">
        ⏳ 로딩 중입니다...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto pt-36 text-center text-red-500 font-semibold">
        🔒 로그인 후 프로젝트 정보를 확인할 수 있습니다.
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto pt-36 text-center text-gray-600">
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
        {isAuthor && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              ✏️ 수정
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
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

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* 모집 상태 표시 및 버튼 처리 */}
        <div className="mb-6">
          {project.isRecruiting ? (
            <button className="px-4 py-2 bg-blue-600 text-white rounded">지원하기</button>
          ) : (
            <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed" disabled>
              모집 완료
            </button>
          )}
        </div>

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
          project={project}
          participants={project.projectMembers}
          onOpenModal={() => setIsModalOpen(true)}
          onAccept={() => {}}
          currentUserId={currentUserId!}
        />
      </div>

      {/* 지원자 모달 */}
      {isModalOpen && (
        <ApplicationModal
          onClose={() => setIsModalOpen(false)}
          onAccept={() => {}}
        />
      )}

      {/* 삭제 확인 모달 */}
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
