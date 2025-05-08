import React, { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { useParams } from "react-router-dom";
import { fetchComments } from "../../../api/interests/api";

export interface Comment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export default function CommentList() {
  const { id } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      try {
        const data = await fetchComments(Number(id));
        setComments(data);
      } catch (error) {
        console.error("댓글 불러오기 실패", error);
      }
    };
    loadComments();
  }, [id]);

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}