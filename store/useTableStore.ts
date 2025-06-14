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
}));
