import React, { useState, useEffect, useRef } from "react";
import {
  getMemberProfile,
  getTech,
  getFavoriteTags, addFavoriteTag, deleteFavoriteTag,
  getDepartments,
  uploadProfileImage,
  updateMemberProfile,
} from "../../api/profile/ProfileAPI";
import axios from "axios";

import {
  Item,
  DepartmentResponse,
  TechStackResponse,
  ProfileFormData,
} from "../../types/profile";

// 하위 컴포넌트 import
import EditProfileImage from "./edit-myprofile/EditProfileImage";
import EditProfileField from "./edit-myprofile/EditProfileField";
import EditDepartment from "./edit-myprofile/EditDepartment";
import EditIntroduce from "./edit-myprofile/EditIntroduce";
import EditInterests from "./edit-myprofile/EditInterests";
import EditTechStacks from "./edit-myprofile/EditTechStacks";
import EditSNS from "./edit-myprofile/EditSNS";
import EditProfileButtons from "./edit-myprofile/EditProfileButtons";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../store/slices/authSlice";
import { ModalContent } from "../../types/modal";
import Modal from "../common/modal";

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormData>({
    name: "",
    email: "",
    major: "",
    introduce: "",
    interests: [],
    sns: ["", "", ""],
    image: "",
    uploadedImagePath: "",
    techStacks: [],
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
  
  // 토큰 관리 변수는 전역 변수로 선언해야 함
  // selector를 사용해 내 토큰 가져오는 slice인 selectAccessToken을 인자로 넣음
  const accessToken = useSelector(selectAccessToken);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);  // 모달 표시 여부
  
  useEffect(() => {
    fetchData();
    getItems();
  }, []);

  const fetchData = async () => {
    const data = await getMemberProfile();
    setProfile({
      image: data.memberImageUrl || "/assets/images/user.png",
      uploadedImagePath: data.memberImageUrl || "",
      name: data.memberName,
      email: data.memberEmail,
      major: data.memberDepartmentResponseDtoList?.[0]?.departmentName || "",
      introduce: data.memberIntroduce || "",
      interests: data.memberInterestResponseDtoList.map(
        (i: { interestId: number; interestName: string }) => i.interestName
      ),
      techStacks: data.memberTechStackResponseDtoList.map(
        (t: { techStackId: number; techStackName: string }) => t.techStackName
      ),
      sns: [
        data.memberSnsUrl1,
        data.memberSnsUrl2,
        data.memberSnsUrl3,
        data.memberSnsUrl4,
      ].filter(Boolean),
    });
    setDepartmentInput(
      data.memberDepartmentResponseDtoList?.[0]?.departmentName || ""
    );
  };

  const getItems = async () => {
    const [deps, techs, tags] = await Promise.all([
      getDepartments(),
      getTech(),
      getFavoriteTags(),
    ]);

    setDepartmentsList(deps.map((d: DepartmentResponse) => ({
      id: d.departmentId,
      name: d.departmentName,
    })));

    setTechList(techs.map((t: TechStackResponse) => ({
      id: t.techStackId,
      name: t.techStackName,
    })));

    setInterestsList(tags.map((t) => ({
      id: t.tagId,
      name: t.tagName,
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

  const handleSelectInterest = async (item: Item) => {
    if (!profile.interests.includes(item.name)) {
      try {
        await addFavoriteTag(item.name);
        setProfile((prev) => ({
          ...prev,
          interests: [...prev.interests, item.name],
        }));
      } catch (e) {
        console.error("관심 태그 추가 실패", e);
      }
    }
    setNewInterest("");
    setFilteredInterests([]);
  };

  const handleDeleteItem = async (field: "interests" | "techStacks", index: number) => {
    const tagName = profile[field][index];
    if (field === "interests") {
      try {
        await deleteFavoriteTag(tagName);
      } catch (e) {
        console.error("관심 태그 삭제 실패", e);
      }
    }
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
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
      setProfile((prev) => ({
        ...prev,
        techStacks: [...prev.techStacks, item.name],
      }));
    }
    setNewTech("");
    setFilteredTechs([]);
  };

  // 이미지 변경 함수
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setModalContent({
        title: "이미지 업로드 오류",
        message: "파일이 없습니다.",
        type: "error",
      });
      setShowModal(true);
      return;
    }

    try {
      const uploadedImageUrl = await uploadProfileImage(file);

      // 중복된 URL 제거 로직
      const sanitizedUrl = uploadedImageUrl.replace(/(https?:\/\/[^/]+)+/, "$1");

      console.log("서버 응답:", uploadedImageUrl);
      console.log("정제된 URL:", sanitizedUrl);

      setProfile((prev) => ({
        ...prev,
        image: sanitizedUrl,
        uploadedImagePath: sanitizedUrl,
      }));
    } catch (err) {
      console.error("이미지 업로드 실패", err);

        if (axios.isAxiosError(err)) {
        console.log("서버 응답 메시지:", err.response?.data.message);
      }

      setModalContent({
        title: "업로드 실패",
        message: "이미지 업로드 중 오류가 발생했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  const handleSave = async () => {
    if (!accessToken) return;

    try {
      const departmentId = departmentsList.find(
        (d) => d.name === profile.major
      )?.id;
      // const interestIdList = interestsList
      //   .filter((i) => profile.interests.includes(i.name))
      //   .map((i) => i.id);
      const techStackIdList = techList
        .filter((t) => profile.techStacks.includes(t.name))
        .map((t) => t.id);

      // 이미지 기본값 설정
      const imageToUse = profile.uploadedImagePath || profile.image || "/assets/images/user.png";
      const [sns1 = "", sns2 = "", sns3 = ""] = profile.sns;

      await updateMemberProfile({
        memberIntroduce: profile.introduce,
        memberImageUrl: imageToUse,
        memberSnsUrl1: sns1,
        memberSnsUrl2: sns2,
        memberSnsUrl3: sns3,
        memberDepartmentUpdateRequestIdList: departmentId ? [departmentId] : [],
        // interests는 favoriteTags API로 따로 관리되므로 불필요
        memberTechStackUpdateRequestIdList: techStackIdList,
      });
      
      console.log("보낼 이미지 URL:", imageToUse);
      
      setModalContent({
        title: "프로필 수정 완료",
        message: "프로필 수정을 완료했습니다.",
        type: "info",
        onClose: () => {
          setShowModal(false);
          window.location.reload();
        },
      });
      setShowModal(true);
    } catch (e) {
      console.error(e);
      setShowModal(true);
      setModalContent({
        title: "프로필 수정 오류",
        message: "프로필 수정중 오류가 발생했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-2xl p-10 mx-auto bg-white shadow rounded-xl">
      {showModal ? (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      ) : null}
      <h2 className="mb-4 text-xl font-bold text-blue-900">내 프로필 변경</h2>

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
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  );
}
