import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import { useState } from "react";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile/",
        element: <Profile />,
      },
    ],
  },
  // 이 윗 줄 까진 Layout의 children임.
  {
    path: "/login",
    element: <NavigateToHome />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/password-reset",
    element: <PasswdReset />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      Nest-FE is Start now!
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
