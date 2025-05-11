import { useNavbarHeight } from "../context/NavbarHeightContext";
import * as S from "../assets/styles/chat.styles";

export default function Chat() {
  const { navbarHeight } = useNavbarHeight();

  return <S.Container navbarHeight={navbarHeight + 20}>hi</S.Container>;
}
