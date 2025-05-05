import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile";           //yeong-eun
import ProfileEdit from "./routes/profile-edit";  //yeong-eun
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";
import ProjectBoard from "./routes/project-board"; //yu-gyeom
import ProjectDetail from "./routes/project-detail";
// import NoticeBoard from "./routes/notice-board"; //yu-gyeom
import NoticeBoard from "./components/notice/NoticeBoard"; //hye-rin
import InterestsBorad from "./routes/interests-borad";    //yeong-eun
// import InterestsWrite from "./routes/interests-write";    //yeong-eun
// import InterestsDetail from "./routes/interests-detail";  //yeong-eun
import { useState } from "react";
import GlobalBackdrop from "./components/easter/GlobalBackdrop";
import { BackdropContext } from "./context/Backdropcontext";
import Chat from "./routes/chat";
import NotFound from "./routes/notfound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "profile/",
        element: <Profile />,
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile-edit/",
        element: <ProfileEdit />,
      },
      {
        path: "project/:id",
        element: <ProjectDetail />
      },
      {
        path: "project-board/",
        element: <ProjectBoard />,
      },
      {
        path: "notice-board/", // ｈｙｅ－ｒｉｎ
        element: <NoticeBoard />,
      },
      {
        path: "interests-board/",   // yeong-eun : 관심사 정보 게시판 페이지
        element: <InterestsBorad />,
      },
      {
        // path: "interests-write/", // yeong-eun : 관심 분야 정보 글쓰기 페이지
        // element: <InterestsWrite />,
      },
      {
        // path: "interests-detail/", // yeong-eun : 관심 분야 정보 글쓰기 페이지
        // element: <InterestsDetail />,
      },
      {
        path: "chat/",
        element: <Chat />,
      },
    ],
  },
  // 이 윗 줄 까진 Layout의 children임.
  // 인증이 필요한 부분
  {
    path: "/login",
    element: <NavigateToHome />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/password-reset",
    element: <PasswdReset />,
  },
  {
    path: "/find-id",
    element: <PasswdReset />,
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
        <GlobalBackdrop visible={showBackdrop} />
        <RouterProvider router={router} />
      </BackdropContext.Provider>
    </>
  );
}

function NavigateToHome() {
  try {
    return <Login />;
  } catch (e) {
    console.log(e);
  }
}

export default App;