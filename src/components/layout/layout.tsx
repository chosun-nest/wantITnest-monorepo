import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Ai from "./ai";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Ai />
      <Outlet />
    </>
  );
}
