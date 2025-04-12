import React, { useState, useEffect, useRef } from "react";
import API from "../../api";
import { getDepartments, getInterests, getTech } from "../../api/common/common";

// 하위 컴포넌트 import
import EditProfileImage from "./edit-myprofile-components/EditProfileImage";
import EditProfileField from "./edit-myprofile-components/EditProfileField";
import EditDepartment from "./edit-myprofile-components/EditDepartment";
import EditBio from "./edit-myprofile-components/EditBio";
import EditInterests from "./edit-myprofile-components/EditInterests";
import EditTechStacks from "./edit-myprofile-components/EditTechStacks";
import EditSNS from "./edit-myprofile-components/EditSNS";
import EditProfileButtons from "./edit-myprofile-components/EditProfileButtons";

interface Item {
  id: number;
  name: string;
}

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    major: "",
    bio: "",
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
    const token = localStorage.getItem("accesstoken");
    if (!token) return;
    const res = await API.get("/api/v1/members/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    setProfile({
      name: data.memberName,
      email: data.memberEmail,
      major: data.memberDepartmentResponseDtoList?.[0]?.departmentName || "",
      bio: data.bio || "",
      interests: data.memberInterestResponseDtoList?.map((i: any) => i.interestName) || [],
      techStacks: data.memberTechStackResponseDtoList?.map((t: any) => t.techStackName) || [],
      sns: [data.memberSnsUrl1 || "", data.memberSnsUrl2 || ""],
      image: data.memberImage || "/assets/images/user.png",
    });

    setDepartmentInput(data.memberDepartmentResponseDtoList?.[0]?.departmentName || "");
  };

  const getItems = async () => {
    const [deps, ints, techs] = await Promise.all([
      getDepartments(),
      getInterests(),
      getTech(),
    ]);
    setDepartmentsList(deps.map((d: { departmentId: number; departmentName: string }) => ({
      id: d.departmentId,
      name: d.departmentName,
    })));
    setDepartmentsList(deps.map((i: { interestId: number; interestName: string }) => ({
      id: i.interestId,
      name: i.interestName,
    })));
    setDepartmentsList(deps.map((t: { techStackId: number; techStackName: string }) => ({
      id: t.techStackId,
      name: t.techStackName,
    })));
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

      await API.patch(
        "/api/v1/members/me",
        {
          departmentId,
          bio: profile.bio,
          interestIdList,
          techStackIdList,
          memberSnsUrl1: profile.sns[0],
          memberSnsUrl2: profile.sns[1],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

      <EditBio
        value={profile.bio}
        isEditing={isEditing}
        onChange={(val) => handleChange("bio", val)}
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
