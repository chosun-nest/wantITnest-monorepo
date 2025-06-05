import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { fetchPostDetail, deletePost } from "../api/interests/InterestsAPI";
import { deletePost } from "../api/interests/InterestsAPI";
// import { fetchComments } from "../api/board-common/CommentAPI"; // 댓글 API 호출
import type { PostDetail as PostDetailType } from "../api/types/interest-board";
// import type { Comment } from "../api/types/comments"; // 댓글 타입
import Navbar from "../components/layout/navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DotsThreeVertical } from "phosphor-react";
import Modal from "../components/common/modal";
import ConfirmModal from "../components/common/ConfirmModal";
// import CommentSection from "../components/interests/detail/CommentSection"; // 댓글 컴포넌트

export default function InterestsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [post, setPost] = useState<PostDetailType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);

  // const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록 상태
  // const isLoggedIn = !!localStorage.getItem("accesstoken"); // 로그인 여부

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);
  
  useEffect(() => {
  // 임시 게시글 데이터로 UI 테스트
  const mockPost: PostDetailType = {
    postId: 1,
    title: "임시 제목입니다.",
    content: "### 게시글 본문 예시입니다.\n- 마크다운 렌더링 테스트",
    tags: ["React", "UI 테스트"],
    author: {
      id: 825,
      name: "관리자",
    },
    viewCount: 123,
    likeCount: 10,
    dislikeCount: 1,
    createdAt: new Date().toISOString(), // 오늘 날짜
    updatedAt: new Date().toISOString()
  };

  setPost(mockPost);
}, []);

  // 403 백엔드 해결되면 게시글 호출 주석 풀기
  // useEffect(() => {
  //   const loadPost = async () => {
  //     if (!id) return;
  //     try {
  //       const data = await fetchPostDetail(Number(id));
  //       setPost(data);
  //     } catch (err) {
  //       console.error("게시글 불러오기 실패", err);
  //     }
  //   };
  //   loadPost();
  // }, [id]);

  // 댓글 API 호출 → 서버에서 403 Forbidden 오류 발생으로 주석 처리
  // 추후 인증 정책이 수정되면 주석 해제하고 복구 예정
  /*
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      try {
        const data = await fetchComments("INTEREST", Number(id));
        setComments(data.comments);
      } catch (err) {
        console.error("댓글 불러오기 실패", err);
      }
    };
    loadComments();
  }, [id]);
  */

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePost(Number(id));
      setShowDeleteConfirm(false);
      setShowDeleteComplete(true);
      setTimeout(() => navigate("/interests-borad"), 1500);
    } catch (err) {
      console.error("게시글 삭제 실패", err);
    }
  };

  const handleEdit = () => {
    if (!post) return;
    navigate("/board-write", { state: { post } });
  };

  if (!post) return null;

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="max-w-5xl px-4 py-10 mx-auto" style={{ paddingTop: navHeight + 40 }}>
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
          <div className="relative">
            <button
              className="p-2 text-gray-600 rounded hover:bg-gray-100"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <DotsThreeVertical size={20} weight="bold" />
            </button>
            <div className="absolute right-0 z-10 mt-2 bg-white border rounded shadow-md">
              <button
                onClick={handleEdit}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                게시글 수정
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
              >
                게시글 삭제
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img
            src="/assets/images/manager-bird.png"
            alt="작성자"
            className="rounded-full w-9 h-9"
          />
          <span className="text-sm font-semibold text-[#002F6C]">{post.author.name}</span>
          {post.author.id !== 825 && (
            <button className="ml-auto px-3 py-1 text-sm border border-[#002F6C] text-[#002F6C] rounded hover:bg-gray-50">
              + 팔로우
            </button>
          )}
        </div>

        <div className="mb-4 text-sm text-gray-500">
          <span>{post.createdAt.slice(0, 10)}</span>
          <span className="mx-2">·</span>
          <span>조회 {post.viewCount}</span>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="mb-6 prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-sm bg-gray-200 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <button className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
            좋아요 {post.likeCount}
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
            싫어요 {post.dislikeCount}
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
            🔗 공유
          </button>
        </div>

        {/* 댓글 렌더링 주석 처리 */}
        {/* 
        <hr className="my-6 border-gray-300" />
        <CommentSection comments={comments} isLoggedIn={isLoggedIn} />
        */}
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="게시글 삭제"
          message="정말 이 게시글을 삭제하시겠습니까?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showDeleteComplete && (
        <Modal
          title="삭제 완료"
          message="게시글이 성공적으로 삭제되었습니다."
          type="info"
          onClose={() => setShowDeleteComplete(false)}
        />
      )}
    </>
  );
}
