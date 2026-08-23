"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import { Progress } from "antd";
import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface UploadProps {
  type?: string; // mime type group: image, video, etc.
  buttonText?: string;
  onSuccess?: (res: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  onError?: (
    err:
      | ImageKitAbortError
      | ImageKitInvalidRequestError
      | ImageKitUploadNetworkError
      | ImageKitServerError
  ) => void;
  children?: React.ReactNode;
  testId?: string;
}

const Upload = ({
  type = "image",
  buttonText = "Upload",
  onSuccess,
  onProgress,
  onError,
  children,
  testId,
}: UploadProps) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const authenticator = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/upload-auth`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth failed: ${errorText}`);
    }
    return response.json();
  };

  const handleUpload = async () => {
    const input = fileInputRef.current;
    if (!input?.files?.[0]) {
      toast.error("Please select a file to upload");
      return;
    }
    setUploading(true);

    const file = input.files[0];

    try {
      const { signature, expire, token, publicKey } = await authenticator();
      const res = await upload({
        file,
        fileName: file.name,
        expire,
        token,
        signature,
        publicKey,
        abortSignal: abortController.signal,
        onProgress: (event) => {
          const pct = (event.loaded / event.total) * 100;
          setProgress(pct);
          onProgress?.(pct);
        },
      });
      onSuccess?.(res);
    } catch (err) {
      if (err instanceof ImageKitAbortError) {
        console.warn("Upload aborted:", err.reason);
      } else {
        console.error("Upload error:", err);
        onError?.(
          err as
            | ImageKitAbortError
            | ImageKitInvalidRequestError
            | ImageKitUploadNetworkError
            | ImageKitServerError
        );
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-2.5"
      data-testid={testId ? `${testId}-container` : "upload-container"}
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-page px-4 py-6 text-center transition-colors hover:border-accent"
      >
        <UploadCloud size={18} className="text-faint" />
        <span className="text-sm text-muted">
          {fileName || buttonText}
        </span>
      </button>
      <input
        accept={`${type}/*`}
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        className="hidden"
        data-testid={testId ? `${testId}-input` : "upload-file-input"}
      />
      <div className="flex items-center gap-3">
        <button
          disabled={uploading}
          onClick={handleUpload}
          className="flex h-9 items-center rounded-[10px] border border-line px-3.5 font-cta text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          type="button"
          data-testid={testId ? `${testId}-button` : "upload-button"}
        >
          {uploading ? "Uploading..." : buttonText}
        </button>
        {uploading && <Progress type="circle" percent={Math.round(progress)} size={28} />}
      </div>
      {children}
    </div>
  );
};

export default Upload;
