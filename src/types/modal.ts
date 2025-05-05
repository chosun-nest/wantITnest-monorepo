export interface ModalContent {
  title: string;
  message: string;
  type: "error" | "info";
  onClose?: () => void;
}
