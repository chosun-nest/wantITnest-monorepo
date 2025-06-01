// 게시글 상세 페이지
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPostDetail,
  deletePost,
  reactToPost,
} from "../api/interests/InterestsAPI";
import type { PostDetail } from "../api/types/interest-board";

import Navbar from "../components/layout/navbar";
import Modal from "../components/common/modal";
import ConfirmModal from "../components/common/ConfirmModal";
import PostDetailHeader from "../components/interests/detail/PostDetailHeader";
import PostDetailInfo from "../components/interests/detail/PostDetailInfo";
import PostDetailContent from "../components/interests/detail/PostDetailContent";
import PostDetailTags from "../components/interests/detail/PostDetailTags";
import PostDetailActions from "../components/interests/detail/PostDetailActions";
// import CommentSection from "../components/interests/detail/CommentSection";

export default function InterestsDetail() {
  const { id } = useParams(); // 주소에서 postId 추출
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);

  const [navHeight, setNavHeight] = useState(0);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);

  // 네비게이션 바 높이 계산
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  // 게시글 상세 조회
  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        console.warn("useParams에서 id 없음");
        return;
      }

      const postId = Number(id);
      console.log("🔍 postId = ", postId);

      try {
        const data = await fetchPostDetail(postId);
        console.log("fetchPostDetail 성공:", data);
        setPost(data);
      } catch (err) {
        console.error("게시글 불러오기 실패", err);
      }
    };

    loadPost();
  }, [id]);


  // 게시글 삭제
  const handleDelete = async () => {
    if (!id) return;

    try {
      await deletePost(Number(id));
      setShowDeleteConfirm(false);
      setShowDeleteComplete(true);
      setTimeout(() => navigate("/interests-board"), 1500);
    } catch (err) {
      console.error("게시글 삭제 실패", err);
    }
  };

  // 게시글 좋아요/싫어요 반응 처리
  const handleReaction = async (type: "LIKE" | "DISLIKE") => {
    if (!post) return;

    try {
      const result = await reactToPost(post.postId, type);
      setPost({
        ...post,
        likeCount: result.likeCount,
        dislikeCount: result.dislikeCount,
      });
    } catch (err) {
      console.error("반응 처리 실패", err);
    }
  };

  if (!post) return null;

  const isAuthor =
    post.author.id === Number(localStorage.getItem("memberId"));

  return (
    <>
      <Navbar ref={navbarRef} />

      <div
        className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
        style={{ paddingTop: navHeight + 32 }}
      >
        <PostDetailHeader
          title={post.title}
          isAuthor={isAuthor}
          onEdit={() => navigate("/board-write", { state: { post } })}
          onDelete={() => setShowDeleteConfirm(true)}
        />

        <PostDetailInfo
          author={post.author}
          isAuthor={isAuthor}
          viewCount={post.viewCount}
          date={post.updatedAt}
        />

        <hr className="my-6 border-gray-300" />

        <PostDetailContent content={post.content} />

        <PostDetailTags tags={post.tags} />

        <PostDetailActions
          likeCount={post.likeCount}
          dislikeCount={post.dislikeCount}
          onLike={() => handleReaction("LIKE")}
          onDislike={() => handleReaction("DISLIKE")}
        />

        <hr className="my-6 border-gray-300" />

        {/* <CommentSection /> */}
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
