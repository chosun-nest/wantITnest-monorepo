import { useState, useEffect } from "react";

/**
 * 사용자의 화면이 세로형(모바일 모드)인지 감지하는 커스텀 훅
 * @returns {boolean} true: 세로형 (모바일), false: 가로형 (데스크탑)
 */
export default function useResponsive(): boolean {
  const getIsMobile = () =>
    window.matchMedia("(orientation: portrait)").matches;

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
