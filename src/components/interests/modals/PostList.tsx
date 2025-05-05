// 게시글 리스트 컴포넌트
import React, { useState } from "react";

interface Post {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  author: string;
  date: string;
  likes: number;
  views: number;
  comments: number;
}

interface PostListProps {
  selectedTags: string[];
}

// mock data (실제 API 대체 예정)
const mockPosts: Post[] = [
  {
    id: 1,
    title: "MacOS base64 Encoding Decoding",
    summary: "MacOS에서 인코딩 디코딩을 쉽게 할 수 있는 방법에 대해 설명합니다...",
    tags: ["웹 개발"],
    author: "맛집을 만나러 갑니다",
    date: "4일 전",
    likes: 22,
    views: 38,
    comments: 4
  },
  {
    id: 2,
    title: "갤럭시S25 지금 구매하기 가장 좋은 이유",
    summary: "SKT 해커 사건 이후 지금이 적기인 이유에 대해 정리합니다...",
    tags: ["모바일 앱 개발"],
    author: "자유",
    date: "4일 전",
    likes: 4,
    views: 1,
    comments: 1
  },
  {
    id: 3,
    title: "SK텔레콤 유심 정보 유출 사건 총정리",
    summary: "단순한 해프닝이 아닌 근본적인 보안 문제로 볼 수 있는 이유들...",
    tags: ["보안"],
    author: "정성을 다하는 병원공간",
    date: "1일 전",
    likes: 2,
    views: 14,
    comments: 3
  }
];

export default function PostList({ selectedTags }: PostListProps) {
  const [sortBy, setSortBy] = useState<"latest" | "likes">("latest");

  const filtered = selectedTags.length
    ? mockPosts.filter((post) =>
        post.tags.some((tag) => selectedTags.includes(tag))
      )
    : mockPosts;

  const sorted = [...filtered].sort((a, b) => {
    return sortBy === "latest"
      ? b.id - a.id // 최신순은 ID 순으로 정렬 (예시)
      : b.likes - a.likes;
  });

  return (
    <div>
      {/* 정렬 드롭다운 */}
      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "latest" | "likes")}
          className="px-3 py-2 text-sm border rounded"
        >
          <option value="latest">최신순</option>
          <option value="likes">좋아요순</option>
        </select>
      </div>

      {/* 게시글 카드 */}
      <div className="space-y-6">
        {sorted.map((post) => (
          <div key={post.id} className="flex items-start justify-between p-4 bg-white rounded shadow">
            <div>
              <p className="mb-1 text-sm text-gray-500">{post.author} • {post.date}</p>
              <h3 className="text-lg font-semibold text-[#002F6C] mb-1">{post.title}</h3>
              <p className="mb-2 text-sm text-gray-700 line-clamp-2">{post.summary}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end text-sm text-gray-500 gap-1 min-w-[80px]">
              <span>♥ {post.likes}</span>
              <span>👁 {post.views}</span>
              <span>💬 {post.comments}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 - 예시 */}
      <div className="flex justify-center gap-2 mt-10">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
