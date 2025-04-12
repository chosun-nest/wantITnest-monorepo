import * as S from "../../assets/styles/notice.styles";
import { FaPaperclip } from "react-icons/fa";
import { Link } from "react-router-dom";
interface NoticeProps {
  notice: {
    id: number;
    title: string;
    date: string;
    author: string;
    views: number;
    hasAttachment: boolean;
  };
}

export default function NoticeRow({ notice }: NoticeProps) {
  return (
    <S.TableRow>
      <span>{notice.id}</span>{" "}
      <Link to={`/notice/${notice.id}`}>
        <S.NoticeTitle>{notice.title}</S.NoticeTitle>{" "}
      </Link>
      <span>{notice.date}</span>
      <span>{notice.author}</span>
      <span>{notice.views}</span>
      <span>{notice.hasAttachment && <FaPaperclip />}</span>
    </S.TableRow>
  );
}
