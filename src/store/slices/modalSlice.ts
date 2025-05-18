// store/slices/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  type: "info" | "error";
}

const initialState: ModalState = {
  visible: false,
  title: "",
  message: "",
  type: "info",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        type?: "info" | "error";
      }>
    ) => {
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.type = action.payload.type ?? "info";
      state.visible = true;
    },
    hideModal: (state) => {
      state.visible = false;
      state.title = "";
      state.message = "";
      state.type = "info";
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
