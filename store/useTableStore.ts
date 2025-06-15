import { create } from "zustand";

type FormData = {
  title: string;
  category: string;
  desc: string;
  content: string;
  img: string;
};

type TableStore = {
  isShowFormDelete: boolean;
  setIsShowFormDelete: (isShowFormDelete: boolean) => void;
  idDelete: string;
  setIdDelete: (idPostDelete: string) => void;
  formData: FormData;
  setFormData: (formData: FormData | ((prev: FormData) => FormData)) => void;
  contentCreatePost: string;
  setContentCreatePost: (
    contentCreatePost: string | ((prev: string) => string)
  ) => void;
  resetContentCreatePost: () => void;
};

export const useTableStore = create<TableStore>((set) => ({
  isShowFormDelete: false,
  setIsShowFormDelete: (isShowFormDelete) => set({ isShowFormDelete }),
  idDelete: "",
  setIdDelete: (idDelete) => set({ idDelete }),
  formData: {
    title: "",
    category: "",
    desc: "",
    content: "",
    img: "",
  },
  setFormData: (formData) =>
    set((state) => ({
      formData:
        typeof formData === "function" ? formData(state.formData) : formData,
    })),
  contentCreatePost: "",
  setContentCreatePost: (contentCreatePost) =>
    set((state) => ({
      contentCreatePost:
        typeof contentCreatePost === "function"
          ? contentCreatePost(state.contentCreatePost)
          : contentCreatePost,
    })),
  resetContentCreatePost: () => set({ contentCreatePost: "" }),
}));
