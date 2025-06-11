import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";
import { getProjects } from "../api/project/ProjectAPI";
import type { ProjectSummary } from "../types/api/project-board";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import BoardWriteButton from "../components/board/write/BoardWriteButton";
import useResponsive from "../hooks/responsive";

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

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProjects({
          "pageable.page": currentPage - 1,
          "pageable.size": ITEMS_PER_PAGE,
          "pageable.sort": "createdAt,desc",
        });

        setProjects(data.projects);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("프로젝트 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, currentPage]);

  if (loading) {
    return <div className="p-10 text-center">⏳ 로딩 중입니다...</div>;
  }

  if (authError) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        🔒 로그인 후 프로젝트 목록을 볼 수 있습니다.
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (project: ProjectSummary) => {
    navigate(`/project/${project.projectId}`, { state: { project } });
  };

  return (
    <div className={`mx-auto p-4 pt-24 ${isMobile ? "max-w-full" : "max-w-4xl"}`}>
      <div className={`flex ${isMobile ? "flex-col items-start gap-2" : "flex-row justify-between items-center"} mb-4`}>
        <h1 className="text-2xl font-bold text-[#00256c]">프로젝트 모집 게시판</h1>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        총 <strong>{totalCount}</strong>개의 게시물이 있습니다.
      </p>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.projectId}
            onClick={() => handleRowClick(project)}
            className="border rounded-lg p-4 cursor-pointer hover:shadow"
          >
            <h2 className={`font-semibold mb-2 ${isMobile ? "text-base" : "text-lg"}`}>
              {project.projectTitle}
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              {project.previewContent.length > 100
                ? `${project.previewContent.slice(0, 100)}...`
                : project.previewContent}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded">
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
