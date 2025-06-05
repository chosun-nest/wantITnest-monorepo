import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        <h1 className="text-[120px] font-extrabold text-blue-500 leading-none">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500 mb-8">
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          ← 이전 페이지로 돌아가기
        </button>
      </motion.div>
    </div>
  );
}
