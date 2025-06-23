//import useResponsive from "../../../hooks/responsive";
interface InterestPostCardListProps {
  posts: {
    postId: number;
    title: string;
    previewContent: string;
    tags: string[];
    author: {         // 작성자 정보
      id: number;
      name: string;
    };
    createdAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }[];
  onCardClick: (postId: number) => void; // 카드 클릭 핸들러 추가
}

export default function InterestPostCardList({
  posts,
  onCardClick,
}: InterestPostCardListProps) {
  //const isMobile = useResponsive();     // 모바일 대응 없애기

  return (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
    {posts
      .filter((post) => !!post.postId && !!post.author)
      .map((post) => (
      <div
        key={post.postId}
        onClick={() => onCardClick(post.postId)}
        className="p-4 border rounded-lg cursor-pointer hover:shadow min-h-[180px] flex flex-col"
      >
        <div className="mb-2">
          <h2 className="text-lg font-semibold break-words">{post.title}</h2>
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {post.previewContent}
          </p>

          {/* 태그 영역 */}
          {post.tags && post.tags.length > 0 && post.tags.some(tag => tag !== "UNCATEGORIZED") && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags
                .filter(tag => tag !== "UNCATEGORIZED")
                .map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between pt-4 mt-auto text-xs text-gray-500">
          <span>{post.author?.name ?? "작성자 없음"} • {post.createdAt}</span>
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