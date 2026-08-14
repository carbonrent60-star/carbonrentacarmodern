"use client";

/* eslint-disable @next/next/no-img-element */

import { ImageUp, Link2, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AdminImageFieldProps = {
  label: string;
  name: string;
  fileName: string;
  defaultValue?: string | null;
  title?: string;
  hint?: string;
  ratio?: "car" | "cover";
};

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

  const previewSource = preview || url;
  const hasPreview = Boolean(previewSource);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
          <img src={previewSource} alt={title} />
        ) : (
          <ImageUp size={32} strokeWidth={1.35} />
        )}
        <div className="admin-image-preview-overlay">
          <span>{label}</span>
          <strong>{hasPreview ? "Önizləmə hazırdır" : "Şəkil seçin"}</strong>
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
          name={fileName}
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) {
              setSelectedFile("");
              setPreview(url);
              return;
            }

            if (preview.startsWith("blob:")) {
              URL.revokeObjectURL(preview);
            }

            setSelectedFile(file.name);
            setPreview(URL.createObjectURL(file));
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
        <button
          type="button"
          className="admin-image-clear"
          onClick={() => {
            if (preview.startsWith("blob:")) {
              URL.revokeObjectURL(preview);
            }
            setUrl("");
            setPreview("");
            setSelectedFile("");
          }}
        >
          <X size={14} />
          Şəkli sil
        </button>
      ) : null}
    </div>
  );
}
