<<<<<<< HEAD
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
  import FollowButton from "../components/interests/detail/FollowButton";
  import PostDetailContent from "../components/interests/detail/PostDetailContent";
  import PostDetailTags from "../components/interests/detail/PostDetailTags";
  import PostDetailActions from "../components/interests/detail/PostDetailActions";
  import CommentSection from "../components/interests/detail/CommentSection";

  export default function InterestsDetail() {
    const { id } = useParams(); // 주소에서 postId 추출
    const navigate = useNavigate();
    const navbarRef = useRef<HTMLDivElement>(null);

    const [navHeight, setNavHeight] = useState(0);
    const [post, setPost] = useState<PostDetail | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteComplete, setShowDeleteComplete] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const memberId = Number(localStorage.getItem("memberId"));
    const isLoggedIn = !Number.isNaN(memberId); // 로그인 여부 확인

    // 네비게이션 바 높이 계산
    useEffect(() => {
      if (navbarRef.current) {
        setNavHeight(navbarRef.current.offsetHeight);
      }
    }, []);

    // 게시글 상세 조회
    useEffect(() => {
      const loadPost = async () => {
        if (!id) return;
        const postId = Number(id);

        try {
          const data = await fetchPostDetail(postId);
          console.log("🔍 게시글 상세:", data);
          setPost(data);
        } catch (err) {
          const error = err as { response?: { status?: number } };
          if (error.response?.status === 404) {
            setNotFound(true);
          } else {
            console.error("게시글 로딩 실패", err);
          }
        }
      };

      loadPost();
    }, [id]);

    // 게시글 삭제
    const handleDelete = async () => {
      if (!id || !post || post.author.id !== memberId) return;

      try {
        await deletePost(post.postId);
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

    // 게시글이 존재하지 않는 경우
    if (notFound) {
      return (
        <div className="mt-20 text-center text-gray-500">
          해당 게시글을 찾을 수 없습니다.
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
          >
            ← 뒤로가기
          </button>
        </div>
      );
=======
// 게시글 상세 페이지
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPostDetail,
  deletePost,
  reactToPost,
} from "../api/interests/InterestsAPI";
import type { PostDetail } from "../api/types/interest-board";

import { getMemberProfile } from "../api/profile/ProfileAPI";
import { useSelector, useDispatch } from "react-redux"; // 리덕스를 통해 사용자 구분 상태 관리
import { setUser, selectCurrentUserId } from "../store/slices/userSlice"; // memberId, memberName, memberRole

import Navbar from "../components/layout/navbar";
import Modal from "../components/common/modal";
import ConfirmModal from "../components/common/ConfirmModal";
import PostDetailHeader from "../components/interests/detail/PostDetailHeader";
import PostDetailInfo from "../components/interests/detail/PostDetailInfo";
import FollowButton from "../components/interests/detail/FollowButton";
import PostDetailContent from "../components/interests/detail/PostDetailContent";
import PostDetailTags from "../components/interests/detail/PostDetailTags";
import PostDetailActions from "../components/interests/detail/PostDetailActions";
import CommentSection from "../components/interests/detail/CommentSection";

export default function InterestsDetail() {
  const { id } = useParams(); // 주소에서 postId 추출
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  const currentUserId = useSelector(selectCurrentUserId);
  const [post, setPost] = useState<PostDetail | null>(null);
  const isAuthor = post?.author.id === currentUserId; // 작성자와 현재 사용자 비교
  const dispatch = useDispatch();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const memberId = useSelector(selectCurrentUserId);
  const isLoggedIn = memberId !== null;

  useEffect(() => {
    getMemberProfile().then((user) => {
      dispatch(
        setUser({
          memberId: user.memberId,
          memberName: user.memberName,
          memberRole: user.memberRole,
        })
      );
    });
  });

  // 네비게이션 바 높이 계산
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  // 게시글 상세 조회
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      const postId = Number(id);

      try {
        const data = await fetchPostDetail(postId);
        console.log("🔍 게시글 상세:", data);
        setPost(data);
      } catch (err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("게시글 로딩 실패", err);
        }
      }
    };

    loadPost();
  }, [id]);

  // 게시글 삭제
  const handleDelete = async () => {
    if (!id || !post || post.author.id !== memberId) return; // memberId가 Redux 기준으로 비교됨.

    try {
      await deletePost(post.postId);
      setShowDeleteConfirm(false);
      setShowDeleteComplete(true);
      setTimeout(() => navigate("/interests-board"), 1500);
    } catch (err) {
      console.error("게시글 삭제 실패", err);
>>>>>>> origin/dev
    }

<<<<<<< HEAD
    // 로그인 안 된 경우 차단
    if (!isLoggedIn) {
      return (
        <div className="mt-20 text-center text-gray-500">
          로그인 후 게시글을 확인할 수 있습니다.
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
          >
            로그인하러 가기
          </button>
        </div>
      );
    }

    if (!post) return null;

    const isAuthor = post.author.id === memberId;

    return (
      <>
        <Navbar ref={navbarRef} />
          <div
            className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
            style={{ paddingTop: navHeight + 120 }}
          >
            {/* 게시글 제목 */}
            <h2 className="text-2xl font-bold text-[#00256c] mb-4">
              {post?.title || "제목 없음"}
            </h2>
          
            <div className="flex items-start justify-between mb-2">
              <PostDetailInfo
                author={post.author}
                isAuthor={isAuthor}
                viewCount={post.viewCount}
                date={post.updatedAt}
              />

              {!isAuthor && (
                <div className="flex gap-2 items-right">
                  <FollowButton />
                  <PostDetailHeader
                    isAuthor={isAuthor}
                    onEdit={() => navigate("/board-write", { state: { post } })}
                    onDelete={() => setShowDeleteConfirm(true)}
                  />
                </div>
              )}
              
            </div>

          <hr className="my-5 border-gray-200" />

          {/* 게시글 본문 */}
          <div className="mb-6">
            <PostDetailContent content={post.content} />
=======
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

  // 게시글이 존재하지 않는 경우
  if (notFound) {
    return (
      <div className="mt-20 text-center text-gray-500">
        해당 게시글을 찾을 수 없습니다.
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-4 text-white bg-[#1e3a8a] rounded"
        >
          ← 뒤로가기
        </button>
      </div>
    );
  }

  // 로그인 안 된 경우 차단
  if (!isLoggedIn) {
    return (
      <div className="mt-20 text-center text-gray-500">
        로그인 후 게시글을 확인할 수 있습니다.
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (!post) return null;

  //const isAuthor = post.author.id === memberId; // 로그인한 사용자와 memberID(작성자) 같은지 비교?

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
        style={{ paddingTop: navHeight + 120 }}
      >
        {/* 게시글 제목 */}
        <h2 className="text-2xl font-bold text-[#00256c] mb-4">
          {post?.title || "제목 없음"}
        </h2>

        <div className="flex items-start justify-between mb-2">
          <PostDetailInfo
            author={post.author}
            isAuthor={isAuthor}
            viewCount={post.viewCount}
            date={post.updatedAt}
          />

          <div className="flex items-center gap-2">
            {!isAuthor && <FollowButton />}
            <PostDetailHeader
              isAuthor={isAuthor}
              onEdit={() => navigate("/board-write", { state: { post } })}
              onDelete={() => setShowDeleteConfirm(true)}
            />
>>>>>>> origin/dev
          </div>

          {/* 태그 */}
          <div className="mb-6">
            <PostDetailTags tags={post.tags} />
          </div>

          {/* 좋아요 / 싫어요 버튼 */}
          <div className="mb-8">
            <PostDetailActions
              likeCount={post.likeCount}
              dislikeCount={post.dislikeCount}
              onLike={() => handleReaction("LIKE")}
              onDislike={() => handleReaction("DISLIKE")}
            />
          </div>
          
          {/* 댓글란 */}
          <CommentSection
          boardType="INTEREST"
          postId={post.postId}
          //memberId={memberId}
        />
        </div>

<<<<<<< HEAD
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
=======
        <hr className="my-5 border-gray-200" />

        {/* 게시글 본문 */}
        <div className="mb-6">
          <PostDetailContent content={post.content} />
        </div>

        {/* 태그 */}
        <div className="mb-6">
          <PostDetailTags tags={post.tags} />
        </div>

        {/* 좋아요 / 싫어요 버튼 */}
        <div className="mb-8">
          <PostDetailActions
            likeCount={post.likeCount}
            dislikeCount={post.dislikeCount}
            onLike={() => handleReaction("LIKE")}
            onDislike={() => handleReaction("DISLIKE")}
          />
        </div>

        {/* 댓글란 */}
        <CommentSection
          boardType="INTEREST"
          postId={post.postId}
          //memberId={memberId}
        />
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
>>>>>>> origin/dev
