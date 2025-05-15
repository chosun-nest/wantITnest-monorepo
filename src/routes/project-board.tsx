import { useState } from "react";
import * as S from "../assets/styles/project-board.styles";
import { mockProjects } from "../constants/mock-projects";
import { useNavigate } from "react-router-dom";
import TagFilterModal from "../components/board/TagFilterModal";
import BoardWriteButton from "../components/board/BoardWriteButton";  // ProjectWriteButton 삭제 > 공통 부분인 BoardWriteButton으로 변경. 동일 글쓰기 버튼 컴포넌트 사용하도록 하기 위함. 

const ITEMS_PER_PAGE = 7;

export default function ProjectBoard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"전체" | "모집중" | "모집완료">("전체");

  const filteredProjects = [...mockProjects]
    .sort(
      (a, b) =>
        new Date(b.date.replace(/\./g, "-")).getTime() -
        new Date(a.date.replace(/\./g, "-")).getTime()
    )
    .filter(
      (p) =>
        p.title.includes(searchTerm) || p.content.includes(searchTerm)
    )
    .filter((p) => {
      if (selectedTags.length > 0 && !p.tags?.some((tag) => selectedTags.includes(tag)))
        return false;
      if (filter !== "전체" && p.status !== filter) return false;
      return true;
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
      {/* 상단 필터와 제목 라인 */}
      <S.FilterRow>
        <S.PageTitle>프로젝트 모집 게시판</S.PageTitle>
        <S.FilterList>
          {["전체", "모집중", "모집완료"].map((label) => (
            <S.FilterItem
              key={label}
              $selected={filter === label}
              onClick={() => setFilter(label as typeof filter)}
            >
              {label}
            </S.FilterItem>
          ))}
        </S.FilterList>
      </S.FilterRow>

      <S.Divider />

      {/* 제목 아래 통계 + 검색창 */}
      <S.TitleSection>
        {/* 왼쪽 - 개수 */}
        <div>
          <S.SubText>
            총 <strong>{filteredProjects.length}</strong>개의 게시물이 있습니다.
          </S.SubText>
        </div>

        {/* 오른쪽 - 검색창 + 필터 */}
        <div className="flex items-center gap-2">
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
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center gap-2">
                <S.StatusBadge status={project.status}>
                  {project.status}
                </S.StatusBadge>
                <S.ProjectTitle>{project.title}</S.ProjectTitle>
              </div>
              <S.ProjectPreview>
                {project.content.length > 100
                  ? `${project.content.slice(0, 100)}...`
                  : project.content}
              </S.ProjectPreview>
              {project.tags && (
                <S.TagContainer>
                  {project.tags.map((tag) => (
                    <S.Tag key={tag}>{tag}</S.Tag>
                  ))}
                </S.TagContainer>
              )}
              <div className="flex items-end justify-between mt-2">
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
      <BoardWriteButton />
    </S.Container>
  );
}