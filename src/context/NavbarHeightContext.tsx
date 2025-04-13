import { createContext, useContext } from "react";

interface NavbarHeightContextType {
  navbarHeight: number;
  setNavbarHeight: (height: number) => void;
}

export const NavbarHeightContext = createContext<NavbarHeightContextType>({
  navbarHeight: 0,
  setNavbarHeight: () => {},
});

export const useNavbarHeight = () => useContext(NavbarHeightContext);
