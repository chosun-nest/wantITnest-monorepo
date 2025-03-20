import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Signin from "./routes/signin";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";

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
        index: true,
        element: <Home />,
      },
    ],
  },
  // 이 윗 줄 까진 Layout의 children임.
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <NavigateToHome />,
  },
  {
    path: "/signin",
    element: <Signin />,
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
