import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/modal";
import { RootState } from "../../types/store";
import { hideModal } from "../../store/slices/modalSlice";

export default function GlobalModal() {
  const dispatch = useDispatch();
  const { visible, title, message, type } = useSelector(
    (state: RootState) => state.modal
  );

  if (!visible) return null;

  return (
    <Modal
      title={title}
      message={message}
      type={type}
      onClose={() => dispatch(hideModal())}
    />
  );
}
