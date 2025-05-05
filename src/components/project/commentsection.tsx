import { useState } from "react";
import styled from "styled-components";

export default function CommentSection() {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() !== "") {
      setComments([...comments, input]);
      setInput("");
    }
  };

  return (
    <Container>
      <Title>댓글 {comments.length}</Title>
      <InputWrapper>
        <CommentInput
          placeholder="댓글을 작성해보세요."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
      </InputWrapper>

      <CommentList>
        {comments.length === 0 ? (
          <NoComment>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</NoComment>
        ) : (
          comments.map((comment, index) => (
            <CommentItem key={index}>
              <Author>익명</Author>
              <CommentText>{comment}</CommentText>
            </CommentItem>
          ))
        )}
      </CommentList>
    </Container>
  );
}

// ⭐ 스타일 컴포넌트

const Container = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  background-color: #1d4ed8;  // 남색 계열 (#2563eb 도 비슷)
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

const CommentList = styled.div`
  margin-top: 10px;
`;

const CommentItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const Author = styled.strong`
  color: #1d4ed8;
  margin-right: 5px;
`;

const CommentText = styled.span`
  color: #333;
`;

const NoComment = styled.p`
  color: #777;
`;