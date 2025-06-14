import { create } from "zustand";

type PostStore = {
  isShowFormDelete: boolean;
  setIsShowFormDelete: (isShowFormDelete: boolean) => void;
  idPostDelete: string;
  setIdPostDelete: (idPostDelete: string) => void;
};

export const usePostStore = create<PostStore>((set) => ({
  isShowFormDelete: false,
  setIsShowFormDelete: (isShowFormDelete) => set({ isShowFormDelete }),
  idPostDelete: "",
  setIdPostDelete: (idPostDelete) => set({ idPostDelete }),
}));
