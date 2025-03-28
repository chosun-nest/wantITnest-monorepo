import * as S from "../../assets/styles/login.styles";

type Props = {
  onPrev: () => void;
};

export default function SigninStudent({ onPrev }: Props) {
  return (
    <S.LoginBox>
      <S.Title>Welcome to WantIT-Nest</S.Title>
      <S.SigninTitle>회원가입</S.SigninTitle>

      <S.InputTitle>이름</S.InputTitle>
      <S.Input placeholder="이름을 입력해주세요" />
      <S.SubText $isValid={false}>⚠ 실명으로 입력해주세요!</S.SubText>

      <S.InputTitle>학과 검색</S.InputTitle>
      <S.Input placeholder="학과를 입력하세요" />

      <S.InputTitle>관심 분야</S.InputTitle>
      <S.Input placeholder="ex) 백엔드 개발, AI" />

      <S.InputTitle>기술 스택</S.InputTitle>
      <S.Input placeholder="보유 기술 스택 검색" />

      <S.ButtonRow>
        <S.LoginButton
          onClick={onPrev}
          style={{ background: "#ccc", color: "#000" }}
        >
          이전
        </S.LoginButton>
        <S.LoginButton>회원가입</S.LoginButton>
      </S.ButtonRow>
    </S.LoginBox>
  );
}
