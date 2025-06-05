import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAccessToken,
  selectIsLoggedIn,
} from "../../store/slices/authSlice";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn || accessToken) {
      navigate("/"); // 로그인 되어 있으면 홈으로 리다이렉트
    }
  }, [isLoggedIn, accessToken, navigate]);

  return <>{children}</>;
}
