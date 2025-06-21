import { SimpleMemberProfile } from "../../types/chat/chat";

interface FollowingListProps {
  isMobile: boolean;
  users: SimpleMemberProfile[];
  onSelectUser: (user: SimpleMemberProfile) => void;
}

export default function FollowingList({
  users,
  onSelectUser,
}: FollowingListProps) {
  return (
    <div className="p-5 w-[66%] max-w-[800px] min-w-[400px] border border-[#002f6c] rounded-lg shadow-sm">
      <h2 className="font-bold text-xl">내 팔로잉 목록</h2>
      <ul className="mt-4">
        {users.map((following) => (
          <li
            key={following.memberId}
            onClick={() => onSelectUser(following)}
            className="flex items-center p-3 border border-gray-300 rounded-lg mb-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <img
              src={following.memberImageUrl}
              alt="프로필"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span>{following.memberName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
