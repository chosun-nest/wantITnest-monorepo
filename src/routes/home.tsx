import { Link } from "react-router-dom";
import * as S from "../assets/styles/home.styles";
import ProfileComponent from "../components/profile/card/ProfileCard";
import useResponsive from "../hooks/responsive";
import GuestCard from "../components/profile/card/ProfileCardGuest";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import MyPin from "../components/profile/history/mypins";
import { MyPinProps } from "../components/profile/history/mypins";
import HistoryTimeline from "../components/profile/history/historytimeline";

export default function Home() {
  const isMobile = useResponsive();
  const { navbarHeight } = useNavbarHeight();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const myPinData: MyPinProps = {
    title: "내 핀",
    items: [{ text: "핀1", pinned: true }, { text: "핀2" }, { text: "핀3" }],
    editable: true,
  };

  return (
    <S.GridContainer $navbarHeight={navbarHeight} $isMobile={isMobile}>
      <S.GridItem $row="1" $isMobile={isMobile} $col="1">
        {!isLoggedIn ? (
          <GuestCard />
        ) : (
          <S.ProfileContainer>
            <ProfileComponent />
          </S.ProfileContainer>
        )}
      </S.GridItem>{" "}
      <S.GridItem $row="1" $isMobile={isMobile} $col="2">
        <S.ItemTitle>
          <HistoryTimeline />
        </S.ItemTitle>
      </S.GridItem>
      <S.GridItem $row="1" $isMobile={isMobile} $col="3">
        <S.ItemTitle>
          학사 공지<Link to="/notice-board">+</Link>
        </S.ItemTitle>
      </S.GridItem>
      <S.GridItem $row="2" $isMobile={isMobile} $col="2">
        <S.ItemTitle>
          프로젝트 모집 게시판<Link to="/project-board">+</Link>
        </S.ItemTitle>
      </S.GridItem>
      <S.GridItem $row="2" $isMobile={isMobile} $col="3">
        <S.ItemTitle>
          관심분야 게시판<Link to="/interests-board">+</Link>
        </S.ItemTitle>
      </S.GridItem>
      <MyPin
        title={myPinData.title}
        items={myPinData.items}
        editable={myPinData.editable}
      />
    </S.GridContainer>
  );
}
