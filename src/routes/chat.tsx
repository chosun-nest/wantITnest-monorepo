import { useNavbarHeight } from "../context/NavbarHeightContext";
import * as S from "../assets/styles/chat.styles";
import Ready from "../components/common/ready";

export default function Chat() {
  const { navbarHeight } = useNavbarHeight();

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      <Ready />
    </S.Container>
  );
}
