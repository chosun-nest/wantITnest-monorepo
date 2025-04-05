import { useState, KeyboardEvent } from "react";
import * as S from "../../assets/styles/login.styles";

type Props = {
  selected: "재학생" | "일반";
  onPrev: () => void;
  onSubmit: () => void;
  name: string;
  onChangeName: (value: string) => void;
  department: string;
  onChangeDepartment: (value: string) => void;
  interest: string[];
  onChangeInterest: (values: string[]) => void;
  skills: string[];
  onChangeSkills: (values: string[]) => void;
  techList: string[];
  interestsList: string[];
  departmentsList: string[];
};

export default function SignUpDetail({
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
  techList,
  interestsList,
  departmentsList,
}: Props) {
  const [interestInput, setInterestInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const newItem = input.trim().replace(/^#/, "");
      if (!list.includes(newItem)) {
        setList([...list, newItem]);
      }
      setInput("");
    }
  };

  const handleRemove = (
    index: number,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

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
            list="department-options"
            onChange={(e) => onChangeDepartment(e.target.value)}
          />{" "}
          <datalist id="department-options">
            {departmentsList.map((department, idx) => (
              <option key={idx} value={department} />
            ))}
          </datalist>
        </>
      )}
      {/* 관심 분야 */}
      <S.InputTitle>관심 분야</S.InputTitle>
      <S.Input
        placeholder="ex) 백엔드, AI"
        value={interestInput}
        onChange={(e) => setInterestInput(e.target.value)}
        onKeyDown={(e) =>
          handleKeyDown(
            e,
            interestInput,
            setInterestInput,
            interest,
            onChangeInterest
          )
        }
        list="interests-options"
      />
      <datalist id="interests-options">
        {interestsList.map((interests, idx) => (
          <option key={idx} value={interests} />
        ))}
      </datalist>
      <S.TagList>
        {interest.map((item, idx) => (
          <S.TagItem key={idx}>
            {item}
            <S.TagRemoveButton
              onClick={() => handleRemove(idx, interest, onChangeInterest)}
            >
              ✕
            </S.TagRemoveButton>
          </S.TagItem>
        ))}
      </S.TagList>
      {/* 기술 스택 */}
      <S.InputTitle>기술 스택</S.InputTitle>
      <S.Input
        placeholder="보유 기술 스택을 입력하세요 (예: #React, #TS)"
        value={skillsInput}
        list="tech-options"
        onChange={(e) => setSkillsInput(e.target.value)}
        onKeyDown={(e) =>
          handleKeyDown(e, skillsInput, setSkillsInput, skills, onChangeSkills)
        }
      />
      <datalist id="tech-options">
        {techList.map((tech, idx) => (
          <option key={idx} value={tech} />
        ))}
      </datalist>
      <S.TagList>
        {skills.map((item, idx) => (
          <S.TagItem key={idx}>
            #{item}
            <S.TagRemoveButton
              onClick={() => handleRemove(idx, skills, onChangeSkills)}
            >
              ✕
            </S.TagRemoveButton>
          </S.TagItem>
        ))}
      </S.TagList>
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
