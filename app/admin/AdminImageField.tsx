"use client";

/* eslint-disable @next/next/no-img-element */

import {
  FlipHorizontal2,
  FlipVertical2,
  ImageUp,
  Link2,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type AdminImageFieldProps = {
  label: string;
  name: string;
  fileName: string;
  defaultValue?: string | null;
  title?: string;
  hint?: string;
  ratio?: "car" | "cover";
};

function revokePreviewUrl(value: string) {
  if (value.startsWith("blob:")) {
    URL.revokeObjectURL(value);
  }
}

async function imageFromUrl(src: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;

  await image.decode();

  return image;
}

async function flipImageFile(file: File, flipX: boolean, flipY: boolean) {
  if (!flipX && !flipY) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await imageFromUrl(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    context.translate(flipX ? canvas.width : 0, flipY ? canvas.height : 0);
    context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, file.type || "image/png", 0.94);
    });

    if (!blob) {
      return file;
    }

    return new File([blob], file.name, {
      type: blob.type || file.type,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function fileFromImageUrl(src: string, label: string) {
  const response = await fetch(src, { mode: "cors" });

  if (!response.ok) {
    throw new Error("image-fetch-failed");
  }

  const blob = await response.blob();

  if (!blob.type.startsWith("image/")) {
    throw new Error("image-fetch-invalid");
  }

  const extension = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "image";

  return new File([blob], `${safeLabel}-flipped.${extension}`, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

export default function AdminImageField({
  label,
  name,
  fileName,
  defaultValue,
  title = "Şəkil önizləməsi",
  hint = "PNG, JPG, WEBP · 50 MB-a qədər",
  ratio = "car",
}: AdminImageFieldProps) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(defaultValue ?? "");
  const [selectedFile, setSelectedFile] = useState("");
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSelectedUpload, setHasSelectedUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const originalFileRef = useRef<File | null>(null);

  const previewSource = preview || url;
  const hasPreview = Boolean(previewSource);
  const previewTransform = hasSelectedUpload
    ? "scale(1, 1)"
    : `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`;

  useEffect(() => {
    return () => revokePreviewUrl(preview);
  }, [preview]);

  async function setUploadFile(file: File, nextFlipX = flipX, nextFlipY = flipY) {
    setIsProcessing(true);

    try {
      const processedFile = await flipImageFile(file, nextFlipX, nextFlipY);

      if (fileInputRef.current) {
        const transfer = new DataTransfer();
        transfer.items.add(processedFile);
        fileInputRef.current.files = transfer.files;
      }

      setPreview((currentPreview) => {
        revokePreviewUrl(currentPreview);
        return URL.createObjectURL(processedFile);
      });
      setSelectedFile(processedFile.name);
    } finally {
      setIsProcessing(false);
    }
  }

  async function updateFlip(axis: "x" | "y") {
    const nextFlipX = axis === "x" ? !flipX : flipX;
    const nextFlipY = axis === "y" ? !flipY : flipY;

    setFlipX(nextFlipX);
    setFlipY(nextFlipY);

    if (originalFileRef.current) {
      await setUploadFile(originalFileRef.current, nextFlipX, nextFlipY);
      return;
    }

    if (url) {
      setIsProcessing(true);

      try {
        const file = await fileFromImageUrl(url, title);
        originalFileRef.current = file;
        setHasSelectedUpload(true);
        await setUploadFile(file, nextFlipX, nextFlipY);
      } catch {
        setIsProcessing(false);
      }
    }
  }

  const shortFileName = useMemo(() => {
    if (!selectedFile) {
      return "Şəkil seçilməyib";
    }

    return selectedFile.length > 28
      ? `${selectedFile.slice(0, 15)}...${selectedFile.slice(-8)}`
      : selectedFile;
  }, [selectedFile]);

  return (
    <div className={`admin-image-field admin-image-field-${ratio}`}>
      <div className="admin-image-preview">
        {hasPreview ? (
          <img
            src={previewSource}
            alt={title}
            style={{
              transform: previewTransform,
            }}
          />
        ) : (
          <ImageUp size={32} strokeWidth={1.35} />
        )}
        <div className="admin-image-preview-overlay">
          <span>{label}</span>
          <strong>
            {isProcessing
              ? "Şəkil hazırlanır..."
              : hasPreview
                ? "Önizləmə hazırdır"
                : "Şəkil seçin"}
          </strong>
        </div>
      </div>

      <label className="admin-field admin-image-url-field">
        <span>{label} URL</span>
        <div className="admin-url-input-shell">
          <Link2 size={15} />
          <input
            name={name}
            type="url"
            value={url}
            placeholder="https://..."
            onChange={(event) => {
              const nextUrl = event.target.value;
              setUrl(nextUrl);
              if (!selectedFile) {
                setPreview(nextUrl);
              }
            }}
          />
        </div>
      </label>

      <label className="admin-upload-dropzone">
        <input
          ref={fileInputRef}
          name={fileName}
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) {
              setSelectedFile("");
              setPreview(url);
              originalFileRef.current = null;
              setHasSelectedUpload(false);
              return;
            }

            originalFileRef.current = file;
            setHasSelectedUpload(true);
            await setUploadFile(file);
          }}
        />
        <UploadCloud size={17} />
        <span>
          Şəkil seç
          <small>{shortFileName}</small>
        </span>
        <em>{hint}</em>
      </label>

      {hasPreview ? (
        <div className="admin-image-tools">
          <button
            type="button"
            className={flipX ? "is-active" : ""}
            onClick={() => updateFlip("x")}
            disabled={isProcessing}
          >
            <FlipHorizontal2 size={14} />
            Üfüqi çevir
          </button>
          <button
            type="button"
            className={flipY ? "is-active" : ""}
            onClick={() => updateFlip("y")}
            disabled={isProcessing}
          >
            <FlipVertical2 size={14} />
            Şaquli çevir
          </button>
          <button
            type="button"
            className="admin-image-clear"
            onClick={() => {
              setUrl("");
              setPreview((currentPreview) => {
                revokePreviewUrl(currentPreview);
                return "";
              });
              setSelectedFile("");
              setFlipX(false);
              setFlipY(false);
              setHasSelectedUpload(false);
              originalFileRef.current = null;
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            <X size={14} />
            Şəkli sil
          </button>
        </div>
      ) : null}
    </div>
  );
}
