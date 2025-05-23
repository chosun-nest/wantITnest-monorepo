import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/layout/navbar";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";

import BoardTypeSelector from "../components/board/write/BoardTypeSelector";
import TitleInput from "../components/board/write/TitleInput";
import ParticipantsInput from "../components/board/write/ParticipantsInput";
import MarkdownEditor from "../components/board/write/MarkdownEditor";
import SubmitButtons from "../components/board/write/SubmitButtons";

import { createInterestPost } from "../api/interests/InterestsAPI";   // interests 전용 API
//import { CreateProjectPayload } from "../api/project/api";

import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";

// 게시판 타입 정의
type BoardType = "interests" | "projects";

interface CreatePostPayload {
  title: string;
  content: string;
  tags: string[];
}

export default function BoardWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);

  const [navHeight, setNavHeight] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [boardType, setBoardType] = useState<BoardType>(() => {
    const from = location.state?.from;
    return from === "project-board" ? "projects" : "interests";
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [participants, setParticipants] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  const defaultProjectContent = `[개발 프로젝트 모집 예시]

- 프로젝트 주제: 
- 프로젝트 목표: 
- 예상 프로젝트 일정(횟수):`;

  const defaultInterestContent = `[관심분야 정보 예시]

# AI 시대 개발자들의 놀이터 '허깅페이스'
## 1. 허깅 페이스란?

## 2. 허깅 페이스 핵심 서비스들 보기

## 3. 허깅 페이스 활용 사례
`;

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    setContent(boardType === "projects" ? defaultProjectContent : defaultInterestContent);
  }, [boardType]);

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

    try {
      if (boardType === "interests") {
        const payload: CreatePostPayload = { title, content, tags: selectedTags };
        await createInterestPost(payload);
        setModalContent({
          title: "게시 완료",
          message: "게시글이 등록되었습니다. 관심분야 정보 게시판에서 확인하세요.",
          type: "info",
          onClose: () => {
            setShowModal(false);
            navigate("/interests-board");
          },
        });
      } else {
        setModalContent({
          title: "준비 중",
          message: "프로젝트 게시판 글쓰기 기능은 아직 준비 중입니다.",
          type: "error",
        });
      }
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setModalContent({
        title: "등록 실패",
        message: "게시글 등록에 실패했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-4xl mx-auto px-4 mt-[40px]" style={{ paddingTop: navHeight }}>
        <BoardTypeSelector boardType={boardType} setBoardType={setBoardType} />

        <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
          <strong>
            {boardType === "projects"
              ? "프로젝트 모집 예시를 참고해 작성해주세요."
              : "관심분야 정보 예시를 참고해 작성해주세요."}
          </strong>
          <br />
          {boardType === "projects"
            ? "꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요."
            : "최신 관심분야에 대한 정보를 정확하게 입력해주세요."}
        </div>

        <TitleInput title={title} setTitle={setTitle} boardType={boardType} />

        {boardType === "projects" && (
          <ParticipantsInput participants={participants} setParticipants={setParticipants} />
        )}

        <MarkdownEditor content={content} setContent={setContent} />

        <div className="mb-6">
          <BoardTagFilterButton
            selectedTags={selectedTags}
            onRemoveTag={removeSelectedTag}
            onOpenFilter={() => setShowFilterModal(true)}
          />
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
            title={modalContent.title}
            message={modalContent.message}
            type={modalContent.type}
            onClose={() => {
              setShowModal(false);
              modalContent.onClose?.();
            }}
          />
        )}

        <SubmitButtons onCancel={() => navigate(-1)} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
