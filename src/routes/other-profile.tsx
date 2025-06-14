import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import { selectCurrentUserId } from "../store/slices/userSlice";
import { getMemberProfileById } from "../api/profile/ProfileAPI";

import type { MemberProfile } from "../types/api/profile";
import type { ProfileType } from "../types/profile";
import { convertToProfileType } from "../utils/profileType";

import Modal from "../components/common/modal";
import ProfileCard from "../components/profile/card/ProfileCard";
import { ModalContent } from "../types/modal";
import {
  GridContainer,
  GridItem,
  ItemTitle,
} from "../assets/styles/profile.styles";
import { CaretDown, CaretUp } from "phosphor-react";
import useResponsive from "../hooks/responsive";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import HistoryTimeline from "../components/profile/history/historytimeline";
import MyPin from "../components/profile/history/mypins";

export default function OtherProfile() {
  const { navbarHeight } = useNavbarHeight();
  const isMobile = useResponsive();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectCurrentUserId);
  const [loading, setLoading] = useState(true);

  // 타인 구분하기
  const { id } = useParams(); // /profile/:id 의 id 받아서
  const isMine = Number(id) === currentUserId;    // currentUserId 비교
  
  //const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  
  const [showModal, setShowModal] = useState(false);
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
        message: "로그인이 필요한 페이지입니다.",
        type: "error",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
      return;
    }

    if (!id || isMine) return;
    
    const fetchProfile = async () => {
      try {
        const data: MemberProfile = await getMemberProfileById(Number(id));
        const converted = convertToProfileType(data);
        setProfile(converted);
      } catch {
        setModalContent({
          title: "조회 실패",
          message: "사용자 정보를 불러올 수 없습니다.",
          type: "error",
        });
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isMine, isLoggedIn, navigate]);

  return (
    <>
      {/* 모달 표시 */}
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
        <GridItem $isMobile={isMobile} $row="1" $col="1">
          {loading ? (
            <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
              <p className="text-sm text-gray-500">🛜 불러오는 중...</p>
            </div>
          ) : profile ? (
            <ProfileCard profile={profile} isOwnProfile={false} />
          ) : (
            <div className="p-4 text-red-500">프로필을 불러오지 못했습니다.</div>
          )}
        </GridItem>

        {/* 1행: My Pins */}
        <GridItem
          $isMobile={isMobile}
          $row="1"
          $col="2"
          $colSpan="2"
          $noMinHeight={true}
        >
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
              <MyPin title={""} editable />
            </div>
          )}
        </GridItem>

        {/* 2행: 활동 로그 */}
        <GridItem $isMobile={isMobile} $row="2" $col="2" $colSpan="2">
          <ItemTitle>History</ItemTitle>
          <HistoryTimeline />
        </GridItem>
      </GridContainer>
    </>
  );
}
