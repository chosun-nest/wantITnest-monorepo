import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Ai from "./ai";
import { useEffect, useRef, useState } from "react";
import { NavbarHeightContext } from "../../context/NavbarHeightContext";
import Footer from "./footer";
import "./layout.css";  // ✅ 추가

export default function Layout() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  return (
    <NavbarHeightContext.Provider value={{ navbarHeight, setNavbarHeight }}>
      <div className="layout-container">
      <Navbar ref={navbarRef} />
      <Ai />
      <div className="content-container" style={{ paddingTop: navbarHeight }}>
        <Outlet />
      </div>
      <Footer />
      </div>
    </NavbarHeightContext.Provider>
  );
}
