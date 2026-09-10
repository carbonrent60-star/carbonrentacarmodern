"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
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
  Trash2,
  Upload,
  Users,
  X,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { type FormEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteBlogInlineAction,
  deleteCarInlineAction,
  logoutAction,
  saveBlogInlineAction,
  saveCarInlineAction,
  seedBlogsAction,
  seedCarsAction,
} from "./actions";
import AdminImageField from "./AdminImageField";
import type { Car, CarVariant } from "@/data/cars";
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
  | "tutorial"
  | "settings";
type CarTab =
  | "general"
  | "technical"
  | "variants"
  | "images"
  | "services"
  | "description"
  | "seo";
type VariantEditorTab = "general" | "technical" | "images" | "services";
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
};

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

const categoryLabels: Record<string, string> = {
  Econom: "Ekonom",
  Comfort: "Komfort",
  Business: "Biznes",
  SUV: "SUV",
  Miniven: "Miniven",
  Sport: "Sport",
};

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
      { key: "tutorial", label: "Təlimat", icon: BadgeHelp },
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
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  span?: boolean;
}) {
  return (
    <label className={`admin-field${span ? " admin-field-span" : ""}`}>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
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

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: string[];
}) {
  const value = defaultValue ?? "";
  const optionSet = value && !options.includes(value) ? [value, ...options] : options;

  return (
    <label className="admin-field">
      <span>{label}</span>
      <select name={name} defaultValue={value}>
        {optionSet.map((option) => (
          <option key={option} value={option}>
            {categoryLabels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
  description,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  description?: string;
}) {
  return (
    <label className="admin-toggle">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
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
      {active === false ? "Gizli" : "Aktiv"}
    </span>
  );
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

function variantStartingPrice(variant?: Pick<CarVariant, "rentalPrices">) {
  if (!variant) {
    return null;
  }

  return (
    variant.rentalPrices.days1to3 ??
    variant.rentalPrices.days4to7 ??
    variant.rentalPrices.days8to15 ??
    variant.rentalPrices.days16to24 ??
    variant.rentalPrices.days25to30 ??
    variant.rentalPrices.days30plus
  );
}

function variantDisplayName(variant: Partial<CarVariant> | undefined, index: number) {
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
  alerts,
  flags,
}: {
  carsResult: CarsResult;
  blogsResult: BlogsResult;
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
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [editorReturnView, setEditorReturnView] = useState<ViewKey>("cars");
  const [editorDirty, setEditorDirty] = useState(false);
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
  const [toast, setToast] = useState<AdminToast | null>(null);

  const rentalCount = cars.filter((car) => car.rentalVisible !== false).length;
  const transferCars = cars.filter((car) => car.transferAvailable);
  const weddingCars = cars.filter(
    (car) => car.weddingAvailable && car.weddingPrice != null
  );
  const activeBlogCount = blogs.filter((blog) => blog.isActive !== false).length;

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
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
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

  const closeEditor = (nextView = editorReturnView) => {
    if (
      editorDirty &&
      !window.confirm(
        "Saxlanılmamış dəyişikliklər var.\n\nBu səhifədən çıxsanız etdiyiniz dəyişikliklər itiriləcək.",
      )
    ) {
      return;
    }

    setEditor(null);
    setEditorDirty(false);
    setView(nextView);
  };

  const upsertCar = (car: AdminCar) => {
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
      text: "Dəyişikliklər saytda yenilənir.",
    });
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
  };

  const removeCar = (id: string) => {
    setCars((items) => items.filter((item) => item.id !== id));
    setEditor(null);
    setToast({
      id: Date.now(),
      type: "success",
      title: "Avtomobil silindi",
    });
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
        const matchesQuery = !query
          ? true
          : [car.title, car.brand, car.category, car.slug, car.id].some((value) =>
              value?.toLowerCase().includes(query)
            );
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
    { label: "İcarəyə keç", hint: "Xidmət", run: () => setView("rental") },
    { label: "Transferlərə keç", hint: "Xidmət", run: () => setView("transfer") },
    { label: "Toy avtomobillərinə keç", hint: "Xidmət", run: () => setView("weddings") },
    { label: "Sayta bax", hint: "Carbon", run: () => window.open("/", "_blank") },
  ].filter((command) => command.label.toLowerCase().includes(commandQuery.toLowerCase()));

  return (
    <main className={`admin-app-shell${collapsed ? " is-sidebar-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand-lockup">
            <span>C</span>
            <div>
              <strong>CARBON</strong>
              <small>İdarə paneli</small>
            </div>
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
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" rel="noopener noreferrer" title={collapsed ? "Sayta bax" : undefined}>
            <ExternalLink size={16} />
            <span>Sayta bax</span>
          </Link>
          <form action={logoutAction} className="admin-user-card">
            <span className="admin-user-avatar">N</span>
            <span className="admin-user-copy">
              <strong>JS Carbon</strong>
              <small>Administrator</small>
            </span>
            <button type="submit" title={collapsed ? "Çıxış" : undefined}>
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
            <ShellButton onClick={() => undefined} title="Görünüş">
              <Moon size={16} />
            </ShellButton>
            <ShellButton onClick={() => undefined} title="Bildirişlər">
              <Bell size={16} />
            </ShellButton>
            <ShellButton onClick={() => setCollapsed((value) => !value)} title="Menyunu yığ">
              {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </ShellButton>
          </div>
        </header>

        <div className="admin-content">
          <Alerts alerts={alerts} flags={flags} />

          {editor ? (
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
          ) : (
            <>
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
                  onEditCar={openCarEditor}
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
                  onEdit={openCarEditor}
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
              {view === "tutorial" ? <TutorialView onView={setView} onNewCar={() => openCarEditor()} /> : null}
              {view === "settings" ? (
                <SettingsView carsResult={carsResult} blogsResult={blogsResult} />
              ) : null}
            </>
          )}
        </div>
      </section>

      {commandOpen ? (
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
      </span>

      <button type="button" onClick={onClose} aria-label="Bildirişi bağla">
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
  onEditCar: (car?: AdminCar, index?: number) => void;
}) {
  const recentCars = cars.slice(0, 5);

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
      </section>

      <div className="admin-overview-grid">
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
              <p>SÜRƏTLİ ƏMƏLİYYATLAR</p>
              <h2>Sürətli əməliyyatlar</h2>
            </div>
          </div>
          <div className="admin-quick-actions">
            <button type="button" onClick={onNewCar}><Plus size={16} /> Avtomobil əlavə et</button>
            <button type="button" onClick={onNewBlog}><Plus size={16} /> Blog yazısı yarat</button>
            <button type="button" onClick={() => onView("transfer")}><Plane size={16} /> Transferləri idarə et</button>
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
  onEdit: (car?: AdminCar, index?: number) => void;
}) {
  const categories = Array.from(new Set(allCars.map((car) => car.category)));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (service !== "all" ? 1 : 0);
  const activeCount = allCars.filter((car) => car.isActive !== false).length;
  const transferCount = allCars.filter((car) => car.transferAvailable).length;
  const weddingCount = allCars.filter((car) => car.weddingAvailable).length;
  const fleetStats = [
    { value: allCars.length, label: "Avtomobil", note: "+3 bu ay", icon: CarFront },
    { value: activeCount, label: "Aktiv", note: `${Math.round((activeCount / Math.max(allCars.length, 1)) * 100)}% park`, icon: Gauge },
    { value: transferCount, label: "Transfer", note: "Mövcuddur", icon: Plane },
    { value: weddingCount, label: "Toy", note: "Kolleksiya", icon: Heart },
  ];

  return (
    <div className="admin-view">
      <PageTitle
        eyebrow="AVTOMOBİL PARKI"
        title="Avtomobillər"
        subtitle={`${allCars.length} avtomobil · ${activeCount} aktiv`}
        action={
          <div className="admin-title-actions">
            <button type="button" className="admin-secondary-button">
              <Upload size={15} />
              Import
            </button>
            <button type="button" className="admin-primary-button" onClick={onNew}><Plus size={16} /> Yeni avtomobil</button>
          </div>
        }
      />

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
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Avtomobil, brend, ID və ya URL axtar..." />
          {query ? (
            <button type="button" onClick={() => onQuery("")} aria-label="Axtarışı təmizlə">
              <X size={14} />
            </button>
          ) : null}
        </label>

        <div className="admin-filter-shell">
          <button
            type="button"
            className={`admin-filter-button${filtersOpen ? " is-active" : ""}`}
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeFilterCount ? <span>{activeFilterCount}</span> : null}
          </button>
          {filtersOpen ? (
            <div className="admin-filter-popover">
              <label>
                <span>Kateqoriya</span>
                <select value={category} onChange={(event) => onCategory(event.target.value)}>
                  <option value="all">Hamısı</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>{categoryLabels[item] ?? item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Xidmət</span>
                <select value={service} onChange={(event) => onService(event.target.value)}>
                  <option value="all">Hamısı</option>
                  <option value="rental">İcarə</option>
                  <option value="transfer">Transfer</option>
                  <option value="wedding">Toy</option>
                </select>
              </label>
              <label>
                <span>Status</span>
                <select value={status} onChange={(event) => onStatus(event.target.value)}>
                  <option value="all">Hamısı</option>
                  <option value="active">Aktiv</option>
                  <option value="hidden">Deaktiv</option>
                </select>
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

        <select value={sortKey} onChange={(event) => onSort(event.target.value)}>
          <option value="sort">Ən köhnə</option>
          <option value="newest">Son əlavə edilən</option>
          <option value="title">A-Z</option>
          <option value="title-desc">Z-A</option>
          <option value="price">Qiymət ↑</option>
          <option value="price-desc">Qiymət ↓</option>
        </select>
        <div className="admin-segmented">
          <ShellButton active={layout === "list"} onClick={() => onLayout("list")} title="Siyahı görünüşü">
            <List size={15} />
          </ShellButton>
          <ShellButton active={layout === "grid"} onClick={() => onLayout("grid")} title="Kart görünüşü">
            <Grid2X2 size={15} />
          </ShellButton>
        </div>
      </div>

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
        <CarTable cars={cars} onEdit={onEdit} />
      ) : (
        <CarGrid cars={cars} onEdit={onEdit} />
      )}
    </div>
  );
}

function CarIdentity({ car, mode = "fleet" }: { car: AdminCar; mode?: CarTableMode }) {
  const image = displayImage(car, mode);

  return (
    <span className="admin-car-identity">
      <span className="admin-thumb">
        {image ? (
          <Image src={image} alt={car.title} fill sizes="52px" />
        ) : (
          <CarFront size={18} />
        )}
      </span>
      <span>
        <strong>{car.title}</strong>
        <small>{car.brand}</small>
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
    return <span className="admin-service-empty">—</span>;
  }

  return (
    <span className="admin-service-pills">
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
}: {
  cars: AdminCar[];
  onEdit: (car?: AdminCar, index?: number) => void;
  mode?: CarTableMode;
}) {
  return (
    <section className="admin-panel admin-table-panel">
      <div className="admin-table-head">
        <span>Avtomobil</span>
        <span>Variantlar</span>
        <span>Kateqoriya</span>
        <span>Xidmətlər</span>
        <span>Qiymət</span>
        <span>Status</span>
        <span />
      </div>
      <div className="admin-data-table">
        {cars.map((car, index) => (
          <button key={car.id} type="button" className="admin-table-row" onClick={() => onEdit(car, index)}>
            <CarIdentity car={car} mode={mode} />
            <span className="admin-variant-cell">
              <strong>{variantPriceLabel(car)}</strong>
              <small>{carVariantRange(car)}</small>
            </span>
            <span className="admin-category-cell">{categoryLabels[car.category] ?? car.category}</span>
            <ServicePills car={car} />
            <span className="admin-price-cell">{displayPrice(car, mode) ? `${displayPrice(car, mode)} ₼-dan` : "-"}</span>
            <StatusDot active={car.isActive} />
            <MoreHorizontal size={18} />
          </button>
        ))}
      </div>
    </section>
  );
}

function CarGrid({
  cars,
  onEdit,
}: {
  cars: AdminCar[];
  onEdit: (car?: AdminCar, index?: number) => void;
}) {
  return (
    <section className="admin-card-grid">
      {cars.map((car, index) => (
        <button key={car.id} type="button" className="admin-fleet-card" onClick={() => onEdit(car, index)}>
          <span className="admin-fleet-card-image">
            {car.thumbnail ? <Image src={car.thumbnail} alt={car.title} fill sizes="280px" /> : <CarFront size={24} />}
          </span>
          <span className="admin-fleet-card-body">
            <strong>{car.title}</strong>
            <small>
              {car.brand}
              {car.manufactureYear ? ` · ${car.manufactureYear}` : ""}
            </small>
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
  return (
    <div className="admin-view">
      <PageTitle eyebrow="XİDMƏTLƏR" title={title} subtitle={subtitle} />
      <section className="admin-panel admin-service-summary">
        <div className="admin-panel-title">
          <div>
            <p>{title.toLocaleUpperCase("az-AZ")}</p>
            <h2>{cars.length} avtomobil</h2>
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
  onCarSaved: (car: AdminCar) => void;
  onBlogSaved: (blog: AdminBlogPost) => void;
  onCarDeleted: (id: string) => void;
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
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const originalFormSignatureRef = useRef<string | null>(null);
  const formId = editor.type === "car" ? "admin-car-editor-form" : "admin-blog-editor-form";
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
    }

    const nextDirty = nextSignature !== originalFormSignatureRef.current;
    setDirty(nextDirty);

    if (nextDirty) {
      setJustSaved(false);
    }
  }, [getEditorForm]);

  useEffect(() => {
    originalFormSignatureRef.current = null;

    const frame = window.requestAnimationFrame(() => {
      updateDirtyFromForm();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [editor, formId, updateDirtyFromForm]);

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

  function requestClose() {
    onClose();
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDrawerError(null);
    setJustSaved(false);
    setIsSaving(true);

    const submittedSignature = editorFormSignature(event.currentTarget);
    const formData = new FormData(event.currentTarget);

    try {
      if (editor.type === "car") {
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
        onCarSaved(result.car);
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
      onBlogSaved(result.blog);
      setDirty(false);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1800);
    } finally {
      setIsSaving(false);
    }
  };
  const handleEditorFormMutation = (event: FormEvent<HTMLDivElement>) => {
    const form = (event.target as HTMLElement).closest("form");
    updateDirtyFromForm(form instanceof HTMLFormElement ? form : null);
  };
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

        onCarDeleted(result.id);
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
      <div className="admin-editor-breadcrumb">
        <button type="button" onClick={requestClose}>
          <ArrowRight size={14} />
          {editor.type === "car" ? "Avtomobillər" : "Blog"}
        </button>
        <span>/</span>
        <strong>{title}</strong>
      </div>

      <header className="admin-editor-hero">
        <div className="admin-editor-identity">
          <span className="admin-editor-thumb">
            {image ? <Image src={image} alt={title} fill sizes="96px" /> : editor.type === "car" ? <CarFront size={22} /> : <Newspaper size={22} />}
          </span>
          <div>
            <p>{editor.type === "car" ? "Vehicle workspace" : "Content workspace"}</p>
            <h1>{title}</h1>
            <div className="admin-editor-badges">
              <span>{subtitle}</span>
              {editor.type === "car" ? <span>{categoryLabels[editor.car?.category ?? ""] ?? editor.car?.category ?? "Model"}</span> : null}
              {editor.type === "car" ? <span>{variantCount} variant</span> : null}
              <span><StatusDot active={editor.type === "car" ? editor.car?.isActive : editor.blog?.isActive} /></span>
            </div>
          </div>
        </div>

        <div className="admin-editor-actions">
          {dirty ? <span className="admin-editor-dirty"><i /> Saxlanılmamış dəyişikliklər</span> : null}
          {editor.type === "car" ? (
            <button type="button" className="admin-secondary-button" onClick={() => setPreviewOpen(true)}>
              Preview
              <ExternalLink size={14} />
            </button>
          ) : null}
          {isEditing && publicHref.endsWith("/") === false ? (
            <Link href={publicHref} target="_blank" rel="noopener noreferrer" className="admin-secondary-button">
              Saytda bax
              <ExternalLink size={14} />
            </Link>
          ) : null}
          <button
            type="button"
            className="admin-secondary-button"
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
      </header>

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
      </div>

      {previewOpen ? (
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
      ) : null}
    </section>
  );
}

function TabButton<T extends string>({
  value,
  active,
  onClick,
  children,
}: {
  value: T;
  active: T;
  onClick: (value: T) => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={active === value ? "is-active" : ""} onClick={() => onClick(value)}>
      {children}
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
    | (Partial<CarVariant> & {
        rentalPrices?: Partial<Car["rentalPrices"]>;
      })
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
}: {
  formId: string;
  editor: Extract<NonNullable<EditorState>, { type: "car" }>;
  activeTab: CarTab;
  onTab: (tab: CarTab) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
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
      variant: formVariants[index],
    })),
  );
  const [variantEditorIndex, setVariantEditorIndex] = useState<number | null>(null);
  const [variantEditorTab, setVariantEditorTab] = useState<VariantEditorTab>("general");
  const variantCount = variantSlots.length;

  function addVariant() {
    const nextIndex = variantSlots.length;

    setVariantSlots((slots) => [
      ...slots,
      {
        key: `${car?.id ?? "new"}-new-variant-${Date.now()}`,
        variant: undefined,
      },
    ]);
    setVariantEditorTab("general");
    setVariantEditorIndex(nextIndex);
  }

  function removeVariant(index: number) {
    if (index === 0) {
      return;
    }

    setVariantSlots((slots) => slots.filter((_, slotIndex) => slotIndex !== index));
    setVariantEditorIndex(null);
  }

  return (
    <>
      <nav className="admin-drawer-tabs">
        <TabButton value="general" active={activeTab} onClick={onTab}>Ümumi</TabButton>
        <TabButton value="technical" active={activeTab} onClick={onTab}>Texniki</TabButton>
        <TabButton value="variants" active={activeTab} onClick={onTab}>Variantlar {variantCount}</TabButton>
        <TabButton value="images" active={activeTab} onClick={onTab}>Şəkillər</TabButton>
        <TabButton value="services" active={activeTab} onClick={onTab}>Xidmətlər</TabButton>
        <TabButton value="description" active={activeTab} onClick={onTab}>Təsvir</TabButton>
        <TabButton value="seo" active={activeTab} onClick={onTab}>SEO</TabButton>
      </nav>

      <form id={formId} onSubmit={onSubmit} className="admin-editor-form">
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
          <div className="admin-form-grid">
            <Field label="Model adı" name="title" defaultValue={car?.title} placeholder="Mercedes S Class" />
            <Field label="URL adı" name="slug" defaultValue={car?.slug} placeholder="mercedes-s-class" />
            <Field label="Brend" name="brand" defaultValue={car?.brand} placeholder="Mercedes-Benz" />
            <label className="admin-field">
              <span>Kateqoriya</span>
              <select name="category" defaultValue={car?.category ?? "Business"}>
                {carCategories.map((category) => (
                  <option key={category} value={category}>{categoryLabels[category] ?? category}</option>
                ))}
              </select>
            </label>
            <Field label="Sıralama" name="sortOrder" type="number" defaultValue={car?.sortOrder ?? editor.index + 1} />
            <Field label="Buraxılış ili" name="manufactureYear" type="number" defaultValue={car?.manufactureYear} placeholder="2024" />
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "technical" ? "" : " is-hidden"}`}>
          <div className="admin-form-grid">
            <Field label="Oturacaq sayı" name="seats" type="number" defaultValue={car?.seats} />
            <Field label="Baqaj" name="baggage" type="number" defaultValue={car?.baggage} />
            <Field label="Kiçik baqaj" name="smallBaggage" type="number" defaultValue={car?.smallBaggage} />
            <SelectField label="Yanacaq" name="fuel" defaultValue={car?.fuel ?? "Benzin"} options={["Benzin", "Dizel", "Hibrid", "Elektrik"]} />
            <Field label="Mühərrik" name="engine" defaultValue={car?.engine} placeholder="2.0" />
            <SelectField label="Sürətlər qutusu" name="transmission" defaultValue={car?.transmission ?? "Avtomat"} options={["Avtomat", "Mexanika"]} />
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "images" ? "" : " is-hidden"}`}>
          <div className="admin-form-grid">
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
        </section>

        <section className={`admin-tab-panel${activeTab === "variants" ? "" : " is-hidden"}`}>
          {variantEditorIndex === null ? (
            <>
              <div className="admin-clean-section-head">
                <div>
                  <h2>Variantlar</h2>
                  <p>{car?.title ?? "Bu model"} üçün {variantCount} versiya</p>
                </div>
                <button type="button" className="admin-secondary-button" onClick={addVariant}>
                  <Plus size={14} />
                  Variant əlavə et
                </button>
              </div>

              <div className="admin-variant-card-grid">
                {variantSlots.map((slot, index) => {
                  const variant = slot.variant;
                  const isMainVariant = index === 0;
                  const price = variantStartingPrice(variant);

                  return (
                    <button
                      key={`${slot.key}-card`}
                      type="button"
                      className="admin-variant-object-card"
                      onClick={() => {
                        setVariantEditorTab("general");
                        setVariantEditorIndex(index);
                      }}
                    >
                      <span>{isMainVariant ? "★ ƏSAS" : "VARIANT"}</span>
                      <strong>{variant?.manufactureYear ?? car?.manufactureYear ?? "İl"}</strong>
                      <small>{variant?.label && variant.label !== String(variant?.manufactureYear) ? variant.label : car?.title ?? "Yeni variant"}</small>
                      <em>{[variant?.engine ?? car?.engine, car?.transmission, car?.fuel].filter(Boolean).join(" · ") || "Texniki məlumat yoxdur"}</em>
                      <i>
                        {car?.rentalVisible !== false ? <span>İcarə</span> : null}
                        {car?.transferAvailable ? <span>Transfer</span> : null}
                        {car?.weddingAvailable ? <span>Toy</span> : null}
                      </i>
                      <b>{price !== null ? `${price} ₼-dan` : "Qiymət yoxdur"}</b>
                      <ArrowRight size={16} />
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="admin-variant-workspace">
              {variantSlots.map((slot, index) => {
                if (index !== variantEditorIndex) return null;

                const variant = slot.variant;
                const isMainVariant = index === 0;

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
                        <h2>{variantDisplayName(variant, index)}</h2>
                      </div>
                      {isMainVariant ? <span>★ Əsas variant</span> : null}
                    </div>

	                    <div className="admin-variant-subtabs">
	                      {[
	                        ["general", "Ümumi"],
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

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "general" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Ümumi məlumat</h2>
	                            <p>Variantın ilini və public adını idarə edin.</p>
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
	                          <Field label="Variant adı" name={`variant_${index}_label`} defaultValue={variant?.label ?? (index === 0 && car?.manufactureYear ? String(car.manufactureYear) : undefined)} placeholder="E 200" />
	                        </div>
		                    </div>

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "technical" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Texniki fərqlər</h2>
	                            <p>Bu versiyanın mühərrik və kuzov fərqlərini ayrıca saxlayın.</p>
	                          </div>
	                        </div>
	                        <div className="admin-form-grid admin-form-grid-comfort">
	                          <Field label="Nəsil / kuzov" name={`variant_${index}_bodyStyle`} defaultValue={variant?.bodyStyle} placeholder="W214 / Sedan" />
	                          <Field label="Mühərrik" name={`variant_${index}_engine`} defaultValue={variant?.engine ?? (index === 0 ? car?.engine : undefined)} placeholder={car?.engine ?? "2.0 L"} />
	                        </div>
		                    </div>

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "images" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Variant şəkli</h2>
	                            <p>Bu il və versiya üçün ayrıca PNG və ya şəkil linki əlavə edin.</p>
	                          </div>
	                        </div>
	                        <div className="admin-form-grid admin-form-grid-comfort">
	                          <Field
	                            label="Variant şəkli"
	                            name={`variant_${index}_thumbnail`}
	                            defaultValue={variant?.thumbnail}
	                            placeholder="https://..."
	                            span
	                          />
	                        </div>
		                    </div>

		                    <div className={`admin-variant-workspace-panel${variantEditorTab === "services" ? "" : " is-hidden"}`}>
	                        <div className="admin-clean-section-head">
	                          <div>
	                            <h2>Variant qiymətləri</h2>
	                            <p>Bu versiyanın icarə qiymətlərini əsas modeldən fərqli yazın.</p>
	                          </div>
	                        </div>
	                        <div className="admin-price-grid">
	                          {rentalPriceKeys.map((key) => (
	                            <PriceField
	                              key={key}
	                              label={rentalPriceLabels[key]}
	                              name={`variant_${index}_rental_${key}`}
	                              defaultValue={variant?.rentalPrices[key] ?? (index === 0 ? car?.rentalPrices[key] : undefined)}
	                            />
	                          ))}
	                        </div>
	                        <p className="admin-variant-service-note">Transfer və toy qiymətləri hələlik model səviyyəsində saxlanır. İcarə qiymətləri isə hər variant üçün ayrıca işləyir.</p>
		                    </div>
	                  </section>
                );
              })}
            </div>
          )}
        </section>

        <section className={`admin-tab-panel${activeTab === "services" ? "" : " is-hidden"}`}>
          <div className="admin-service-card-grid">
            <Toggle label="Saytda aktiv" name="isActive" defaultChecked={car?.isActive ?? true} description="Avtomobil saytda görünür." />
            <Toggle label="İcarədə göstər" name="rentalVisible" defaultChecked={car?.rentalVisible ?? true} description="İcarə siyahısında göstər." />
            <Toggle label="Transfer üçün aktiv" name="transferAvailable" defaultChecked={car?.transferAvailable} description="Transfer bölməsində istifadə et." />
            <Toggle label="Toy avtomobili" name="weddingAvailable" defaultChecked={car?.weddingAvailable} description="Toy kolleksiyasında göstər." />
          </div>

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
