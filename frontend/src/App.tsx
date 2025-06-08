import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile"; //yeong-eun
import ProfileEdit from "./routes/profile-edit"; //yeong-eun
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";

//yeong-eun : 앱 로드될 때 user 정보를 redux에 저장. 게시판에서 본인/타인 구분하는데 사용
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMemberProfile } from "./api/profile/ProfileAPI";
import { setUser, clearUser } from "./store/slices/userSlice";

import ProjectBoard from "./routes/project-board"; //yu-gyeom
import ProjectDetail from "./routes/project-detail"; //yu-gyeom
import ProjectApply from "./routes/project-apply"; // yu-gyeom
// import NoticeBoard from "./routes/notice-board"; //yu-gyeom
import NoticeBoard from "./components/notice/NoticeBoard"; //hye-rin
import InterestsBorad from "./routes/interests-borad"; //yeong-eun
import InterestsDetail from "./routes/interests-detail"; //yeong-eun
import BoardWrite from "./routes/board-write"; //yeong-eun

import { useState } from "react";
import GlobalBackdrop from "./components/easter/GlobalBackdrop";
import { BackdropContext } from "./context/Backdropcontext";
import Chat from "./routes/chat";
import NotFound from "./routes/notfound";
import ProtectedRoute from "./components/auth/protected-route";
import Events from "./routes/events";
import PublicRoute from "./components/auth/public-route";
import ResetPassword from "./routes/reset-password";
import GlobalModal from "./components/global/global-modal";

const router = createBrowserRouter([
  {
    // Layout이 포함된 페이지 중중
    // 인증이 필요하지 않은 페이지
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "project/:id",
        element: <ProjectDetail />,
      },

      {
        path: "project-apply",
        element: <ProjectApply />,
      },
      {
        path: "notice-board/", // ｈｙｅ－ｒｉｎ
        element: <NoticeBoard />,
      },
      {
        path: "interests-board/", // yeong-eun : 관심사 정보 게시판 페이지
        element: <InterestsBorad />,
      },
      {
        path: "interests-detail/:id", // yeong-eun : 관심 분야 정보 글쓰기 페이지
        element: <InterestsDetail />,
      },

      {
        path: "chat/",
        element: <Chat />,
      },
      {
        path: "events/",
        element: <Events />,
      },
    ],
  },
  // Layout이 필요하지 않은 로그인, 회원가입, 404에러처리 페이지
  {
    // 인증이 필요한 페이지
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "profile/",
        element: <Profile />,
      },

      {
        path: "profile-edit/",
        element: <ProfileEdit />,
      },
      // {
      //   path: "interests-write",
      //   element: <InterestsWrite />,   // 게시판 글쓰기 페이지 통합함.
      // },
      {
        path: "board-write/", // yeong-eun : 게시판 글쓰기 페이지
        element: <BoardWrite />,
      },
      {
        path: "project-board/",
        element: <ProjectBoard />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },

  {
    path: "/password-reset",
    element: (
      <PublicRoute>
        <PasswdReset />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password/",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);

function App() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initUser = async () => {
      try {
        const user = await getMemberProfile();
        dispatch(setUser({
          memberId: user.memberId,    // 사용자 id
          memberName: user.memberName,// 사용자 이름
          memberRole: user.memberRole,// 사용자 역할 redux에 저장
        }));
      } catch {
        dispatch(clearUser());
      }
    };

    initUser();
  }, [dispatch]);

  return (
    <>
      <BackdropContext.Provider value={{ showBackdrop, setShowBackdrop }}>
        <GlobalModal />
        <GlobalBackdrop visible={showBackdrop} />
        <RouterProvider router={router} />
      </BackdropContext.Provider>
    </>
  );
}

export default App;
