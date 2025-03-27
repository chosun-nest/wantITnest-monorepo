import { useState } from "react";
import * as S from "../assets/styles/login.styles";
import useResponsive from "../hooks/responsive";
export default function CreateProfile() {
  const isMobile = useResponsive();
  const [skills, setSkills] = useState([""]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // 모달 상태

  // 관심 분야 상태 추가
  const [interests, setInterests] = useState([""]);

  // 관심 분야 추가
  const addInterest = () => {
    setInterests([...interests, ""]);
  };

  // 관심 분야 삭제
  const removeInterest = (index: number) => {
    if (interests.length > 1) {
      setInterests(interests.filter((_, i) => i !== index));
    }
  };

  // 관심 분야 입력값 변경
  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  };

  // 보유 기술 추가
  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  // 보유 기술 삭제
  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  // 보유 기술 입력값 변경
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  // 프로필 이미지 업로드 -> 모달 열기
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowModal(true); // 모달 열기
      };
    }
  };

  // 크롭 완료된 이미지 저장
  const handleCroppedImage = (croppedImage: string) => {
    setProfileImage(croppedImage);
    setShowModal(false);
  };

  return (
    <S.Container>
      {/* 로고 */}
      <S.Header $isMobile={isMobile}>
        <S.LogoText>CHOSUN-NEST</S.LogoText>
      </S.Header>

      <S.LoginBox>
        <S.Title>Welcome to CSU-NEST</S.Title>
        {/* 프로필 이미지 업로드 */}
        {"Profile Image"}
        <S.ProfileImageWrapper>
          <label htmlFor="profile-upload">
            {profileImage ? (
              <S.ProfileImage src={profileImage} alt="Profile Preview" />
            ) : (
              <S.ProfilePlaceholder>
                {profileImage === null ? "선택된 파일 없음" : "프로필 이미지"}
              </S.ProfilePlaceholder>
            )}
          </label>
          <S.FileInput
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </S.ProfileImageWrapper>
        {/* 학과, 학년 입력란 */}
        <S.Input type="text" placeholder="학과" />
        <S.Input type="number" placeholder="학년" />

        {/* 보유 기술 입력란 */}
        <S.SkillContainer>
          <S.Label>보유 기술</S.Label>
          {skills.map((skill, index) => (
            <S.SkillRow key={index}>
              <S.Input
                type="text"
                placeholder="보유 기술 입력"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
              {index === 0 ? (
                <S.AddButton onClick={addSkill}>+</S.AddButton>
              ) : (
                <S.RemoveButton onClick={() => removeSkill(index)}>
                  -
                </S.RemoveButton>
              )}
            </S.SkillRow>
          ))}
        </S.SkillContainer>
        {/*관심 분야 입력란*/}
        <S.SkillContainer>
          <S.Label>관심 분야</S.Label>
          {interests.map((interest, index) => (
            <S.SkillRow key={index}>
              <S.Input
                type="text"
                placeholder="관심 분야 입력"
                value={interest}
                onChange={(e) => handleInterestChange(index, e.target.value)}
              />
              {index === 0 ? (
                <S.AddButton onClick={addInterest}>+</S.AddButton>
              ) : (
                <S.RemoveButton onClick={() => removeInterest(index)}>
                  -
                </S.RemoveButton>
              )}
            </S.SkillRow>
          ))}
        </S.SkillContainer>

        <S.AccountLink to="/">
          <S.LoginButton>Create Profile </S.LoginButton>
        </S.AccountLink>
        <S.AccountLink to="/signin">
          <S.NoAccount>이미 계정이 있어요</S.NoAccount>
        </S.AccountLink>
      </S.LoginBox>

      {/* 모달 추가 */}
      {showModal && (
        <ImageModal
          imageSrc={imageSrc}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCropDone={handleCroppedImage}
        />
      )}
    </S.Container>
  );
}
