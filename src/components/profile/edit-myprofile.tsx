import React, { useState, useEffect, useRef } from "react";
import API from "../../api";
import { getDepartments, getInterests, getTech } from "../../api/common/common";

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

  const [newInterest, setNewInterest] = useState("");
  const [newTech, setNewTech] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Item[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");

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
      name: data.name,
      email: data.email,
      major: data.major,
      bio: data.bio,
      interests: data.interests || [],
      sns: data.sns || ["", ""],
      image: data.profileImageUrl || "/assets/images/user.png",
      techStacks: data.techStacks || [],
    });
    setDepartmentInput(data.major);
  };

  const getItems = async () => {
    const [deps, ints, techs] = await Promise.all([
      getDepartments(),
      getInterests(),
      getTech(),
    ]);
    setDepartmentsList(deps.map((d: any) => ({ id: d.departmentId, name: d.departmentName })));
    setInterestsList(ints.map((i: any) => ({ id: i.interestId, name: i.interestName })));
    setTechList(techs.map((t: any) => ({ id: t.techStackId, name: t.techStackName })));
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newInterest.trim()) {
      e.preventDefault();
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleDeleteInterest = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTech.trim()) {
      e.preventDefault();
      setProfile((prev) => ({
        ...prev,
        techStacks: [...prev.techStacks, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const handleDeleteTech = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      techStacks: prev.techStacks.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentInput(value);
    if (value.trim() === "") {
      setFilteredDepartments([]);
      return;
    }
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

  const handleSave = async () => {
    const token = localStorage.getItem("accesstoken");
    if (!token) return;
    try {
      await API.patch(
        "/api/v1/members/me",
        {
          major: profile.major,
          bio: profile.bio,
          interests: profile.interests,
          techStacks: profile.techStacks,
          sns: profile.sns,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("프로필이 저장되었습니다.");
      setIsEditing(false);
    } catch (e) {
      console.error("프로필 저장 실패", e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-900 mb-4">내 프로필 변경</h2>

      {/* 이미지 */}
      <div className="flex items-start gap-4 mb-4">
        <label htmlFor="user-image" className="w-28 text-sm font-semibold">
          이미지
        </label>
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={profile.image}
            alt="프로필"
            className="w-24 h-24 rounded-lg object-cover group-hover:opacity-80 transition"
          />

          {isEditing && (
            <input
              id="user-image"
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          )}
        </div>
      </div>

      {/* 이름, 이메일 */}
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이름</label>
        <input
          type="text"
          value={profile.name}
          disabled
          className="flex-1 bg-gray-100 p-2 rounded"
        />
      </div>
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이메일</label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="flex-1 bg-gray-100 p-2 rounded"
        />
      </div>

      {/* 학과 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">학과</label>
        <div className="flex-1">
          <input
            type="text"
            value={departmentInput}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            disabled={!isEditing}
            className="block w-full p-2 border rounded"
          />
          {filteredDepartments.length > 0 && (
            <ul className="border mt-1 rounded max-h-40 overflow-y-auto">
              {filteredDepartments.map((item) => (
                <li
                  key={item.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectDepartment(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 자기소개 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">자기소개</label>
        <textarea
          value={profile.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          disabled={!isEditing}
          className="flex-1 p-2 rounded border min-h-[80px]"
        />
      </div>

      {/* 관심분야 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">관심분야</label>
        <div className="flex-1">
          {isEditing && (
            <input
              type="text"
              placeholder="관심분야 입력 후 Enter"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleAddInterest}
              className="mt-2 w-full p-2 border rounded mb-2"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                {isEditing && (
                  <button onClick={() => handleDeleteInterest(i)} className="text-red-500">
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 기술 스택 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">기술 스택</label>
        <div className="flex-1">
          {isEditing && (
            <input
              type="text"
              placeholder="기술 스택 입력 후 Enter"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={handleAddTech}
              className="mt-2 w-full p-2 border rounded mb-2"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {profile.techStacks.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                {isEditing && (
                  <button onClick={() => handleDeleteTech(i)} className="text-red-500">
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SNS 링크 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">SNS 링크</label>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm font-semibold">Github</span>
                <input
                  type="text"
                  value={profile.sns[0]}
                  onChange={(e) => {
                    const newSns = [...profile.sns];
                    newSns[0] = e.target.value;
                    setProfile({ ...profile, sns: newSns });
                  }}
                  className="flex-1 p-2 border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm font-semibold">LinkedIn</span>
                <input
                  type="text"
                  value={profile.sns[1]}
                  onChange={(e) => {
                    const newSns = [...profile.sns];
                    newSns[1] = e.target.value;
                    setProfile({ ...profile, sns: newSns });
                  }}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-2">
              <a href={profile.sns[0]} target="_blank" rel="noreferrer">
                <img
                  src="/assets/images/github-logo.png"
                  alt="GitHub"
                  className="w-8 h-8 hover:opacity-80"
                />
              </a>
              <a href={profile.sns[1]} target="_blank" rel="noreferrer">
                <img
                  src="/assets/images/LinkedIn-logo.png"
                  alt="LinkedIn"
                  className="w-9 h-8 hover:opacity-80"
                />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="text-right">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 mr-2 rounded border"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              저장
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            설정
          </button>
        )}
      </div>
    </div>
  );
}
