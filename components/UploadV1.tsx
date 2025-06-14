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
import { useRef, useState } from "react";

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
}

const Upload = ({
  type = "image",
  buttonText = "Upload",
  onSuccess,
  onProgress,
  onError,
  children,
}: UploadProps) => {
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();
  const [disabledBtnUpload, setDisabledBtnUpload] = useState(false);

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
    setDisabledBtnUpload(true);
    const input = fileInputRef.current;
    if (!input?.files?.[0]) {
      setDisabledBtnUpload(false);
      alert("Please select a file to upload");
      return;
    }

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
    }
  };

  return (
    <div className="space-y-2 flex flex-col items-center gap-2">
      <input accept={`${type}/*`} type="file" ref={fileInputRef} />
      <div className="flex flex-row items-center gap-2">
        <button
          disabled={disabledBtnUpload}
          onClick={handleUpload}
          className="w-max p-3 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
          type="button"
        >
          {buttonText}
        </button>
        {/* <>
        <input
          type="file"
          accept={`${type}/*`}
          ref={fileInputRef}
          // onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          onClick={handleUpload}
          className="w-max p-3 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
          type="button"
        >
          {buttonText}
        </button>
      </> */}
        {/* <progress className="block w-full" value={progress} max={100}></progress> */}
        <Progress type="circle" percent={progress} size={50} />
      </div>
      {children}
    </div>
  );
};

export default Upload;
