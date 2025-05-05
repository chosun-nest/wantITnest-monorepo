// 게시글 리스트 컴포넌트
import React, { useMemo, useState } from "react";

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
  selectedTags: string[];       // 태그
  searchKeyword: string;        // 제목
  onCountChange: (count: number) => void;   // post 개수 counting
}


const postCards: Post[] = [
  {
    id: 1,
    title: "android 최신 버전 업데이트 소식",
    summary: "19일 저녁 해커에 의한 악성코드로 정보 유출 정황 발생...",
    tags: ["모바일 앱 개발", "보안"],
    author: "제로실버",
    date: "4일 전",
    likes: 22,
    views: 38,
    comments: 4,
  },
  {
    id: 2,
    title: "관심분야 정보 게시판 출시!",
    summary: "관심분야 정보 게시판 기능 정리",
    tags: ["개발•프로그래밍", "MacOS"],
    author: "지금 IT야",
    date: "4일 전",
    likes: 400,
    views: 1,
    comments: 1,
  },
];

export default function PostList({ selectedTags, searchKeyword }: PostListProps) {
  const [sort, setSort] = useState<"latest" | "likes">("latest");

  const filteredPosts = useMemo(() => {
    return postCards
      .filter((post) =>
        selectedTags.length > 0
          ? selectedTags.every((tag) => post.tags.includes(tag))
          : true
      )
      .filter((post) =>
        searchKeyword.trim() !== ""
          ? post.title.toLowerCase().includes(searchKeyword.toLowerCase())
          : true
      )
      .sort((a, b) => {
        if (sort === "likes") return b.likes - a.likes;
        return 0;
      });
  }, [selectedTags, searchKeyword, sort]);

  return (
    <div>
      {/* 정렬 선택 */}
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="p-2 text-sm border rounded"
        >
          <option value="latest">최신순</option>
          <option value="likes">좋아요순</option>
        </select>
      </div>

      {/* 게시글 카드 목록 */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-gray-800 cursor-pointer hover:underline">
                {post.title}
              </h3>
              <p className="mb-2 text-sm text-gray-600">{post.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-blue-800 bg-blue-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {post.author} • {post.date}
              </p>
            </div>
            <div className="flex flex-row justify-end items-end gap-2 text-sm text-gray-500 min-w-[70px]">
              <span>♡ {post.likes}</span>
              <span>👀 {post.views}</span>
              <span>💬 {post.comments}</span>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="mt-10 text-center text-gray-500">
            조건에 맞는 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
