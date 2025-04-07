type UserType = "재학생" | "일반";

type Item = {
  id: number;
  name: string;
};

type SignUpComponentProps = {
  selected: UserType;
  onChangeSelected: (value: UserType) => void;
  email: string;
  onChangeEmail: (value: string) => void;
  authCode: string;
  onChangeAuthCode: (value: string) => void;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
  timer: number;
  password: string;
  onChangePassword: (value: string) => void;
  confirmPassword: string;
  onChangeConfirmPassword: (value: string) => void;
  isPasswordVisible: boolean;
  setIsPasswordVisible: (visible: boolean) => void;
  onNext: () => void;
  getItems: () => void;
  isEmailVerified: boolean;
};

type SignUpDetailProps = {
  selected: UserType;
  onPrev: () => void;
  onSubmit: () => void;
  name: string;
  onChangeName: (value: string) => void;
  department: string;
  onChangeDepartment: (value: string) => void;
  interest: string[];
  onChangeInterest: (values: string[]) => void;
  skills: string[];
  onChangeSkills: (values: string[]) => void;
  techList: Item[];
  interestsList: Item[];
  departmentsList: Item[];
};

export type { UserType, Item, SignUpComponentProps, SignUpDetailProps };
