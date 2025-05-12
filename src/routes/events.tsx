import Ready from "../components/common/ready";
import * as S from "../assets/styles/chat.styles";
import { useNavbarHeight } from "../context/NavbarHeightContext";
export default function Events() {
  const { navbarHeight } = useNavbarHeight();
  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      <Ready />
    </S.Container>
  );
}
