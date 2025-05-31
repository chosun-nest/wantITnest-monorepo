import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/profile/card/ProfileCard";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import {
  GridContainer,
  GridItem,
  ItemTitle,
} from "../assets/styles/profile.styles"; // 프로필 grid 적용
import { CaretDown, CaretUp } from "phosphor-react"; // history 열림, 닫힘용
import useResponsive from "../hooks/responsive";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import HistoryTimeline from "../components/profile/history/historytimeline";
import MyPin from "../components/profile/history/mypins";

export default function Profile() {
  const { navbarHeight } = useNavbarHeight();
  const isMobile = useResponsive();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  // history 열림/닫힘 상태
  const [historyOpen, setHistoryOpen] = useState(true);

  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn) {
      setModalContent({
        title: "로그인 필요",
        message: "로그인이 필요한 페이지 입니다",
        type: "error",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}

      <GridContainer $isMobile={isMobile} $navbarHeight={navbarHeight}>
        {/* 1행: 내 프로필 */}
        <GridItem $isMobile={isMobile} $row="1" $col="1">
          {loading ? (
            <div className="relative p-4 …">
              <p> 불러오는 중…</p>
            </div>
          ) : (
            <ProfileCard />
          )}
        </GridItem>
        {/* 1행: History (min-height 해제) */}
        <GridItem
          $isMobile={isMobile}
          $row="1"
          $col="2"
          $colSpan="2"
          $noMinHeight={true}
        >
          {/* 헤더에 onClick 걸기 */}
          <ItemTitle onClick={() => setHistoryOpen((o) => !o)}>
            <span>My Pins</span>
            {historyOpen ? (
              <CaretUp size={20} weight="bold" />
            ) : (
              <CaretDown size={20} weight="bold" />
            )}
          </ItemTitle>

          {historyOpen && (
            <div style={{ padding: 16 }}>
              <MyPin title={"뭐"} />
            </div>
          )}
        </GridItem>

        {/* 2행: 활동 로그 */}
        <GridItem $isMobile={isMobile} $row="2" $col="2" $colSpan="2">
          <ItemTitle>History</ItemTitle>

          <HistoryTimeline />
        </GridItem>
      </GridContainer>
      {/* <div
          className="flex min-h-screen px-20 bg-white"
          style={{ paddingTop: navHeight + 40 }}
        > */}

      {/* <div>
          {loading ? (
            <div className="relative p-4 bg-white border shadow-md w-80 rounded-xl">
              <p className="text-sm text-gray-500"> 불러오는 중...</p>
            </div>
          ) : (
            <ProfileCard />
          )}
        </div>
        <div>
          나중에 히스토리, 채팅방 등 들어갈 자리
        </div> */}

      {/* </div> */}
    </>
  );
}
