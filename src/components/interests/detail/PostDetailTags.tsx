// 태그 목록 출력

interface PostDetailTagsProps {
  tags: string[];
}

export default function PostDetailTags({ tags }: PostDetailTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => (
        <span key={tag} className="px-3 py-1 text-sm bg-gray-200 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  );
}
