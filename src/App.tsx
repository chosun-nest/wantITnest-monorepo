import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile"; //yeong-eun
import ProfileEdit from "./routes/profile-edit"; //yeong-eun
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";
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
