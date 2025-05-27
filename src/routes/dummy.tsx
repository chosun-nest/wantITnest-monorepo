import { useNavbarHeight } from "../context/NavbarHeightContext";
import * as S from "../assets/styles/chat.styles";
import HistoryTimeline from "../components/profile/history/historytimeline";

export default function Dummy() {
  const { navbarHeight } = useNavbarHeight();

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      <HistoryTimeline />
    </S.Container>
  );
}
