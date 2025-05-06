import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/slices/authSlice";
import { checkTokenValidity } from "../../api/auth/auth"; // /auth/me API

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        if (!accessToken) throw new Error("No token");

        await checkTokenValidity(); // /auth/me 호출
        setLoading(false);
      } catch (e) {
        console.warn("인증 실패 → 로그인 페이지로 이동", e);
        navigate("/login");
      }
    };

    verify();
  }, [accessToken, navigate]);

  if (loading) return null; // 또는 <Spinner />

  return <>{children}</>;
}
