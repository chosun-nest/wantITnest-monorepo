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

//       <div className="max-w-5xl mx-auto px-4">
//         <NoticeDropdown selected={category} onChange={setCategory} />
//         <hr className="mb-4" />
//         <p className="text-sm text-gray-700 mb-4">
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

import { useEffect, useState } from "react";
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

function NoticeBoard() {
  const [category, setCategory] = useState("전체");
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (category === "전체") {
      Promise.all(
        CATEGORY_LIST.map((cat) =>
          fetch(`http://34.64.252.112:8000/crawl/${cat}`).then((res) => res.json())
        )
      )
        .then((results) => {
          const merged = results.flatMap((res, i) =>
            res.notices ? res.notices.map((n: Notice) => ({ ...n, category: CATEGORY_LIST[i] })) : []
          );
          setNotices(
            merged.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        })
        .catch((err) => console.error("❌ 전체 공지 불러오기 실패:", err));
      return;
    }

    fetch(`http://34.64.252.112:8000/crawl/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.notices) {
          setNotices(
            data.notices
              .map((n: Notice) => ({ ...n, category }))
              .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )
          );
        } else setNotices([]);
      })
      .catch((err) => console.error("❌ 공지 불러오기 실패:", err));
  }, [category]);

  return (
    <div style={{ padding: "80px 24px" }}>
      <NoticeBoardHeader />

      <div className="max-w-5xl mx-auto px-4">
        <NoticeDropdown selected={category} onChange={setCategory} />
        <hr className="mb-4" />
        <p className="text-sm text-gray-700 mb-4">
          총 <strong>{notices.length}</strong>개의 게시물이 있습니다.
        </p>
      </div>

      <NoticeBoardSearch />

      <div className="mt-6">
        {notices.length > 0 ? (
          notices.map((notice, idx) => <NoticeCard key={idx} notice={notice} />)
        ) : (
          <p>공지사항이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default NoticeBoard;