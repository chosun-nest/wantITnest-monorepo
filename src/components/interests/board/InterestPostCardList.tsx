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
      {posts.map((post) => (
        <div
          key={post.postId}
          onClick={() => {
            if (post.postId) {
              navigate(`/interests-detail/${post.postId}`);
            } else {
              console.error("postId가 유효하지 않습니다.", post);
            }
          }}
          className="p-4 border rounded-lg cursor-pointer hover:shadow"
        >
          <div className={`flex items-center gap-2 mb-2 ${isMobile ? "flex-wrap" : ""}`}>
            <h2 className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}>
              {post.title}
            </h2>
          </div>

          <p className="mb-2 text-sm text-gray-700">
            {post.previewContent.length > 100     // 100자 preview
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
