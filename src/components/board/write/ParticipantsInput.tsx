// 참여정원 인원
interface Props {
  participants: string;
  setParticipants: (val: string) => void;
}

export default function ParticipantsInput({ participants, setParticipants }: Props) {
  return (
    <div className="mb-4 mt-7">
      <label className="block mb-2 text-lg font-semibold text-gray-500">
        참여인원/정원
      </label>
      <input
        className="w-full p-3 border rounded"
        placeholder="예: 3/6"
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
      />
    </div>
  );
}
