import React, { useState, useEffect, useRef } from "react";
import {
  getMemberProfile,
  getTech,
  getInterests,
  getDepartments,
  uploadProfileImage,
  updateMemberProfile,
} from "../../api/profile/api";

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
    sns: ["", "", ""],
    image: "",
    uploadedImagePath: "",
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
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, item.name],
      }));
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
      setProfile((prev) => ({
        ...prev,
        techStacks: [...prev.techStacks, item.name],
      }));
    }
    setNewTech("");
    setFilteredTechs([]);
  };

  const handleDeleteItem = (
    field: "interests" | "techStacks",
    index: number
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
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
      //alert("파일이 없습니다.");
      setShowModal(true);
      return;
    }

    try {
      const uploadedImageUrl = await uploadProfileImage(file);
      
      setProfile((prev) => ({
        ...prev,
        image: uploadedImageUrl,
        uploadedImagePath: uploadedImageUrl,  // 이거 빠지면 저장 시 PATCH에도 누락됨
      }));
    } catch (err) {
      console.error("이미지 업로드 실패", err);
      if (err instanceof Error) alert(err.message);
      else {
        // setModalMessage("이미지 업로드 실패!");
        // setShowModal(true);
        setModalContent({
          title: "업로드 실패",
          message: "이미지 업로드 중 오류가 발생했습니다.",
          type: "error",
        });
        setShowModal(true);
      }
      //alert("이미지 업로드 실패!");
    }
  };

  const handleSave = async () => {
    if (!accessToken) return;

    try {
      const departmentId = departmentsList.find(
        (d) => d.name === profile.major
      )?.id;
      const interestIdList = interestsList
        .filter((i) => profile.interests.includes(i.name))
        .map((i) => i.id);
      const techStackIdList = techList
        .filter((t) => profile.techStacks.includes(t.name))
        .map((t) => t.id);

      await updateMemberProfile({
        memberIntroduce: profile.introduce,
        memberImageUrl: profile.uploadedImagePath || profile.image, // 업로드된 URL
        memberSnsUrl1: profile.sns[0] || "",
        memberSnsUrl2: profile.sns[1] || "",
        memberSnsUrl3: profile.sns[2] || "",
        memberSnsUrl4: profile.sns[3] || "",
        memberDepartmentUpdateRequestIdList: departmentId ? [departmentId] : [],
        memberInterestUpdateRequestIdList: interestIdList,
        memberTechStackUpdateRequestIdList: techStackIdList,
      });
      setShowModal(true);
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
      setShowModal(true);
      setModalContent({
        title: "프로필 수정 오류",
        message: "프로필 수정중 오류가 발생했습니다.",
        type: "error",
      });
      console.error(e);
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
