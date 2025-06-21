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
    <div className={`max-w-6xl mx-auto px-4 pt-36 pb-10 flex ${isMobile ? "flex-col gap-4" : "flex-row gap-8"}`}>
      {/* 왼쪽: 본문 영역 */}
      <div className="flex-1">
        <h1 className={`font-bold text-blue-900 mb-2 ${isMobile ? "text-lg" : "text-xl md:text-2xl"}`}>
          {project.projectTitle}
        </h1>

        {/* 작성자 정보 줄 */}
        <div className="flex justify-between items-center mt-1">
          {/* 왼쪽: 프로필 + 작성자 */}
          <div className="flex items-center gap-2">
            <img src="/assets/images/manager-bird.png" alt="프로필" className="w-8 h-8 rounded-full" />
            <span className="font-semibold text-[16px] text-gray-900">{project.author.name}</span>
          </div>

          {/* 오른쪽: 팔로우 버튼 + ⋯ */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
              팔로우
            </button>
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ⋯
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={handleEdit}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 text-[15px] text-gray-600 flex gap-2 flex-wrap">
          <span>생성일: {project.createdAt}</span>
          <span>수정일: {project.updatedAt}</span>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* 설명, 태그 */}
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

        {/* 댓글 섹션 */}
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
        {isAuthor ? (
          <ParticipantCardBox
            project={project}
            participants={project.projectMembers}
            onOpenModal={() => setIsModalOpen(true)}
            onAccept={() => {}}
            currentUserId={currentUserId!}
          />
        ) : (
          <div className="flex flex-col gap-2 items-start border rounded px-4 py-3">
            <div className="text-sm font-semibold text-gray-800">프로젝트에 관심이 있나요?</div>
            <button
              onClick={() => navigate(`/project-apply/${project.projectId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              지원하기
            </button>
          </div>
        )}
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
