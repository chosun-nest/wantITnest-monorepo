import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { PostDetail as PostDetailType } from "../api/types/interest-board";
import { fetchPostDetail } from "../api/interests/InterestsAPI";
import Navbar from "../components/layout/navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const mockPost: PostDetailType = {
  postId: 0,
  title: "AI 시대의 놀이터, 허깅페이스 완전 분석",
  content:
    "# 허깅페이스란?\nAI 모델과 데이터를 위한 오픈플랫폼입니다.\n\n## 사용 방법\n- Transformers\n- Datasets\n- Spaces",
  author: {
    id: 825,
    name: "관리자"
  },
  tags: ["AI", "허깅페이스", "Transformers"],
  viewCount: 123,
  likeCount: 45,
  dislikeCount: 2,
  createdAt: "2025-05-22T16:00:00.000Z",
  updatedAt: "2025-05-22T16:00:00.000Z"
};

export default function InterestsDetail() {
  const { id } = useParams();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [post, setPost] = useState<PostDetailType | null>(null);

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await fetchPostDetail(Number(id));
        setPost(data);
      } catch (err) {
        console.error("게시글 조회 실패", err);
        setPost(mockPost); // fallback
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return null;

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="flex flex-col max-w-6xl px-20 py-10 mx-auto text-gray-800 bg-white lg:flex-row"
        style={{ paddingTop: navHeight + 40 }}
      >
        <div className="flex-1 lg:pr-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img
                src={"/assets/images/manager-bird.png"}
                alt="프로필"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-bold text-[#002F6C]">{post.author.name}</span>
            </div>
            <button className="px-3 py-1 text-sm text-[#002F6C] border rounded-md border-[#002F6C] hover:bg-gray-100">
              + 팔로우
            </button>
          </div>

          <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
          <div className="mb-4 space-x-4 text-sm text-gray-500">
            <span>{post.createdAt.slice(0, 10)}</span>
            {post.createdAt !== post.updatedAt && (
              <span className="italic text-gray-400"> (수정됨)</span>
            )}
          </div>
          <div className="mb-4 space-x-4 text-sm text-gray-500">
            <span>
              추천 <span className="text-[#72afff] font-semibold">{post.likeCount}</span>
            </span>
            <span>
              조회 <span className="text-[#72afff] font-semibold">{post.viewCount}</span>
            </span>
            <span>
              댓글 <span className="text-[#72afff] font-semibold">2</span>
            </span>
          </div>

          <hr className="my-6 border-t border-gray-300" />
          <div className="mb-6 prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="flex items-center justify-start mb-4 space-x-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm bg-gray-200 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
              좋아요 {post.likeCount}
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
              싫어요 {post.dislikeCount}
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
              🔗 공유
            </button>
          </div>
        </div>
      </div>
    </>
  );
}