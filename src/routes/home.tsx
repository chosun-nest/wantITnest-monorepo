import * as S from "../assets/styles/home.styles";

export default function Home() {
  return (
    <S.GridContainer>
      <S.GridItem row="1" col="1">
        프로필
      </S.GridItem>
      <S.GridItem row="1" col="2">
        학사 공지
      </S.GridItem>
      <S.GridItem row="1" col="3">
        참여중인 채팅방
      </S.GridItem>
      <S.GridItem row="2" col="2">
        AI Global Conference
      </S.GridItem>
      <S.GridItem row="2" col="3">
        프로젝트 모집
      </S.GridItem>
    </S.GridContainer>
  );
}
