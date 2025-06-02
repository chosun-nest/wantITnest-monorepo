import { useNavigate } from "react-router-dom";
import useResponsive from "../../../hooks/responsive";

interface InterestPostCardListProps {
  posts: {
    postId: number;
    title: string;
    previewContent: string;
    tags: string[];
    authorName: string;
    createdAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }[];
}

export default function InterestPostCardList({ posts }: InterestPostCardListProps) {
  const isMobile = useResponsive();
  const navigate = useNavigate();

  return (
  <div className="space-y-4">
    {posts
      .filter((post) => !!post.postId) // postId가 있는 게시글만 필터링
      .map((post) => (
        <div
          key={post.postId}
          onClick={() => navigate(`/interests-detail/${post.postId}`)}
          className="p-4 border rounded-lg cursor-pointer hover:shadow"
        >
          {/* 카드 내부 */}
          <div className={`flex items-center gap-2 mb-2 ${isMobile ? "flex-wrap" : ""}`}>
            <h2 className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}>
              {post.title}
            </h2>
          </div>

          <p className="mb-2 text-sm text-gray-700">
            {post.previewContent.length > 100
              ? `${post.previewContent.slice(0, 100)}...`
              : post.previewContent}
          </p>

          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {post.authorName} • {post.createdAt.slice(0, 10)}
            </span>
            <div className="flex gap-3">
              <span>조회수 {post.viewCount}</span>
              <span>좋아요 {post.likeCount}</span>
              <span>댓글수 {post.commentCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
