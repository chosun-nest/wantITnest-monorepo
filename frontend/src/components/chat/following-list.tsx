import { MemberProfile } from "../../types/api/profile";

interface FollowingListProps {
  isMobile: boolean;
  onSelectUser: (user: MemberProfile) => void;
}

const dummyFriends: MemberProfile[] = [
  /* ...더미 친구 생략... */
];

export default function FollowingList({ onSelectUser }: FollowingListProps) {
  return (
    <div className="p-5 w-[66%] max-w-[800px] min-w-[400px] border border-[#002f6c] rounded-lg shadow-sm">
      <h2 className="font-bold text-xl">내 친구 목록</h2>
      <ul className="mt-4">
        {dummyFriends.map((friend) => (
          <li
            key={friend.memberId}
            onClick={() => onSelectUser(friend)}
            className="flex items-center p-3 border border-gray-300 rounded-lg mb-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <img
              src={friend.memberImageUrl}
              alt="프로필"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span>{friend.memberName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
