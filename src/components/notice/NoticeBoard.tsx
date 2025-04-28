//React 화면에 크롤링한 공지사항 리스트가 실시간으로 표시됨.
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  link: string;
}

function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    async function fetchNotices() {
      const res = await axios.get('http://localhost:8000/crawl');
      setNotices(res.data.notices);
    }
    fetchNotices();
  }, []);

  return (
    <div>
      <h2>공지사항 목록</h2>
      <ul>
        {notices.map((notice, idx) => (
          <li key={idx}>
            <a href={notice.link} target="_blank" rel="noopener noreferrer">
              {notice.number}. {notice.title} ({notice.writer} / {notice.date} / 조회수 {notice.views})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoticeBoard;
