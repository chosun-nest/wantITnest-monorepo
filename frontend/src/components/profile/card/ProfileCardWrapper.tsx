// 분리된 컴포넌트에서 profile 데이터를 가져와서 ProfileCard에 넘기는 방식
import { useEffect, useState } from "react";
import { getMemberProfile } from "../../../api/profile/ProfileAPI";
import ProfileCard from "./ProfileCard";
import type { ProfileType } from "../../../types/profile";
import { convertToProfileType } from "../../../utils/profileType";

export default function ProfileCardWrapper() {
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    getMemberProfile().then((data) => {
      const converted = convertToProfileType(data);
      setProfile(converted);
    });
  }, []);

  if (!profile) return null; // or loading skeleton

  return <ProfileCard profile={profile} isOwnProfile={true} />;
}
