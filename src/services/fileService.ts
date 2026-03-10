import api from "@/lib/apiClient";
import { UploadedFile } from "@/types";

export const filesApi = {
  uploadFiles: async (files: File[]): Promise<UploadedFile[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const { data } = await api.post<UploadedFile[]>("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteFiles: async (fileIds: string[]) => {
    const { data } = await api.patch("/files/delete", { ids: fileIds });
    return data;
  },
};
