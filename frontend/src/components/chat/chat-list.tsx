import { MemberProfile } from "../../types/api/profile";

interface ChatListProps {
  onSelectUser: (user: MemberProfile) => void;
  isMobile: boolean;
}

const dummyChatUsers: MemberProfile[] = [
  /* ...더미 유저 생략... */
];

export default function ChatList({ onSelectUser }: ChatListProps) {
  return (
    <div className="w-[66%] max-w-[800px] min-w-[400px] p-5 border border-[#002f6c] rounded-lg shadow-sm">
      <h2 className="font-bold text-xl">대화 중인 채팅방</h2>
      <ul className="mt-4">
        {dummyChatUsers.map((user) => (
          <li
            key={user.memberId}
            onClick={() => onSelectUser(user)}
            className="flex items-center p-3 border rounded-lg mb-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
          >
            <img
              src={user.memberImageUrl}
              alt={`${user.memberName} 프로필`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span>{user.memberName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
