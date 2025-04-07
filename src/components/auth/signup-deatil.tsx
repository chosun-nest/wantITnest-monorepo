import { useState } from "react";
import * as S from "../../assets/styles/auth.styles";
import { Item, SignUpDetailProps } from "../../types/signup";

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
}: SignUpDetailProps) {
  const [interestInput, setInterestInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [filteredInterests, setFilteredInterests] = useState<Item[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Item[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Item[]>([]);

  // 드롭다운 코드
  const handleInterestInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInterestInput(value);

    if (value.trim() !== "") {
      const filtered = interestsList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInterests(filtered);
    } else {
      setFilteredInterests([]);
    }
  };

  const handleSkillsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsInput(value);

    if (value.trim() !== "") {
      const filtered = techList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  const handleDepartmentsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    onChangeDepartment(value);
    if (value.trim() !== "") {
      const filtered = departmentsList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  };

  const handleSelectInterest = (item: string) => {
    if (!interest.includes(item)) {
      onChangeInterest([...interest, item]);
    }
    setInterestInput("");
    setFilteredInterests([]);
  };

  const handleSelectSkill = (item: string) => {
    if (!skills.includes(item)) {
      onChangeSkills([...skills, item]);
    }
    setSkillsInput("");
    setFilteredSkills([]);
  };

  const handleSelectDepartment = (item: string) => {
    onChangeDepartment(item); // ✅ 선택된 학과를 저장
    setFilteredDepartments([]); // 드롭다운 닫기
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
          <S.InputWrapper>
            <S.Input
              placeholder="학과를 입력하세요"
              value={department} // ✅ props department 사용
              onChange={handleDepartmentsInputChange}
            />
            {filteredDepartments.length > 0 && (
              <S.Dropdown>
                {filteredDepartments.map((item, idx) => (
                  <S.DropdownItem
                    key={idx}
                    onClick={() => handleSelectDepartment(item.name)}
                  >
                    {item.name}
                  </S.DropdownItem>
                ))}
              </S.Dropdown>
            )}
          </S.InputWrapper>
        </>
      )}

      {/* 관심 분야 */}
      <S.InputTitle>관심 분야</S.InputTitle>
      <S.InputWrapper>
        <S.Input
          placeholder="ex) 백엔드, AI"
          value={interestInput}
          onChange={handleInterestInputChange}
        />
        {filteredInterests.length > 0 && (
          <S.Dropdown>
            {filteredInterests.map((item, idx) => (
              <S.DropdownItem
                key={idx}
                onClick={() => handleSelectInterest(item.name)}
              >
                {item.name}
              </S.DropdownItem>
            ))}
          </S.Dropdown>
        )}
      </S.InputWrapper>

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
      <S.InputWrapper>
        <S.Input
          placeholder="ex) React, TypeScript"
          value={skillsInput}
          onChange={handleSkillsInputChange}
        />
        {filteredSkills.length > 0 && (
          <S.Dropdown>
            {filteredSkills.map((item, idx) => (
              <S.DropdownItem
                key={idx}
                onClick={() => handleSelectSkill(item.name)}
              >
                {item.name}
              </S.DropdownItem>
            ))}
          </S.Dropdown>
        )}
      </S.InputWrapper>

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
