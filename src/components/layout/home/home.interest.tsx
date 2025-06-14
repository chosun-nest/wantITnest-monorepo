import { useEffect, useState } from "react";
import { getTopPosts } from "../../../utils/getTopPosts";
import { PostSummary } from "../../../types/api/interest-board";
import { useNavigate } from "react-router-dom";

export default function HomeInterest() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopPosts({ size: 5 }).then(setPosts).catch(console.error);
  }, []);

  const handleCardClick = (postId: number) => {
    navigate(`/interests-detail/${postId}`);
  };

  return (
    <div
      className="overflow-x-auto scrollbar-instagram -mx-2 px-2"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
      }}
    >
      <div className="flex gap-4 py-2 touch-auto">
        {posts.map((post) => (
          <div
            key={post.postId}
            onClick={() => handleCardClick(post.postId)}
            className="min-w-[250px] max-w-[300px] shrink-0 border rounded-lg p-4 cursor-pointer hover:shadow transition"
          >
            <h2 className="font-semibold text-base mb-2">{post.title}</h2>

            <p className="mb-2 text-sm text-gray-700">
              {post.previewContent.length > 100
                ? `${post.previewContent.slice(0, 100)}...`
                : post.previewContent}
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {post.author?.name ?? "작성자 없음"} • {post.createdAt}
              </span>
              <div className="flex gap-2">
                <span>조회 {post.viewCount}</span>
                <span>♥ {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
