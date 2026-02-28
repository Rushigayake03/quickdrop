import { create } from "zustand";

export const useRoomStore = create((set) => ({
  roomId: null,
  files: [],
  userCount: 0,

  setRoomId: (roomId) => set({ roomId }),
  setFiles: (files) => set({ files }),
  addFile: (file) =>
    set((state) => ({ files: [file, ...state.files] })),
  setUserCount: (count) => set({ userCount: count }),
}));