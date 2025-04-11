// 검색 + 선택 + API 연동
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
    setDepartmentsList(deps.map((d: { departmentId: number; departmentName: string }) => ({
      id: d.departmentId,
      name: d.departmentName,
    })));
    
    setInterestsList(ints.map((i: { interestId: number; interestName: string }) => ({
      id: i.interestId,
      name: i.interestName,
    })));
    
    setTechList(techs.map((t: { techStackId: number; techStackName: string }) => ({
      id: t.techStackId,
      name: t.techStackName,
    })));
    
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleDeleteItem = (field: "interests" | "techStacks", index: number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold text-blue-900 mb-4">내 프로필 변경</h2>

      {/* 이미지 */}
      <div className="flex items-start gap-4 mb-4">
        <label className="w-28 text-sm font-semibold">이미지</label>
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

      {/* 이름 / 이메일 */}
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이름</label>
        <input value={profile.name} disabled className="flex-1 bg-gray-100 p-2 rounded" />
      </div>
      <div className="flex items-center mb-4">
        <label className="w-28 text-sm font-semibold">이메일</label>
        <input value={profile.email} disabled className="flex-1 bg-gray-100 p-2 rounded" />
      </div>

      {/* 학과 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">학과</label>
        <div className="flex-1">
          <input
            value={departmentInput}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            disabled={!isEditing}
            className="block w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
          />
          {isEditing && filteredDepartments.length > 0 && (
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
          className="flex-1 p-2 rounded border min-h-[80px]  focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
        />
      </div>

      {/* 관심분야 */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">관심분야</label>
        <div className="flex-1">
          {isEditing && (
            <>
              <input
                value={newInterest}
                onChange={(e) => handleInterestInputChange(e.target.value)}
                placeholder="ex) 백엔드, AI"
                className="mt-2 w-full p-2 border rounded  focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
              />
              {filteredInterests.length > 0 && (
                <ul className="border mt-1 rounded max-h-40 overflow-y-auto">
                  {filteredInterests.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectInterest(item)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.interests.map((tag, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                #{tag}
                {isEditing && <button onClick={() => handleDeleteItem("interests", i)} className="text-red-500">×</button>}
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
            <>
              <input
                value={newTech}
                onChange={(e) => handleTechInputChange(e.target.value)}
                placeholder="ex) React, TypeScript"
                className="mt-2 w-full p-2 border rounded  focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
              />
              {filteredTechs.length > 0 && (
                <ul className="border mt-1 rounded max-h-40 overflow-y-auto">
                  {filteredTechs.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectTech(item)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.techStacks.map((tag, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                #{tag}
                {isEditing && <button onClick={() => handleDeleteItem("techStacks", i)} className="text-red-500">×</button>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SNS */}
      <div className="flex items-start mb-4">
        <label className="w-28 text-sm font-semibold mt-2">SNS 링크</label>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              {['Github', 'LinkedIn'].map((label, i) => (
                <div className="flex items-center gap-2" key={i}>
                  <span className="w-20 text-sm font-semibold">{label}</span>
                  <input
                    type="text"
                    value={profile.sns[i]}
                    onChange={(e) => {
                      const snsCopy = [...profile.sns];
                      snsCopy[i] = e.target.value;
                      setProfile({ ...profile, sns: snsCopy });
                    }}
                    className="flex-1 p-2 border rounded  focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-blue-800"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-2">
              {profile.sns[0] && <a href={profile.sns[0]} target="_blank" rel="noreferrer">
                <img src="/assets/images/github-logo.png" alt="GitHub" className="w-8 h-8 hover:opacity-80" />
              </a>}
              {profile.sns[1] && <a href={profile.sns[1]} target="_blank" rel="noreferrer">
                <img src="/assets/images/LinkedIn-logo.png" alt="LinkedIn" className="w-9 h-8 hover:opacity-80" />
              </a>}
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="text-right">
        {isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 mr-2 rounded border">취소</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">저장</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded">설정</button>
        )}
      </div>
    </div>
  );
}
