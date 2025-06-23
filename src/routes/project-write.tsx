import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { useSelector } from "react-redux";
//import { selectCurrentUserName } from "../store/slices/userSlice";
import Navbar from "../components/layout/navbar";
import BoardTypeSelector from "../components/board/write/BoardTypeSelector";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import SelectedTagList from "../components/board/tag/SelectedTagList";
//import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";
import TitleInput from "../components/board/write/TitleInput";
import MarkdownEditor from "../components/board/write/MarkdownEditor";
import SubmitButtons from "../components/board/write/SubmitButtons";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import {
  createProjectPost,
  updateProject,
} from "../api/project/ProjectAPI";
import RecruitRoleList from "../components/project/RecruitRoleList";
import { getMemberProfile } from "../api/profile/ProfileAPI";
import type { ProjectDetail } from "../types/api/project-board";

interface RecruitCardData {
  id: number;
  role: string;
  authorName: string;
}

export default function ProjectWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  //const reduxAuthorName = useSelector(selectCurrentUserName);

  const navbarRef = useRef<HTMLDivElement>(null);
  const projectToEdit = location.state?.project as ProjectDetail | undefined;
  const isEditMode = !!projectToEdit;

  const [finalAuthorName, setFinalAuthorName] = useState("모집중");
  const [navHeight, setNavHeight] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recruitCards, setRecruitCards] = useState<RecruitCardData[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  const defaultContent = `[개발 프로젝트 모집 예시]

- 프로젝트 주제: 
- 프로젝트 목표: 
- 예상 프로젝트 일정(횟수):`;

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMemberProfile();
        if (user.memberName) setFinalAuthorName(user.memberName);
      } catch {
        setFinalAuthorName("모집중");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      setContent(defaultContent);
    } else if (projectToEdit) {
      setTitle(projectToEdit.projectTitle);
      setContent(projectToEdit.projectDescription);
      setSelectedTags(projectToEdit.tags);
    }
  }, [isEditMode, projectToEdit]);

  const handleSubmit = async () => {
    if (!title || !content) {
      setModalContent({
        title: "입력 누락",
        message: "제목과 내용을 입력해주세요.",
        type: "error",
      });
      setShowModal(true);
      return;
    }

    const partCounts: Record<string, number> = recruitCards.reduce((acc, card) => {
      const role = card.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalMembers = Object.values(partCounts).reduce((sum, count) => sum + count, 0);

    try {
      if (isEditMode && projectToEdit) {
        await updateProject(projectToEdit.projectId, {
          projectTitle: title,
          projectDescription: content || "",
          isRecruiting: true,
          tags: selectedTags,
          partCounts,
        });
        setModalContent({
          title: "수정 완료",
          message: "게시글이 성공적으로 수정되었습니다.",
          type: "info",
          onClose: () => {
            setShowModal(false);
            navigate(`/project/${projectToEdit.projectId}`);
          },
        });
      } else {
        await createProjectPost({
          projectTitle: title,
          projectDescription: content || "",
          isRecruiting: true,
          tags: selectedTags,
          partCounts,
          creatorPart: recruitCards[0]?.role || "BACKEND",
          creatorRole: "LEADER",
          maximumNumberOfMembers: totalMembers,
        });
        setModalContent({
          title: "게시 완료",
          message: "게시글이 등록되었습니다. 프로젝트 게시판에서 확인하세요.",
          type: "info",
          onClose: () => {
            setShowModal(false);
            navigate("/project-board");
          },
        });
      }

      setShowModal(true);
    } catch (e) {
      console.error(e);
      setModalContent({
        title: "등록 실패",
        message: "게시글 등록에 실패했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-6xl mx-auto px-4 mt-[40px]" style={{ paddingTop: navHeight }}>
        <BoardTypeSelector boardType="projects" />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
              <strong>프로젝트 모집 예시를 참고해 작성해주세요.</strong><br />
              꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요.
            </div>

            <TitleInput title={title} setTitle={setTitle} boardType="projects" />
            <MarkdownEditor content={content} setContent={setContent} />

            {/* 태그 리스트 표시 */}
            <SelectedTagList
              selectedTags={selectedTags}
              onRemoveTag={(tag) => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
            />

            {/* 태그 필터 모달 열기 버튼 */}
            <div className="mt-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
              >
                🔍 태그 선택
              </button>
            </div>

            {showFilterModal && (
              <TagFilterModal
                onClose={() => setShowFilterModal(false)}
                onApply={(tags) => {
                  setSelectedTags(tags);
                  setShowFilterModal(false);
                }}
              />
            )}

            {showModal && (
              <Modal
                {...modalContent}
                onClose={() => {
                  setShowModal(false);
                  modalContent.onClose?.();
                }}
              />
            )}

            <SubmitButtons
              onCancel={() => navigate(-1)}
              onSubmit={handleSubmit}
              submitLabel={isEditMode ? "수정 완료" : undefined}
            />
          </div>

          <div className="w-full md:w-[300px]">
            <RecruitRoleList
              onChange={setRecruitCards}
              authorName={finalAuthorName}
            />
          </div>
        </div>
      </div>
    </>
  );
}
