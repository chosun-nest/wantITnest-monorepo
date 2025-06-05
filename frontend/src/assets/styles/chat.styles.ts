import styled from "styled-components";

interface ContainerProps {
  navbarHeight: number;
}
export const Container = styled.div<ContainerProps>`
  padding-top: ${({ navbarHeight }) => `${navbarHeight}px`};
`;
