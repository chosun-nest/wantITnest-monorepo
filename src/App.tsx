import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile"; //yeong-eun
import ProfileEdit from "./routes/profile-edit"; //yeong-eun
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";
import CreateProfile from "./routes/create-profile";
import ProjectBoard from "./routes/project-board"; //yu-gyeom

// 공지사항 게시판 (혜린)
import NoticeBoard from './components/notice/NoticeBoard'; //hye-rin

import InterestsBorad from "./routes/interests-borad"; //yeong-eun
import { useState } from "react";
import GlobalBackdrop from "./components/easter/GlobalBackdrop";
import { BackdropContext } from "./context/Backdropcontext";
import Chat from "./routes/chat";

// 프로젝트 상세, 글쓰기 (yu-gyeom)
import ProjectDetail from "./routes/project-detail";  //yu-gyeom
import ProjectWrite from "./routes/project-write"; //yu-gyeom

import { mockProjects } from "./constants/mock-projects";

// ✅ 댓글 상태 초기값 (yu-gyeom)
const initialComments: { [key: number]: { name: string; text: string; date: string }[] } = {
  23: [
    { name: "금상", text: "좋은 프로젝트네요!", date: "2025.05.02" },
    { name: "유겸", text: "저도 참여하고 싶어요.", date: "2025.05.02" },
  ],
};

function App() {
  const [showBackdrop, setShowBackdrop] = useState(false);

  // ✅ 프로젝트 상태 - useState로 관리 (yu-gyeom)
  const [projects, setProjects] = useState(mockProjects);

  // ✅ 새 글 추가 함수 (yu-gyeom)
  const handleAddProject = (newProject: any) => {
    setProjects((prev) => [
      { ...newProject, id: prev.length ? prev[0].id + 1 : 1, views: 0 },
      ...prev,
    ]);
  };

  // ✅ 댓글 상태 관리 (yu-gyeom)
  const [comments, setComments] = useState(initialComments);

  const handleAddComment = (projectId: number, name: string, text: string) => {
    setComments((prev) => ({
      ...prev,
      [projectId]: [
        ...(prev[projectId] || []),
        { name, text, date: new Date().toISOString().slice(0, 10) },
      ],
    }));
  };

  // ✅ 라우터 설정
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "profile/", element: <Profile /> },
        { path: "profile-edit/", element: <ProfileEdit /> },

        // ✅ 프로젝트 게시판 (yu-gyeom)
        { path: "project-board/", element: <ProjectBoard projects={projects} /> },
        {
          path: "project/:id",
          element: (
            <ProjectDetail
              projects={projects}
              comments={comments}
              onCommentAdd={handleAddComment}
            />
          ),
        },
        {
          path: "project-write/",
          element: <ProjectWrite onAdd={handleAddProject} />,
        },

        // ✅ 공지사항 게시판 (혜린)
        { path: "notice-board/", element: <NoticeBoard /> },

        // ✅ 관심사 게시판 (yeong-eun)
        { path: "interests-board/", element: <InterestsBorad /> },

        // ✅ 채팅 (공통)
        { path: "chat/", element: <Chat /> },
      ],
    },
    { path: "/login", element: <NavigateToHome /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/create-profile", element: <CreateProfile /> },
    { path: "/password-reset", element: <PasswdReset /> },
    { path: "/find-id", element: <PasswdReset /> },
  ]);

  return (
    <BackdropContext.Provider value={{ showBackdrop, setShowBackdrop }}>
      <GlobalBackdrop visible={showBackdrop} />
      <RouterProvider router={router} />
    </BackdropContext.Provider>
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