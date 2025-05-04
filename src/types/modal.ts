export type ModalType = "info" | "error";

export interface ModalContent {
  title: string;
  message: string;
  type: ModalType;
}
