import { useState, useEffect } from "react";

/**
 * 모바일 기기 + width 768px 이하 + 또는 해상도 2/3 이하 → 모바일로 판단
 */
export default function useResponsive(): boolean {
  const isMobileDevice = () =>
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const getIsMobile = () => {
    const isSmallWidth = window.innerWidth <= 768;
    const isNarrowScreen = window.innerWidth / window.screen.width <= 2 / 3;
    return isMobileDevice() || isSmallWidth || isNarrowScreen;
  };

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize); // 회전 감지 추가

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return isMobile;
}
