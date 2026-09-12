"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpDown,
  BadgeHelp,
  Bell,
  CalendarDays,
  CarFront,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Database,
  ExternalLink,
  Gauge,
  Grid2X2,
  Heart,
  Images,
  LayoutDashboard,
  List,
  LogOut,
  MoreHorizontal,
  Moon,
  Newspaper,
  Plane,
  Plus,
  Rows3,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Trash2,
  Upload,
  Users,
  X,
  CheckCircle2,
  AlertTriangle,
  Clipboard,
  Code2,
  Eye,
  Flag,
  History,
  ImagePlus,
  Italic,
  Link2,
  NotebookPen,
  ListChecks,
  ListTodo,
  Percent,
  Underline,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { type CSSProperties, type Dispatch, type FormEvent, type PointerEvent, type ReactNode, type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteBlogInlineAction,
  deleteCarInlineAction,
  bulkUpdateCarsInlineAction,
  logoutAction,
  recordAdminActivityInlineAction,
  restoreCarInlineAction,
  saveBlogInlineAction,
  saveCarInlineAction,
  seedBlogsAction,
  seedCarsAction,
  type AdminActivityLog,
} from "./actions";
import AdminImageField from "./AdminImageField";
import { CarBrandLogo } from "@/components/CarBrandLogo";
import type { Car, CarCategory, CarVariant } from "@/data/cars";
import type { AdminBlogPost } from "@/lib/supabase/blogs";
import {
  carCategories,
  rentalPriceKeys,
  transferPriceKeys,
} from "@/lib/supabase/cars";

type AdminCar = Car & {
  isActive?: boolean;
  sortOrder?: number;
};

type CarsResult = {
  configured: boolean;
  cars: AdminCar[];
  source: "local" | "supabase";
  error: string | null;
};

type BlogsResult = {
  configured: boolean;
  blogs: AdminBlogPost[];
  source: "local" | "supabase";
  error: string | null;
};

type ViewKey =
  | "overview"
  | "cars"
  | "bookings"
  | "customers"
  | "rental"
  | "transfer"
  | "weddings"
  | "blog"
  | "media"
  | "notes"
  | "tutorial"
  | "quality"
  | "settings";
type CarTab =
  | "general"
  | "technical"
  | "variants"
  | "images"
  | "services"
  | "description"
  | "seo";
type VariantEditorTab = "general" | "pricing" | "technical" | "images" | "services";
type AdminVariantDraft = Omit<Partial<CarVariant>, "rentalPrices"> & {
  rentalPrices?: Partial<Car["rentalPrices"]>;
};
type AdminVariantSlot = {
  key: string;
  variant?: AdminVariantDraft;
};
type BlogTab = "general" | "content" | "media" | "visibility";
type EditorState =
  | { type: "car"; mode: "create" | "edit"; car?: AdminCar; index: number }
  | { type: "blog"; mode: "create" | "edit"; blog?: AdminBlogPost; index: number }
  | null;
type CarTableMode = "fleet" | "wedding";
type AdminToast = {
  id: number;
  type: "success" | "error";
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
};
type ChangeLogEntry = {
  id: number;
  title: string;
  text: string;
  time: string;
};
type AdminNoteItem = {
  id: string;
  title: string;
  body: string;
  done: boolean;
  priority: "low" | "normal" | "important" | "urgent";
  image?: string | null;
  createdAt: string;
  updatedAt: string;
};
type SaveDiff = {
  label: string;
  before: string;
  after: string;
};

function AdminPortal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}

function editorFormSignature(form: HTMLFormElement) {
  const values: string[] = [];

  Array.from(form.elements).forEach((element) => {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) ||
      !element.name ||
      element.disabled
    ) {
      return;
    }

    if (element instanceof HTMLInputElement) {
      if (element.type === "checkbox" || element.type === "radio") {
        values.push(`${element.name}=${element.checked ? element.value || "on" : ""}`);
        return;
      }

      if (element.type === "file") {
        const fileValue = Array.from(element.files ?? [])
          .map((file) => `${file.name}:${file.size}:${file.lastModified}`)
          .join(",");
        values.push(`${element.name}=${fileValue}`);
        return;
      }
    }

    if (element instanceof HTMLSelectElement && element.multiple) {
      values.push(`${element.name}=${Array.from(element.selectedOptions).map((option) => option.value).join(",")}`);
      return;
    }

    values.push(`${element.name}=${element.value}`);
  });

  return values.sort().join("\n");
}

function editorFormValues(form: HTMLFormElement) {
  const values: Record<string, string | boolean> = {};

  Array.from(form.elements).forEach((element) => {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) ||
      !element.name ||
      element.type === "file"
    ) {
      return;
    }

    values[element.name] =
      element instanceof HTMLInputElement && element.type === "checkbox"
        ? element.checked
        : element.value;
  });

  return values;
}

function restoreEditorFormValues(form: HTMLFormElement, values: Record<string, string | boolean>) {
  Array.from(form.elements).forEach((element) => {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) ||
      !element.name ||
      element.type === "file" ||
      !(element.name in values)
    ) {
      return;
    }

    const value = values[element.name];

    if (element instanceof HTMLInputElement && element.type === "checkbox") {
      element.checked = Boolean(value);
    } else {
      element.value = String(value ?? "");
    }
  });

  form.dispatchEvent(new Event("input", { bubbles: true }));
}

const carDiffFields: Array<{ name: string; label: string; kind?: "checkbox" }> = [
  { name: "title", label: "Model adı" },
  { name: "slug", label: "URL adı" },
  { name: "brand", label: "Brend" },
  { name: "category", label: "Kateqoriya" },
  { name: "manufactureYear", label: "Buraxılış ili" },
  { name: "engine", label: "Mühərrik" },
  { name: "fuel", label: "Yanacaq" },
  { name: "transmission", label: "Sürətlər qutusu" },
  { name: "seats", label: "Oturacaq" },
  { name: "rental_days1to3", label: "1-3 gün qiyməti" },
  { name: "rental_days30plus", label: "30+ gün qiyməti" },
  { name: "rentalVisible", label: "İcarə kanalı", kind: "checkbox" },
  { name: "transferAvailable", label: "Transfer kanalı", kind: "checkbox" },
  { name: "weddingAvailable", label: "Toy kanalı", kind: "checkbox" },
  { name: "isActive", label: "Dərc statusu", kind: "checkbox" },
];

function formatDiffValue(value: string | boolean | undefined, kind?: "checkbox") {
  if (kind === "checkbox") {
    return value ? "Aktiv" : "Gizli";
  }

  return typeof value === "string" && value.trim() ? value : "Boş";
}

function buildCarSaveDiffs(before: Record<string, string | boolean>, after: Record<string, string | boolean>) {
  return carDiffFields
    .map((field) => {
      const beforeValue = formatDiffValue(before[field.name], field.kind);
      const afterValue = formatDiffValue(after[field.name], field.kind);

      return beforeValue === afterValue
        ? null
        : {
            label: field.label,
            before: beforeValue,
            after: afterValue,
          };
    })
    .filter(Boolean) as SaveDiff[];
}

const categoryLabels: Record<string, string> = {
  Econom: "Ekonom",
  Comfort: "Komfort",
  Business: "Biznes",
  SUV: "SUV",
  Miniven: "Miniven",
  Sport: "Sport",
};

const adminBrandOptions = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "BMW",
  "Bentley",
  "Bugatti",
  "Buick",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Koenigsegg",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Pagani",
  "Polestar",
  "Porsche",
  "RAM",
  "Rivian",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "VinFast",
  "Volkswagen",
  "Volvo",
];

function BrandLogo({ brand, size = 42 }: { brand?: string | null; size?: number }) {
  return <CarBrandLogo brand={brand} size={size} tone="dark" />;
}

const rentalPriceLabels: Record<(typeof rentalPriceKeys)[number], string> = {
  days1to3: "1-3 gün",
  days4to7: "4-7 gün",
  days8to15: "8-15 gün",
  days16to24: "16-24 gün",
  days25to30: "25-30 gün",
  days30plus: "30+ gün",
};

const transferPriceLabels: Record<(typeof transferPriceKeys)[number], string> = {
  baku: "Hava limanı - Bakı",
  seaBreeze: "Sea Breeze - Hava limanı",
  qabala: "Qəbələ - Bakı",
  ismayilli: "İsmayıllı - Bakı",
  quba: "Quba - Bakı",
  shamaxi: "Şamaxı - Bakı",
  shaki: "Şəki - Bakı",
  shusha: "Şuşa - Bakı",
  lankaran: "Lənkəran - Bakı",
};

const adminClientMessages: Record<string, string> = {
  unauthenticated: "Sessiya bitib. Səhifəni yeniləyib yenidən daxil olun.",
  "missing-supabase-admin-env":
    "Supabase server məlumatları tapılmadı. Env dəyərlərini yoxlayın.",
  "image-too-large": "Şəkil çox böyükdür. Maksimum 50 MB şəkil yükləyin.",
  "image-upload-failed": "Şəkil yüklənmədi. Storage ayarlarını yoxlayın.",
  "required-fields-missing": "Mütləq sahələri doldurun.",
  "image-required": "Əsas şəkil tələb olunur.",
  "blog-body-required": "Məqalə mətni boş ola bilməz.",
  "blog-table-missing": "blog_posts cədvəli Supabase-də tapılmadı.",
  "database-save-failed": "Məlumat bazaya yazılmadı.",
  "database-delete-failed": "Məlumat silinmədi.",
  "unknown-error": "Gözlənilməyən xəta baş verdi.",
};

function adminClientMessage(code: string) {
  return adminClientMessages[code] ?? adminClientMessages["unknown-error"];
}

const navGroups: Array<{
  label: string;
  items: Array<{ key: ViewKey; label: string; icon: LucideIcon }>;
}> = [
  {
    label: "ƏSAS",
    items: [
      { key: "overview", label: "İcmal", icon: LayoutDashboard },
      { key: "cars", label: "Avtomobillər", icon: CarFront },
    ],
  },
  {
    label: "İDARƏETMƏ",
    items: [
      { key: "bookings", label: "Bronlar", icon: CalendarDays },
      { key: "customers", label: "Müştərilər", icon: Users },
      { key: "rental", label: "İcarə", icon: Gauge },
      { key: "transfer", label: "Transferlər", icon: Plane },
      { key: "weddings", label: "Toy avtomobilləri", icon: Heart },
    ],
  },
  {
    label: "MƏZMUN",
    items: [
      { key: "blog", label: "Blog", icon: Newspaper },
      { key: "media", label: "Şəkillər", icon: Images },
      { key: "notes", label: "Qeydlər", icon: NotebookPen },
      { key: "tutorial", label: "Təlimat", icon: BadgeHelp },
      { key: "quality", label: "Keyfiyyət", icon: AlertTriangle },
    ],
  },
  {
    label: "SİSTEM",
    items: [{ key: "settings", label: "Ayarlar", icon: Settings }],
  },
];

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  span,
  icon,
  suggestions,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  span?: boolean;
  icon?: ReactNode;
  suggestions?: string[];
}) {
  const listId = suggestions?.length ? `${name}-suggestions` : undefined;

  return (
    <label className={`admin-field${span ? " admin-field-span" : ""}${icon ? " has-icon" : ""}`}>
      <span>{label}</span>
      <span className="admin-field-control">
        {icon ? <i>{icon}</i> : null}
        <input
          name={name}
          type={type}
          list={listId}
          placeholder={placeholder}
          defaultValue={defaultValue ?? ""}
        />
        {listId ? (
          <datalist id={listId}>
            {suggestions?.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        ) : null}
      </span>
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 4,
  placeholder,
  span = true,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
  span?: boolean;
}) {
  return (
    <label className={`admin-field${span ? " admin-field-span" : ""}`}>
      <span>{label}</span>
      <textarea name={name} rows={rows} placeholder={placeholder} defaultValue={defaultValue ?? ""} />
    </label>
  );
}

type AdminSelectOption = {
  value: string;
  label: string;
};

function AdminSelect({
  options,
  value,
  defaultValue,
  onChange,
  name,
  label,
  icon,
  compact = false,
}: {
  options: AdminSelectOption[];
  value?: string;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  icon?: ReactNode;
  compact?: boolean;
}) {
  const selectRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const currentValue = isControlled ? value : internalValue;
  const selected = options.find((option) => option.value === currentValue) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: globalThis.PointerEvent) {
      if (!selectRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
    setOpen(false);

    window.requestAnimationFrame(() => {
      hiddenInputRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
      hiddenInputRef.current?.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  return (
    <div ref={selectRef} className={`admin-custom-select${open ? " is-open" : ""}${compact ? " is-compact" : ""}${icon ? " has-icon" : ""}`}>
      {name ? <input ref={hiddenInputRef} type="hidden" name={name} value={currentValue} readOnly /> : null}
      <button
        type="button"
        className="admin-custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((active) => !active)}
      >
        {icon ? <i>{icon}</i> : null}
        <span>{selected?.label ?? "Seç"}</span>
        <ChevronDown size={15} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="admin-custom-select-menu"
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.975, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, scale: 0.985, filter: "blur(6px)" }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === currentValue}
                className={option.value === currentValue ? "is-selected" : ""}
                onClick={() => choose(option.value)}
              >
                <span>{option.label}</span>
                {option.value === currentValue ? <CheckCircle2 size={14} /> : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
  icon,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: string[];
  icon?: ReactNode;
}) {
  const value = defaultValue ?? "";
  const optionSet = value && !options.includes(value) ? [value, ...options] : options;

  return (
    <label className={`admin-field${icon ? " has-icon" : ""}`}>
      <span>{label}</span>
      <AdminSelect
        name={name}
        defaultValue={value}
        options={optionSet.map((option) => ({
          value: option,
          label: categoryLabels[option] ?? option,
        }))}
        icon={icon}
        label={label}
      />
    </label>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
  description,
  icon,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <label className="admin-toggle">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      {icon ? <i className="admin-toggle-icon">{icon}</i> : null}
      <span>
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
    </label>
  );
}

function PriceField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: number | null;
}) {
  return (
    <label className="admin-price-field">
      <span>{label}</span>
      <span className="admin-price-input">
        <input name={name} type="number" defaultValue={defaultValue ?? ""} />
        <small>₼</small>
      </span>
    </label>
  );
}

function StatusDot({ active }: { active?: boolean }) {
  return (
    <span className={`admin-status-dot${active === false ? " is-muted" : ""}`}>
      {active === false ? "Qaralama" : "Dərc olunub"}
    </span>
  );
}

function uniqueCompact(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean))) as string[];
}

function startPrice(car?: AdminCar) {
  if (!car) {
    return null;
  }

  return (
    car.rentalPrices.days1to3 ??
    car.rentalPrices.days4to7 ??
    car.rentalPrices.days8to15 ??
    car.rentalPrices.days16to24 ??
    car.rentalPrices.days25to30 ??
    car.rentalPrices.days30plus ??
    car.weddingPrice ??
    null
  );
}

function displayPrice(car: AdminCar, mode: CarTableMode = "fleet") {
  return mode === "wedding" ? car.weddingPrice : startPrice(car);
}

function displayImage(car: AdminCar, mode: CarTableMode = "fleet") {
  return mode === "wedding" ? car.weddingThumbnail ?? car.thumbnail : car.thumbnail;
}

type AdminHeroPalette = { accent: string; soft: string; deep: string; glow: string };

const adminCarHeroPalettes: Record<string, AdminHeroPalette> = {
  Acura: { accent: "96, 165, 250", soft: "37, 99, 235", deep: "10, 18, 34", glow: "62%" },
  "Alfa Romeo": { accent: "248, 113, 113", soft: "185, 28, 28", deep: "27, 10, 13", glow: "58%" },
  "Aston Martin": { accent: "52, 211, 153", soft: "20, 184, 166", deep: "8, 24, 22", glow: "62%" },
  Audi: { accent: "226, 232, 240", soft: "100, 116, 139", deep: "15, 23, 42", glow: "66%" },
  "BMW": { accent: "59, 130, 246", soft: "37, 99, 235", deep: "15, 23, 42", glow: "62%" },
  Bentley: { accent: "74, 222, 128", soft: "22, 163, 74", deep: "8, 24, 18", glow: "63%" },
  Bugatti: { accent: "96, 165, 250", soft: "29, 78, 216", deep: "9, 16, 34", glow: "62%" },
  Buick: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  BYD: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  Cadillac: { accent: "251, 191, 36", soft: "168, 85, 247", deep: "26, 18, 26", glow: "58%" },
  Chevrolet: { accent: "251, 191, 36", soft: "245, 158, 11", deep: "26, 19, 8", glow: "58%" },
  Chrysler: { accent: "147, 197, 253", soft: "59, 130, 246", deep: "10, 18, 34", glow: "62%" },
  Dodge: { accent: "251, 113, 133", soft: "225, 29, 72", deep: "29, 10, 18", glow: "57%" },
  Ferrari: { accent: "251, 191, 36", soft: "239, 68, 68", deep: "29, 16, 8", glow: "56%" },
  Fiat: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  Ford: { accent: "249, 115, 22", soft: "37, 99, 235", deep: "14, 18, 30", glow: "60%" },
  Genesis: { accent: "226, 232, 240", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  GMC: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  Honda: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  Hummer: { accent: "132, 204, 22", soft: "77, 124, 15", deep: "17, 24, 12", glow: "62%" },
  "Mercedes-Benz": { accent: "203, 213, 225", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  "Hyundai": { accent: "56, 189, 248", soft: "14, 165, 233", deep: "12, 20, 36", glow: "60%" },
  Infiniti: { accent: "203, 213, 225", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  "Kia": { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  Jaguar: { accent: "244, 114, 182", soft: "219, 39, 119", deep: "28, 13, 28", glow: "58%" },
  Jeep: { accent: "132, 204, 22", soft: "77, 124, 15", deep: "17, 24, 12", glow: "62%" },
  Koenigsegg: { accent: "96, 165, 250", soft: "239, 68, 68", deep: "12, 16, 32", glow: "58%" },
  Lamborghini: { accent: "251, 191, 36", soft: "245, 158, 11", deep: "29, 19, 8", glow: "56%" },
  "Land Rover": { accent: "34, 197, 94", soft: "21, 128, 61", deep: "12, 24, 18", glow: "64%" },
  "Range Rover": { accent: "34, 197, 94", soft: "21, 128, 61", deep: "12, 24, 18", glow: "64%" },
  Lexus: { accent: "203, 213, 225", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  Lincoln: { accent: "203, 213, 225", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  Lotus: { accent: "251, 191, 36", soft: "34, 197, 94", deep: "15, 24, 12", glow: "58%" },
  Lucid: { accent: "251, 191, 36", soft: "245, 158, 11", deep: "24, 17, 10", glow: "58%" },
  Maserati: { accent: "96, 165, 250", soft: "37, 99, 235", deep: "10, 18, 34", glow: "62%" },
  Mazda: { accent: "248, 113, 113", soft: "185, 28, 28", deep: "27, 10, 13", glow: "58%" },
  McLaren: { accent: "249, 115, 22", soft: "234, 88, 12", deep: "28, 14, 8", glow: "56%" },
  Mini: { accent: "226, 232, 240", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  Mitsubishi: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  Nissan: { accent: "203, 213, 225", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  Pagani: { accent: "56, 189, 248", soft: "245, 158, 11", deep: "13, 18, 27", glow: "58%" },
  Polestar: { accent: "226, 232, 240", soft: "125, 211, 252", deep: "14, 22, 32", glow: "66%" },
  Porsche: { accent: "251, 191, 36", soft: "220, 38, 38", deep: "29, 16, 8", glow: "56%" },
  RAM: { accent: "248, 113, 113", soft: "120, 113, 108", deep: "24, 13, 12", glow: "58%" },
  Rivian: { accent: "251, 191, 36", soft: "132, 204, 22", deep: "20, 22, 12", glow: "58%" },
  "Rolls-Royce": { accent: "226, 232, 240", soft: "147, 51, 234", deep: "22, 16, 34", glow: "66%" },
  Subaru: { accent: "96, 165, 250", soft: "37, 99, 235", deep: "10, 18, 34", glow: "62%" },
  Tesla: { accent: "248, 113, 113", soft: "220, 38, 38", deep: "24, 12, 18", glow: "58%" },
  "Toyota": { accent: "248, 113, 113", soft: "239, 68, 68", deep: "24, 12, 18", glow: "58%" },
  VinFast: { accent: "96, 165, 250", soft: "37, 99, 235", deep: "10, 18, 34", glow: "62%" },
  Volkswagen: { accent: "96, 165, 250", soft: "37, 99, 235", deep: "10, 18, 34", glow: "62%" },
  Volvo: { accent: "96, 165, 250", soft: "37, 99, 235", deep: "10, 18, 34", glow: "62%" },
};

const adminModelHeroPalettes: Array<[RegExp, AdminHeroPalette]> = [
  [/mustang/i, { accent: "249, 115, 22", soft: "234, 88, 12", deep: "24, 13, 8", glow: "58%" }],
  [/range rover|vogue|defender|discovery/i, { accent: "34, 197, 94", soft: "21, 128, 61", deep: "12, 24, 18", glow: "64%" }],
];

const adminCategoryHeroPalettes: Record<string, AdminHeroPalette> = {
  Econom: { accent: "45, 212, 191", soft: "20, 184, 166", deep: "8, 22, 24", glow: "58%" },
  Comfort: { accent: "96, 165, 250", soft: "59, 130, 246", deep: "10, 18, 34", glow: "62%" },
  Business: { accent: "203, 213, 225", soft: "100, 116, 139", deep: "17, 24, 39", glow: "66%" },
  SUV: { accent: "34, 197, 94", soft: "22, 163, 74", deep: "9, 22, 18", glow: "63%" },
  Miniven: { accent: "168, 85, 247", soft: "124, 58, 237", deep: "20, 13, 34", glow: "60%" },
  Sport: { accent: "251, 113, 133", soft: "225, 29, 72", deep: "29, 10, 18", glow: "57%" },
};

function carHeroPalette(car?: AdminCar) {
  const modelPalette = adminModelHeroPalettes.find(([pattern]) =>
    pattern.test(`${car?.brand ?? ""} ${car?.title ?? ""} ${car?.category ?? ""}`)
  )?.[1];

  return (
    modelPalette ??
    (car?.brand ? adminCarHeroPalettes[car.brand] : null) ??
    (car?.category ? adminCategoryHeroPalettes[car.category] : null) ??
    { accent: "236, 72, 153", soft: "168, 85, 247", deep: "13, 20, 34", glow: "62%" }
  );
}

function rgbToHsl(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === r) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return { hue: hue * 60, saturation, lightness };
}

function hslToRgb(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = lightness - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) [r, g, b] = [chroma, x, 0];
  else if (hue < 120) [r, g, b] = [x, chroma, 0];
  else if (hue < 180) [r, g, b] = [0, chroma, x];
  else if (hue < 240) [r, g, b] = [0, x, chroma];
  else if (hue < 300) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];

  return [
    Math.round((r + match) * 255),
    Math.round((g + match) * 255),
    Math.round((b + match) * 255),
  ];
}

function imagePaletteFromPixels(data: Uint8ClampedArray): AdminHeroPalette | null {
  let totalWeight = 0;
  let red = 0;
  let green = 0;
  let blue = 0;

  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha < 160) continue;

    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const { saturation, lightness } = rgbToHsl(r, g, b);

    if (lightness < 0.12 || lightness > 0.92 || saturation < 0.18) {
      continue;
    }

    const weight = saturation * (1 - Math.abs(lightness - 0.52)) * 1.25;
    totalWeight += weight;
    red += r * weight;
    green += g * weight;
    blue += b * weight;
  }

  if (totalWeight < 4) {
    return null;
  }

  const averageRed = Math.round(red / totalWeight);
  const averageGreen = Math.round(green / totalWeight);
  const averageBlue = Math.round(blue / totalWeight);
  const hsl = rgbToHsl(averageRed, averageGreen, averageBlue);
  const accent = hslToRgb(hsl.hue, Math.min(0.82, Math.max(0.5, hsl.saturation + 0.18)), 0.58);
  const soft = hslToRgb(hsl.hue, Math.min(0.74, Math.max(0.42, hsl.saturation)), 0.44);
  const deep = hslToRgb(hsl.hue, 0.42, 0.12);

  return {
    accent: accent.join(", "),
    soft: soft.join(", "),
    deep: deep.join(", "),
    glow: hsl.hue > 25 && hsl.hue < 75 ? "57%" : "62%",
  };
}

function useImageHeroPalette(image: string | null | undefined, fallback: AdminHeroPalette) {
  const [extractedPalette, setExtractedPalette] = useState<{
    image: string;
    palette: AdminHeroPalette;
  } | null>(null);

  useEffect(() => {
    if (!image || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      if (cancelled) return;

      try {
        const canvas = document.createElement("canvas");
        const size = 56;
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;

        context.clearRect(0, 0, size, size);
        context.drawImage(img, 0, 0, size, size);
        const extracted = imagePaletteFromPixels(context.getImageData(0, 0, size, size).data);

        if (extracted && !cancelled) {
          setExtractedPalette({ image, palette: extracted });
        }
      } catch {
        // Remote images can block canvas reads; the brand/category palette remains the fallback.
      }
    };

    img.src = image;

    return () => {
      cancelled = true;
    };
  }, [image]);

  return extractedPalette && extractedPalette.image === image ? extractedPalette.palette : fallback;
}

function carMissingInfo(car: AdminCar, mode: CarTableMode = "fleet") {
  return [
    !car.manufactureYear ? "İl yoxdur" : null,
    !displayImage(car, mode) ? "Şəkil yoxdur" : null,
    displayPrice(car, mode) === null ? "Qiymət yoxdur" : null,
    !car.engine ? "Mühərrik yoxdur" : null,
    car.seats === null ? "Oturacaq yoxdur" : null,
    car.variants?.some((variant) => variant.isActive === false) ? "Deaktiv variant var" : null,
  ].filter(Boolean) as string[];
}

function fleetQuality(cars: AdminCar[]) {
  const total = Math.max(cars.length, 1);
  const issueCount = cars.reduce((sum, car) => sum + carMissingInfo(car).length, 0);
  const completeCars = cars.filter((car) => carMissingInfo(car).length === 0).length;

  return {
    issueCount,
    completeCars,
    score: Math.max(0, Math.round((completeCars / total) * 100)),
  };
}

function qualityIssueTarget(issue: string): CarTab {
  if (issue.includes("İl")) return "general";
  if (issue.includes("Şəkil")) return "images";
  if (issue.includes("Qiymət")) return "services";
  if (issue.includes("variant")) return "variants";
  if (issue.includes("Mühərrik") || issue.includes("Oturacaq")) return "technical";
  return "general";
}

function smartQueryMatches(car: AdminCar, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const haystack = [
    car.title,
    car.brand,
    car.category,
    car.slug,
    car.id,
    car.manufactureYear ? String(car.manufactureYear) : "",
    ...carMissingInfo(car),
    ...(car.variants ?? []).flatMap((variant) => [
      variant.label,
      variant.manufactureYear ? String(variant.manufactureYear) : "",
    ]),
  ].join(" ").toLowerCase();
  const missingTerms: Array<[string, boolean]> = [
    ["no year", !car.manufactureYear],
    ["il yoxdur", !car.manufactureYear],
    ["missing year", !car.manufactureYear],
    ["no price", displayPrice(car) === null],
    ["qiymət yoxdur", displayPrice(car) === null],
    ["missing price", displayPrice(car) === null],
    ["no image", !displayImage(car)],
    ["şəkil yoxdur", !displayImage(car)],
    ["missing image", !displayImage(car)],
    ["draft", car.isActive === false],
    ["qaralama", car.isActive === false],
    ["active", car.isActive !== false],
    ["aktiv", car.isActive !== false],
    ["transfer", car.transferAvailable],
    ["toy", car.weddingAvailable === true],
    ["wedding", car.weddingAvailable === true],
  ];

  return haystack.includes(normalized) || missingTerms.some(([term, matches]) => normalized.includes(term) && matches);
}

function variantPriceLabel(car: AdminCar) {
  const count = car.variants?.length ?? 0;

  return `${count + 1} variant`;
}

function carVariantYears(car: AdminCar) {
  return [
    car.manufactureYear,
    ...(car.variants ?? []).map((variant) => variant.manufactureYear),
  ].filter((year): year is number => typeof year === "number");
}

function carVariantRange(car: AdminCar) {
  const years = carVariantYears(car);

  if (!years.length) {
    return "";
  }

  const min = Math.min(...years);
  const max = Math.max(...years);

  return min === max ? String(min) : `${min}-${max}`;
}

function variantStartingPrice(variant?: { rentalPrices?: Partial<Car["rentalPrices"]> }) {
  if (!variant?.rentalPrices) {
    return null;
  }

  return (
    variant.rentalPrices.days1to3 ??
    variant.rentalPrices.days4to7 ??
    variant.rentalPrices.days8to15 ??
    variant.rentalPrices.days16to24 ??
    variant.rentalPrices.days25to30 ??
    variant.rentalPrices.days30plus ??
    null
  );
}

function variantDisplayName(variant: AdminVariantDraft | undefined, index: number) {
  if (!variant) {
    return index === 0 ? "Yeni əsas variant" : "Yeni variant";
  }

  const year = variant.manufactureYear ? String(variant.manufactureYear) : "";
  const label = variant.label?.trim() ?? "";

  if (year && label && label !== year) {
    return `${year} · ${label}`;
  }

  return year || label || (index === 0 ? "Əsas variant" : "Yeni variant");
}

function variantTitleParts(variant: AdminVariantDraft | undefined, index: number) {
  const year = variant?.manufactureYear ? String(variant.manufactureYear) : "";
  const label = variant?.label?.trim() ?? "";
  const cleanLabel = label && label !== year ? label : index === 0 ? "Əsas variant" : "";

  return {
    year: year || "İl",
    label: cleanLabel,
    title: [year || "İl", cleanLabel].filter(Boolean).join(" · "),
  };
}

function variantImagesText(variant: AdminVariantDraft | undefined) {
  return (variant?.images ?? []).join("\n");
}

function variantSpecValue<T>(variantValue: T | null | undefined, carValue: T | null | undefined) {
  return variantValue ?? carValue ?? null;
}

function inheritedState(variantValue: unknown) {
  return variantValue === null || typeof variantValue === "undefined" || variantValue === ""
    ? "Inherited"
    : "Dəyişdirilib";
}

function blogBodyText(blog?: AdminBlogPost) {
  return (
    blog?.sections
      .flatMap((section) => section.paragraphs)
      .filter(Boolean)
      .join("\n\n") ?? ""
  );
}

function blogImagesText(blog?: AdminBlogPost) {
  return blog?.images?.join("\n") ?? "";
}

function ShellButton({
  children,
  onClick,
  active,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={`admin-icon-button${active ? " is-active" : ""}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function moveMagneticItem(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const pullX = (x - rect.width / 2) * 0.08;
  const pullY = (y - rect.height / 2) * 0.08;

  event.currentTarget.style.setProperty("--mx", `${x}px`);
  event.currentTarget.style.setProperty("--my", `${y}px`);
  event.currentTarget.style.setProperty("--pull-x", `${pullX}px`);
  event.currentTarget.style.setProperty("--pull-y", `${pullY}px`);
}

function resetMagneticItem(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--pull-x", "0px");
  event.currentTarget.style.setProperty("--pull-y", "0px");
}

function PageTitle({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-page-title">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: number;
  note: string;
  icon: ReactNode;
}) {
  return (
    <article className="admin-metric-card">
      <div>
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function AdminDashboardClient({
  carsResult,
  blogsResult,
  activityLogs,
  alerts,
  flags,
}: {
  carsResult: CarsResult;
  blogsResult: BlogsResult;
  activityLogs: AdminActivityLog[];
  alerts: {
    error: string | null;
    carError: string | null;
    blogError: string | null;
    missingSupabase: boolean;
  };
  flags: Record<string, boolean>;
}) {
  const [view, setView] = useState<ViewKey>("overview");
  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("carbon-admin-sidebar") === "collapsed"
  );
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [editorReturnView, setEditorReturnView] = useState<ViewKey>("cars");
  const [editorDirty, setEditorDirty] = useState(false);
  const [pendingEditorCloseView, setPendingEditorCloseView] = useState<ViewKey | null>(null);
  const [carTab, setCarTab] = useState<CarTab>("general");
  const [blogTab, setBlogTab] = useState<BlogTab>("general");
  const [carQuery, setCarQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortKey, setSortKey] = useState("sort");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [cars, setCars] = useState(() => carsResult.cars);
  const [blogs, setBlogs] = useState(() => blogsResult.blogs);
  const [notes, setNotes] = useState<AdminNoteItem[]>(loadAdminNotes);
  const [toast, setToast] = useState<AdminToast | null>(null);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>(() =>
    activityLogs.map((entry) => ({
      id: new Date(entry.createdAt).getTime() || Date.now(),
      title: entry.action,
      text: [entry.entityTitle, entry.summary].filter(Boolean).join(" · "),
      time: new Intl.DateTimeFormat("az-AZ", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(entry.createdAt)),
    }))
  );

  const rentalCount = cars.filter((car) => car.rentalVisible !== false).length;
  const transferCars = cars.filter((car) => car.transferAvailable);
  const weddingCars = cars.filter(
    (car) => car.weddingAvailable && car.weddingPrice != null
  );
  const activeBlogCount = blogs.filter((blog) => blog.isActive !== false).length;
  const openNotesCount = notes.filter((note) => !note.done).length;

  useEffect(() => {
    window.localStorage.setItem("carbon-admin-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!commandOpen && !pendingEditorCloseView) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [commandOpen, pendingEditorCloseView]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setPendingEditorCloseView(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openCarEditor = (car?: AdminCar, index = cars.length) => {
    setCarTab("general");
    setEditorReturnView(view);
    setEditorDirty(false);
    setEditor({ type: "car", mode: car ? "edit" : "create", car, index });
  };

  const openBlogEditor = (blog?: AdminBlogPost, index = blogs.length) => {
    setBlogTab("general");
    setEditorReturnView(view);
    setEditorDirty(false);
    setEditor({ type: "blog", mode: blog ? "edit" : "create", blog, index });
  };

  const closeEditor = (nextView = editorReturnView, force = false) => {
    if (editorDirty && !force) {
      setPendingEditorCloseView(nextView);
      return;
    }

    setEditor(null);
    setEditorDirty(false);
    setPendingEditorCloseView(null);
    setView(nextView);
  };

  async function restoreCarsSnapshot(snapshot: AdminCar[], label: string) {
    if (!snapshot.length) return;

    setCars((items) => {
      const restored = snapshot.reduce((next, car) => {
        const exists = next.some((item) => item.id === car.id);
        return exists
          ? next.map((item) => (item.id === car.id ? car : item))
          : [...next, car];
      }, items);

      return restored.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });

    const results = await Promise.all(snapshot.map((car) => restoreCarInlineAction(car)));
    const failed = results.find((result) => !result.ok);

    setToast({
      id: Date.now(),
      type: failed ? "error" : "success",
      title: failed ? "Geri alma tam alınmadı" : "Geri alındı",
      text: failed ? adminClientMessage(failed.error) : label,
    });
    addChange("Undo", label, { entityType: "car", entityTitle: snapshot[0]?.title ?? "Avtomobil" });
  }

  const upsertCar = (car: AdminCar, previousCar?: AdminCar | null, summary?: string) => {
    setCars((items) => {
      const exists = items.some((item) => item.id === car.id);
      const next = exists
        ? items.map((item) => (item.id === car.id ? car : item))
        : [...items, car];

      return next.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });
    setEditor({ type: "car", mode: "edit", car, index: car.sortOrder ?? cars.length });
    setToast({
      id: Date.now(),
      type: "success",
      title: "Avtomobil yadda saxlanıldı",
      text: summary || "Dəyişikliklər saytda yenilənir.",
      actionLabel: previousCar ? "Geri al" : undefined,
      onAction: previousCar ? () => void restoreCarsSnapshot([previousCar], `${car.title} əvvəlki vəziyyətə qaytarıldı.`) : undefined,
    });
    addChange("Avtomobil yeniləndi", summary || car.title, { entityType: "car", entityId: car.id, entityTitle: car.title });
  };

  const upsertBlog = (blog: AdminBlogPost) => {
    setBlogs((items) => {
      const exists = items.some((item) => item.slug === blog.slug);
      const next = exists
        ? items.map((item) => (item.slug === blog.slug ? blog : item))
        : [...items, blog];

      return next.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });
    setEditor({ type: "blog", mode: "edit", blog, index: blog.sortOrder ?? blogs.length });
    setToast({
      id: Date.now(),
      type: "success",
      title: "Blog məqaləsi yadda saxlanıldı",
      text: "Məzmun yeniləndi.",
    });
    addChange("Blog yeniləndi", blog.title);
  };

  const removeCar = (id: string, deletedCar?: AdminCar | null) => {
    setCars((items) => items.filter((item) => item.id !== id));
    setEditor(null);
    setToast({
      id: Date.now(),
      type: "success",
      title: "Avtomobil silindi",
      text: deletedCar?.title,
      actionLabel: deletedCar ? "Geri al" : undefined,
      onAction: deletedCar ? () => void restoreCarsSnapshot([deletedCar], `${deletedCar.title} bərpa edildi.`) : undefined,
    });
    addChange("Avtomobil silindi", deletedCar?.title ?? id, { entityType: "car", entityId: id, entityTitle: deletedCar?.title ?? id });
  };

  const removeBlog = (slug: string) => {
    setBlogs((items) => items.filter((item) => item.slug !== slug));
    setEditor(null);
    setToast({
      id: Date.now(),
      type: "success",
      title: "Blog məqaləsi silindi",
    });
  };

  const filteredCars = useMemo(() => {
    const query = carQuery.trim().toLowerCase();

    return cars
      .filter((car) => {
        const matchesQuery = smartQueryMatches(car, query);
        const matchesCategory = categoryFilter === "all" || car.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" ? car.isActive !== false : car.isActive === false);
        const matchesService =
          serviceFilter === "all" ||
          (serviceFilter === "rental" && car.rentalVisible !== false) ||
          (serviceFilter === "transfer" && car.transferAvailable) ||
          (serviceFilter === "wedding" && car.weddingAvailable);

        return matchesQuery && matchesCategory && matchesStatus && matchesService;
      })
      .sort((a, b) => {
        if (sortKey === "newest") {
          return (b.sortOrder ?? 0) - (a.sortOrder ?? 0);
        }

        if (sortKey === "title") {
          return a.title.localeCompare(b.title);
        }

        if (sortKey === "title-desc") {
          return b.title.localeCompare(a.title);
        }

        if (sortKey === "price") {
          return (startPrice(a) ?? 0) - (startPrice(b) ?? 0);
        }

        if (sortKey === "price-desc") {
          return (startPrice(b) ?? 0) - (startPrice(a) ?? 0);
        }

        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });
  }, [cars, carQuery, categoryFilter, statusFilter, serviceFilter, sortKey]);

  const mediaItems = useMemo(() => {
    const carMedia = cars.flatMap((car) => [
      car.thumbnail
        ? { id: `car-${car.id}-thumbnail`, title: car.title, src: car.thumbnail, type: "Avtomobil" }
        : null,
      car.weddingThumbnail
        ? { id: `car-${car.id}-wedding`, title: `${car.title} toy`, src: car.weddingThumbnail, type: "Toy" }
        : null,
    ]);
    const blogMedia = blogs.flatMap((blog) => [
      blog.image
        ? { id: `blog-${blog.slug}-cover`, title: blog.title, src: blog.image, type: "Blog" }
        : null,
      ...(blog.images ?? []).map((src, index) => ({
        id: `blog-${blog.slug}-extra-${index}`,
        title: blog.title,
        src,
        type: "Blog",
      })),
    ]);

    return [...carMedia, ...blogMedia].filter(Boolean) as Array<{
      id: string;
      title: string;
      src: string;
      type: string;
    }>;
  }, [cars, blogs]);

  const currentLabel =
    navGroups.flatMap((group) => group.items).find((item) => item.key === view)?.label ?? "İcmal";

  const commands = [
    { label: "Avtomobillərə keç", hint: "Avtomobil parkı", run: () => setView("cars") },
    { label: "Yeni avtomobil əlavə et", hint: "Yarat", run: () => openCarEditor() },
    { label: "Bloga keç", hint: "Məzmun", run: () => setView("blog") },
    { label: "Yeni məqalə əlavə et", hint: "Yarat", run: () => openBlogEditor() },
    { label: "Təlimatı aç", hint: "Admin kömək", run: () => setView("tutorial") },
    { label: "Keyfiyyət mərkəzi", hint: "Çatışmayan məlumatlar", run: () => setView("quality") },
    { label: "İcarəyə keç", hint: "Xidmət", run: () => setView("rental") },
    { label: "Transferlərə keç", hint: "Xidmət", run: () => setView("transfer") },
    { label: "Toy avtomobillərinə keç", hint: "Xidmət", run: () => setView("weddings") },
    { label: "Sayta bax", hint: "Carbon", run: () => window.open("/", "_blank") },
  ].filter((command) => command.label.toLowerCase().includes(commandQuery.toLowerCase()));

  function addChange(title: string, text: string, meta?: { entityType?: string; entityId?: string | null; entityTitle?: string | null }) {
    setChangeLog((items) => [
      {
        id: Date.now(),
        title,
        text,
        time: new Intl.DateTimeFormat("az-AZ", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      },
      ...items,
    ].slice(0, 8));
    void recordAdminActivityInlineAction({
      action: title,
      entityType: meta?.entityType ?? "admin",
      entityId: meta?.entityId ?? null,
      entityTitle: meta?.entityTitle ?? text,
      summary: text,
    });
  }

  function openCarAtTab(car?: AdminCar, index = cars.length, tab: CarTab = "general") {
    setCarTab(tab);
    setEditorReturnView(view);
    setEditorDirty(false);
    setEditor({ type: "car", mode: car ? "edit" : "create", car, index });
  }

  async function bulkUpdateCars(ids: string[], patch: Partial<AdminCar>, label: string) {
    if (!ids.length) return;
    const previousCars = cars.filter((car) => ids.includes(car.id));

    setCars((items) => items.map((car) => (ids.includes(car.id) ? { ...car, ...patch } : car)));
    addChange("Bulk edit", `${ids.length} avtomobil: ${label}`, { entityType: "car", entityTitle: `${ids.length} avtomobil` });

    const result = await bulkUpdateCarsInlineAction(ids.map((id) => ({ id, patch })));

    if (!result.ok) {
      setToast({
        id: Date.now(),
        type: "error",
        title: "Bulk dəyişiklik lokal qaldı",
        text: adminClientMessage(result.error),
      });
      return;
    }

    if (result.cars.length) {
      setCars((items) =>
        items.map((car) => result.cars.find((savedCar) => savedCar.id === car.id) ?? car)
      );
    }

    setToast({
      id: Date.now(),
      type: "success",
      title: "Bulk dəyişiklik yadda saxlanıldı",
      text: `${ids.length} avtomobil yeniləndi.`,
      actionLabel: previousCars.length ? "Geri al" : undefined,
      onAction: previousCars.length ? () => void restoreCarsSnapshot(previousCars, `${previousCars.length} bulk dəyişiklik geri alındı.`) : undefined,
    });
  }

  return (
    <main className={`admin-app-shell${collapsed ? " is-sidebar-collapsed" : ""}${theme === "light" ? " is-light-theme" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand-lockup">
          <span className="admin-brand-logo">
            <Image src="/images/carbon-logo.webp" alt="Carbon Rent A Car" width={138} height={80} priority />
          </span>
          <small>İdarə paneli</small>
        </div>

        <nav className="admin-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={view === item.key ? "is-active" : ""}
                    onClick={() => {
                      if (editor) {
                        closeEditor(item.key);
                        return;
                      }

                      setView(item.key);
                    }}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    onPointerMove={moveMagneticItem}
                    onPointerLeave={resetMagneticItem}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    {item.key === "notes" && openNotesCount > 0 ? <small>{openNotesCount}</small> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "Sayta bax" : undefined}
            aria-label="Sayta bax"
            onPointerMove={moveMagneticItem}
            onPointerLeave={resetMagneticItem}
          >
            <ExternalLink size={16} />
            <span>Sayta bax</span>
          </Link>
          <form action={logoutAction} className="admin-user-card">
            <span className="admin-user-avatar">N</span>
            <span className="admin-user-copy">
              <strong>JS Carbon</strong>
              <small>Administrator</small>
            </span>
            <button
              type="submit"
              title={collapsed ? "Çıxış" : undefined}
              aria-label="Çıxış"
              onPointerMove={moveMagneticItem}
              onPointerLeave={resetMagneticItem}
            >
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>Admin</span>
            <ChevronDown size={13} />
            <strong>{currentLabel}</strong>
          </div>

          <button type="button" className="admin-command-trigger" onClick={() => setCommandOpen(true)}>
            <Search size={15} />
            <span>Axtarış və sürətli əmrlər...</span>
            <kbd>⌘ K</kbd>
          </button>

          <div className="admin-topbar-actions">
            <ShellButton
              active={theme === "light"}
              onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </ShellButton>
            <ShellButton onClick={() => undefined} title="Bildirişlər">
              <Bell size={16} />
            </ShellButton>
            <ShellButton onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Menyunu aç" : "Menyunu yığ"}>
              {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </ShellButton>
          </div>
        </header>

        <div className="admin-content">
          <Alerts alerts={alerts} flags={flags} />

          <AnimatePresence mode="wait" initial={false}>
            {editor ? (
              <motion.div
                key={`editor-${editor.type}-${editor.type === "car" ? editor.car?.id ?? editor.index : editor.blog?.slug ?? editor.index}`}
                className="admin-motion-screen"
                initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, scale: 0.99, filter: "blur(6px)" }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <EditorWorkspace
                  editor={editor}
                  carTab={carTab}
                  blogTab={blogTab}
                  onCarTab={setCarTab}
                  onBlogTab={setBlogTab}
                  onCarSaved={upsertCar}
                  onBlogSaved={upsertBlog}
                  onCarDeleted={removeCar}
                  onBlogDeleted={removeBlog}
                  onToast={(nextToast) =>
                    setToast({
                      ...nextToast,
                      id: Date.now(),
                    })
                  }
                  onDirtyChange={setEditorDirty}
                  onClose={() => closeEditor(editorReturnView)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`view-${view}`}
                className="admin-motion-screen"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
              {view === "overview" ? (
                <OverviewView
                  cars={cars}
                  blogs={blogs}
                  source={carsResult.source}
                  configured={carsResult.configured}
                  rentalCount={rentalCount}
                  transferCount={transferCars.length}
                  weddingCount={weddingCars.length}
                  activeBlogCount={activeBlogCount}
                  onNewCar={() => openCarEditor()}
                  onNewBlog={() => openBlogEditor()}
                  onView={setView}
                  onEditCar={openCarAtTab}
                  changeLog={changeLog}
                />
              ) : null}

              {view === "cars" ? (
                <CarsView
                  cars={filteredCars}
                  allCars={cars}
                  query={carQuery}
                  category={categoryFilter}
                  status={statusFilter}
                  service={serviceFilter}
                  sortKey={sortKey}
                  layout={layout}
                  onQuery={setCarQuery}
                  onCategory={setCategoryFilter}
                  onStatus={setStatusFilter}
                  onService={setServiceFilter}
                  onSort={setSortKey}
                  onLayout={setLayout}
                  onNew={() => openCarEditor()}
                  onEdit={openCarAtTab}
                  onBulkUpdate={bulkUpdateCars}
                />
              ) : null}

              {view === "bookings" ? (
                <ComingSoonView
                  eyebrow="İDARƏETMƏ"
                  title="Bronlar"
                  subtitle="İcarə, transfer və toy sorğuları üçün vahid bron mərkəzi."
                />
              ) : null}

              {view === "customers" ? (
                <ComingSoonView
                  eyebrow="İDARƏETMƏ"
                  title="Müştərilər"
                  subtitle="Müştəri profilləri, əlaqə məlumatları və bron tarixçəsi burada toplanacaq."
                />
              ) : null}

              {view === "rental" ? (
                <ServiceCarsView
                  title="İcarə"
                  subtitle="Gündəlik icarə üçün aktiv avtomobillər və başlanğıc qiymətlər"
                  cars={cars.filter((car) => car.rentalVisible !== false)}
                  icon={<Gauge size={18} />}
                  onEdit={openCarEditor}
                />
              ) : null}

              {view === "transfer" ? (
                <ServiceCarsView
                  title="Transferlər"
                  subtitle="Transfer üçün aktiv avtomobilləri və marşrut qiymətlərini idarə edin"
                  cars={transferCars}
                  icon={<Plane size={18} />}
                  onEdit={openCarEditor}
                />
              ) : null}

              {view === "weddings" ? (
                <ServiceCarsView
                  title="Toy avtomobilləri"
                  subtitle="Toy kolleksiyasını və xüsusi gün qiymətlərini idarə edin"
                  cars={weddingCars}
                  icon={<Heart size={18} />}
                  onEdit={openCarEditor}
                  mode="wedding"
                />
              ) : null}

              {view === "blog" ? (
                <BlogView blogs={blogs} onNew={() => openBlogEditor()} onEdit={openBlogEditor} />
              ) : null}

              {view === "media" ? <MediaView items={mediaItems} /> : null}
              {view === "notes" ? <NotesView notes={notes} setNotes={setNotes} /> : null}
              {view === "tutorial" ? <TutorialView onView={setView} onNewCar={() => openCarEditor()} /> : null}
              {view === "quality" ? (
                <QualityView
                  cars={cars}
                  onEdit={(car, index, tab) => openCarAtTab(car, index, tab)}
                />
              ) : null}
              {view === "settings" ? (
                <SettingsView carsResult={carsResult} blogsResult={blogsResult} />
              ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {pendingEditorCloseView ? (
        <AdminPortal>
          <div className="admin-confirm-layer" role="dialog" aria-modal="true" aria-labelledby="admin-unsaved-title">
            <button
              type="button"
              className="admin-preview-backdrop"
              onClick={() => setPendingEditorCloseView(null)}
              aria-label="Modalı bağla"
            />
            <section className="admin-confirm-card admin-unsaved-card">
              <div>
                <span className="admin-confirm-icon"><AlertTriangle size={18} /></span>
                <div>
                  <h2 id="admin-unsaved-title">Saxlanılmamış dəyişikliklər var</h2>
                  <p>Bu səhifədən çıxsanız, redaktə etdiyiniz son dəyişikliklər itiriləcək.</p>
                </div>
              </div>
              <footer>
                <button type="button" className="admin-secondary-button" onClick={() => setPendingEditorCloseView(null)}>
                  Redaktəyə qayıt
                </button>
                <button
                  type="button"
                  className="admin-danger-button"
                  onClick={() => closeEditor(pendingEditorCloseView, true)}
                >
                  Çıx və dəyişiklikləri at
                </button>
              </footer>
            </section>
          </div>
        </AdminPortal>
      ) : null}

      {commandOpen ? (
        <AdminPortal>
          <div className="admin-command-backdrop" onMouseDown={() => setCommandOpen(false)}>
            <section className="admin-command-palette" onMouseDown={(event) => event.stopPropagation()}>
              <div className="admin-command-input">
                <Search size={17} />
                <input
                  autoFocus
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  placeholder="Əmr və ya səhifə axtar..."
                />
                <kbd>Esc</kbd>
              </div>
              <div className="admin-command-list">
                {commands.map((command) => (
                  <button
                    key={command.label}
                    type="button"
                    onClick={() => {
                      command.run();
                      setCommandOpen(false);
                      setCommandQuery("");
                    }}
                  >
                    <span>{command.label}</span>
                    <small>{command.hint}</small>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </AdminPortal>
      ) : null}

      {toast ? (
        <AdminToastMessage toast={toast} onClose={() => setToast(null)} />
      ) : null}
    </main>
  );
}

function AdminToastMessage({
  toast,
  onClose,
}: {
  toast: AdminToast;
  onClose: () => void;
}) {
  return (
    <div className={`admin-floating-toast is-${toast.type}`} role="status">
      <span className="admin-floating-toast-icon">
        {toast.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}
      </span>

      <span>
        <strong>{toast.title}</strong>
        {toast.text ? <small>{toast.text}</small> : null}
        {toast.actionLabel && toast.onAction ? (
          <button
            type="button"
            className="admin-toast-action"
            onClick={() => {
              toast.onAction?.();
              onClose();
            }}
          >
            {toast.actionLabel}
          </button>
        ) : null}
      </span>

      <button type="button" className="admin-toast-close" onClick={onClose} aria-label="Bildirişi bağla">
        <X size={14} />
      </button>
    </div>
  );
}

function Alerts({
  alerts,
  flags,
}: {
  alerts: {
    error: string | null;
    carError: string | null;
    blogError: string | null;
    missingSupabase: boolean;
  };
  flags: Record<string, boolean>;
}) {
  const successes = [
    flags.saved ? "Avtomobil yadda saxlanıldı." : null,
    flags.seeded ? "Lokal avtomobillər Supabase bazasına köçürüldü." : null,
    flags.deleted ? "Avtomobil silindi." : null,
    flags.blogSaved ? "Blog məqaləsi yadda saxlanıldı." : null,
    flags.blogsSeeded ? "Lokal blog məqalələri Supabase bazasına köçürüldü." : null,
    flags.blogDeleted ? "Blog məqaləsi silindi." : null,
  ].filter(Boolean);

  return (
    <div className="admin-alert-stack">
      {alerts.error ? <div className="admin-alert">{alerts.error}</div> : null}
      {alerts.carError ? <div className="admin-alert">{alerts.carError}</div> : null}
      {alerts.blogError ? <div className="admin-alert">{alerts.blogError}</div> : null}
      {alerts.missingSupabase ? (
        <div className="admin-alert">
          Yadda saxlama üçün Supabase env məlumatlarını əlavə edin: SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL və NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </div>
      ) : null}
      {successes.map((message) => (
        <div key={message} className="admin-success">
          {message}
        </div>
      ))}
    </div>
  );
}

function OverviewView({
  cars,
  blogs,
  source,
  configured,
  rentalCount,
  transferCount,
  weddingCount,
  activeBlogCount,
  onNewCar,
  onNewBlog,
  onView,
  onEditCar,
  changeLog,
}: {
  cars: AdminCar[];
  blogs: AdminBlogPost[];
  source: "local" | "supabase";
  configured: boolean;
  rentalCount: number;
  transferCount: number;
  weddingCount: number;
  activeBlogCount: number;
  onNewCar: () => void;
  onNewBlog: () => void;
  onView: (view: ViewKey) => void;
  onEditCar: (car?: AdminCar, index?: number, tab?: CarTab) => void;
  changeLog: ChangeLogEntry[];
}) {
  const recentCars = cars.slice(0, 5);
  const quality = fleetQuality(cars);
  const issueCars = cars.filter((car) => carMissingInfo(car).length > 0);

  return (
    <div className="admin-view">
      <PageTitle
        eyebrow="İCMAL"
        title="İcmal"
        subtitle="Carbon Rent A Car idarəetmə mərkəzi"
        action={
          <button type="button" className="admin-primary-button" onClick={onNewCar}>
            <Plus size={16} />
            Yeni avtomobil
          </button>
        }
      />

      <section className="admin-metric-grid">
        <MetricCard label="Cəmi avtomobil" value={cars.length} note="Park" icon={<CarFront size={18} />} />
        <MetricCard label="İcarədə" value={rentalCount} note="Saytda görünür" icon={<Gauge size={18} />} />
        <MetricCard label="Transfer" value={transferCount} note="Mövcuddur" icon={<Plane size={18} />} />
        <MetricCard label="Toy avtomobilləri" value={weddingCount} note="Kolleksiya" icon={<Heart size={18} />} />
        <MetricCard label="Aktiv məqalə" value={activeBlogCount} note="Blog" icon={<Newspaper size={18} />} />
        <MetricCard label="Fleet health" value={quality.score} note={`${quality.issueCount} problem`} icon={<Percent size={18} />} />
      </section>

      <div className="admin-overview-grid">
        <section className="admin-panel admin-health-card">
          <div className="admin-panel-title">
            <div>
              <p>FLEET HEALTH</p>
              <h2>{quality.score}% tamamlanıb</h2>
            </div>
            <AlertTriangle size={18} />
          </div>
          <i><span style={{ width: `${quality.score}%` }} /></i>
          <p>{quality.completeCars} avtomobil tamdır, {issueCars.length} avtomobil yoxlanmalıdır.</p>
          <button type="button" className="admin-secondary-button" onClick={() => onView("quality")}>
            Keyfiyyət mərkəzinə keç
            <ArrowRight size={14} />
          </button>
        </section>

        <section className="admin-panel admin-table-panel">
          <div className="admin-panel-title">
            <div>
              <p>AVTOMOBİL PARKI</p>
              <h2>Son avtomobillər</h2>
            </div>
            <button type="button" onClick={() => onView("cars")}>Hamısına bax</button>
          </div>
          <div className="admin-data-table is-compact">
            {recentCars.map((car, index) => (
              <button key={car.id} type="button" className="admin-table-row" onClick={() => onEditCar(car, index)}>
                <CarIdentity car={car} />
                <span>{categoryLabels[car.category] ?? car.category}</span>
                <span>{startPrice(car) ? `${startPrice(car)} ₼` : "-"}</span>
                <StatusDot active={car.isActive} />
              </button>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <p>CHANGE HISTORY</p>
              <h2>Son dəyişikliklər</h2>
            </div>
            <History size={18} />
          </div>
          <div className="admin-change-log">
            {changeLog.length ? changeLog.map((entry) => (
              <span key={entry.id}>
                <b>{entry.time}</b>
                <strong>{entry.title}</strong>
                <small>{entry.text}</small>
              </span>
            )) : (
              <p>Bu sessiyada dəyişiklik yoxdur.</p>
            )}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <p>SÜRƏTLİ ƏMƏLİYYATLAR</p>
              <h2>Sürətli əməliyyatlar</h2>
            </div>
          </div>
          <div className="admin-quick-actions">
            <button type="button" onClick={onNewCar}><Plus size={16} /> Avtomobil əlavə et</button>
            <button type="button" onClick={onNewBlog}><Plus size={16} /> Blog yazısı yarat</button>
            <button type="button" onClick={() => onView("quality")}><AlertTriangle size={16} /> Boş məlumatları yoxla</button>
            <button type="button" onClick={() => onView("weddings")}><Heart size={16} /> Toy kolleksiyası</button>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <p>SİSTEM</p>
              <h2>Sistem</h2>
            </div>
          </div>
          <dl className="admin-system-list">
            <div><dt>Məlumat bazası</dt><dd>{source === "supabase" ? "Supabase" : "Lokal ehtiyat"}</dd></div>
            <div><dt>Status</dt><dd>{configured ? "Qoşulub" : "Env çatışmır"}</dd></div>
            <div><dt>Avtomobillər</dt><dd>{cars.length}</dd></div>
            <div><dt>Blog</dt><dd>{blogs.length}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function CarsView({
  cars,
  allCars,
  query,
  category,
  status,
  service,
  sortKey,
  layout,
  onQuery,
  onCategory,
  onStatus,
  onService,
  onSort,
  onLayout,
  onNew,
  onEdit,
  onBulkUpdate,
}: {
  cars: AdminCar[];
  allCars: AdminCar[];
  query: string;
  category: string;
  status: string;
  service: string;
  sortKey: string;
  layout: "list" | "grid";
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onStatus: (value: string) => void;
  onService: (value: string) => void;
  onSort: (value: string) => void;
  onLayout: (value: "list" | "grid") => void;
  onNew: () => void;
  onEdit: (car?: AdminCar, index?: number, tab?: CarTab) => void;
  onBulkUpdate: (ids: string[], patch: Partial<AdminCar>, label: string) => void | Promise<void>;
}) {
  const categories = Array.from(new Set(allCars.map((car) => car.category)));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState<CarCategory>("Business");
  const filterShellRef = useRef<HTMLDivElement>(null);
  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (service !== "all" ? 1 : 0);
  const activeCount = allCars.filter((car) => car.isActive !== false).length;
  const transferCount = allCars.filter((car) => car.transferAvailable).length;
  const weddingCount = allCars.filter((car) => car.weddingAvailable).length;
  const activePercent = Math.round((activeCount / Math.max(allCars.length, 1)) * 100);
  const heroImage = allCars.find((car) => displayImage(car))?.thumbnail;
  const fleetStats = [
    { value: allCars.length, label: "Avtomobil", note: `${categories.length} kateqoriya`, icon: CarFront },
    { value: activeCount, label: "Aktiv", note: `${activePercent}% park`, icon: Gauge },
    { value: transferCount, label: "Transfer", note: "Xidmət aktiv", icon: Plane },
    { value: weddingCount, label: "Toy", note: "Toy xidməti", icon: Heart },
  ];
  const selectedCars = allCars.filter((car) => selectedIds.includes(car.id));
  const categoryOptions = [
    { value: "all", label: "Hamısı" },
    ...categories.map((item) => ({ value: item, label: categoryLabels[item] ?? item })),
  ];
  const serviceOptions = [
    { value: "all", label: "Hamısı" },
    { value: "rental", label: "İcarə" },
    { value: "transfer", label: "Transfer" },
    { value: "wedding", label: "Toy" },
  ];
  const statusOptions = [
    { value: "all", label: "Hamısı" },
    { value: "active", label: "Dərc olunub" },
    { value: "hidden", label: "Qaralama" },
  ];
  const sortOptions = [
    { value: "sort", label: "Ən köhnə" },
    { value: "newest", label: "Son əlavə edilən" },
    { value: "title", label: "A-Z" },
    { value: "title-desc", label: "Z-A" },
    { value: "price", label: "Qiymət ↑" },
    { value: "price-desc", label: "Qiymət ↓" },
  ];
  const bulkCategoryOptions = carCategories.map((item) => ({
    value: item,
    label: categoryLabels[item] ?? item,
  }));

  useEffect(() => {
    if (!filtersOpen) return;

    function onPointerDown(event: globalThis.PointerEvent) {
      if (!filterShellRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  function toggleSelected(id: string) {
    setSelectedIds((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function runBulk(patch: Partial<AdminCar>, label: string) {
    onBulkUpdate(selectedIds, patch, label);
    clearSelection();
  }

  return (
    <div className="admin-view">
      <section className="admin-fleet-hero">
        {heroImage ? (
          <Image className="admin-fleet-hero-image" src={heroImage} alt="" fill sizes="760px" aria-hidden="true" />
        ) : null}
        <div>
          <p>AVTOMOBİL PARKI</p>
          <h1>Avtomobillər</h1>
          <span>Avtomobil parkını idarə edin, yeni avtomobillər əlavə edin və məlumatlarını yeniləyin.</span>
        </div>
        <div className="admin-title-actions">
          <button type="button" className="admin-secondary-button">
            <Upload size={15} />
            Import
          </button>
          <button type="button" className="admin-primary-button" onClick={onNew}><Plus size={16} /> Yeni avtomobil</button>
        </div>
      </section>

      <section className="admin-fleet-stat-strip">
        {fleetStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label}>
              <span><Icon size={16} /></span>
              <div>
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </div>
              <em>{stat.note}</em>
            </article>
          );
        })}
      </section>

      <div className="admin-toolbar">
        <label className="admin-search-field">
          <Search size={15} />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder='Axtar: "BMW", "no price", "il yoxdur", "toy", "draft"...' />
          {query ? (
            <button type="button" onClick={() => onQuery("")} aria-label="Axtarışı təmizlə">
              <X size={14} />
            </button>
          ) : null}
        </label>

        <div className="admin-filter-shell" ref={filterShellRef}>
          <button
            type="button"
            className={`admin-filter-button${filtersOpen ? " is-active" : ""}`}
            onClick={() => setFiltersOpen((value) => !value)}
            onPointerMove={moveMagneticItem}
            onPointerLeave={resetMagneticItem}
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeFilterCount ? <span>{activeFilterCount}</span> : null}
          </button>
          {filtersOpen ? (
            <div className="admin-filter-popover">
              <label>
                <span>Kateqoriya</span>
                <AdminSelect value={category} onChange={onCategory} options={categoryOptions} label="Kateqoriya" />
              </label>
              <label>
                <span>Xidmət</span>
                <AdminSelect value={service} onChange={onService} options={serviceOptions} label="Xidmət" />
              </label>
              <label>
                <span>Status</span>
                <AdminSelect value={status} onChange={onStatus} options={statusOptions} label="Status" />
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    onCategory("all");
                    onStatus("all");
                    onService("all");
                  }}
                >
                  Təmizlə
                </button>
                <button type="button" onClick={() => setFiltersOpen(false)}>
                  Tətbiq et
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <AdminSelect value={sortKey} onChange={onSort} options={sortOptions} label="Sıralama" icon={<ArrowUpDown size={15} />} compact />
        <div className="admin-segmented">
          <ShellButton active={layout === "list"} onClick={() => onLayout("list")} title="Siyahı görünüşü">
            <List size={15} />
          </ShellButton>
          <ShellButton active={layout === "grid"} onClick={() => onLayout("grid")} title="Kart görünüşü">
            <Grid2X2 size={15} />
          </ShellButton>
        </div>
      </div>

      {selectedIds.length ? (
        <section className="admin-bulk-bar">
          <div>
            <strong>{selectedIds.length} seçildi</strong>
            <small>{selectedCars.map((car) => car.title).slice(0, 2).join(", ")}{selectedIds.length > 2 ? ` +${selectedIds.length - 2}` : ""}</small>
          </div>
          <button type="button" onClick={() => runBulk({ isActive: true }, "dərc olundu")}>Dərc et</button>
          <button type="button" onClick={() => runBulk({ isActive: false }, "qaralamaya keçirildi")}>Qaralama et</button>
          <button type="button" onClick={() => runBulk({ rentalVisible: true }, "icarə aktiv edildi")}>İcarəni aç</button>
          <button type="button" onClick={() => runBulk({ transferAvailable: true }, "transfer aktiv edildi")}>Transfer aç</button>
          <AdminSelect
            value={bulkCategory}
            onChange={(nextValue) => setBulkCategory(nextValue as CarCategory)}
            options={bulkCategoryOptions}
            label="Bulk kateqoriya"
            compact
          />
          <button type="button" onClick={() => runBulk({ category: bulkCategory }, `${categoryLabels[bulkCategory] ?? bulkCategory} kateqoriyası`)}>
            Kateqoriya
          </button>
          <button type="button" onClick={clearSelection}>Təmizlə</button>
        </section>
      ) : null}

      <div className="admin-results-line">
        <span>{cars.length} nəticə göstərilir</span>
      </div>

      {cars.length === 0 ? (
        <section className="admin-empty-state">
          <Search size={22} />
          <h2>Nəticə tapılmadı</h2>
          <p>Axtarış sözünü və ya filtr seçimlərini dəyişin.</p>
        </section>
      ) : layout === "list" ? (
        <CarTable cars={cars} onEdit={onEdit} selectedIds={selectedIds} onSelect={toggleSelected} />
      ) : (
        <CarGrid cars={cars} onEdit={onEdit} selectedIds={selectedIds} onSelect={toggleSelected} />
      )}
    </div>
  );
}

function CarIdentity({ car, mode = "fleet" }: { car: AdminCar; mode?: CarTableMode }) {
  const image = displayImage(car, mode);
  const yearText = car.manufactureYear ? String(car.manufactureYear) : carVariantRange(car);
  const year = yearText ? ` • ${yearText}` : "";
  const missingInfo = carMissingInfo(car, mode);
  const rentalHidden = car.rentalVisible === false;
  const publicHidden = car.isActive === false;

  return (
    <span className="admin-car-identity">
      <span className="admin-thumb">
        {image ? (
          <Image src={image} alt={car.title} fill sizes="76px" />
        ) : (
          <CarFront size={18} />
        )}
      </span>
      <span>
        <strong>
          <span className="admin-brand-mini-logo"><BrandLogo brand={car.brand} size={18} /></span>
          {car.title}
        </strong>
        <small>{car.brand}{year}</small>
        {missingInfo.length ? (
          <span className="admin-missing-labels">
            {missingInfo.slice(0, 3).map((item) => (
              <em key={item}>{item}</em>
            ))}
          </span>
        ) : null}
        {rentalHidden ? (
          <span className="admin-catalog-hidden-label">
            İcarə kataloqunda gizli
          </span>
        ) : null}
        {publicHidden ? (
          <span className="admin-catalog-hidden-label">
            Saytda görünmür
          </span>
        ) : null}
      </span>
    </span>
  );
}

function ServicePills({ car }: { car: AdminCar }) {
  const services = [
    car.rentalVisible !== false ? { label: "İcarə", icon: CarFront } : null,
    car.transferAvailable ? { label: "Transfer", icon: Plane } : null,
    car.weddingAvailable ? { label: "Toy", icon: Heart } : null,
  ].filter(Boolean) as Array<{ label: string; icon: LucideIcon }>;

  if (!services.length) {
    return car.rentalVisible === false ? (
      <span className="admin-service-pills">
        <i className="is-hidden-service">
          <CarFront size={12} />
          İcarə gizli
        </i>
      </span>
    ) : (
      <span className="admin-service-empty">—</span>
    );
  }

  return (
    <span className="admin-service-pills">
      {car.rentalVisible === false ? (
        <i className="is-hidden-service">
          <CarFront size={12} />
          İcarə gizli
        </i>
      ) : null}
      {services.map((service) => {
        const Icon = service.icon;

        return (
          <i key={service.label}>
            <Icon size={12} />
            {service.label}
          </i>
        );
      })}
    </span>
  );
}

function CarTable({
  cars,
  onEdit,
  mode = "fleet",
  selectedIds = [],
  onSelect,
}: {
  cars: AdminCar[];
  onEdit: (car?: AdminCar, index?: number, tab?: CarTab) => void;
  mode?: CarTableMode;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}) {
  return (
    <section className="admin-panel admin-table-panel">
      <div className={`admin-table-head${onSelect ? " is-selectable" : ""}`}>
        {onSelect ? <span /> : null}
        <span>Avtomobil</span>
        <span>Variantlar</span>
        <span>Kateqoriya</span>
        <span>Qiymət</span>
        <span>Status</span>
        <span>Əməliyyatlar</span>
      </div>
      <div className="admin-data-table">
        {cars.map((car, index) => (
          <button key={car.id} type="button" className={`admin-table-row${onSelect ? " is-selectable" : ""}${selectedIds.includes(car.id) ? " is-selected" : ""}`} onClick={() => onEdit(car, index)}>
            {onSelect ? (
              <span className="admin-row-select" onClick={(event) => event.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(car.id)}
                  onChange={() => onSelect(car.id)}
                  aria-label={`${car.title} seç`}
                />
              </span>
            ) : null}
            <CarIdentity car={car} mode={mode} />
            <span className="admin-variant-cell">
              <strong>{variantPriceLabel(car)}</strong>
              <small>{carVariantRange(car)}</small>
            </span>
            <span className="admin-category-cell"><CarFront size={13} />{categoryLabels[car.category] ?? car.category}</span>
            <span className="admin-price-cell"><Database size={14} />{displayPrice(car, mode) ? `${displayPrice(car, mode)} ₼-dan` : "-"}</span>
            <StatusDot active={car.isActive} />
            <span className="admin-row-actions">
              <ServicePills car={car} />
              <i><MoreHorizontal size={16} /></i>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CarGrid({
  cars,
  onEdit,
  selectedIds = [],
  onSelect,
}: {
  cars: AdminCar[];
  onEdit: (car?: AdminCar, index?: number, tab?: CarTab) => void;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}) {
  return (
    <section className="admin-card-grid">
      {cars.map((car, index) => (
        <button key={car.id} type="button" className={`admin-fleet-card${selectedIds.includes(car.id) ? " is-selected" : ""}`} onClick={() => onEdit(car, index)}>
          {onSelect ? (
            <span className="admin-card-select" onClick={(event) => event.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedIds.includes(car.id)}
                onChange={() => onSelect(car.id)}
                aria-label={`${car.title} seç`}
              />
            </span>
          ) : null}
          {carMissingInfo(car).length ? (
            <span className="admin-card-missing-labels">
              {carMissingInfo(car).slice(0, 2).map((item) => (
                <em key={item}>{item}</em>
              ))}
            </span>
          ) : null}
          <span className="admin-fleet-card-image">
            {car.thumbnail ? <Image src={car.thumbnail} alt={car.title} fill sizes="280px" /> : <CarFront size={24} />}
          </span>
          <span className="admin-fleet-card-body">
            <strong>{car.title}</strong>
            <small>
              {car.brand}
              {car.manufactureYear ? ` · ${car.manufactureYear}` : ""}
            </small>
            {car.rentalVisible === false ? (
              <span className="admin-catalog-hidden-label">
                İcarə kataloqunda gizli
              </span>
            ) : null}
            <span>
              <i>{categoryLabels[car.category] ?? car.category}</i>
              <StatusDot active={car.isActive} />
            </span>
            <b>{startPrice(car) ? `${startPrice(car)} ₼ / gün` : "Qiymət yoxdur"}</b>
            <span>
              <i>{variantPriceLabel(car)}</i>
            </span>
          </span>
        </button>
      ))}
    </section>
  );
}

function ServiceCarsView({
  title,
  subtitle,
  cars,
  icon,
  onEdit,
  mode = "fleet",
}: {
  title: string;
  subtitle: string;
  cars: AdminCar[];
  icon: ReactNode;
  onEdit: (car?: AdminCar, index?: number) => void;
  mode?: CarTableMode;
}) {
  const publicVisibleCount = cars.filter((car) => car.isActive !== false).length;
  const publicHiddenCount = cars.length - publicVisibleCount;

  return (
    <div className="admin-view">
      <PageTitle eyebrow="XİDMƏTLƏR" title={title} subtitle={subtitle} />
      <section className="admin-panel admin-service-summary">
        <div className="admin-panel-title">
          <div>
            <p>{title.toLocaleUpperCase("az-AZ")}</p>
            <h2>{publicVisibleCount} avtomobil</h2>
            <small className="admin-service-count-note">
              Saytda görünür · {cars.length} idarədə
              {publicHiddenCount ? ` · ${publicHiddenCount} saytda gizli` : ""}
            </small>
          </div>
          {icon}
        </div>
      </section>
      <CarTable cars={cars} onEdit={onEdit} mode={mode} />
    </div>
  );
}

function ComingSoonView({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="admin-view">
      <PageTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <section className="admin-panel admin-module-empty">
        <div>
          <span>
            <Database size={20} />
          </span>
          <h2>Modul hazırlanır</h2>
          <p>
            Bu bölmə yeni Carbon operations strukturuna uyğun ayrılıb. Növbəti mərhələdə bron, müştəri və xidmət konfiqurasiyaları ayrıca bazaya bağlana bilər.
          </p>
        </div>
      </section>
    </div>
  );
}

const tutorialGuides: Array<{
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  time: string;
  icon: LucideIcon;
  keywords: string[];
  cta: string;
  action: "new-car" | ViewKey;
  steps: Array<{
    title: string;
    text: string;
    visual: "new-car" | "fields" | "variant" | "services" | "prices" | "transfer" | "wedding" | "bookings";
  }>;
}> = [
  {
    id: "new-car",
    title: "Yeni avtomobil əlavə etmək",
    shortTitle: "Avtomobil əlavə et",
    description: "Model, brend, şəkil və əsas variantı düzgün yaradın.",
    time: "2-3 dəq",
    icon: CarFront,
    keywords: ["avtomobil", "masin", "yeni", "model", "brend", "sekil", "şəkil"],
    cta: "Avtomobil əlavə etməyə başla",
    action: "new-car",
    steps: [
      {
        title: "Avtomobili yarat",
        text: "Avtomobillər bölməsinə keçin və Yeni avtomobil düyməsini seçin.",
        visual: "new-car",
      },
      {
        title: "Əsas məlumatları doldur",
        text: "Model adı, brend və kateqoriya yazılanda avtomobil siyahıda aydın görünür.",
        visual: "fields",
      },
      {
        title: "Əsas variantı seç",
        text: "Birinci variant avtomobilin əsas ili və versiyasıdır. Saytda kart qiyməti buradan götürülür.",
        visual: "variant",
      },
      {
        title: "Xidməti aktivləşdir",
        text: "İcarə, Transfer və ya Toy xidmətini seçin, qiymətləri doldurun və dəyişiklikləri saxlayın.",
        visual: "services",
      },
    ],
  },
  {
    id: "price",
    title: "Qiymətləri dəyişmək",
    shortTitle: "Qiymət dəyiş",
    description: "İcarə və xidmət qiymətlərini qarışdırmadan yeniləyin.",
    time: "1 dəq",
    icon: Gauge,
    keywords: ["qiymet", "qiymət", "icarə", "icare", "pul", "rent", "gunluk", "günlük"],
    cta: "Qiymətləri aç",
    action: "cars",
    steps: [
      {
        title: "Avtomobili aç",
        text: "Siyahıda istənilən avtomobil sətrinə klik edin.",
        visual: "new-car",
      },
      {
        title: "Qiymətlər tabına keç",
        text: "1-3 gün, 4-7 gün, 8-15 gün və digər aralıqları ayrıca dəyişin.",
        visual: "prices",
      },
      {
        title: "Variant qiymətini yoxla",
        text: "Əsas variantın 1-3 gün qiyməti public kartda başlanğıc qiymət kimi görünür.",
        visual: "variant",
      },
      {
        title: "Saytda yoxla",
        text: "Saxladıqdan sonra avtomobil səhifəsində qiymətin yeniləndiyini yoxlayın.",
        visual: "services",
      },
    ],
  },
  {
    id: "variant",
    title: "Fərqli il üçün variant əlavə etmək",
    shortTitle: "Variant əlavə et",
    description: "Eyni modelin yeni il və ya versiyasını əlavə edin.",
    time: "1-2 dəq",
    icon: Rows3,
    keywords: ["variant", "il", "versiya", "2024", "2022", "model", "fərqli", "ferqli"],
    cta: "Variantları aç",
    action: "cars",
    steps: [
      {
        title: "Modeli ayrı saxla",
        text: "Hyundai Sonata bir avtomobildir. 2022 və 2024 həmin avtomobilin variantlarıdır.",
        visual: "variant",
      },
      {
        title: "Variantlar tabına keç",
        text: "Birinci sətir əsas variantdır. İkinci variant yalnız əlavə il və ya versiya üçündür.",
        visual: "new-car",
      },
      {
        title: "İl və versiya yaz",
        text: "Məsələn: 2024 · Facelift və ya 2022 · E 200.",
        visual: "variant",
      },
      {
        title: "Hər variantın qiymətini yaz",
        text: "Variantın öz qiyməti varsa, onu həmin variantın qiymət sahələrində doldurun.",
        visual: "prices",
      },
    ],
  },
  {
    id: "transfer",
    title: "Transfer xidməti qurmaq",
    shortTitle: "Transfer qur",
    description: "Transfer üçün avtomobili aktivləşdirin və qiymətləri daxil edin.",
    time: "2 dəq",
    icon: Plane,
    keywords: ["transfer", "airport", "hava limani", "marşrut", "marsrut", "sürücü", "surucu"],
    cta: "Transferlərə keç",
    action: "transfer",
    steps: [
      {
        title: "Xidmətlər tabını aç",
        text: "Avtomobil səhifəsində Transfer aktiv seçimini yandırın.",
        visual: "services",
      },
      {
        title: "Transfer qiymətlərini yaz",
        text: "Saatlıq və marşrut qiymətlərini ayrıca saxlayın.",
        visual: "transfer",
      },
      {
        title: "Tutumu yoxla",
        text: "Sərnişin və baqaj sayı transfer müştərisi üçün vacibdir.",
        visual: "fields",
      },
      {
        title: "Transfer siyahısında yoxla",
        text: "Saxladıqdan sonra avtomobil Transferlər bölməsində görünməlidir.",
        visual: "transfer",
      },
    ],
  },
  {
    id: "wedding",
    title: "Toy avtomobili əlavə etmək",
    shortTitle: "Toy avtomobili",
    description: "Toy xidməti, paket və başlanğıc qiyməti qurun.",
    time: "2 dəq",
    icon: Heart,
    keywords: ["toy", "wedding", "paket", "bezək", "bezek", "gelin", "gəlin"],
    cta: "Toy avtomobillərinə keç",
    action: "weddings",
    steps: [
      {
        title: "Toy xidmətini aktivləşdir",
        text: "Avtomobil editorunda Toy tabına keçin və toy xidməti üçün statusu aktiv edin.",
        visual: "services",
      },
      {
        title: "Başlanğıc qiyməti yaz",
        text: "Public toy kartında görünəcək əsas qiyməti daxil edin.",
        visual: "wedding",
      },
      {
        title: "Paketləri aydın saxla",
        text: "Standart, Premium və Full Day kimi paketləri saat və qiymətlə izah edin.",
        visual: "wedding",
      },
      {
        title: "Şəkilləri seç",
        text: "Toy üçün uyğun, təmiz və premium görünən əsas şəkil istifadə edin.",
        visual: "fields",
      },
    ],
  },
  {
    id: "bookings",
    title: "Bronları idarə etmək",
    shortTitle: "Bronları idarə et",
    description: "Rezervasiyalara baxın və xidmət tipinə görə ayırın.",
    time: "1 dəq",
    icon: CalendarDays,
    keywords: ["bron", "rezervasiya", "musteri", "müştəri", "sifaris", "sifariş"],
    cta: "Bronlara keç",
    action: "bookings",
    steps: [
      {
        title: "Bronlar bölməsinə keç",
        text: "Bütün icarə, transfer və toy sorğuları burada birləşəcək.",
        visual: "bookings",
      },
      {
        title: "Xidmət tipini yoxla",
        text: "Hər bronun icarə, transfer və ya toy olduğunu ayrıca görmək lazımdır.",
        visual: "services",
      },
      {
        title: "Müştəri məlumatına bax",
        text: "Telefon, tarix, avtomobil və qiymət eyni ekranda olmalıdır.",
        visual: "bookings",
      },
      {
        title: "Statusu yenilə",
        text: "Gözləyən, təsdiqlənən və tamamlanan bronlar qarışmamalıdır.",
        visual: "bookings",
      },
    ],
  },
];

const docsHighlights = [
  {
    label: "Park idarəsi",
    value: "7 əsas modul",
    text: "Avtomobil, variant, qiymət, xidmət və media eyni axında izah olunur.",
    icon: CarFront,
  },
  {
    label: "Public sayt",
    value: "Canlı görünüş",
    text: "Admin paneldə etdiyiniz dəyişikliklərin saytda harada göründüyünü göstərir.",
    icon: ExternalLink,
  },
  {
    label: "Keyfiyyət",
    value: "Premium qaydalar",
    text: "Şəkil, SEO, URL, status və qiymət üçün praktik standartlar.",
    icon: ShieldCheck,
  },
];

const docsSystemMap = [
  {
    title: "Avtomobillər",
    text: "Model adı, brend, kateqoriya, texniki məlumat, əsas şəkil, aktivlik və sıralama buradan idarə olunur.",
    icon: CarFront,
    view: "cars" as ViewKey,
  },
  {
    title: "Variantlar",
    text: "Eyni modelin müxtəlif illərini və versiyalarını ayrıca saxlayın. Saytda müştəri düzgün ili görür.",
    icon: Rows3,
    view: "cars" as ViewKey,
  },
  {
    title: "İcarə qiymətləri",
    text: "1-3, 4-7, 8-15, 16-24, 25-30 və 30+ gün aralıqları müştəriyə real başlanğıc qiyməti verir.",
    icon: Gauge,
    view: "rental" as ViewKey,
  },
  {
    title: "Transferlər",
    text: "Hava limanı, şəhər və region marşrutları üçün sürücülü xidmət qiymətlərini ayrıca idarə edin.",
    icon: Plane,
    view: "transfer" as ViewKey,
  },
  {
    title: "Toy avtomobilləri",
    text: "Toy statusu, toy şəkli, paket təsviri və toy qiyməti public toy kolleksiyasını formalaşdırır.",
    icon: Heart,
    view: "weddings" as ViewKey,
  },
  {
    title: "Blog və SEO",
    text: "Məqalə adı, URL adı, kateqoriya, oxu vaxtı və şəkillər axtarış nəticəsində daha səliqəli görünməyə kömək edir.",
    icon: Newspaper,
    view: "blog" as ViewKey,
  },
];

const docsDesignRules = [
  "Model adlarını qısa və rəsmi saxlayın: Mercedes S Class, Hyundai Sonata kimi.",
  "Şəkillər təmiz, yüksək keyfiyyətli və avtomobili aydın göstərən olmalıdır.",
  "Toy avtomobillərində ağ və premium görüntünü ayrıca toy şəkli ilə vurğulayın.",
  "Qiymət boş qalırsa, həmin xidmət saytda zəif görünür və seçim alqoritmi onu aşağı sala bilər.",
  "URL adında boşluq, böyük hərf və xüsusi simvol istifadə etməyin.",
];

const docsTroubleshooting = [
  {
    title: "Avtomobil saytda görünmür",
    text: "Status aktiv olmalıdır, rentalVisible gizli olmamalıdır və əsas şəkil mütləq yazılmalıdır.",
  },
  {
    title: "Toy kolleksiyası səhv çıxır",
    text: "Toy xidməti aktiv olmalı, toy qiyməti və toy üçün uyğun şəkil ayrıca əlavə edilməlidir.",
  },
  {
    title: "Qiymət görünmür",
    text: "Ən azı bir rental qiymət aralığı, transfer marşrutu və ya toy başlanğıc qiyməti doldurulmalıdır.",
  },
  {
    title: "Şəkil köhnə görünür",
    text: "Yeni şəkli yükləyin, lazım olsa çevirmə alətlərindən istifadə edin və brauzeri sərt yeniləyin.",
  },
];

function TutorialView({
  onView,
  onNewCar,
}: {
  onView: (view: ViewKey) => void;
  onNewCar: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeGuideId, setActiveGuideId] = useState(tutorialGuides[0].id);
  const [openedGuideId, setOpenedGuideId] = useState(tutorialGuides[0].id);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGuides = normalizedQuery
    ? tutorialGuides.filter((guide) =>
        [guide.title, guide.shortTitle, guide.description, ...guide.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : tutorialGuides;
  const activeGuide = tutorialGuides.find((guide) => guide.id === activeGuideId) ?? tutorialGuides[0];
  const onboardingTasks = [
    { label: "Paneli tanı", done: true, guideId: "new-car" },
    { label: "İlk avtomobili əlavə et", done: false, guideId: "new-car" },
    { label: "Qiymət təyin et", done: false, guideId: "price" },
    { label: "Saytda nəticəyə bax", done: false, guideId: "price" },
  ];
  const completedTasks = onboardingTasks.filter((task) => task.done).length;
  const activeGuideIndex = tutorialGuides.findIndex((guide) => guide.id === activeGuide.id);

  const runGuideAction = (guide = activeGuide) => {
    if (guide.action === "new-car") {
      onNewCar();
      return;
    }

    onView(guide.action);
  };

  return (
    <div className="admin-view admin-tutorial-view">
      <motion.section
        className="admin-docs-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="admin-docs-hero-copy">
          <span>TƏLİMAT MƏRKƏZİ</span>
          <h1>Carbon panelini peşəkar idarə etmək üçün tam bələdçi</h1>
          <p>
            Avtomobil əlavə etməkdən SEO URL-lərinə, toy kolleksiyasından transfer
            qiymətlərinə qədər paneldə gördüyünüz əsas işlərin hamısı burada izahlı,
            vizual və addım-addım göstərilir.
          </p>
          <label className="admin-tutorial-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Axtar: "qiymət dəyiş", "toy şəkli", "variant ili"'
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Axtarışı təmizlə">
                <X size={14} />
              </button>
            ) : null}
          </label>
        </div>

        <div className="admin-docs-hero-visual" aria-hidden="true">
          <div className="admin-docs-window">
            <header>
              <span />
              <span />
              <span />
              <b>Carbon Admin</b>
            </header>
            <main>
              <div className="admin-docs-sidebar-mini">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="admin-docs-screen-mini">
                <strong>Mercedes S Class</strong>
                <em>2024 · Biznes · Aktiv</em>
                <div>
                  <span>İcarə 230 ₼</span>
                  <span>Transfer aktiv</span>
                  <span>Toy 450 ₼</span>
                </div>
              </div>
            </main>
          </div>
        </div>
      </motion.section>

      <section className="admin-docs-highlight-grid">
        {docsHighlights.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            >
              <span><Icon size={18} /></span>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <small>{item.text}</small>
            </motion.article>
          );
        })}
      </section>

      <section className="admin-help-section">
        <div className="admin-help-section-title">
          <p>TEZ BAŞLANĞIC</p>
          <span>Kartı açın və həmin əməliyyatı real docs səhifəsi kimi oxuyun.</span>
        </div>
        <div className="admin-help-action-grid">
          {visibleGuides.map((guide, index) => {
            const Icon = guide.icon;
            const isOpen = openedGuideId === guide.id;

            return (
              <motion.article
                key={guide.id}
                className={`admin-help-action-card${activeGuide.id === guide.id ? " is-active" : ""}${isOpen ? " is-open" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: index * 0.035, ease: "easeOut" }}
                whileHover={{ y: -3 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveGuideId(guide.id);
                    setOpenedGuideId((current) => (current === guide.id ? "" : guide.id));
                  }}
                  aria-expanded={isOpen}
                >
                  <span><Icon size={22} /></span>
                  <strong>{guide.shortTitle}</strong>
                  <small>{guide.description}</small>
                  <em>{guide.time}</em>
                  <b>{isOpen ? "Bağla" : "Oxu"} <ChevronDown size={13} /></b>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      className="admin-help-action-expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <div>
                        <p>{guide.title}</p>
                        <h3>{guide.description}</h3>
                        <span>
                          Bu sənəd {guide.time} vaxt aparır və paneldə hansı
                          bölməni açmalı olduğunuzu addım-addım göstərir.
                        </span>
                      </div>

                      <ol>
                        {guide.steps.map((step, stepIndex) => (
                          <li key={step.title}>
                            <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                            <div>
                              <strong>{step.title}</strong>
                              <p>{step.text}</p>
                            </div>
                            <TutorialMock type={step.visual} />
                          </li>
                        ))}
                      </ol>

                      <button type="button" onClick={() => runGuideAction(guide)}>
                        {guide.cta}
                        <ChevronsRight size={15} />
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="admin-help-layout">
        <motion.article
          className="admin-guide-panel admin-guide-panel-premium"
          layout
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <header>
            <div>
              <p>{activeGuide.title}</p>
              <h2>{String(Math.max(activeGuideIndex + 1, 1)).padStart(2, "0")} · {activeGuide.steps.length} addımlı iş axını</h2>
              <span>Təxminən {activeGuide.time}. Hər addım paneldə hansı sahəyə toxunduğunuzu göstərir.</span>
            </div>
            <button type="button" className="admin-primary-button" onClick={() => runGuideAction()}>
              {activeGuide.cta}
              <ChevronsRight size={15} />
            </button>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeGuide.id}
              className="admin-guide-steps"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {activeGuide.steps.map((step, index) => (
                <motion.article
                  key={step.title}
                  className="admin-guide-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: index * 0.045, ease: "easeOut" }}
                >
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <TutorialMock type={step.visual} />
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.article>

        <aside className="admin-onboarding-card admin-docs-progress-card">
          <div>
            <p>İLK DƏFƏ BURADASINIZ?</p>
            <strong>{completedTasks} / {onboardingTasks.length} tamamlandı</strong>
            <span>{Math.round((completedTasks / onboardingTasks.length) * 100)}%</span>
          </div>
          <i>
            <span style={{ width: `${(completedTasks / onboardingTasks.length) * 100}%` }} />
          </i>
          {onboardingTasks.map((task) => (
            <button
              key={task.label}
              type="button"
              onClick={() => setActiveGuideId(task.guideId)}
              className={task.done ? "is-done" : ""}
            >
              <CheckCircle2 size={15} />
              {task.label}
            </button>
          ))}
        </aside>
      </section>

      <section className="admin-docs-system-map">
        <div className="admin-help-section-title">
          <p>PANEL XƏRİTƏSİ</p>
          <span>Hansı modulun nə etdiyini və sayta necə təsir etdiyini buradan görün.</span>
        </div>
        <div>
          {docsSystemMap.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.title}
                type="button"
                onClick={() => onView(item.view)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.035, ease: "easeOut" }}
              >
                <span><Icon size={18} /></span>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
                <em>Modula keç <ChevronsRight size={13} /></em>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="admin-carbon-model-card admin-docs-model-card">
        <div>
          <p>CARBON STRUKTURU</p>
          <h2>Model, variant və xidmət eyni şey deyil</h2>
          <span><strong>Avtomobil</strong> modeli saxlayır, <strong>variant</strong> il/versiyanı ayırır, <strong>xidmət</strong> isə həmin maşının icarə, transfer və ya toy kimi necə satıldığını göstərir.</span>
        </div>
        <div className="admin-carbon-model-visual" aria-hidden="true">
          <strong>Hyundai Sonata</strong>
          <i />
          <div>
            <span>2022<small>VARİANT</small></span>
            <span>2024<small>VARİANT</small></span>
          </div>
          <i />
          <div>
            <em><CarFront size={14} />İcarə<b>70 ₼</b></em>
            <em><Plane size={14} />Transfer<b>35 ₼</b></em>
            <em><Heart size={14} />Toy<b>250 ₼</b></em>
          </div>
        </div>
      </section>

      <section className="admin-docs-quality-grid">
        <article>
          <p>PREMIUM SAYT QAYDALARI</p>
          <h2>Admin paneldə yazdığınız hər şey public dizayna təsir edir</h2>
          <div>
            {docsDesignRules.map((rule) => (
              <span key={rule}>
                <CheckCircle2 size={15} />
                {rule}
              </span>
            ))}
          </div>
        </article>

        <article className="admin-docs-public-preview">
          <p>SAYTDA GÖRÜNÜŞ</p>
          <h2>Mercedes S Class</h2>
          <div>
            <span>Business</span>
            <span>2024</span>
            <span>230 ₼ / gün</span>
          </div>
          <button type="button">Rezervasiya et <ArrowRight size={14} /></button>
        </article>
      </section>

      <section className="admin-help-topics admin-docs-topics">
        <p>PROBLEM HƏLLİ</p>
        <div>
          {docsTroubleshooting.map((topic) => (
            <article key={topic.title}>
              <strong>{topic.title}</strong>
              <span>{topic.text}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TutorialMock({ type }: { type: "new-car" | "fields" | "variant" | "services" | "prices" | "transfer" | "wedding" | "bookings" }) {
  if (type === "fields") {
    return (
      <div className="admin-guide-mock admin-guide-mock-fields">
        <span>Model adı <b>Mercedes E Class</b></span>
        <span>Brend <b>Mercedes-Benz</b></span>
        <span>Kateqoriya <b>Biznes</b></span>
      </div>
    );
  }

  if (type === "variant") {
    return (
      <div className="admin-guide-mock admin-guide-mock-variant">
        <strong>ƏSAS</strong>
        <span>2024</span>
        <b>E 200 AMG</b>
        <small>2.0L · 204 HP · 200 ₼</small>
      </div>
    );
  }

  if (type === "prices") {
    return (
      <div className="admin-guide-mock admin-guide-mock-prices">
        {["1-3 gün", "4-7 gün", "8-15 gün"].map((label, index) => (
          <span key={label}>{label}<b>{[200, 180, 165][index]} ₼</b></span>
        ))}
      </div>
    );
  }

  if (type === "services") {
    return (
      <div className="admin-guide-mock admin-guide-mock-services">
        <span><CarFront size={14} /> İcarə <b>Aktiv</b></span>
        <span><Plane size={14} /> Transfer <b>Aktiv</b></span>
        <span><Heart size={14} /> Toy <b>Deaktiv</b></span>
      </div>
    );
  }

  if (type === "transfer") {
    return (
      <div className="admin-guide-mock admin-guide-mock-prices">
        <span>GYD - Bakı <b>45 ₼</b></span>
        <span>Saatlıq <b>80 ₼</b></span>
        <span>Baqaj <b>3</b></span>
      </div>
    );
  }

  if (type === "wedding") {
    return (
      <div className="admin-guide-mock admin-guide-mock-prices">
        <span>Standart <b>250 ₼</b></span>
        <span>Premium <b>400 ₼</b></span>
        <span>Full Day <b>600 ₼</b></span>
      </div>
    );
  }

  if (type === "bookings") {
    return (
      <div className="admin-guide-mock admin-guide-mock-bookings">
        <span>09:30 <b>Transfer</b></span>
        <span>12:00 <b>İcarə təhvil</b></span>
        <span>16:30 <b>Geri qaytarma</b></span>
      </div>
    );
  }

  return (
    <div className="admin-guide-mock admin-guide-mock-new">
      <span>Avtomobillər</span>
      <b><Plus size={14} /> Yeni avtomobil</b>
      <i />
    </div>
  );
}

function QualityView({
  cars,
  onEdit,
}: {
  cars: AdminCar[];
  onEdit: (car?: AdminCar, index?: number, tab?: CarTab) => void;
}) {
  const quality = fleetQuality(cars);
  const issueRows = cars.flatMap((car, index) =>
    carMissingInfo(car).map((issue) => ({
      car,
      index,
      issue,
      tab: qualityIssueTarget(issue),
    }))
  );
  const missingYear = issueRows.filter((row) => row.issue === "İl yoxdur").length;
  const missingPrice = issueRows.filter((row) => row.issue === "Qiymət yoxdur").length;
  const missingImage = issueRows.filter((row) => row.issue === "Şəkil yoxdur").length;

  return (
    <div className="admin-view admin-quality-view">
      <PageTitle
        eyebrow="KEYFİYYƏT"
        title="Data Quality Center"
        subtitle="Çatışmayan avtomobil məlumatlarını bir yerdən düzəldin."
      />

      <section className="admin-quality-hero">
        <div>
          <p>FLEET HEALTH</p>
          <h2>{quality.score}%</h2>
          <span>{quality.completeCars} tam avtomobil · {quality.issueCount} problem</span>
        </div>
        <i><span style={{ width: `${quality.score}%` }} /></i>
      </section>

      <section className="admin-quality-stat-grid">
        <article><AlertTriangle size={16} /><strong>{missingYear}</strong><span>İl yoxdur</span></article>
        <article><Images size={16} /><strong>{missingImage}</strong><span>Şəkil yoxdur</span></article>
        <article><Gauge size={16} /><strong>{missingPrice}</strong><span>Qiymət yoxdur</span></article>
        <article><CheckCircle2 size={16} /><strong>{quality.completeCars}</strong><span>Tam profil</span></article>
      </section>

      <section className="admin-panel admin-quality-table">
        <div className="admin-panel-title">
          <div>
            <p>DÜZƏLDİLMƏLİ SAHƏLƏR</p>
            <h2>{issueRows.length ? `${issueRows.length} problem tapıldı` : "Hər şey qaydasındadır"}</h2>
          </div>
        </div>
        <div className="admin-data-table">
          {issueRows.length ? issueRows.map((row) => (
            <button
              key={`${row.car.id}-${row.issue}`}
              type="button"
              className="admin-quality-row"
              onClick={() => onEdit(row.car, row.index, row.tab)}
            >
              <CarIdentity car={row.car} />
              <span className="admin-missing-labels"><em>{row.issue}</em></span>
              <small>{row.tab === "services" ? "Xidmətlər" : row.tab === "images" ? "Şəkillər" : row.tab === "technical" ? "Texniki" : "Ümumi"}</small>
              <ArrowRight size={15} />
            </button>
          )) : (
            <div className="admin-quality-empty">
              <CheckCircle2 size={22} />
              <strong>Fleet tam görünür</strong>
              <span>Hazırda əsas məlumat problemi tapılmadı.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogView({
  blogs,
  onNew,
  onEdit,
}: {
  blogs: AdminBlogPost[];
  onNew: () => void;
  onEdit: (blog?: AdminBlogPost, index?: number) => void;
}) {
  return (
    <div className="admin-view">
      <PageTitle
        eyebrow="MƏZMUN"
        title="Blog"
        subtitle="Məqalələri yaradın, redaktə edin və saytda görünməsini idarə edin"
        action={<button type="button" className="admin-primary-button" onClick={onNew}><Plus size={16} /> Yeni məqalə</button>}
      />

      <section className="admin-panel admin-table-panel">
        <div className="admin-table-head admin-blog-head">
          <span>Məqalə</span>
          <span>Kateqoriya</span>
          <span>Tarix</span>
          <span>Oxu müddəti</span>
          <span>Status</span>
          <span />
        </div>
        <div className="admin-data-table">
          {blogs.map((blog, index) => (
            <button key={blog.slug} type="button" className="admin-table-row admin-blog-row" onClick={() => onEdit(blog, index)}>
              <span className="admin-car-identity">
                <span className="admin-thumb">
                  {blog.image ? <Image src={blog.image} alt={blog.title} fill sizes="52px" /> : <Newspaper size={18} />}
                </span>
                <span>
                  <strong>{blog.title}</strong>
                  <small>{blog.description}</small>
                </span>
              </span>
              <span>{blog.category}</span>
              <span>{blog.date}</span>
              <span>{blog.readingTime}</span>
              <StatusDot active={blog.isActive} />
              <MoreHorizontal size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function MediaView({ items }: { items: Array<{ id: string; title: string; src: string; type: string }> }) {
  return (
    <div className="admin-view">
      <PageTitle eyebrow="MEDIA KİTABXANASI" title="Şəkillər" subtitle="Saytda istifadə olunan avtomobil və blog şəkilləri" />
      <section className="admin-media-library">
        {items.map((item) => (
          <article key={item.id} className="admin-media-item">
            <span>
              <Image src={item.src} alt={item.title} fill sizes="240px" />
              <span className="admin-media-actions">
                <button type="button" onClick={() => navigator.clipboard?.writeText(item.src)}>
                  URL-i kopyala
                </button>
                <Link href={item.src} target="_blank" rel="noopener noreferrer">
                  Aç
                </Link>
              </span>
            </span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.type}</small>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

const notesStorageKey = "carbon-admin-notes";
const notePriorityOptions: Array<{ value: AdminNoteItem["priority"]; label: string }> = [
  { value: "low", label: "Aşağı" },
  { value: "normal", label: "Normal" },
  { value: "important", label: "Vacib" },
  { value: "urgent", label: "Təcili" },
];

const notePriorityMeta: Record<AdminNoteItem["priority"], { label: string; color: string; soft: string; glow: string }> = {
  low: {
    label: "Aşağı",
    color: "#60a5fa",
    soft: "rgba(96, 165, 250, .09)",
    glow: "rgba(96, 165, 250, .22)",
  },
  normal: {
    label: "Normal",
    color: "#34d399",
    soft: "rgba(52, 211, 153, .09)",
    glow: "rgba(52, 211, 153, .2)",
  },
  important: {
    label: "Vacib",
    color: "#f59e0b",
    soft: "rgba(245, 158, 11, .1)",
    glow: "rgba(245, 158, 11, .24)",
  },
  urgent: {
    label: "Təcili",
    color: "#fb7185",
    soft: "rgba(251, 113, 133, .1)",
    glow: "rgba(251, 113, 133, .26)",
  },
};

function createAdminNote(): AdminNoteItem {
  const now = new Date().toISOString();

  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `note-${Date.now()}`,
    title: "",
    body: "",
    done: false,
    priority: "normal",
    image: null,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeAdminNote(note: Partial<AdminNoteItem>): AdminNoteItem {
  const fallback = createAdminNote();
  const rawPriority = String(note.priority ?? "");
  const legacyPriority = rawPriority === "high" ? "urgent" : rawPriority;
  const priority = legacyPriority && legacyPriority in notePriorityMeta ? legacyPriority : "normal";

  return {
    id: note.id ?? fallback.id,
    title: note.title ?? "",
    body: note.body ?? "",
    done: Boolean(note.done),
    priority: priority as AdminNoteItem["priority"],
    image: note.image ?? null,
    createdAt: note.createdAt ?? note.updatedAt ?? fallback.createdAt,
    updatedAt: note.updatedAt ?? fallback.updatedAt,
  };
}

function loadAdminNotes() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(notesStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Partial<AdminNoteItem>[];
    return Array.isArray(parsed) ? parsed.map(normalizeAdminNote) : [];
  } catch {
    return [];
  }
}

function NotesView({
  notes,
  setNotes,
}: {
  notes: AdminNoteItem[];
  setNotes: Dispatch<SetStateAction<AdminNoteItem[]>>;
}) {
  const [draftNote, setDraftNote] = useState<AdminNoteItem | null>(() => notes[0] ?? null);
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [query, setQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const noteBodyRef = useRef<HTMLTextAreaElement>(null);
  const activeNote = draftNote;
  const doneCount = notes.filter((note) => note.done).length;
  const openCount = notes.length - doneCount;
  const filteredNotes = notes.filter((note) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "open" && !note.done) ||
      (filter === "done" && note.done);
    const haystack = `${note.title} ${note.body} ${notePriorityMeta[note.priority].label}`.toLowerCase();

    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  });

  const persistNotes = useCallback((nextNotes: AdminNoteItem[]) => {
    window.localStorage.setItem(notesStorageKey, JSON.stringify(nextNotes));
  }, []);

  function updateDraft(patch: Partial<AdminNoteItem>) {
    setDraftNote((note) =>
      note ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note
    );
  }

  function addNote() {
    const next = createAdminNote();
    setDraftNote(next);
    setFilter("all");
  }

  const saveNote = useCallback(() => {
    if (!draftNote) return;

    const cleanNote = {
      ...draftNote,
      title: draftNote.title.trim(),
      body: draftNote.body.trim(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((items) => {
      const exists = items.some((note) => note.id === cleanNote.id);
      const nextNotes = exists
        ? items.map((note) => (note.id === cleanNote.id ? cleanNote : note))
        : [cleanNote, ...items];

      persistNotes(nextNotes);
      return nextNotes;
    });
    setDraftNote(cleanNote);
  }, [draftNote, persistNotes, setNotes]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveNote();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveNote]);

  function deleteNote(id: string) {
    const next = notes.filter((note) => note.id !== id);
    setNotes(next);
    persistNotes(next);

    const nextActive = next[0] ?? null;
    setDraftNote(nextActive);
  }

  function attachImage(file?: File | null) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateDraft({ image: typeof reader.result === "string" ? reader.result : null });
    };
    reader.readAsDataURL(file);
  }

  function formatNote(command: "bold" | "italic" | "underline" | "list" | "checklist" | "link" | "code") {
    if (!activeNote || !noteBodyRef.current) return;

    const input = noteBodyRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = activeNote.body.slice(start, end);
    const formats: Record<typeof command, [string, number]> = {
      bold: [`**${selected || "qalın mətn"}**`, selected ? 2 : 2],
      italic: [`_${selected || "italik mətn"}_`, selected ? 1 : 1],
      underline: [`<u>${selected || "altı xətli mətn"}</u>`, selected ? 3 : 3],
      list: [`- ${selected || "siyahı elementi"}`, 2],
      checklist: [`- [ ] ${selected || "tapşırıq"}`, 6],
      link: [`[${selected || "link"}](https://)`, selected ? 1 : 1],
      code: [`\`${selected || "kod"}\``, 1],
    };
    const [nextText, cursorOffset] = formats[command];
    const body = `${activeNote.body.slice(0, start)}${nextText}${activeNote.body.slice(end)}`;

    updateDraft({ body });
    window.requestAnimationFrame(() => {
      input.focus();
      const cursor = start + nextText.length - cursorOffset;
      input.setSelectionRange(cursor, cursor);
    });
  }

  const activeMeta = activeNote ? notePriorityMeta[activeNote.priority] : notePriorityMeta.normal;
  const filterItems = [
    { key: "all", label: "Hamısı", count: notes.length },
    { key: "open", label: "Açıq", count: openCount },
    { key: "done", label: "Tamamlanan", count: doneCount },
  ] as const;

  return (
    <div className="admin-view admin-notes-page">
      <header className="admin-notes-hero">
        <div>
          <span><NotebookPen size={28} /></span>
          <div>
            <p>QEYDLƏR</p>
            <h1>Qeydlər</h1>
            <small>Şəxsi qeydlər, tapşırıqlar və vacib məlumatlar.</small>
          </div>
        </div>
        <div className="admin-notes-header-side">
          <div className="admin-notes-compact-stats">
            <span><b>{notes.length}</b> Ümumi</span>
            <span><b>{openCount}</b> Açıq</span>
            <span><b>{doneCount}</b> Tamamlandı</span>
          </div>
          <button type="button" className="admin-primary-button" onClick={addNote}>
            <Plus size={15} />
            Yeni qeyd
          </button>
        </div>
      </header>

      <section className="admin-notes-workspace">
        <aside className="admin-notes-browser">
          <div className="admin-notes-tabs">
            {filterItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={filter === item.key ? "is-active" : ""}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
                <small>{item.count}</small>
              </button>
            ))}
          </div>
          <label className="admin-notes-search">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Qeydlərdə axtar..." />
          </label>
          <div className="admin-notes-list">
            <AnimatePresence initial={false}>
              {filteredNotes.map((note) => {
                const meta = notePriorityMeta[note.priority];

                return (
                  <motion.button
                    key={note.id}
                    type="button"
                    style={{
                      "--note-accent": meta.color,
                      "--note-soft": meta.soft,
                      "--note-glow": meta.glow,
                    } as CSSProperties}
                    className={`${activeNote?.id === note.id ? "is-active" : ""}${note.done ? " is-done" : ""}`}
                    onClick={() => {
                      setDraftNote(note);
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <i />
                    <span>
                      <strong>{note.title.trim() || "Adsız qeyd"}</strong>
                      <small>{note.body.trim() || "Detalları əlavə edin"}</small>
                      <em>{formatNoteDate(note.updatedAt)}</em>
                    </span>
                    <b>{note.done ? "Tamam" : meta.label}</b>
                    {note.image ? <Images size={14} /> : null}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </aside>

        {activeNote ? (
          <article
            className="admin-note-editor"
            style={{
              "--note-accent": activeMeta.color,
              "--note-soft": activeMeta.soft,
              "--note-glow": activeMeta.glow,
            } as CSSProperties}
          >
            <header>
              <div>
                <span className="admin-note-save-state is-saved">
                  <i />
                  Manual saxlama
                </span>
                <h2>{activeNote.title.trim() || "Yeni qeyd"}</h2>
              </div>
              <div className="admin-note-actions">
                <label className="admin-note-image-button">
                  <ImagePlus size={15} />
                  Şəkil əlavə et
                  <input type="file" accept="image/*" onChange={(event) => attachImage(event.target.files?.[0])} />
                </label>
                <button type="button" className="admin-primary-button" onClick={saveNote}>
                  <Save size={14} />
                  Qeydi saxla
                </button>
              </div>
            </header>

            <div className="admin-note-grid">
              <label className="admin-field admin-field-span">
                <span>Başlıq</span>
                <span className="admin-field-control">
                  <input value={activeNote.title} onChange={(event) => updateDraft({ title: event.target.value })} placeholder="Məs: Yeni ideya, tapşırıq, görüş..." />
                </span>
              </label>
              <label className="admin-field">
                <span>Status</span>
                <AdminSelect
                  value={activeNote.done ? "done" : "open"}
                  onChange={(status) => updateDraft({ done: status === "done" })}
                  options={[
                    { value: "open", label: "Açıq todo" },
                    { value: "done", label: "Tamamlandı" },
                  ]}
                  label="Status"
                  icon={<CheckCircle2 size={15} />}
                />
              </label>
              <label className="admin-field">
                <span>Prioritet</span>
                <AdminSelect
                  value={activeNote.priority}
                  onChange={(priority) => updateDraft({ priority: priority as AdminNoteItem["priority"] })}
                  options={notePriorityOptions}
                  label="Prioritet"
                  icon={<Flag size={15} />}
                />
              </label>
            </div>

            <div className="admin-note-writing-shell">
              <div className="admin-note-toolbar">
                <button type="button" onClick={() => formatNote("bold")} title="Bold"><strong>B</strong></button>
                <button type="button" onClick={() => formatNote("italic")} title="Italic"><Italic size={15} /></button>
                <button type="button" onClick={() => formatNote("underline")} title="Underline"><Underline size={15} /></button>
                <button type="button" onClick={() => formatNote("list")} title="List"><ListTodo size={15} /></button>
                <button type="button" onClick={() => formatNote("checklist")} title="Checklist"><ListChecks size={15} /></button>
                <button type="button" onClick={() => formatNote("link")} title="Link"><Link2 size={15} /></button>
                <button type="button" onClick={() => formatNote("code")} title="Code"><Code2 size={15} /></button>
                <label title="Image">
                  <ImagePlus size={15} />
                  <input type="file" accept="image/*" onChange={(event) => attachImage(event.target.files?.[0])} />
                </label>
              </div>
              <textarea
                ref={noteBodyRef}
                value={activeNote.body}
                onChange={(event) => updateDraft({ body: event.target.value })}
                rows={12}
                placeholder="Qeydinizi buraya yazın..."
              />
            </div>

            {activeNote.image ? (
              <div className="admin-note-attachments">
                <article>
                  <span><Image src={activeNote.image} alt={activeNote.title || "Qeyd şəkli"} fill sizes="180px" /></span>
                  <div>
                    <strong>Əlavə şəkil</strong>
                    <small>Qeydə bağlı vizual məlumat</small>
                  </div>
                  <button type="button" onClick={() => setPreviewImage(activeNote.image ?? null)}><Eye size={14} /> Önizlə</button>
                  <label>
                    <Upload size={14} />
                    Dəyiş
                    <input type="file" accept="image/*" onChange={(event) => attachImage(event.target.files?.[0])} />
                  </label>
                  <button type="button" onClick={() => updateDraft({ image: null })}><Trash2 size={14} /></button>
                </article>
              </div>
            ) : (
              <label className="admin-note-dropzone">
                <ImagePlus size={22} />
                <span>Şəkil əlavə et</span>
                <small>PNG, JPG və ya ekran görüntüsü. Saxlamaq üçün Qeydi saxla düyməsini basın.</small>
                <input type="file" accept="image/*" onChange={(event) => attachImage(event.target.files?.[0])} />
              </label>
            )}
          </article>
        ) : null}

        {!activeNote ? (
          <article className="admin-note-empty-state">
            <NotebookPen size={34} />
            <h2>Hələ qeyd yoxdur</h2>
            <p>Yeni qeyd yaradın, məlumatları doldurun və sonra manual olaraq saxlayın.</p>
            <button type="button" className="admin-primary-button" onClick={addNote}>
              <Plus size={15} />
              Yeni qeyd
            </button>
          </article>
        ) : null}

        {activeNote ? (
          <aside className="admin-note-inspector">
            <section>
              <h3>Məlumat</h3>
              <dl>
                <div><dt>Yaradılıb</dt><dd>{formatNoteDate(activeNote.createdAt)}</dd></div>
                <div><dt>Son dəyişiklik</dt><dd>{formatNoteDate(activeNote.updatedAt)}</dd></div>
                <div><dt>Prioritet</dt><dd style={{ color: activeMeta.color }}>{activeMeta.label}</dd></div>
                <div><dt>Status</dt><dd>{activeNote.done ? "Tamamlandı" : "Açıq"}</dd></div>
                <div><dt>Attachment</dt><dd>{activeNote.image ? "1 şəkil" : "Yoxdur"}</dd></div>
              </dl>
            </section>
            <section>
              <h3>Qısa yollar</h3>
              <div className="admin-note-shortcuts">
                <span><kbd>⌘</kbd><kbd>S</kbd> Yadda saxla</span>
                <span><kbd>⌘</kbd><kbd>K</kbd> Axtarış</span>
                <span><kbd>Esc</kbd> Popup bağla</span>
              </div>
            </section>
            <button type="button" className="admin-danger-button" onClick={() => deleteNote(activeNote.id)}>
              <Trash2 size={14} />
              Qeydi sil
            </button>
          </aside>
        ) : null}
      </section>

      {previewImage ? (
        <AdminPortal>
          <div className="admin-preview-layer" role="dialog" aria-modal="true" aria-label="Qeyd şəkli">
            <button type="button" className="admin-preview-backdrop" onClick={() => setPreviewImage(null)} aria-label="Önizləməni bağla" />
            <section className="admin-note-image-preview">
              <button type="button" className="admin-icon-button" onClick={() => setPreviewImage(null)} aria-label="Bağla">
                <X size={16} />
              </button>
              <Image src={previewImage} alt="Qeyd şəkli" fill sizes="900px" />
            </section>
          </div>
        </AdminPortal>
      ) : null}
    </div>
  );
}

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function SettingsView({
  carsResult,
  blogsResult,
}: {
  carsResult: CarsResult;
  blogsResult: BlogsResult;
}) {
  return (
    <div className="admin-view">
      <PageTitle eyebrow="SİSTEM" title="Ayarlar" subtitle="Supabase mənbə statusu və ilkin köçürmə əməliyyatları" />
      <div className="admin-settings-grid">
        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <p>AVTOMOBİL BAZASI</p>
              <h2>Avtomobilləri bazaya köçür</h2>
            </div>
          </div>
          <p className="admin-panel-copy">
            Supabase cədvəlini yaratdıqdan sonra lokal avtomobil parkını bazaya köçürmək üçün istifadə edin.
          </p>
          <form action={seedCarsAction}>
            <button type="submit" className="admin-secondary-button"><Database size={16} /> Bazaya köçür</button>
          </form>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <p>BLOG BAZASI</p>
              <h2>Blogları bazaya köçür</h2>
            </div>
          </div>
          <p className="admin-panel-copy">
            Lokal blog məqalələrini Supabase cədvəlinə əlavə edir.
          </p>
          <form action={seedBlogsAction}>
            <button type="submit" className="admin-secondary-button"><Database size={16} /> Blogları köçür</button>
          </form>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <p>STATUS</p>
              <h2>Mənbələr</h2>
            </div>
          </div>
          <dl className="admin-system-list">
            <div><dt>Avtomobillər</dt><dd>{carsResult.source} · {carsResult.cars.length}</dd></div>
            <div><dt>Blog</dt><dd>{blogsResult.source} · {blogsResult.blogs.length}</dd></div>
            <div><dt>Supabase</dt><dd>{carsResult.configured ? "Qoşulub" : "Env çatışmır"}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function EditorWorkspace({
  editor,
  carTab,
  blogTab,
  onCarTab,
  onBlogTab,
  onCarSaved,
  onBlogSaved,
  onCarDeleted,
  onBlogDeleted,
  onToast,
  onDirtyChange,
  onClose,
}: {
  editor: NonNullable<EditorState>;
  carTab: CarTab;
  blogTab: BlogTab;
  onCarTab: (tab: CarTab) => void;
  onBlogTab: (tab: BlogTab) => void;
  onCarSaved: (car: AdminCar, previousCar?: AdminCar | null, summary?: string) => void;
  onBlogSaved: (blog: AdminBlogPost) => void;
  onCarDeleted: (id: string, deletedCar?: AdminCar | null) => void;
  onBlogDeleted: (slug: string) => void;
  onToast: (toast: Omit<AdminToast, "id">) => void;
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [saveDiffs, setSaveDiffs] = useState<SaveDiff[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const originalFormSignatureRef = useRef<string | null>(null);
  const originalFormValuesRef = useRef<Record<string, string | boolean>>({});
  const pendingSubmitRef = useRef<{ formData: FormData; signature: string; summary: string } | null>(null);
  const formId = editor.type === "car" ? "admin-car-editor-form" : "admin-blog-editor-form";
  const draftKey = `carbon-admin-draft-${editor.type}-${editor.type === "car" ? editor.car?.id ?? "new-car" : editor.blog?.slug ?? "new-blog"}`;
  const title =
    editor.type === "car"
      ? editor.car?.title ?? "Yeni avtomobil"
      : editor.blog?.title ?? "Yeni məqalə";
  const subtitle = editor.type === "car" ? editor.car?.brand ?? "Carbon parkı" : "Carbon məqaləsi";
  const image =
    editor.type === "car"
      ? editor.car?.variants?.find((variant) => variant.thumbnail)?.thumbnail ?? editor.car?.thumbnail
      : editor.blog?.image;
  const isEditing = editor.mode === "edit";
  const publicHref = editor.type === "car" ? `/avtomobiller/${editor.car?.slug ?? ""}` : `/blog/${editor.blog?.slug ?? ""}`;
  const variantCount = editor.type === "car" ? Math.max((editor.car?.variants?.length ?? 0) + 1, 1) : 0;
  const startingPrice = editor.type === "car" ? startPrice(editor.car) : null;
  const carImages = useMemo(() => {
    if (editor.type !== "car") {
      return [];
    }

    return uniqueCompact([
      editor.car?.thumbnail,
      ...(editor.car?.variants ?? []).map((variant) => variant.thumbnail),
      editor.car?.weddingThumbnail,
    ]);
  }, [editor]);
  const activePreviewImage = carImages[activeImageIndex] ?? image;
  const deleteTitle = editor.type === "car" ? "Avtomobili sil" : "Məqaləni sil";
  const deleteCopy =
    editor.type === "car"
      ? "Bu avtomobil idarə panelindən və bağlı siyahılardan silinəcək."
      : "Bu məqalə idarə panelindən və saytdakı blog siyahısından silinəcək.";

  const getEditorForm = useCallback(() => {
    const form = document.getElementById(formId);
    return form instanceof HTMLFormElement ? form : null;
  }, [formId]);

  const updateDirtyFromForm = useCallback((form?: HTMLFormElement | null) => {
    const targetForm = form ?? getEditorForm();

    if (!targetForm) {
      return;
    }

    const nextSignature = editorFormSignature(targetForm);

    if (originalFormSignatureRef.current === null) {
      originalFormSignatureRef.current = nextSignature;
      originalFormValuesRef.current = editorFormValues(targetForm);
    }

    const nextDirty = nextSignature !== originalFormSignatureRef.current;
    setDirty(nextDirty);

    if (nextDirty) {
      setJustSaved(false);
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({
          time: Date.now(),
          title,
          values: editorFormValues(targetForm),
        })
      );
    }
  }, [draftKey, getEditorForm, title]);

  useEffect(() => {
    originalFormSignatureRef.current = null;

    const frame = window.requestAnimationFrame(() => {
      updateDirtyFromForm();
      const draft = window.localStorage.getItem(draftKey);
      setDraftAvailable(Boolean(draft));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [draftKey, editor, formId, updateDirtyFromForm]);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    const modalOpen = previewOpen || confirmDelete || saveDiffs.length > 0;

    if (!modalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [confirmDelete, previewOpen, saveDiffs.length]);

  function requestClose() {
    onClose();
  }

  async function submitEditorForm(formData: FormData, submittedSignature: string, summary: string) {
    setDrawerError(null);
    setJustSaved(false);
    setIsSaving(true);

    try {
      if (editor.type === "car") {
        const previousCar = editor.car ?? null;
        const result = await saveCarInlineAction(formData);

        if (!result.ok) {
          const message = adminClientMessage(result.error);
          setDrawerError(message);
          onToast({
            type: "error",
            title: "Saxlanılmadı",
            text: message,
          });
          return;
        }

        originalFormSignatureRef.current = submittedSignature;
        originalFormValuesRef.current = Object.fromEntries(
          Array.from(formData.entries())
            .filter(([, value]) => typeof value === "string")
            .map(([key, value]) => [key, String(value)])
        );
        window.localStorage.removeItem(draftKey);
        setDraftAvailable(false);
        onCarSaved(result.car, previousCar, summary);
        setDirty(false);
        setJustSaved(true);
        window.setTimeout(() => setJustSaved(false), 1800);
        return;
      }

      const result = await saveBlogInlineAction(formData);

      if (!result.ok) {
        const message = adminClientMessage(result.error);
        setDrawerError(message);
        onToast({
          type: "error",
          title: "Saxlanılmadı",
          text: message,
        });
        return;
      }

      originalFormSignatureRef.current = submittedSignature;
      window.localStorage.removeItem(draftKey);
      setDraftAvailable(false);
      onBlogSaved(result.blog);
      setDirty(false);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1800);
    } finally {
      setIsSaving(false);
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submittedSignature = editorFormSignature(event.currentTarget);
    const formData = new FormData(event.currentTarget);
    const nextValues = editorFormValues(event.currentTarget);
    const diffs = editor.type === "car" ? buildCarSaveDiffs(originalFormValuesRef.current, nextValues) : [];
    const summary = diffs.length
      ? diffs.slice(0, 3).map((diff) => `${diff.label}: ${diff.before} → ${diff.after}`).join("; ")
      : "Dəyişikliklər saytda yenilənir.";

    if (editor.type === "car" && diffs.length && !pendingSubmitRef.current) {
      pendingSubmitRef.current = { formData, signature: submittedSignature, summary };
      setSaveDiffs(diffs);
      return;
    }

    await submitEditorForm(formData, submittedSignature, summary);
  };
  const handleEditorFormMutation = (event: FormEvent<HTMLDivElement>) => {
    const form = (event.target as HTMLElement).closest("form");
    updateDirtyFromForm(form instanceof HTMLFormElement ? form : null);
  };
  const handleEditorFormStructureChange = useCallback(() => {
    window.requestAnimationFrame(() => {
      updateDirtyFromForm();
    });
  }, [updateDirtyFromForm]);

  function recoverDraft() {
    const form = getEditorForm();
    const raw = window.localStorage.getItem(draftKey);

    if (!form || !raw) return;

    try {
      const draft = JSON.parse(raw) as { values?: Record<string, string | boolean> };

      if (draft.values) {
        restoreEditorFormValues(form, draft.values);
        updateDirtyFromForm(form);
        setDraftAvailable(false);
        onToast({
          type: "success",
          title: "Draft bərpa olundu",
          text: "Saxlanılmamış məlumatlar forma qaytarıldı.",
        });
      }
    } catch {
      window.localStorage.removeItem(draftKey);
      setDraftAvailable(false);
    }
  }

  function discardDraft() {
    window.localStorage.removeItem(draftKey);
    setDraftAvailable(false);
  }

  function cancelSaveDiff() {
    pendingSubmitRef.current = null;
    setSaveDiffs([]);
  }

  async function confirmSaveDiff() {
    const pending = pendingSubmitRef.current;

    if (!pending) return;

    pendingSubmitRef.current = null;
    setSaveDiffs([]);
    await submitEditorForm(pending.formData, pending.signature, pending.summary);
  }
  const handleDelete = async () => {
    setDrawerError(null);
    setIsDeleting(true);

    try {
      if (editor.type === "car") {
        const id = editor.car?.id;

        if (!id) {
          const message = adminClientMessage("database-delete-failed");
          setDrawerError(message);
          onToast({
            type: "error",
            title: "Silinmədi",
            text: message,
          });
          return;
        }

        const result = await deleteCarInlineAction(id);

        if (!result.ok) {
          const message = adminClientMessage(result.error);
          setDrawerError(message);
          onToast({
            type: "error",
            title: "Silinmədi",
            text: message,
          });
          return;
        }

        onCarDeleted(result.id, editor.car ?? null);
        return;
      }

      const slug = editor.blog?.slug;

      if (!slug) {
        const message = adminClientMessage("database-delete-failed");
        setDrawerError(message);
        onToast({
          type: "error",
          title: "Silinmədi",
          text: message,
        });
        return;
      }

      const result = await deleteBlogInlineAction(slug);

      if (!result.ok) {
        const message = adminClientMessage(result.error);
        setDrawerError(message);
        onToast({
          type: "error",
          title: "Silinmədi",
          text: message,
        });
        return;
      }

      onBlogDeleted(result.slug);
    } finally {
      setIsDeleting(false);
    }
  };

	  return (
	    <section className="admin-editor-page">
	      <div className="admin-editor-actionbar">
	        <div className="admin-editor-breadcrumb">
	          <button type="button" onClick={requestClose}>
	            <ArrowRight size={14} />
	            {editor.type === "car" ? "Avtomobillər" : "Blog"}
	          </button>
	          <span>/</span>
	          <strong>{title}</strong>
	          {editor.type === "car" ? (
	            <>
	              <span>/</span>
	              <em>Redaktə et</em>
	            </>
	          ) : null}
	        </div>

	        <div className="admin-editor-actions">
	          {dirty ? <span className="admin-editor-dirty"><i /> Saxlanılmamış dəyişikliklər</span> : null}
	          {isEditing && publicHref.endsWith("/") === false ? (
	            <Link href={publicHref} target="_blank" rel="noopener noreferrer" className="admin-secondary-button">
	              Saytda bax
	              <ExternalLink size={14} />
	            </Link>
	          ) : null}
	          {editor.type === "car" ? (
	            <button type="button" className="admin-secondary-button" onClick={() => setPreviewOpen(true)}>
	              Preview
	              <ExternalLink size={14} />
	            </button>
	          ) : null}
	          <button
	            type="button"
	            className="admin-secondary-button admin-editor-more-button"
	            onClick={() => setConfirmDelete(true)}
	            disabled={!isEditing || isSaving || isDeleting}
	            title={deleteTitle}
	          >
	            <MoreHorizontal size={16} />
	          </button>
	          <button
	            type="submit"
	            form={formId}
	            className={`admin-primary-button${justSaved ? " is-saved" : ""}`}
	            disabled={isSaving || isDeleting || !dirty}
	          >
	            {justSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
	            {isSaving
	              ? "Saxlanılır..."
	              : justSaved
	                ? "Saxlanıldı"
	                : "Dəyişiklikləri saxla"}
	          </button>
	        </div>
	      </div>

      {draftAvailable ? (
        <div className="admin-editor-recovery">
          <span><History size={15} /></span>
          <strong>Autosave draft tapıldı</strong>
          <small>Bu forma üçün əvvəl saxlanmamış dəyişiklik var.</small>
          <button type="button" onClick={recoverDraft}>Bərpa et</button>
          <button type="button" onClick={discardDraft}>Sil</button>
        </div>
      ) : null}

	      {editor.type === "car" ? (
	        <CarEditorHero car={editor.car} title={title} image={image} variantCount={variantCount} startingPrice={startingPrice} />
	      ) : (
	        <header className="admin-editor-hero">
	          <div className="admin-editor-identity">
	            <span className="admin-editor-thumb">
	              {image ? <Image src={image} alt={title} fill sizes="96px" /> : <Newspaper size={22} />}
	            </span>
	            <div>
	              <p>Content workspace</p>
	              <h1>{title}</h1>
	              <div className="admin-editor-badges">
	                <span>{subtitle}</span>
	                <span><StatusDot active={editor.blog?.isActive} /></span>
	              </div>
	            </div>
	          </div>
	        </header>
	      )}

	      <div className="admin-editor-page-body" onChange={handleEditorFormMutation} onInput={handleEditorFormMutation}>
	        <div className="admin-editor-main">
          {editor.type === "car" ? (
            <CarEditorForm
              key={editor.car?.id ?? `new-${editor.index}`}
              formId={formId}
              editor={editor}
              activeTab={carTab}
	              onTab={onCarTab}
	              onSubmit={handleSubmit}
	              onStructureChange={handleEditorFormStructureChange}
	            />
          ) : (
            <BlogEditorForm
              formId={formId}
              editor={editor}
              activeTab={blogTab}
              onTab={onBlogTab}
              onSubmit={handleSubmit}
            />
          )}

          {drawerError ? (
            <div className="admin-drawer-message is-error">
              {drawerError}
	            </div>
	          ) : null}
	        </div>
	        {editor.type === "car" ? (
	          <CarEditorSidePanel
	            car={editor.car}
	            title={title}
	            images={carImages}
	            activeImage={activePreviewImage}
	            activeImageIndex={activeImageIndex}
	            onImage={setActiveImageIndex}
	            startingPrice={startingPrice}
	          />
	        ) : null}
      </div>

      {previewOpen ? (
        <AdminPortal>
          <div className="admin-preview-layer" role="dialog" aria-modal="true" aria-label="Saytda görünüş">
            <button type="button" className="admin-preview-backdrop" onClick={() => setPreviewOpen(false)} aria-label="Preview bağla" />
            <section className="admin-preview-modal">
              <header>
                <div>
                  <span>Saytda görünüş</span>
                  <strong>{title}</strong>
                </div>
                <button type="button" className="admin-icon-button" onClick={() => setPreviewOpen(false)}>
                  <X size={16} />
                </button>
              </header>
              <div className={`admin-editor-preview-card${editor.type === "blog" ? " is-blog" : ""}`}>
                <div>
                  {image ? <Image src={image} alt={title} fill sizes="640px" /> : editor.type === "car" ? <CarFront size={44} /> : <Newspaper size={44} />}
                </div>
                <span>{editor.type === "car" ? editor.car?.brand ?? "CARBON" : editor.blog?.category ?? "BLOG"}</span>
                <strong>{title}</strong>
                <small>{editor.type === "car" ? startingPrice !== null ? `${startingPrice} ₼-dan` : "Qiymət yoxdur" : editor.blog?.readingTime ?? "Oxu müddəti"}</small>
              </div>
              {publicHref ? (
                <Link href={publicHref} target="_blank" rel="noopener noreferrer" className="admin-primary-button">
                  Saytda aç
                  <ExternalLink size={14} />
                </Link>
              ) : null}
            </section>
          </div>
        </AdminPortal>
      ) : null}

      {saveDiffs.length ? (
        <AdminPortal>
          <div className="admin-confirm-layer" role="dialog" aria-modal="true" aria-labelledby="admin-save-diff-title">
            <button type="button" className="admin-preview-backdrop" onClick={cancelSaveDiff} aria-label="Dəyişiklik önizləməsini bağla" />
            <section className="admin-diff-card">
              <header>
                <div>
                  <span>PREVIEW DIFF</span>
                  <h2 id="admin-save-diff-title">Bu dəyişikliklər yadda saxlanılacaq</h2>
                </div>
                <button type="button" className="admin-icon-button" onClick={cancelSaveDiff} aria-label="Bağla">
                  <X size={16} />
                </button>
              </header>
              <div className="admin-diff-list">
                {saveDiffs.map((diff) => (
                  <article key={diff.label}>
                    <strong>{diff.label}</strong>
                    <span>{diff.before}</span>
                    <ArrowRight size={14} />
                    <span>{diff.after}</span>
                  </article>
                ))}
              </div>
              <footer>
                <button type="button" className="admin-secondary-button" onClick={cancelSaveDiff}>
                  Düzəlişə qayıt
                </button>
                <button type="button" className="admin-primary-button" onClick={confirmSaveDiff}>
                  Yadda saxla
                  <Save size={14} />
                </button>
              </footer>
            </section>
          </div>
        </AdminPortal>
      ) : null}

      <footer className="admin-editor-footer">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={requestClose}
          disabled={isSaving || isDeleting}
        >
          Geri qayıt
        </button>
        <button
	          type="submit"
	          form={formId}
	          className={`admin-primary-button${justSaved ? " is-saved" : ""}`}
	          disabled={isSaving || isDeleting || !dirty}
	        >
          {justSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {isSaving
            ? "Saxlanılır..."
            : justSaved
              ? "Saxlanıldı"
              : "Dəyişiklikləri saxla"}
        </button>
      </footer>

      {confirmDelete ? (
        <AdminPortal>
          <div className="admin-confirm-layer" role="dialog" aria-modal="true" aria-labelledby="admin-delete-title">
            <section className="admin-confirm-card">
              <div>
                <span className="admin-confirm-icon"><Trash2 size={18} /></span>
                <div>
                  <h2 id="admin-delete-title">{deleteTitle}</h2>
                  <p>{deleteCopy}</p>
                </div>
              </div>
              <footer>
                <button type="button" className="admin-secondary-button" onClick={() => setConfirmDelete(false)}>
                  Ləğv et
                </button>
                <button
                  type="button"
                  className="admin-danger-button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Silinir..." : "Bəli, sil"}
                </button>
              </footer>
            </section>
          </div>
        </AdminPortal>
      ) : null}
    </section>
  );
}

function CarEditorHero({
  car,
  title,
  image,
  variantCount,
  startingPrice,
}: {
  car?: AdminCar;
  title: string;
  image?: string | null;
  variantCount: number;
  startingPrice: number | null;
}) {
  const category = categoryLabels[car?.category ?? ""] ?? car?.category ?? "Model";
  const fallbackPalette = useMemo(
    () => carHeroPalette(car),
    [car]
  );
  const palette = useImageHeroPalette(image, fallbackPalette);
  const meta = uniqueCompact([
    `${variantCount} variant`,
    startingPrice !== null ? `${startingPrice} ₼-dan` : null,
    car?.manufactureYear ? String(car.manufactureYear) : null,
    car?.variants?.find((variant) => variant.bodyStyle)?.bodyStyle,
    car?.transmission,
  ]).slice(0, 5);

  return (
    <motion.header
      key={car?.id ?? title}
      className="admin-car-hero"
      style={{
        "--admin-car-hero-accent": palette.accent,
        "--admin-car-hero-soft": palette.soft,
        "--admin-car-hero-deep": palette.deep,
        "--admin-car-hero-glow": palette.glow,
      } as CSSProperties}
      initial={{ opacity: 0, y: 18, scale: 0.992, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="admin-car-hero-copy">
        <span className={`admin-car-status${car?.isActive === false ? " is-muted" : ""}`}>
          <i />
          {car?.isActive === false ? "Qaralama" : "Dərc olunub"}
        </span>
        <h1>{title}</h1>
        <p>{car?.brand ?? "Carbon"} <b /> {category}</p>
        <div className="admin-car-hero-pills">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="admin-car-hero-image">
        {image ? <Image src={image} alt={title} fill sizes="720px" priority /> : <CarFront size={96} />}
      </div>

      <aside className="admin-car-brand-card">
        <span><BrandLogo brand={car?.brand} size={42} /></span>
        <strong>{car?.brand ?? "Carbon"}</strong>
        <small>{title}</small>
      </aside>
    </motion.header>
  );
}

function CarEditorSidePanel({
  car,
  title,
  images,
  activeImage,
  activeImageIndex,
  onImage,
  startingPrice,
}: {
  car?: AdminCar;
  title: string;
  images: string[];
  activeImage?: string | null;
  activeImageIndex: number;
  onImage: (index: number) => void;
  startingPrice: number | null;
}) {
  const safeIndex = images.length ? Math.min(activeImageIndex, images.length - 1) : 0;
  const services = [
    car?.rentalVisible !== false ? "İcarə" : null,
    car?.transferAvailable ? "Transfer" : null,
    car?.weddingAvailable ? "Toy" : null,
  ].filter(Boolean);
  const visibilityItems = [
    {
      label: "Detal səhifəsi",
      active: car?.isActive !== false && Boolean(car?.slug),
      note: car?.isActive === false ? "Qaralama statusundadır" : "URL aktivdir",
    },
    {
      label: "Avtomobillər",
      active: car?.isActive !== false && car?.rentalVisible !== false,
      note: "İcarə kataloqu",
    },
    {
      label: "Transfer",
      active: car?.isActive !== false && Boolean(car?.transferAvailable),
      note: "Transfer axını",
    },
    {
      label: "Toy",
      active: car?.isActive !== false && Boolean(car?.weddingAvailable),
      note: "Toy kolleksiyası",
    },
  ];

  function moveImage(direction: -1 | 1) {
    if (!images.length) return;
    onImage((safeIndex + direction + images.length) % images.length);
  }

  return (
    <aside className="admin-car-side">
      <section className="admin-car-preview-card">
        <header>
          <span><Images size={16} /></span>
          <div>
            <strong>Şəkil önizləməsi</strong>
            <small>Əsas və variant şəkilləri</small>
          </div>
        </header>

        <div className="admin-car-preview-frame">
          {activeImage ? <Image src={activeImage} alt={title} fill sizes="460px" /> : <CarFront size={46} />}
          {images.length > 1 ? (
            <>
              <button type="button" onClick={() => moveImage(-1)} aria-label="Əvvəlki şəkil">
                <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => moveImage(1)} aria-label="Növbəti şəkil">
                <ArrowRight size={16} />
              </button>
            </>
          ) : null}
        </div>

        {images.length ? (
          <div className="admin-car-preview-thumbs">
            {images.slice(0, 4).map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                className={safeIndex === index ? "is-active" : ""}
                onClick={() => onImage(index)}
              >
                <Image src={item} alt={`${title} ${index + 1}`} fill sizes="96px" />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="admin-car-info-card">
          <header>
            <span><Gauge size={16} /></span>
            <div>
              <strong>Kanallar</strong>
              <small>Aktiv satış kanalları</small>
            </div>
          </header>
          <div className="admin-car-info-grid">
            <span><b>{car?.variants?.length ? car.variants.length + 1 : 1}</b><small>Variant</small></span>
            <span><b>{startingPrice !== null ? `${startingPrice} ₼` : "—"}</b><small>Başlanğıc</small></span>
            <span><b>{services.length || 0}</b><small>Kanal</small></span>
          </div>
        </section>

      <section className="admin-car-info-card admin-visibility-card">
        <header>
          <span><ShieldCheck size={16} /></span>
          <div>
            <strong>Public görünürlük</strong>
            <small>Saytda harada görünür</small>
          </div>
        </header>
        <div className="admin-visibility-list">
          {visibilityItems.map((item) => (
            <span key={item.label} className={item.active ? "is-visible" : "is-hidden"}>
              <i />
              <b>{item.label}</b>
              <small>{item.active ? "Görünür" : "Gizli"} · {item.note}</small>
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function FormSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-form-section-card">
      <header>
        <span>{icon}</span>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function TabButton<T extends string>({
  value,
  active,
  onClick,
  children,
  icon,
  count,
}: {
  value: T;
  active: T;
  onClick: (value: T) => void;
  children: ReactNode;
  icon?: ReactNode;
  count?: number;
}) {
  return (
    <button type="button" className={active === value ? "is-active" : ""} onClick={() => onClick(value)}>
      {icon ? <span className="admin-tab-icon">{icon}</span> : null}
      {children}
      {typeof count === "number" ? <small>{count}</small> : null}
      {active === value ? <motion.i layoutId="admin-editor-tab-indicator" /> : null}
    </button>
  );
}

function HiddenVariantFields({
  index,
  variant,
  car,
}: {
  index: number;
  variant:
    | AdminVariantDraft
    | undefined;
  car?: AdminCar;
}) {
  const fallbackLabel =
    variant?.label ??
    (index === 0
      ? car?.manufactureYear
        ? String(car.manufactureYear)
        : "Əsas variant"
      : "");
  const fallbackPrices = variant?.rentalPrices ?? (index === 0 ? car?.rentalPrices : undefined);

  return (
    <>
      <input name={`variant_${index}_id`} type="hidden" defaultValue={variant?.id ?? ""} />
      <input name={`variant_${index}_label`} type="hidden" defaultValue={fallbackLabel} />
      <input name={`variant_${index}_manufactureYear`} type="hidden" defaultValue={variant?.manufactureYear ?? (index === 0 ? car?.manufactureYear ?? "" : "")} />
      <input name={`variant_${index}_bodyStyle`} type="hidden" defaultValue={variant?.bodyStyle ?? ""} />
      <input name={`variant_${index}_engine`} type="hidden" defaultValue={variant?.engine ?? (index === 0 ? car?.engine ?? "" : "")} />
      <input name={`variant_${index}_fuel`} type="hidden" defaultValue={variant?.fuel ?? ""} />
      <input name={`variant_${index}_transmission`} type="hidden" defaultValue={variant?.transmission ?? ""} />
      <input name={`variant_${index}_seats`} type="hidden" defaultValue={variant?.seats ?? ""} />
      <input name={`variant_${index}_baggage`} type="hidden" defaultValue={variant?.baggage ?? ""} />
      <input name={`variant_${index}_power`} type="hidden" defaultValue={variant?.power ?? ""} />
      <input name={`variant_${index}_images`} type="hidden" defaultValue={variantImagesText(variant)} />
      <input name={`variant_${index}_isActive`} type="hidden" value={typeof variant?.isActive === "boolean" ? String(variant.isActive) : ""} readOnly />
      <input name={`variant_${index}_popular`} type="hidden" value={typeof variant?.popular === "boolean" ? String(variant.popular) : ""} readOnly />
      <input name={`variant_${index}_transferAvailable`} type="hidden" value={typeof variant?.transferAvailable === "boolean" ? String(variant.transferAvailable) : ""} readOnly />
      <input name={`variant_${index}_weddingAvailable`} type="hidden" value={typeof variant?.weddingAvailable === "boolean" ? String(variant.weddingAvailable) : ""} readOnly />
      <input name={`variant_${index}_thumbnail`} type="hidden" defaultValue={variant?.thumbnail ?? ""} />
      {rentalPriceKeys.map((key) => (
        <input key={key} type="hidden" name={`variant_${index}_rental_${key}`} defaultValue={fallbackPrices?.[key] ?? ""} />
      ))}
    </>
  );
}

function CarEditorForm({
  formId,
  editor,
  activeTab,
  onTab,
  onSubmit,
  onStructureChange,
}: {
  formId: string;
  editor: Extract<NonNullable<EditorState>, { type: "car" }>;
  activeTab: CarTab;
  onTab: (tab: CarTab) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStructureChange: () => void;
}) {
  const car = editor.car;
  const baseVariant = car
    ? {
        id: "",
        label:
          car.manufactureYear ? String(car.manufactureYear) :
          "Əsas variant",
        manufactureYear: car.manufactureYear ?? null,
        bodyStyle: null,
        engine: car.engine ?? null,
        fuel: null,
        transmission: null,
        seats: null,
        baggage: null,
        power: null,
        isActive: car.isActive ?? true,
        transferAvailable: car.transferAvailable,
        weddingAvailable: car.weddingAvailable,
        images: [],
        thumbnail: null,
        rentalPrices: car.rentalPrices,
      }
    : undefined;
  const existingVariants = car?.variants ?? [];
  const formVariants = [baseVariant, ...existingVariants];
  const initialVariantCount = Math.max(formVariants.length, 1);
  const [variantSlots, setVariantSlots] = useState(() =>
    Array.from({ length: initialVariantCount }, (_, index) => ({
      key: `${car?.id ?? "new"}-${formVariants[index]?.id ?? "main"}-${index}`,
      variant: formVariants[index] as AdminVariantDraft | undefined,
    })) satisfies AdminVariantSlot[],
  );
  const [variantEditorIndex, setVariantEditorIndex] = useState<number | null>(null);
  const [variantEditorTab, setVariantEditorTab] = useState<VariantEditorTab>("general");
  const [variantCreateOpen, setVariantCreateOpen] = useState(false);
  const [newVariantYear, setNewVariantYear] = useState(() => {
    const latestYear = car ? carVariantYears(car)[0] : new Date().getFullYear();
    return String(latestYear - 1);
  });
  const [copySourceIndex, setCopySourceIndex] = useState(0);
  const [copyTechnical, setCopyTechnical] = useState(true);
  const [copyServices, setCopyServices] = useState(true);
  const [copyImages, setCopyImages] = useState(true);
  const [copyPricing, setCopyPricing] = useState(false);
  const variantCount = variantSlots.length;
  const copySourceVariant = variantSlots[Math.min(copySourceIndex, Math.max(variantSlots.length - 1, 0))]?.variant;
  const copySourcePrice = variantStartingPrice(copySourceVariant) ?? startPrice(car);
  const suggestedPrice = copySourcePrice !== null ? Math.max(1, Math.round(copySourcePrice * 0.9)) : null;

  useEffect(() => {
    if (!variantCreateOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [variantCreateOpen]);

  function addVariant() {
    setVariantCreateOpen(true);
  }

  function createVariantFromDialog() {
    const nextIndex = variantSlots.length;
    const source = variantSlots[Math.min(copySourceIndex, variantSlots.length - 1)]?.variant;
    const sourcePrices = source?.rentalPrices ?? car?.rentalPrices;
    const nextYear = Number(newVariantYear);
    const createdVariant: AdminVariantDraft = {
      id: "",
      label: Number.isFinite(nextYear) ? String(nextYear) : "",
      manufactureYear: Number.isFinite(nextYear) ? nextYear : null,
      bodyStyle: copyTechnical ? source?.bodyStyle ?? null : null,
      engine: copyTechnical ? source?.engine ?? null : null,
      fuel: copyTechnical ? source?.fuel ?? null : null,
      transmission: copyTechnical ? source?.transmission ?? null : null,
      seats: copyTechnical ? source?.seats ?? null : null,
      baggage: copyTechnical ? source?.baggage ?? null : null,
      power: copyTechnical ? source?.power ?? null : null,
      isActive: true,
      transferAvailable: copyServices ? source?.transferAvailable ?? false : false,
      weddingAvailable: copyServices ? source?.weddingAvailable ?? false : false,
      images: copyImages ? source?.images ?? [] : [],
      thumbnail: copyImages ? source?.thumbnail ?? null : null,
      rentalPrices: copyPricing && sourcePrices ? { ...sourcePrices } : {},
    };

    setVariantSlots((slots) => [
      ...slots,
      {
        key: `${car?.id ?? "new"}-new-variant-${Date.now()}`,
        variant: createdVariant,
      },
    ]);
    setVariantEditorTab("general");
    setVariantEditorIndex(nextIndex);
    setVariantCreateOpen(false);
    onStructureChange();
  }

  function duplicateVariant(index: number) {
    const source = variantSlots[index]?.variant;
    const nextYear = source?.manufactureYear ? source.manufactureYear - 1 : new Date().getFullYear();
    const createdVariant: AdminVariantDraft = {
      ...source,
      id: "",
      label: String(nextYear),
      manufactureYear: nextYear,
      isActive: true,
      rentalPrices: source?.rentalPrices ? { ...source.rentalPrices } : {},
      images: source?.images ? [...source.images] : [],
    };
    const nextIndex = variantSlots.length;

    setVariantSlots((slots) => [
      ...slots,
      {
        key: `${car?.id ?? "new"}-duplicate-variant-${Date.now()}`,
        variant: createdVariant,
      },
    ]);
    setVariantEditorTab("general");
    setVariantEditorIndex(nextIndex);
    onStructureChange();
  }

  function removeVariant(index: number) {
    if (index === 0) {
      return;
    }

    setVariantSlots((slots) => slots.filter((_, slotIndex) => slotIndex !== index));
    setVariantEditorIndex(null);
    onStructureChange();
  }

  function syncActiveVariant(form: HTMLFormElement) {
    if (activeTab !== "variants" || variantEditorIndex === null) {
      return;
    }

    const formData = new FormData(form);
    const textValue = (key: string) => String(formData.get(key) ?? "").trim();
    const optionalValue = (key: string) => textValue(key) || null;
    const numberValue = (key: string) => {
      const value = textValue(key);

      if (!value) {
        return null;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };
    const boolValue = (key: string) => {
      const value = formData.get(key);
      return value === "on" || value === "true";
    };
    const index = variantEditorIndex;
    const rentalPrices = Object.fromEntries(
      rentalPriceKeys.map((key) => [key, numberValue(`variant_${index}_rental_${key}`)])
    ) as Partial<Car["rentalPrices"]>;
    const images = textValue(`variant_${index}_images`)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    setVariantSlots((slots) =>
      slots.map((slot, slotIndex) =>
        slotIndex === index
          ? {
              ...slot,
              variant: {
                ...slot.variant,
                label: textValue(`variant_${index}_label`),
                manufactureYear: numberValue(`variant_${index}_manufactureYear`),
                bodyStyle: optionalValue(`variant_${index}_bodyStyle`),
                engine: optionalValue(`variant_${index}_engine`),
                fuel: optionalValue(`variant_${index}_fuel`),
                transmission: optionalValue(`variant_${index}_transmission`),
                seats: numberValue(`variant_${index}_seats`),
                baggage: numberValue(`variant_${index}_baggage`),
                power: optionalValue(`variant_${index}_power`),
                thumbnail: optionalValue(`variant_${index}_thumbnail`),
                images,
                isActive: boolValue(`variant_${index}_isActive`),
                transferAvailable: boolValue(`variant_${index}_transferAvailable`),
                weddingAvailable: boolValue(`variant_${index}_weddingAvailable`),
                popular: formData.has(`variant_${index}_popular`)
                  ? boolValue(`variant_${index}_popular`)
                  : slot.variant?.popular,
                rentalPrices,
              },
            }
          : slot
      )
    );
  }

  return (
    <>
	      <nav className="admin-drawer-tabs">
	        <TabButton value="general" active={activeTab} onClick={onTab} icon={<CarFront size={15} />}>Ümumi</TabButton>
	        <TabButton value="technical" active={activeTab} onClick={onTab} icon={<Gauge size={15} />}>Texniki</TabButton>
	        <TabButton value="variants" active={activeTab} onClick={onTab} icon={<Grid2X2 size={15} />} count={variantCount}>Variantlar</TabButton>
	        <TabButton value="images" active={activeTab} onClick={onTab} icon={<Images size={15} />}>Şəkillər</TabButton>
	        <TabButton value="services" active={activeTab} onClick={onTab} icon={<SlidersHorizontal size={15} />}>Xidmətlər</TabButton>
	        <TabButton value="description" active={activeTab} onClick={onTab} icon={<List size={15} />}>Təsvir</TabButton>
	        <TabButton value="seo" active={activeTab} onClick={onTab} icon={<ShieldCheck size={15} />}>SEO</TabButton>
	      </nav>

      <form
        id={formId}
        onSubmit={onSubmit}
        onInput={(event) => syncActiveVariant(event.currentTarget)}
        onChange={(event) => syncActiveVariant(event.currentTarget)}
        className="admin-editor-form"
      >
        <input name="id" type="hidden" defaultValue={car?.id ?? ""} />
        <input name="variantCount" type="hidden" value={variantCount} readOnly />
        {variantSlots.map((slot, index) =>
          activeTab === "variants" && variantEditorIndex === index ? null : (
            <HiddenVariantFields
              key={`${slot.key}-hidden`}
              index={index}
              variant={slot.variant}
              car={car}
            />
          ),
        )}

	        <section className={`admin-tab-panel${activeTab === "general" ? "" : " is-hidden"}`}>
	          <FormSection icon={<CarFront size={18} />} title="Əsas məlumatlar" subtitle="Avtomobilin ümumi məlumatlarını daxil edin.">
	            <div className="admin-form-grid">
	              <Field label="Model adı" name="title" defaultValue={car?.title} placeholder="Mercedes S Class" icon={<CarFront size={16} />} />
	              <Field label="URL adı" name="slug" defaultValue={car?.slug} placeholder="mercedes-s-class" icon={<ExternalLink size={16} />} />
	              <Field label="Brend" name="brand" defaultValue={car?.brand} placeholder="Mercedes-Benz" icon={<ShieldCheck size={16} />} suggestions={adminBrandOptions} />
	              <SelectField label="Kateqoriya" name="category" defaultValue={car?.category ?? "Business"} options={[...carCategories]} icon={<Grid2X2 size={16} />} />
	              <Field label="Sıralama" name="sortOrder" type="number" defaultValue={car?.sortOrder ?? editor.index + 1} icon={<Rows3 size={16} />} />
	              <Field label="Buraxılış ili" name="manufactureYear" type="number" defaultValue={car?.manufactureYear} placeholder="2024" icon={<CalendarDays size={16} />} />
	              <div className="admin-form-status-row">
	                <Toggle label="Dərc olunub" name="isActive" defaultChecked={car?.isActive ?? true} description="Avtomobil saytda göstərilsin." icon={<ShieldCheck size={16} />} />
	              </div>
	            </div>
	          </FormSection>
	        </section>

	        <section className={`admin-tab-panel${activeTab === "technical" ? "" : " is-hidden"}`}>
	          <FormSection icon={<Gauge size={18} />} title="Texniki məlumatlar" subtitle="Komfort, mühərrik və istifadə göstəricilərini yeniləyin.">
	            <div className="admin-form-grid">
	              <Field label="Oturacaq sayı" name="seats" type="number" defaultValue={car?.seats} icon={<Users size={16} />} />
	              <Field label="Baqaj" name="baggage" type="number" defaultValue={car?.baggage} icon={<Database size={16} />} />
	              <Field label="Kiçik baqaj" name="smallBaggage" type="number" defaultValue={car?.smallBaggage} icon={<Rows3 size={16} />} />
	              <SelectField label="Yanacaq" name="fuel" defaultValue={car?.fuel ?? "Benzin"} options={["Benzin", "Dizel", "Hibrid", "Elektrik"]} icon={<CarFront size={16} />} />
	              <Field label="Mühərrik" name="engine" defaultValue={car?.engine} placeholder="2.0" icon={<Gauge size={16} />} />
	              <SelectField label="Sürətlər qutusu" name="transmission" defaultValue={car?.transmission ?? "Avtomat"} options={["Avtomat", "Mexanika"]} icon={<Settings size={16} />} />
	            </div>
	          </FormSection>
	        </section>

	        <section className={`admin-tab-panel${activeTab === "images" ? "" : " is-hidden"}`}>
	          <FormSection icon={<Images size={18} />} title="Şəkillər" subtitle="Əsas, toy və public görünüş üçün istifadə olunan şəkilləri idarə edin.">
	            <div className="admin-image-editor-stack">
	              <AdminImageField
	                key={`car-image-${car?.id ?? "new"}`}
	                label="Əsas şəkil"
	                name="thumbnail"
	                fileName="imageFile"
	                defaultValue={car?.thumbnail}
	                title={car?.title || "Avtomobil şəkli"}
	              />
	              <AdminImageField
	                key={`car-wedding-image-${car?.id ?? "new"}`}
	                label="Toy şəkli"
	                name="weddingThumbnail"
	                fileName="weddingImageFile"
	                defaultValue={car?.weddingThumbnail}
	                title={car?.title ? `${car.title} toy şəkli` : "Toy avtomobili şəkli"}
	              />
	            </div>
	          </FormSection>
	        </section>

        <section className={`admin-tab-panel${activeTab === "variants" ? "" : " is-hidden"}`}>
	          <AnimatePresence mode="wait" initial={false}>
	            {variantEditorIndex === null ? (
	              <motion.div
	                key="variant-list"
	                className="admin-variant-stage"
	                initial={{ opacity: 0, x: -18, filter: "blur(8px)" }}
	                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
	                exit={{ opacity: 0, x: -14, filter: "blur(6px)" }}
	                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
	              >
	              <div className="admin-clean-section-head">
	                <div>
	                  <h2>Variantlar</h2>
                  <p>Eyni avtomobilin fərqli il, qiymət və texniki versiyalarını idarə edin.</p>
                </div>
                <button type="button" className="admin-primary-button admin-variant-add-button" onClick={addVariant}>
                  <Plus size={14} />
                  Yeni variant
                </button>
              </div>

	              <motion.div className="admin-variant-table-card" layout>
                  <div className="admin-variant-table-head">
                    <span>İl / Variant</span>
                    <span>Status</span>
                    <span>Qiymət (günlük)</span>
                    <span>Texniki məlumatlar</span>
                    <span>Əməliyyatlar</span>
                  </div>
	                {variantSlots.map((slot, index) => {
	                  const variant = slot.variant;
	                  const isMainVariant = index === 0;
                  const price = variantStartingPrice(variant);
                  const titleParts = variantTitleParts(variant, index);
                  const image = variant?.thumbnail || (isMainVariant ? car?.thumbnail : null);
                  const hasVariantYear = Boolean(variant?.manufactureYear || (isMainVariant && car?.manufactureYear));
                  const specs = [
                    variantSpecValue(variant?.engine, car?.engine),
                    variantSpecValue(variant?.transmission, car?.transmission),
                    variantSpecValue(variant?.fuel, car?.fuel),
                  ].filter(Boolean);

	                  return (
	                    <motion.div
	                      key={`${slot.key}-card`}
	                      layout
	                      initial={{ opacity: 0, y: 18, scale: 0.96 }}
	                      animate={{ opacity: 1, y: 0, scale: 1 }}
	                      exit={{ opacity: 0, y: -12, scale: 0.96 }}
	                      transition={{ duration: 0.24, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
	                      className={`admin-variant-row${isMainVariant ? " is-main" : ""}`}
                    >
                      <div className="admin-variant-name-cell">
                        <span className="admin-variant-row-image">
                          {image ? <Image src={image} alt={titleParts.title} fill sizes="86px" /> : <CarFront size={18} />}
                        </span>
                        <span>
                          <strong>{titleParts.year}</strong>
                          <small>{titleParts.label || car?.title || "Yeni variant"}</small>
                          {!hasVariantYear ? (
                            <span className="admin-missing-labels">
                              <em>İl yoxdur</em>
                            </span>
                          ) : null}
                        </span>
                        {isMainVariant ? <em>Əsas variant</em> : null}
                      </div>
                      <span className={`admin-variant-status${variant?.isActive === false ? " is-muted" : ""}`}>
                        <i />
                        {variant?.isActive === false ? "Deaktiv" : "Aktiv"}
                      </span>
                      <span className="admin-variant-price-cell">
                        <strong>{price !== null ? `${price} ₼` : "—"}</strong>
                        <small>/ gün</small>
                      </span>
                      <span className="admin-variant-spec-cell">
                        {specs.length ? specs.map((item) => <small key={item}>{item}</small>) : <small>Inherited</small>}
                      </span>
                      <span className="admin-variant-action-cell">
                        <button
                          type="button"
                          className="admin-secondary-button"
                          onClick={() => {
                            setVariantEditorTab("general");
                            setVariantEditorIndex(index);
                          }}
                        >
                          Redaktə et
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button"
                          title="Variantı kopyala"
                          aria-label="Variantı kopyala"
                          onClick={() => duplicateVariant(index)}
                        >
                          <Clipboard size={15} />
                        </button>
                      </span>
	                    </motion.div>
	                  );
	                })}
	              </motion.div>
                <div className="admin-variant-quick-strip">
                  <span><Plus size={16} /></span>
                  <div>
                    <strong>Sürətli əlavəetmə</strong>
                    <small>Yeni ili mövcud variantdan kopyalayaraq yaradın.</small>
                  </div>
                  <span><Database size={16} /></span>
                  <div>
                    <strong>Məlumatları kopyala</strong>
                    <small>Texniki məlumat, xidmət və şəkilləri bir kliklə daşıyın.</small>
                  </div>
                  <span><ShieldCheck size={16} /></span>
                  <div>
                    <strong>Çevik qiymətləndirmə</strong>
                    <small>Hər il üçün günlük qiymətləri ayrıca saxlayın.</small>
                  </div>
                </div>
	              </motion.div>
	            ) : (
	            <motion.div
	              key={`variant-workspace-${variantEditorIndex}`}
	              className="admin-variant-workspace"
	              initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
	              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
	              exit={{ opacity: 0, x: 16, filter: "blur(6px)" }}
	              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
	            >
	              {variantSlots.map((slot, index) => {
                if (index !== variantEditorIndex) return null;

                const variant = slot.variant;
                const isMainVariant = index === 0;
                const titleParts = variantTitleParts(variant, index);
                const previewImage = variant?.thumbnail || car?.thumbnail;
                const previewPrice = variantStartingPrice(variant) ?? startPrice(car);
                const previewSpecs = [
                  variantSpecValue(variant?.engine, car?.engine),
                  variantSpecValue(variant?.transmission, car?.transmission),
                  variantSpecValue(variant?.fuel, car?.fuel),
                ].filter(Boolean);

                return (
	                  <section key={`${slot.key}-workspace`}>
	                    <input name={`variant_${index}_id`} type="hidden" defaultValue={variant?.id ?? ""} />
                    <div className="admin-variant-workspace-head">
                      <button type="button" onClick={() => setVariantEditorIndex(null)}>
                        <ArrowRight size={14} />
                        Variantlar
                      </button>
                      <div>
                        <p>{car?.title ?? "Model"}</p>
                        <h2>{titleParts.year}</h2>
                        <span className="admin-variant-head-summary">
                          {titleParts.label || "Variant adı yoxdur"}
                          <b />
                          {variant?.isActive === false ? "Deaktiv" : "Aktiv"}
                          <b />
                          {previewPrice !== null ? `${previewPrice} ₼ / gün` : "Qiymət yoxdur"}
                          {previewSpecs.length ? ` · ${previewSpecs.join(" · ")}` : ""}
                        </span>
                      </div>
                      {isMainVariant ? <span>★ Əsas variant</span> : null}
                    </div>

	                    <div className="admin-variant-subtabs">
	                      {[
	                        ["general", "Ümumi"],
	                        ["pricing", "Qiymət"],
	                        ["technical", "Texniki"],
	                        ["images", "Şəkillər"],
	                        ["services", "Xidmətlər"],
	                      ].map(([tab, label]) => (
	                        <button
	                          key={tab}
	                          type="button"
	                          className={variantEditorTab === tab ? "is-active" : ""}
	                          onClick={() => setVariantEditorTab(tab as VariantEditorTab)}
	                        >
	                          {label}
	                        </button>
	                    ))}
	                    </div>

                    <div className="admin-variant-editor-grid">
                      <div className="admin-variant-editor-main">
		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "general" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Ümumi məlumat</h2>
	                            <p>Bu versiyaya aid il, opsional ad və görünürlük.</p>
	                          </div>
	                          {!isMainVariant ? (
	                            <button type="button" className="admin-variant-delete-button" onClick={() => removeVariant(index)}>
	                              <Trash2 size={13} />
	                              Variantı sil
	                            </button>
	                          ) : null}
	                        </div>
	                        <div className="admin-form-grid admin-form-grid-comfort">
	                          <Field label="İl" name={`variant_${index}_manufactureYear`} type="number" defaultValue={variant?.manufactureYear ?? (index === 0 ? car?.manufactureYear : undefined)} placeholder="2024" />
	                          <Field label="Variant adı (opsional)" name={`variant_${index}_label`} defaultValue={variant?.label ?? (index === 0 && car?.manufactureYear ? String(car.manufactureYear) : undefined)} placeholder="Competition, Facelift, Premium" />
                            <Field label="Sıralama" name={`variant_${index}_sortOrder`} type="number" defaultValue={index + 1} placeholder="1" />
                            <div className="admin-form-status-row">
                              <Toggle label="Aktiv" name={`variant_${index}_isActive`} defaultChecked={variant?.isActive ?? true} description="Bu il public səhifədə seçilə bilsin." icon={<ShieldCheck size={16} />} />
                            </div>
	                        </div>
		                    </div>

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "pricing" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Qiymətləndirmə</h2>
	                            <p>Variantın günlük tariflərini ayrıca saxlayın.</p>
	                          </div>
	                        </div>
	                        <div className="admin-price-grid">
	                          {rentalPriceKeys.map((key) => (
	                            <PriceField
	                              key={key}
	                              label={rentalPriceLabels[key]}
	                              name={`variant_${index}_rental_${key}`}
	                              defaultValue={variant?.rentalPrices?.[key] ?? (index === 0 ? car?.rentalPrices[key] : undefined)}
	                            />
	                          ))}
	                        </div>
		                    </div>

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "technical" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Texniki məlumatlar</h2>
	                            <p>Boş saxlanan sahələr avtomobilin əsas məlumatlarından istifadə edir.</p>
	                          </div>
	                        </div>
                          <div className="admin-inheritance-banner">
                            <span><Database size={16} /></span>
                            <div>
                              <strong>Avtomobil məlumatlarından istifadə: ON</strong>
                              <small>Yalnız fərqlənən sahələri doldurun.</small>
                            </div>
                          </div>
	                        <div className="admin-form-grid admin-form-grid-comfort">
	                          <Field label="Nəsil / kuzov" name={`variant_${index}_bodyStyle`} defaultValue={variant?.bodyStyle} placeholder="W214 / Sedan" />
	                          <Field label={`Mühərrik · ${inheritedState(variant?.engine)}`} name={`variant_${index}_engine`} defaultValue={variant?.engine ?? (index === 0 ? car?.engine : undefined)} placeholder={car?.engine ?? "2.0 L"} />
                            <SelectField label={`Sürətlər qutusu · ${inheritedState(variant?.transmission)}`} name={`variant_${index}_transmission`} defaultValue={variant?.transmission ?? ""} options={["", "Avtomat", "Mexanika"]} />
                            <SelectField label={`Yanacaq · ${inheritedState(variant?.fuel)}`} name={`variant_${index}_fuel`} defaultValue={variant?.fuel ?? ""} options={["", "Benzin", "Dizel", "Hibrid", "Elektrik"]} />
                            <Field label={`Oturacaq · ${inheritedState(variant?.seats)}`} name={`variant_${index}_seats`} type="number" defaultValue={variant?.seats ?? ""} placeholder={car?.seats ? String(car.seats) : "5"} />
                            <Field label={`Baqaj · ${inheritedState(variant?.baggage)}`} name={`variant_${index}_baggage`} type="number" defaultValue={variant?.baggage ?? ""} placeholder={car?.baggage ? String(car.baggage) : "2"} />
                            <Field label={`Güc · ${inheritedState(variant?.power)}`} name={`variant_${index}_power`} defaultValue={variant?.power ?? ""} placeholder="250 HP" />
	                        </div>
		                    </div>

			                    <div className={`admin-variant-workspace-panel${variantEditorTab === "images" ? "" : " is-hidden"}`}>
		                        <div className="admin-clean-section-head">
		                          <div>
		                            <h2>Variant şəkli</h2>
		                            <p>Xüsusi şəkil yoxdursa, əsas avtomobil qalereyası istifadə olunur.</p>
		                          </div>
		                        </div>
                            <div className="admin-inheritance-banner">
                              <span><Images size={16} /></span>
                              <div>
                                <strong>Əsas avtomobil şəkillərindən istifadə</strong>
                                <small>{variant?.thumbnail || variant?.images?.length ? "Xüsusi şəkillər əlavə edilib." : "Hazırda xüsusi şəkil yoxdur."}</small>
                              </div>
                            </div>
		                        <div className="admin-image-editor-stack">
		                          <AdminImageField
		                            key={`variant-image-${slot.key}`}
		                            label="Variant şəkli"
		                            name={`variant_${index}_thumbnail`}
		                            fileName={`variant_${index}_imageFile`}
		                            defaultValue={variant?.thumbnail ?? (index === 0 ? car?.thumbnail : undefined)}
		                            title={`${car?.title ?? "Avtomobil"} ${variantDisplayName(variant, index)}`}
		                          />
                              <TextAreaField label="Əlavə variant şəkilləri" name={`variant_${index}_images`} rows={4} placeholder="Hər sətrə bir şəkil URL-i yazın." defaultValue={variantImagesText(variant)} />
		                        </div>
			                    </div>

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "services" ? "" : " is-hidden"}`}>
                            <input name={`variant_${index}_popular`} type="hidden" value={typeof variant?.popular === "boolean" ? String(variant.popular) : ""} readOnly />
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Xidmətlər</h2>
	                            <p>Bu ilin transfer və toy sifarişlərində istifadə olunmasını idarə edin.</p>
	                          </div>
	                        </div>
	                        <div className="admin-service-card-grid">
                            <Toggle label="Transfer" name={`variant_${index}_transferAvailable`} defaultChecked={variant?.transferAvailable ?? false} description="Bu il transfer sifarişlərində seçilə bilsin." icon={<Plane size={16} />} />
                            <Toggle label="Toy avtomobili" name={`variant_${index}_weddingAvailable`} defaultChecked={variant?.weddingAvailable ?? false} description="Bu il toy avtomobili kimi təklif olunsun." icon={<Heart size={16} />} />
                          </div>
	                        <p className="admin-variant-service-note">İcarə üçün əsas açar avtomobilin Xidmətlər tabındadır. Bu variantın icarədə seçilməsi isə Ümumi tabdakı Aktiv statusu ilə idarə olunur.</p>
		                    </div>
                      </div>

                      <aside className="admin-variant-live-preview">
                        <header>
                          <span><Images size={16} /></span>
                          <strong>CANLI ÖNİZLƏMƏ</strong>
                        </header>
                        <div className="admin-variant-live-image">
                          {previewImage ? <Image src={previewImage} alt={`${car?.title ?? "Avtomobil"} ${titleParts.title}`} fill sizes="340px" /> : <CarFront size={42} />}
                        </div>
                        <h3>{car?.title ?? "Yeni avtomobil"}</h3>
                        <p>{titleParts.title}</p>
                        <div className="admin-variant-live-specs">
                          {previewSpecs.map((item) => <span key={item}>{item}</span>)}
                        </div>
                        <div className="admin-variant-live-price">
                          <strong>{previewPrice !== null ? `${previewPrice} ₼` : "—"}</strong>
                          <small>/ gün</small>
                        </div>
                        {car?.slug ? (
                          <Link href={`/avtomobiller/${car.slug}`} target="_blank" rel="noopener noreferrer" className="admin-primary-button">
                            Saytda bax
                            <ExternalLink size={14} />
                          </Link>
                        ) : null}
                      </aside>
                    </div>
	                  </section>
                );
              })}
	            </motion.div>
	            )}
	          </AnimatePresence>
	        </section>

        <section className={`admin-tab-panel${activeTab === "services" ? "" : " is-hidden"}`}>
          <div className="admin-service-card-grid">
                <Toggle label="İcarədə göstər" name="rentalVisible" defaultChecked={car?.rentalVisible ?? true} description="İcarə siyahısı və rezervasiya axınında göstər." />
                <Toggle label="Transfer üçün aktiv" name="transferAvailable" defaultChecked={car?.transferAvailable} description="Transfer bölməsində təklif et." />
                <Toggle label="Toy avtomobili" name="weddingAvailable" defaultChecked={car?.weddingAvailable} description="Toy kolleksiyasında təklif et." />
              </div>
              <p className="admin-variant-service-note">
                Detal səhifəsi avtomobil aktiv olduğu müddətdə görünür; bu seçimlər yalnız hansı satış kanallarında təklif ediləcəyini idarə edir.
              </p>

              <div className="admin-service-settings">
            <section>
              <div className="admin-clean-section-head">
                <div>
                  <h2>İcarə</h2>
                  <p>Gün sayına görə public rezervasiya qiymətləri.</p>
                </div>
              </div>
              <div className="admin-price-grid">
                {rentalPriceKeys.map((key) => (
                  <PriceField key={key} label={rentalPriceLabels[key]} name={`rental_${key}`} defaultValue={car?.rentalPrices[key]} />
                ))}
              </div>
            </section>
            <section>
              <div className="admin-clean-section-head">
                <div>
                  <h2>Transfer</h2>
                  <p>Marşrut üzrə sürücülü transfer qiymətləri.</p>
                </div>
              </div>
              <div className="admin-price-grid">
                {transferPriceKeys.map((key) => (
                  <PriceField key={key} label={transferPriceLabels[key]} name={`transfer_${key}`} defaultValue={car?.transferPrices[key]} />
                ))}
              </div>
            </section>
            <section>
              <div className="admin-clean-section-head">
                <div>
                  <h2>Toy xidməti</h2>
                  <p>Xüsusi gün kolleksiyası üçün görünüş və qiymət.</p>
                </div>
              </div>
              <div className="admin-form-grid admin-form-grid-comfort">
                <PriceField label="Toy qiyməti" name="weddingPrice" defaultValue={car?.weddingPrice} />
                <TextAreaField label="Toy təsviri" name="weddingDescription" rows={5} defaultValue={car?.weddingDescription} />
              </div>
            </section>
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "description" ? "" : " is-hidden"}`}>
          <div className="admin-clean-section-head">
            <div>
              <h2>Təsvir</h2>
              <p>Model üçün public səhifədə istifadə olunacaq redaksiya məzmunu.</p>
            </div>
          </div>
          <TextAreaField label="Qısa təsvir" name="carDescription" rows={6} placeholder="Premium avtomobil, komfortlu salon və gündəlik istifadə üçün uyğun seçim." />
        </section>

        <section className={`admin-tab-panel${activeTab === "seo" ? "" : " is-hidden"}`}>
          <div className="admin-clean-section-head">
            <div>
              <h2>SEO</h2>
              <p>Meta başlıq, axtarış təsviri və indeksləmə qeydləri.</p>
            </div>
          </div>
          <div className="admin-form-grid admin-form-grid-comfort">
            <Field label="Meta başlıq" name="seoTitle" defaultValue={car?.title ? `${car.title} icarəsi Bakıda` : ""} />
            <TextAreaField label="Meta təsvir" name="seoDescription" rows={4} placeholder="Bakıda sürətli və rahat avtomobil icarəsi." />
          </div>
        </section>
      </form>
      {variantCreateOpen ? (
        <AdminPortal>
          <div className="admin-variant-modal-layer" role="dialog" aria-modal="true" aria-labelledby="admin-new-variant-title">
            <button type="button" className="admin-variant-modal-backdrop" onClick={() => setVariantCreateOpen(false)} aria-label="Modalı bağla" />
            <section className="admin-variant-modal">
              <header>
                <div>
                  <span>Variantlar</span>
                  <h2 id="admin-new-variant-title">Yeni variant yarat</h2>
                </div>
                <button type="button" className="admin-icon-button" onClick={() => setVariantCreateOpen(false)} aria-label="Bağla">
                  <X size={16} />
                </button>
              </header>
              <div className="admin-variant-modal-grid">
                <label className="admin-field">
                  <span>İl</span>
                  <span className="admin-field-control">
                    <input type="number" value={newVariantYear} onChange={(event) => setNewVariantYear(event.target.value)} placeholder="2023" />
                  </span>
                </label>
                <label className="admin-field">
                  <span>Başqa variantdan məlumatları kopyala</span>
                  <AdminSelect
                    value={String(copySourceIndex)}
                    onChange={(nextValue) => setCopySourceIndex(Number(nextValue))}
                    options={variantSlots.map((slot, index) => ({
                      value: String(index),
                      label: variantTitleParts(slot.variant, index).title,
                    }))}
                    label="Başqa variantdan məlumatları kopyala"
                  />
                </label>
                {suggestedPrice !== null ? (
                  <div className="admin-price-suggestion">
                    <span><WandSparkles size={16} /></span>
                    <div>
                      <strong>Təklif olunan başlanğıc qiymət: {suggestedPrice} ₼ / gün</strong>
                      <small>Mənbə qiymətindən təxminən 10% aşağı hesablandı. İstəsəniz Qiyməti kopyala seçimini yandırın.</small>
                    </div>
                  </div>
                ) : null}
                <div className="admin-variant-copy-options">
                  <label>
                    <input type="checkbox" checked={copyTechnical} onChange={(event) => setCopyTechnical(event.target.checked)} />
                    <span>Texniki məlumatları kopyala</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={copyServices} onChange={(event) => setCopyServices(event.target.checked)} />
                    <span>Xidmətləri kopyala</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={copyImages} onChange={(event) => setCopyImages(event.target.checked)} />
                    <span>Şəkilləri kopyala</span>
                  </label>
                  <label>
                    <input type="checkbox" checked={copyPricing} onChange={(event) => setCopyPricing(event.target.checked)} />
                    <span>Qiyməti kopyala</span>
                  </label>
                </div>
              </div>
              <footer>
                <button type="button" className="admin-secondary-button" onClick={() => setVariantCreateOpen(false)}>
                  Ləğv et
                </button>
                <button type="button" className="admin-primary-button" onClick={createVariantFromDialog}>
                  Variant yarat
                  <ArrowRight size={14} />
                </button>
              </footer>
            </section>
          </div>
        </AdminPortal>
      ) : null}
    </>
  );
}

function BlogEditorForm({
  formId,
  editor,
  activeTab,
  onTab,
  onSubmit,
}: {
  formId: string;
  editor: Extract<NonNullable<EditorState>, { type: "blog" }>;
  activeTab: BlogTab;
  onTab: (tab: BlogTab) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const blog = editor.blog;

  return (
    <>
      <nav className="admin-drawer-tabs">
        <TabButton value="general" active={activeTab} onClick={onTab}>Ümumi</TabButton>
        <TabButton value="content" active={activeTab} onClick={onTab}>Məzmun</TabButton>
        <TabButton value="media" active={activeTab} onClick={onTab}>Şəkillər</TabButton>
        <TabButton value="visibility" active={activeTab} onClick={onTab}>Görünürlük</TabButton>
      </nav>

      <form id={formId} onSubmit={onSubmit} className="admin-editor-form">
        <section className={`admin-tab-panel${activeTab === "general" ? "" : " is-hidden"}`}>
          <div className="admin-form-grid">
            <Field label="Başlıq" name="blogTitle" defaultValue={blog?.title} placeholder="Bakıda avtomobil seçimi" />
            <Field label="URL adı" name="blogSlug" defaultValue={blog?.slug} placeholder="bakida-avtomobil-secimi" />
            <Field label="Kateqoriya" name="blogCategory" defaultValue={blog?.category} placeholder="İcarə məsləhətləri" />
            <Field label="Tarix" name="blogDate" type="date" defaultValue={blog?.date} />
            <Field label="Oxu müddəti" name="blogReadingTime" defaultValue={blog?.readingTime} placeholder="5 dəq" />
            <Field label="Sıralama" name="blogSortOrder" type="number" defaultValue={blog?.sortOrder ?? editor.index + 1} />
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "content" ? "" : " is-hidden"}`}>
          <div className="admin-form-grid">
            <Field label="Kiçik üst yazı" name="blogEyebrow" defaultValue={blog?.eyebrow} placeholder="CARBON GUIDE" />
            <TextAreaField label="Qısa təsvir" name="blogDescription" rows={3} defaultValue={blog?.description} />
            <TextAreaField label="Giriş mətni" name="blogIntro" rows={4} defaultValue={blog?.intro} />
            <Field label="Bölmə başlığı" name="blogSectionHeading" defaultValue={blog?.sections[0]?.heading} placeholder="Nələri nəzərə almaq lazımdır?" />
            <TextAreaField label="Əsas məqalə mətni" name="blogBody" rows={10} placeholder="Abzasları boş sətirlə ayırın." defaultValue={blogBodyText(blog)} />
            <TextAreaField label="Sitat və ya vurğulu fikir" name="blogQuote" rows={3} defaultValue={blog?.sections[0]?.quote} />
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "media" ? "" : " is-hidden"}`}>
          <div className="admin-form-grid">
            <AdminImageField
              key={`blog-image-${blog?.slug ?? "new"}`}
              label="Məqalə örtük şəkli"
              name="blogImage"
              fileName="blogImageFile"
              defaultValue={blog?.image}
              title={blog?.title || "Blog şəkli"}
              ratio="cover"
            />
            <TextAreaField label="Əlavə şəkillər" name="blogImages" rows={5} placeholder="Hər sətrə bir şəkil URL-i yazın." defaultValue={blogImagesText(blog)} />
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "visibility" ? "" : " is-hidden"}`}>
          <div className="admin-toggle-row">
            <Toggle label="Saytda aktiv" name="blogIsActive" defaultChecked={blog?.isActive ?? true} description="Məqalə blog səhifəsində görünür." />
          </div>
        </section>
      </form>
    </>
  );
}

export default AdminDashboardClient;
