import { useState } from "react";
import * as S from "../assets/styles/project-board.styles";
import { mockProjects } from "../constants/mock-projects";
import { useNavigate } from "react-router-dom";
import TagFilterModal from "../components/modals/interests/TagFilterModal";
import ProjectWriteButton from "../components/project/ProjectWriteButton";

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = mockProjects
    .filter(
      (p) => p.title.includes(searchTerm) || p.content.includes(searchTerm)
    )
    .filter((p) => {
      if (selectedTags.length === 0) return true;
      return p.tags?.some((tag) => selectedTags.includes(tag));
    });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (project: any) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  return (
    <S.Container>
      <S.TitleSection>
        {/* 왼쪽 - 제목 + 서브텍스트 */}
        <div>
          <S.PageTitle>프로젝트 모집 게시판</S.PageTitle>
          <S.SubText>
            총 <strong>{filteredProjects.length}</strong>개의 게시물이 있습니다.
            </S.SubText>
        </div>
        
        {/* 오른쪽 - 검색창 + 필터 */}
        <div className="flex gap-2 items-center">
          <S.SearchInput
            type="text"
            placeholder="제목 또는 내용 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <S.FilterButton onClick={() => setIsModalOpen(true)}>
            🔍 태그 필터
          </S.FilterButton>
        </div>
      </S.TitleSection>

      {/* 선택된 태그 보기 */}
      {selectedTags.length > 0 && (
        <S.SelectedTags>
          {selectedTags.map((tag) => (
            <S.Tag
              key={tag}
              onClick={() =>
                setSelectedTags(selectedTags.filter((t) => t !== tag))
              }
            >
              {tag} ×
            </S.Tag>
          ))}
        </S.SelectedTags>
      )}

      {/* 카드 리스트 */}
      <S.CardList>
        {currentProjects.map((project) => (
          <S.Card key={project.id} onClick={() => handleRowClick(project)}>
            <div className="flex flex-col gap-2 h-full justify-between">
              {/* 상태 뱃지 + 제목 */}
              <div className="flex items-center gap-2">
                <S.StatusBadge status={project.status}>
                  {project.status}
                </S.StatusBadge>
                <S.ProjectTitle>{project.title}</S.ProjectTitle>
              </div>

              {/* 본문 미리보기 */}
              <S.ProjectPreview>
                {project.content.length > 100
                  ? `${project.content.slice(0, 100)}...`
                  : project.content}
              </S.ProjectPreview>

              {/* 태그들 */}
              {project.tags && (
                <S.TagContainer>
                  {project.tags.map((tag) => (
                    <S.Tag key={tag}>{tag}</S.Tag>
                  ))}
                </S.TagContainer>
              )}

              {/* 하단 정보: 왼쪽 작성자 + 날짜 / 오른쪽 조회수 + 참여 */}
              <div className="flex justify-between items-end mt-2">
                <S.ProjectMetaLeft>
                  {project.author} ・ {project.date}
                </S.ProjectMetaLeft>
                <S.ProjectMetaRight>
                  조회수 {project.views} ・ 참여 {project.participants}
                </S.ProjectMetaRight>
              </div>
            </div>
          </S.Card>
        ))}
      </S.CardList>

      {/* 페이지네이션 */}
      <S.Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </S.Pagination>

      {/* 태그 모달 */}
      {isModalOpen && (
        <TagFilterModal
          onClose={() => setIsModalOpen(false)}
          onApply={(tags) => {
            setSelectedTags(tags);
            setIsModalOpen(false);
          }}
        />
      )}
    <ProjectWriteButton />
    </S.Container>
  );
}