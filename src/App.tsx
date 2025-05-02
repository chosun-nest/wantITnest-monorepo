import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile";
import ProfileEdit from "./routes/profile-edit";
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";
import CreateProfile from "./routes/create-profile";
import ProjectBoard from "./routes/project-board";
import NoticeBoard from "./routes/notice-board";
import Notice from "./routes/notice";
import InterestsBorad from "./routes/interests-borad";
import { useState } from "react";
import GlobalBackdrop from "./components/easter/GlobalBackdrop";
import { BackdropContext } from "./context/Backdropcontext";
import Chat from "./routes/chat";
import ProjectDetail from "./routes/project-detail";  // 파일 이름 수정 확인!
import ProjectWrite from "./routes/project-write";

import { mockProjects } from "./constants/mock-projects";

// 댓글 상태 (유겸 - project detail 댓글용)
const initialComments: { [key: number]: { name: string; text: string; date: string }[] } = {
  23: [
    { name: "금상", text: "좋은 프로젝트네요!", date: "2025.05.02" },
    { name: "유겸", text: "저도 참여하고 싶어요.", date: "2025.05.02" },
  ],
};

function App() {
  const [showBackdrop, setShowBackdrop] = useState(false);

  // 프로젝트 상태 - useState로 관리 (yu-gyeom)
  const [projects, setProjects] = useState(mockProjects);

  // 새 글 추가하는 함수 (yu-gyeom)
  const handleAddProject = (newProject: any) => {
    setProjects((prev) => [
      { ...newProject, id: prev.length ? prev[0].id + 1 : 1, views: 0 },
      ...prev,
    ]);
  };

  // 댓글 상태도 같이 관리 (yu-gyeom)
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "profile/", element: <Profile /> },
        { path: "profile-edit/", element: <ProfileEdit /> },

        // 프로젝트 게시판 (yu-gyeom)
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

        // 공지사항 게시판 (yu-gyeom)
        { path: "notice-board/", element: <NoticeBoard /> },
        { path: "notice/:id", element: <Notice /> },

        // 관심사 게시판 (yeong-eun)
        { path: "interests-board/", element: <InterestsBorad /> },

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