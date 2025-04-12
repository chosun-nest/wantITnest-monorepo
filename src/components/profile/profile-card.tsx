import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

interface ProfileType {
  image: string;  //api/v1/members/me에 이미지 컬럼 추가 시 확인하기
  name: string;
  email: string;
  major: string;
  bio: string;
  interests: string[];
  techStacks: string[];
  sns: string[];
}

export default function ProfileCard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accesstoken");
      if (!token) return;

      try {
        const res = await API.get("/api/v1/members/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        
        setProfile({
          image: data.memberImage,  //api/v1/members/me에 이미지 컬럼 추가 시 확인하기
          name: data.memberName,
          email: data.memberEmail,
          major: data.memberDepartmentResponseDtoList[0]?.departmentName || "",
          bio: data.bio || "",
          interests: data.memberInterestResponseDtoList.map((i:any) => i.interestName),
          techStacks: data.memberTechStackResponseDtoList.map((t:any) => t.techStackName),
          sns: [
            data.memberSnsUrl1,
            data.memberSnsUrl2,
            data.memberSnsUrl3,
            data.memberSnsUrl4,
          ].filter(Boolean)
        });        
      } catch (err) {
        console.error("프로필 정보를 불러오지 못했습니다", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">🛜 불러오는 중...</p>
      </div>
    );
  }
  return (
    <div className="w-80 p-4 border rounded-xl shadow-md bg-white">
      {/* 프로필 이미지 */}
      <div className="flex justify-center mb-7">
        <img
          src={profile.image || "/assets/images/user.png"}
          alt="Profile"
          className="w-30 h-30 rounded-full border"
        />
      </div>

      {/* 이름 및 전공 정보 */}
      <div className="flex items-center justify-left mt-2 gap-2">
        <h2 className="text-lg font-bold">{profile.name}</h2>
        <p className="text-gray-500">{profile.major}</p>
      </div>

      {/* 한 줄 소개 */}
      <p className="text-sm text-left mt-2">{profile.bio}</p>

      {/* 관심사 해시태그 */}
      <div className="flex flex-wrap justify-left gap-2 mt-5">
        {profile.interests?.map((tag, i) => (
          <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* 기술 스택 */}
      <div className="flex flex-wrap justify-left gap-2 mt-3">
        {profile.techStacks?.map((stack, i) => (
          <span key={i} className="bg-blue-100 text-xs px-2 py-1 rounded-full">
            {stack}
          </span>
        ))}
      </div>

      {/* SNS 아이콘 */}
      <div className="flex justify-center items-center gap-10 mt-10">  
      {/* Github */}
      {profile.sns?.[0] ? (
          <a href={profile.sns[0]} target="_blank" rel="noreferrer">
            <img
              src="/assets/images/github-logo.png"
              alt="GitHub"
              className="w-12 h-12 hover:opacity-80 cursor-pointer"
            />
          </a>
        ) : (
          <img
            src="/assets/images/github-logo.png"
            alt="Github"
            className="w-12 h-12 hover:opacity-80 cursor-pointer"
            onClick={() => alert("아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.")}
          />
        )}
        {/* LinkedIn */}
        {profile.sns?.[1] ? (
          <a href={profile.sns[1]} target="_blank" rel="noreferrer">
            <img
              src="/assets/images/LinkedIn-logo.png"
              alt="LinkedIn"
              className="w-12 h-12 hover:opacity-80 cursor-pointer"
            />
          </a>
        ) : (
          <img
          src="/assets/images/LinkedIn-logo.png"
          alt="LinkedIn"
          className="w-12 h-12 hover:opacity-80 cursor-pointer"
          onClick={() => alert("아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.")}
          />
        )}
      </div>

      {/* 수정 버튼 */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => navigate("/profile-edit")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          수정
        </button>
      </div>
    </div>
  );
}