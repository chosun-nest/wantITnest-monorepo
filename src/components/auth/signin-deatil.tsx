import * as S from "../../assets/styles/login.styles";

type Props = {
  selected: "재학생" | "일반";
  onPrev: () => void;
  onSubmit: () => void;
  name: string;
  onChangeName: (value: string) => void;
  department: string;
  onChangeDepartment: (value: string) => void;
  interest: string;
  onChangeInterest: (value: string) => void;
  skills: string;
  onChangeSkills: (value: string) => void;
};

export default function SigninDetail({
  selected,
  onPrev,
  onSubmit,
  name,
  onChangeName,
  department,
  onChangeDepartment,
  interest,
  onChangeInterest,
  skills,
  onChangeSkills,
}: Props) {
  return (
    <S.LoginBox>
      <S.HeaderBox>
        <S.HeaderLogo src="/assets/images/logo.png" />
        <S.Title>Welcome to WantIT-NEST</S.Title>
        <S.SigninTitle>회원가입</S.SigninTitle>
      </S.HeaderBox>

      <S.InputTitle>이름</S.InputTitle>
      <S.Input
        placeholder="이름을 입력해주세요"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
      />
      <S.SubText $isValid={!!name}>⚠ 실명으로 입력해주세요!</S.SubText>

      {selected === "재학생" && (
        <>
          <S.InputTitle>학과 검색</S.InputTitle>
          <S.Input
            placeholder="학과를 입력하세요"
            value={department}
            onChange={(e) => onChangeDepartment(e.target.value)}
          />
        </>
      )}

      <S.InputTitle>관심 분야</S.InputTitle>
      <S.Input
        placeholder="ex) 백엔드 개발, AI"
        value={interest}
        onChange={(e) => onChangeInterest(e.target.value)}
      />

      <S.InputTitle>기술 스택</S.InputTitle>
      <S.Input
        placeholder="보유 기술 스택 검색"
        value={skills}
        onChange={(e) => onChangeSkills(e.target.value)}
      />

      <S.ButtonRow>
        <S.LoginButton
          onClick={onPrev}
          style={{ background: "#ccc", color: "#000" }}
        >
          이전
        </S.LoginButton>
        <S.LoginButton onClick={onSubmit}>회원가입</S.LoginButton>
      </S.ButtonRow>

      <div className="flex justify-center">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>이미 계정이 있나요?</span>
          <a href="/login" className="text-blue-500 hover:underline">
            로그인 하기
          </a>
        </div>
      </div>
    </S.LoginBox>
  );
}
