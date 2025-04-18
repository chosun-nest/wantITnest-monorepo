import React, { useState, useEffect, useRef } from "react";
import { getMemberProfile, getTech, getInterests, getDepartments } from "../../api/profile/api";
import { updateMemberProfile } from "../../api/profile/api";

// 하위 컴포넌트 import
import EditProfileImage from "./edit-myprofile-components/EditProfileImage";
import EditProfileField from "./edit-myprofile-components/EditProfileField";
import EditDepartment from "./edit-myprofile-components/EditDepartment";
import EditIntroduce from "./edit-myprofile-components/EditIntroduce";
import EditInterests from "./edit-myprofile-components/EditInterests";
import EditTechStacks from "./edit-myprofile-components/EditTechStacks";
import EditSNS from "./edit-myprofile-components/EditSNS";
import EditProfileButtons from "./edit-myprofile-components/EditProfileButtons";

interface Item {
  id: number;
  name: string;
}

interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
}
interface InterestResponse {
  interestId: number;
  interestName: string;
}
interface TechStackResponse {
  techStackId: number;
  techStackName: string;
}

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    major: "",
    introduce: "",
    interests: [] as string[],
    sns: ["", ""],
    image: "",
    techStacks: [] as string[],
  });

  const [departmentsList, setDepartmentsList] = useState<Item[]>([]);
  const [interestsList, setInterestsList] = useState<Item[]>([]);
  const [techList, setTechList] = useState<Item[]>([]);

  const [departmentInput, setDepartmentInput] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Item[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [filteredInterests, setFilteredInterests] = useState<Item[]>([]);
  const [newTech, setNewTech] = useState("");
  const [filteredTechs, setFilteredTechs] = useState<Item[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
    getItems();
  }, []);

  const fetchData = async () => {
    const data = await getMemberProfile();
    setProfile({
      image: data.memberImageUrl || "/assets/images/user.png",
      name: data.memberName,
      email: data.memberEmail,
      major: data.memberDepartmentResponseDtoList?.[0]?.departmentName || "",
      introduce: data.memberIntroduce || "",
      interests: data.memberInterestResponseDtoList.map(
        (i: { interestId: number; interestName: string }) => i.interestName),
      techStacks: data.memberTechStackResponseDtoList.map(
        (t: { techStackId: number; techStackName: string } ) => t.techStackName
      ),
      sns: [
        data.memberSnsUrl1,
        data.memberSnsUrl2,
        data.memberSnsUrl3,
        data.memberSnsUrl4,
      ].filter(Boolean),
    });
    setDepartmentInput(data.memberDepartmentResponseDtoList?.[0]?.departmentName || "");
  };

  const getItems = async () => {
    const [deps, ints, techs] = await Promise.all([
      getDepartments(),
      getInterests(),
      getTech(),
    ]);
  
    const formattedDepartments = deps.map((d: DepartmentResponse) => ({
      id: d.departmentId,
      name: d.departmentName,
    }));
    const formattedInterests = ints.map((i: InterestResponse) => ({
      id: i.interestId,
      name: i.interestName,
    }));
    const formattedTechs = techs.map((t: TechStackResponse) => ({
      id: t.techStackId,
      name: t.techStackName,
    }));
  
    setDepartmentsList(formattedDepartments);
    setInterestsList(formattedInterests);
    setTechList(formattedTechs);
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentInput(value);
    if (!value.trim()) return setFilteredDepartments([]);
    const filtered = departmentsList.filter((dep) =>
      dep.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };

  const handleSelectDepartment = (item: Item) => {
    setDepartmentInput(item.name);
    setProfile((prev) => ({ ...prev, major: item.name }));
    setFilteredDepartments([]);
  };

  const handleInterestInputChange = (value: string) => {
    setNewInterest(value);
    if (!value.trim()) return setFilteredInterests([]);
    const filtered = interestsList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInterests(filtered);
  };

  const handleSelectInterest = (item: Item) => {
    if (!profile.interests.includes(item.name)) {
      setProfile((prev) => ({ ...prev, interests: [...prev.interests, item.name] }));
    }
    setNewInterest("");
    setFilteredInterests([]);
  };

  const handleTechInputChange = (value: string) => {
    setNewTech(value);
    if (!value.trim()) return setFilteredTechs([]);
    const filtered = techList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTechs(filtered);
  };

  const handleSelectTech = (item: Item) => {
    if (!profile.techStacks.includes(item.name)) {
      setProfile((prev) => ({ ...prev, techStacks: [...prev.techStacks, item.name] }));
    }
    setNewTech("");
    setFilteredTechs([]);
  };

  const handleDeleteItem = (field: "interests" | "techStacks", index: number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accesstoken");
    if (!token) return;

    try {
      const departmentId = departmentsList.find((d) => d.name === profile.major)?.id;
      const interestIdList = interestsList
        .filter((i) => profile.interests.includes(i.name))
        .map((i) => i.id);
      const techStackIdList = techList
        .filter((t) => profile.techStacks.includes(t.name))
        .map((t) => t.id);

        await updateMemberProfile({
          memberIntroduce: profile.introduce,
          memberImageUrl: profile.image, // 서버 저장용 이미지 URL이 실제로 필요할 경우
          memberSnsUrl1: profile.sns[0] || "",
          memberSnsUrl2: profile.sns[1] || "",
          memberDepartmentUpdateRequestIdList: departmentId ? [departmentId] : [],
          memberInterestUpdateRequestIdList: interestIdList,
          memberTechStackUpdateRequestIdList: techStackIdList,
        });

      alert("프로필이 저장되었습니다.");
      setIsEditing(false);
    } catch (e) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-900 mb-4">내 프로필 변경</h2>

      <EditProfileImage
      image={profile.image}
      isEditing={isEditing}
      onChange={handleImageChange}
      fileInputRef={fileInputRef}
    />

      <EditProfileField name={profile.name} email={profile.email} />

      <EditDepartment
        isEditing={isEditing}
        departmentInput={departmentInput}
        onInputChange={handleDepartmentChange}
        filteredDepartments={filteredDepartments}
        onSelect={handleSelectDepartment}
      />

      <EditIntroduce
        value={profile.introduce}
        isEditing={isEditing}
        onChange={(val) => handleChange("introduce", val)}
      />

      <EditInterests
        interests={profile.interests}
        isEditing={isEditing}
        newInterest={newInterest}
        filtered={filteredInterests}
        onInputChange={handleInterestInputChange}
        onSelect={handleSelectInterest}
        onDelete={(i) => handleDeleteItem("interests", i)}
      />

      <EditTechStacks
        techStacks={profile.techStacks}
        isEditing={isEditing}
        newTech={newTech}
        filtered={filteredTechs}
        onInputChange={handleTechInputChange}
        onSelect={handleSelectTech}
        onDelete={(i) => handleDeleteItem("techStacks", i)}
      />

      <EditSNS
        sns={profile.sns}
        isEditing={isEditing}
        onChange={(newSNS) => setProfile((prev) => ({ ...prev, sns: newSNS }))}
      />

      <EditProfileButtons
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  );
}
