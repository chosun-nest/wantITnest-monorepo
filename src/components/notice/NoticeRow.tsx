import * as S from "../../assets/styles/notice.styles";
import { FaPaperclip } from "react-icons/fa"; // 아이콘용

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
      <span>{notice.id}</span>
      <S.NoticeTitle>{notice.title}</S.NoticeTitle>
      <span>{notice.date}</span>
      <span>{notice.author}</span>
      <span>{notice.views}</span>
      <span>{notice.hasAttachment && <FaPaperclip />}</span>
    </S.TableRow>
  );
}