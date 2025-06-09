import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";
import { getProjects } from "../api/project/ProjectAPI";
import type { ProjectSummary } from "../types/api/project-board";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import BoardWriteButton from "../components/board/tag/BoardWriteButton";
import useResponsive from "../hooks/responsive";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const navigate = useNavigate();
  const isMobile = useResponsive();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"전체" | "모집중" | "모집완료">("전체");
  
  const [allProjects, setAllProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setAllProjects(data.projects); // ✅ 수정된 부분
      } catch (error) {
        console.error("프로젝트 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated]);

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

  const fixedProjects = allProjects.map((project) => {
    const status = Math.random() > 0.5 ? "모집완료" : "모집중"; // 임시 랜덤
    // const max = project.maxMember;
    const max = 6; // 예시로 하드코딩
    const curr = Math.floor(Math.random() * max);
    const participants = `${curr}/${max}`;
    return {
    ...project,
    status,
    participants,
    title: project.projectTitle,
    content: project.previewContent, // 또는 project.projectDescription
    tags: ["React", "UX/UI"],
    author: { name: project.authorName }, // ✅ 수정
    date: project.createdAt,
    views: Math.floor(Math.random() * 200),
  };
  });

  const filteredProjects = [...fixedProjects]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(
      (p) => p.title.includes(searchTerm) || p.content.includes(searchTerm)
    )
    .filter((p) => {
      if (
        selectedTags.length > 0 &&
        !p.tags?.some((tag: string) => selectedTags.includes(tag))
      )
        return false;
      if (filter !== "전체" && p.status !== filter) return false;
      return true;
    });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (project: any) => {
    navigate(`/project/${project.projectId}`, { state: { project } });
  };

  return (
    <div className={`mx-auto p-4 pt-24 ${isMobile ? "max-w-full" : "max-w-4xl"}`}>
      <div className={`flex ${isMobile ? "flex-col items-start gap-2" : "flex-row justify-between items-center"} mb-4`}>
        <h1 className="text-2xl font-bold text-[#00256c]">프로젝트 모집 게시판</h1>
        <div className="flex space-x-2">
          {["전체", "모집중", "모집완료"].map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label as typeof filter)}
              className={`px-3 py-1 rounded-md border ${
                filter === label ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex ${isMobile ? "flex-col items-start gap-2" : "flex-row justify-between items-center"} mb-4`}>
        <p className="text-sm text-gray-600">
          총 <strong>{filteredProjects.length}</strong>개의 게시물이 있습니다.
        </p>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="제목 또는 내용 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded-md w-full md:w-96"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            🔎 태그 선택
          </button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
              className="inline-flex items-center px-2 py-1 text-[13px] font-medium bg-gray-100 text-gray-800 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition"
            >
              {tag}
              <span className="ml-1">×</span>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {currentProjects.map((project) => {
          const [current, max] = project.participants?.split("/") || ["0", "0"];
          const statusStyle =
            project.status === "모집중"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-200 text-gray-600";

          return (
            <div
              key={project.projectId}
              onClick={() => handleRowClick(project)}
              className="border rounded-lg p-4 cursor-pointer hover:shadow"
            >
              <div className={`flex items-center gap-2 mb-2 ${isMobile ? "flex-wrap" : ""}`}>
                <div className={`px-2 py-1 text-xs rounded-full font-semibold ${statusStyle}`}>
                  {project.status} · 참여 {current}/{max}
                </div>
                <h2 className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}>
                  {project.title}
                </h2>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                {project.content.length > 100
                  ? `${project.content.slice(0, 100)}...`
                  : project.content}
              </p>
              {project.tags && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500">
                <span>{project.author.name} · {project.date}</span>
                <span>조회수 {project.views}</span>
              </div>
            </div>
          );
        })}
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

      {isModalOpen && (
        <TagFilterModal
          onClose={() => setIsModalOpen(false)}
          onApply={(tags) => {
            setSelectedTags(tags);
            setIsModalOpen(false);
          }}
        />
      )}
      <BoardWriteButton />
    </div>
  );
}
