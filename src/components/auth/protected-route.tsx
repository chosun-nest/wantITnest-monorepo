import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearTokens, selectAccessToken } from "../../store/slices/authSlice";
import { checkTokenValidity } from "../../api/auth/auth"; // /auth/me API
import { showModal } from "../../store/slices/modalSlice";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!accessToken) {
          dispatch(clearTokens());
          dispatch(
            showModal({
              title: "로그인 필요",
              message: "로그인이 필요합니다. 다시 로그인해주세요.",
              type: "error",
            })
          );
          navigate("/login");
          return;
        }
        await checkTokenValidity(); // /auth/me 호출
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        dispatch(
          showModal({
            title: "인증 오류",
            message:
              "세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.",
            type: "error",
          })
        );
        navigate("/login");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, navigate]);

  if (loading) return null; // 또는 <Spinner />

  return <>{children}</>;
}
