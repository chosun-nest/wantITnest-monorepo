// 공지사항 게시판 API 연동 중인 내용 저장용 tsx 파일

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