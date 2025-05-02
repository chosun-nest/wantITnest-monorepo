import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 120px auto 40px;
  padding: 0 20px;
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00256c;
  margin-bottom: 15px;
`;

export const MetaInfo = styled.div`
  font-size: 0.95rem;
  margin-bottom: 15px;
  color: #555;
`;

export const ContentCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
`;

export const Info = styled.div`
  font-size: 0.95rem;
  margin-bottom: 5px;
`;

export const BodyContent = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-top: 15px;
  color: #222;
  white-space: pre-line;
`;

export const BackButton = styled.button`
  margin-top: 25px;
  padding: 8px 14px;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #eaeaea;
  }
`;

export const CommentSection = styled.div`
  margin-top: 40px;
`;

export const CommentTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

export const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const CommentItem = styled.li`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

export const CommentForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const CommentInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const CommentButton = styled.button`
  padding: 8px 14px;
  background-color: #00256c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #00256c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #001a4d;
  }
`;