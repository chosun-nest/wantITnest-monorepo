import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";
import { getProjects } from "../api/project/ProjectAPI";
import type { ProjectSummary } from "../types/api/project-board";
import BoardWriteButton from "../components/board/write/BoardWriteButton";
import useResponsive from "../hooks/responsive";
import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";
import TagFilterModal from "../components/board/tag/TagFilterModal";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const navigate = useNavigate();
  const isMobile = useResponsive();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;

  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        "pageable.page": currentPage - 1,
        "pageable.size": ITEMS_PER_PAGE,
        "pageable.sort": "createdAt,desc",
      };
      if (searchKeyword.trim()) params.keyword = searchKeyword;
      if (selectedTags.length > 0) params.tags = selectedTags;

      const data = await getProjects(params);
      setProjects(data.projects);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("프로젝트 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthError(true);
      setLoading(false);
      return;
    }
    fetchData();
  }, [isAuthenticated, currentPage, searchKeyword, selectedTags]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= Math.ceil(totalCount / ITEMS_PER_PAGE)) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (project: ProjectSummary) => {
    navigate(`/project/${project.projectId}`, { state: { project } });
  };

  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  if (loading) {
    return <div className="p-10 text-center">⏳ 로딩 중입니다...</div>;
  }

  if (authError) {
    return (
      <div className="p-10 font-semibold text-center text-red-500">
        🔒 로그인 후 프로젝트 목록을 볼 수 있습니다.
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className={`mx-auto p-4 pt-24 ${isMobile ? "max-w-full" : "max-w-4xl"}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-[#00256c]">프로젝트 모집 게시판</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="제목 또는 내용 검색"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border rounded w-[240px]"
          />
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            🔍 태그 선택
          </button>
        </div>
      </div>

      {/* 🔻 추가된 구분선과 게시물 개수 */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
        <p className="text-sm text-gray-600">
          총 <strong>{totalCount}</strong>개의 게시물이 있습니다.
        </p>
      </div>

      <BoardTagFilterButton
        selectedTags={selectedTags}
        onRemoveTag={removeSelectedTag}
        onOpenFilter={() => setShowFilterModal(true)}
      />

      {showFilterModal && (
        <TagFilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={(tags) => {
            setSelectedTags(tags);
            setCurrentPage(1);
            setShowFilterModal(false);
          }}
        />
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.projectId}
            onClick={() => handleRowClick(project)}
            className="p-4 border rounded-lg cursor-pointer hover:shadow"
          >
            <div className="flex items-center justify-start gap-2 mb-2">
              {project.isRecruiting !== undefined && (
                <span className={`px-2 py-1 text-sm font-semibold border rounded-full ${
                  project.isRecruiting
                    ? "text-green-700 bg-green-100 border-green-300"
                    : "text-gray-500 bg-gray-100 border-gray-300"
                }`}>
                  {project.isRecruiting ? "모집중" : "모집완료"}
                </span>
              )}
              <h2 className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}>
                {project.projectTitle}
              </h2>
            </div>

            <p className="mb-2 text-sm text-gray-700">
              {project.previewContent.length > 100
                ? `${project.previewContent.slice(0, 100)}...`
                : project.previewContent}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs text-blue-700 bg-blue-100 border border-blue-200 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{project.author.name} · {project.createdAt}</span>
              <span>조회수 {project.viewCount}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <BoardWriteButton />
    </div>
  );
}
