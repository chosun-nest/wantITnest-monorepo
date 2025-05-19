import { useNavigate } from "react-router-dom";
import useResponsive from "../../../hooks/responsive";

interface InterestPostCardListProps {
  posts: {
    id: number;
    title: string;
    summary: string;
    tags: string[];
    author: string;
    date: string;
    views: number;
    likes: number;
    comments: number;
  }[];
}

export default function InterestPostCardList({ posts }: InterestPostCardListProps) {
  const isMobile = useResponsive();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => navigate(`/interests-detail/${post.id}`)}
          className="p-4 border rounded-lg cursor-pointer hover:shadow"
        >
          <div className={`flex items-center gap-2 mb-2 ${isMobile ? "flex-wrap" : ""}`}>
            <h2 className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}>
              {post.title}
            </h2>
          </div>

          <p className="mb-2 text-sm text-gray-700">
            {post.summary.length > 100
              ? `${post.summary.slice(0, 100)}...`
              : post.summary}
          </p>

          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {post.author} • {post.date}
            </span>
            <div className="flex gap-3">
              <span>조회수 {post.views}</span>
              <span>좋아요 {post.likes}</span>
              <span>댓글수 {post.comments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
