// import { useEffect, useState } from "react";
// import { fetchNotices } from "../../api/notices/NoticesAPI"; // API 연동
// import { NoticeItem } from "../../api/types/notice-board";

// import NoticeBoardHeader from "./NoticeBoardHeader";
// import NoticeBoardSearch from "./NoticeBoardSearch";
// import NoticeDropdown from "./NoticeDropdown";
// import NoticeCard from "./NoticeCard";

// const CATEGORY_LIST = [
//   "일반공지",
//   "학사공지",
//   "장학공지",
//   "IT융합대학 공지",
//   "컴퓨터공학과 공지",
// ];

// function NoticeBoard() {
//   const [category, setCategory] = useState("전체");
//   const [notices, setNotices] = useState<NoticeItem[]>([]);
//   const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태

//   useEffect(() => {
//     if (category === "전체") {
//       Promise.all(
//         CATEGORY_LIST.map((cat) => fetchNotices(cat))
//       )
//         .then((results) => {
//           const merged = results.flatMap((res, i) =>
//             res.notices.map((n) => ({ ...n, category: CATEGORY_LIST[i] }))
//           );
//           const sorted = merged.sort(
//             (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//           );
//           setNotices(sorted);
//         })
//         .catch((err) => console.error("❌ 전체 공지 불러오기 실패:", err));
//       return;
//     }

//     fetchNotices(category)
//       .then((res) => {
//         const sorted = res.notices
//           .map((n) => ({ ...n, category }))
//           .sort(
//             (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//           );
//         setNotices(sorted);
//       })
//       .catch((err) => console.error("❌ 공지 불러오기 실패:", err));
//   }, [category]);

//   return (
//     <div style={{ padding: "80px 24px" }}>
//       <NoticeBoardHeader />

//       <div className="max-w-5xl px-4 mx-auto">
//         <NoticeDropdown selected={category} onChange={setCategory} />
//         <hr className="mb-4" />
//         <p className="mb-4 text-sm text-gray-700">
//           총 <strong>{notices.length}</strong>개의 게시물이 있습니다.
//         </p>
//       </div>

//       <NoticeBoardSearch
//         searchKeyword={searchKeyword}
//         setSearchKeyword={setSearchKeyword}
//       />

//       <div className="mt-6">
//         {notices.length > 0 ? (
//           notices.map((notice, idx) => <NoticeCard key={idx} notice={notice} />)
//         ) : (
//           <p>공지사항이 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default NoticeBoard;

// src/pages/NoticeBoard.tsx

import { useEffect, useState, useRef } from "react";
import Navbar from "../layout/navbar";
import NoticeBoardHeader from "./NoticeBoardHeader";
import NoticeBoardSearch from "./NoticeBoardSearch";
import NoticeDropdown from "./NoticeDropdown";
import NoticeCard from "./NoticeCard";

interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  link: string;
  category?: string;
  deadline?: string;
}

const CATEGORY_LIST = [
  "일반공지",
  "학사공지",
  "장학공지",
  "IT융합대학 공지",
  "컴퓨터공학과 공지",
];

export default function NoticeBoard() {
  // 내비게이션 바 높이를 측정할 ref/state
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  // 카테고리·공지 목록·검색어 상태
  const [category, setCategory] = useState("전체");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  // mount 시점에 navbar 높이 계산
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  // 카테고리 변경 또는 mount 시 공지 fetch
  useEffect(() => {
    const loadNotices = async () => {
      try {
        if (category === "전체") {
          const results = await Promise.all(
            CATEGORY_LIST.map((cat) =>
              fetch(`http://34.64.252.112:8000/crawl/${cat}`).then((res) => res.json())
            )
          );
          const merged: Notice[] = results.flatMap((res, i) =>
            (res.notices ?? []).map((n: Notice) => ({ ...n, category: CATEGORY_LIST[i] }))
          );
          merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNotices(merged);
        } else {
          const res = await fetch(`http://34.64.252.112:8000/crawl/${category}`);
          const data = await res.json();
          const list: Notice[] = (data.notices ?? []).map((n: Notice) => ({ ...n, category }));
          list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNotices(list);
        }
      } catch (err) {
        console.error("❌ 공지 불러오기 실패:", err);
      }
    };

    loadNotices();
  }, [category]);

  return (
    <>
      {/* 1) 최상단 네비게이션 바 */}
      <Navbar ref={navbarRef} />

      {/* 2) navHeight 만큼 상단 padding을 준 콘텐츠 영역 */}
      <div
        className="max-w-5xl mx-auto"
        style={{ padding: `${navHeight}px 24px` }}
      >
        {/* 제목 + 게시글 개수 */}
        <NoticeBoardHeader />

        {/* 검색 */}
        <div className="max-w-5xl px-4 mx-auto">
          <NoticeDropdown selected={category} onChange={setCategory} />
          <NoticeBoardSearch
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
          <hr className="my-4" />
          <p className="text-sm text-gray-700">
            총 <strong>{notices.length}</strong>개의 게시물이 있습니다.
          </p>
        </div>

        {/* 공지 리스트 */}
        <div className="mt-6">
          {notices.length > 0 ? (
            notices.map((notice, idx) => (
              <NoticeCard key={idx} notice={notice} />
            ))
          ) : (
            <p className="text-center text-gray-500">공지사항이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
}
