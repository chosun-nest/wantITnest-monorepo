import React, { useState, useRef, useEffect } from "react";
import PostAuthorCard from "../components/interests/detail/PostAuthorCard.tsx";
import Navbar from "../components/layout/navbar";

export default function InterestsDetail() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="flex flex-col max-w-6xl px-20 py-10 mx-auto text-gray-800 bg-white lg:flex-row"
        style={{ paddingTop: navHeight + 40}}
      >
        {/* 왼쪽: 게시글 본문 */}
        <div className="flex-1 lg:pr-8">
          {/* 제목 및 메타 정보 */}
          <h1 className="mb-2 text-2xl font-bold">관심분야 정보 게시판 출시!</h1>
          <div className="mb-4 space-x-4 text-sm text-gray-500">
            <span>2025.05.08. 14:24</span>
          </div>
          <div className="mb-4 space-x-4 text-sm text-gray-500">
            <span>추천 <span className="text-[#72afff] font-semibold">1</span></span>
            <span>조회 <span className="text-[#72afff] font-semibold">437</span></span>
            <span>댓글 <span className="text-[#72afff] font-semibold">2</span></span>
          </div>

          {/* 구분선 */}
          <hr className="my-6 border-t border-gray-300" />

          {/* 본문 내용 */}
          <div className="mb-6 prose max-w-none">
            <p>관심분야 정보 게시판 기능 정리</p>
            <img src="/assets/images/user.png" width="20" alt="첨부 이미지" className="my-1 rounded-md" />
            <pre><code>{`function example() {console.log("Hello World");}`}</code></pre>
            <a href="https://www.acmicpc.net" className="text-blue-600 underline" target="_blank">
              https://www.acmicpc.net
            </a>
          </div>

          {/* 태그 */}
          <div className="flex items-center justify-start mb-4 space-x-2">
            <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">개발•프로그래밍</span>
            <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">MacOS</span>
          </div>

          {/* 버튼 */}
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
              👍🏻 좋아요 1
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
              👎🏻 싫어요 0
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50">
              🔗 공유
            </button>
          </div>

          {/* 첨부 파일 */}
          <div className="mb-6">
            <label className="font-semibold">첨부 파일</label>
            <div className="p-2 mt-2 text-sm border rounded bg-gray-50">첨부파일_예시.pdf</div>
          </div>

          {/* 댓글 입력 */}
          <div className="mb-6">
            <p className="mb-2 text-lg font-semibold">댓글 2</p>
            <textarea
              className="w-full p-3 border rounded resize-none"
              rows={4}
              maxLength={1500}
              placeholder="댓글을 작성하세요 (최대 1500자)"
            ></textarea>
            <div className="mt-2 text-right">
              <button className="px-4 py-2 text-white bg-blue-900 rounded">작성</button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-6">
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/example/profile1.png" className="w-8 h-8 rounded-full" alt="프로필" />
                  <span className="font-medium">Hello WD</span>
                  <span className="text-sm text-gray-400">6개월 전</span>
                </div>
                <button className="text-sm text-blue-600">⋮</button>
              </div>
              <p className="mt-2 text-gray-700">네 봅니다 :D</p>
              <button className="flex items-center px-3 py-1 mt-2 text-sm text-blue-600 border rou nded hover:bg-gray-50">
                답글 1
              </button>
              
              {/* 답글 */}
              <div className="pl-4 mt-4 ml-6 border-l">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/example/profile2.png" className="rounded-full w-7 h-7" alt="프로필" />
                    <span className="font-medium">cocoa</span>
                    <span className="text-sm text-gray-400">5개월 전</span>
                  </div>
                  <button className="text-sm text-blue-600">⋮</button>
                </div>
                <p className="mt-2 text-gray-700">당근 빠따죠</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 작성자 정보 */}
        <div className="w-full mt-10 lg:mt-0 lg:w-64 lg:shrink-0">
          <PostAuthorCard
            memberId={123}
            memberName="김영은"
            memberImageUrl="/assets/images/user.png"
            followerCount={22}
            isFollowing={false}
            onToggleFollow={() => console.log("팔로우 토글")}
          />
        </div>
      </div>
    </>
  );
}
