import { useEffect, useState } from "react";
import { Notice } from "../../../routes/NoticeBoard";
import { fetchNotices } from "../../../api/notices/NoticesAPI";
import NoticeCard from "../../notice/NoticeCard";

export default function HomeNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const CATEGORY_LIST = [
    "전체",
    "일반공지",
    "학사공지",
    "장학공지",
    "SW중심대학사업단",
    "IT융합대학",
    "컴퓨터공학전공",
    "정보통신공학전공",
    "인공지능공학전공",
    "모빌리티SW전공",
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const results = await Promise.all(
        CATEGORY_LIST.map((cat) => fetchNotices(cat, 0, 100))
      );
      const merged: Notice[] = results.flatMap((res, i) =>
        (res.notices ?? []).map((n) => ({ ...n, category: CATEGORY_LIST[i] }))
      );
      const sorted = merged.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const top5 = sorted.slice(0, 5);
      setNotices(top5);
    } catch (error) {
      console.error("공지 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="overflow-x-auto scrollbar-instagram -mx-2 px-2"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
      }}
    >
      {isLoading ? (
        <div className="text-center py-4">로딩 중...</div>
      ) : (
        <div className="flex gap-4 py-2 touch-pan-x">
          {notices.length > 0 ? (
            notices.map((notice, idx) => (
              <div
                key={idx}
                className="min-w-[280px] max-w-[320px] shrink-0 border rounded-lg p-4 bg-white hover:shadow cursor-pointer transition"
              >
                <NoticeCard notice={notice} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full">
              공지사항이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
