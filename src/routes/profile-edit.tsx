import Navbar from "../components/layout/navbar";
import MyProfileComponent from "../components/profile/profile-edit-myprofile-component";
import { useRef, useEffect, useState } from "react";

export default function ProfileEdit() {
    const navbarRef = useRef<HTMLDivElement>(null);
    const [navHeight, setNavHeight] = useState(0);

    useEffect(() => {
        if (navbarRef.current) {
            setNavHeight(navbarRef.current.offsetHeight);
        }
    }, []);

    return (
        <>
        <div ref={navbarRef}>
            <Navbar />
        </div>
        <div className="flex px-8 bg-white min-h-screen" style={{ marginTop: navHeight }}>
            <div
                //className="flex pt-40 px-20 pt-25 text-[20px] font-bold text-[#00256c] font-sans"
                className="pt-16 px-4 text-[20px] font-bold text-[#00256c] font-sans"
                style={{
                    fontFamily: "Monomaniac One",
                }}
            > 계정 정보
            </div>

            <div className="w-full px-4">
                <MyProfileComponent />
            </div>
            
        </div>
        </>
    );
}
