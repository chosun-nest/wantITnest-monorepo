import { useEffect, useState } from 'react';
import NoticeBoardHeader from "./NoticeBoardHeader";
import NoticeBoardSearch from "./NoticeBoardSearch";
import NoticeBoardSortTabs from "./NoticeBoardSortTabs";
import NoticeCard from "./NoticeCard";
import { mockNotices } from "../../constants/mock-notices";

interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  content: string;
}

function NoticeBoard() {
  // 전체 공지 목록
  const [notices, setNotices] = useState<Notice[]>([]);

  // 선택된 카테고리 ("전체", "장학공지" 등)
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // mock 데이터로 초기화
  useEffect(() => {
    setNotices(mockNotices);
  }, []);

  // ✅ 카테고리 필터링: writer 기준
  const filteredNotices = notices.filter((notice) => {
    if (selectedCategory === "전체") return true;

    const writerMap: Record<string, string> = {
      "학사공지": "학사팀",
      "장학공지": "장학팀",
      "IT융합대학 공지": "IT융합대학 관리자",
      "컴퓨터공학과 공지": "컴퓨터공학과",
    };

    const targetWriter = writerMap[selectedCategory];
    return notice.writer === targetWriter;
  });

  return (
    <div style={{ padding: "80px 24px" }}>
      {/* 상단 헤더 */}
      <NoticeBoardHeader />

      {/* 카테고리 탭 */}
      <NoticeBoardSortTabs
        selectedCategory={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
      />

      {/* 검색창 */}
      <NoticeBoardSearch />

      {/* 공지 카드 리스트 */}
      <div style={{ marginTop: "24px" }}>
        {filteredNotices.map((notice, idx) => (
          <NoticeCard key={idx} notice={notice} />
        ))}
      </div>
    </div>
  );
}

export default NoticeBoard;
