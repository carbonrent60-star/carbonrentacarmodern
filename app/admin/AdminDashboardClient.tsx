"use client";

import Image from "next/image";
import Link from "next/link";
import {
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
  SlidersHorizontal,
  Trash2,
  Upload,
  Users,
  X,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
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
  | "images"
  | "prices"
  | "variants"
  | "services"
  | "wedding";
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
        setEditor(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openCarEditor = (car?: AdminCar, index = cars.length) => {
    setCarTab("general");
    setEditor({ type: "car", mode: car ? "edit" : "create", car, index });
  };

  const openBlogEditor = (blog?: AdminBlogPost, index = blogs.length) => {
    setBlogTab("general");
    setEditor({ type: "blog", mode: blog ? "edit" : "create", blog, index });
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
                    onClick={() => setView(item.key)}
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

      {editor ? (
        <EditorDrawer
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
          onClose={() => setEditor(null)}
        />
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

const tutorialTopics = [
  "Avtomobil və variant fərqi",
  "Qiymətlər necə hesablanır?",
  "Transfer sistemi",
  "Toy avtomobilləri",
  "Şəkillərin idarəsi",
  "SEO və URL",
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

  const runGuideAction = () => {
    if (activeGuide.action === "new-car") {
      onNewCar();
      return;
    }

    onView(activeGuide.action);
  };

  return (
    <div className="admin-view admin-tutorial-view">
      <PageTitle
        eyebrow="TƏLİMAT"
        title="Nə etmək istəyirsiniz?"
        subtitle="Carbon idarə panelində işə başlamaq üçün bir əməliyyat seçin."
      />

      <label className="admin-tutorial-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Nə etmək istəyirsiniz? Məsələn, "qiymət dəyiş"'
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label="Axtarışı təmizlə">
            <X size={14} />
          </button>
        ) : null}
      </label>

      <section className="admin-help-section">
        <div className="admin-help-section-title">
          <p>POPULYAR ƏMƏLİYYATLAR</p>
        </div>
        <div className="admin-help-action-grid">
          {visibleGuides.map((guide) => {
            const Icon = guide.icon;

            return (
              <button
                key={guide.id}
                type="button"
                className={`admin-help-action-card${activeGuide.id === guide.id ? " is-active" : ""}`}
                onClick={() => setActiveGuideId(guide.id)}
              >
                <span><Icon size={22} /></span>
                <strong>{guide.shortTitle}</strong>
                <small>{guide.description}</small>
                <em>{guide.time}</em>
                <b>Başla <ChevronDown size={13} /></b>
              </button>
            );
          })}
        </div>
      </section>

      <section className="admin-help-layout">
        <article className="admin-guide-panel">
          <header>
            <div>
              <p>{activeGuide.title}</p>
              <h2>Addım 1 / {activeGuide.steps.length}</h2>
              <span>Təxminən {activeGuide.time}</span>
            </div>
            <button type="button" className="admin-primary-button" onClick={runGuideAction}>
              {activeGuide.cta}
              <ChevronsRight size={15} />
            </button>
          </header>

          <div className="admin-guide-steps">
            {activeGuide.steps.map((step, index) => (
              <article key={step.title} className="admin-guide-step">
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <TutorialMock type={step.visual} />
              </article>
            ))}
          </div>
        </article>

        <aside className="admin-onboarding-card">
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

      <section className="admin-carbon-model-card">
        <div>
          <p>CARBON NECƏ İŞLƏYİR?</p>
          <h2>Model, variant və xidmət eyni şey deyil</h2>
          <span><strong>Avtomobil</strong> modeli, <strong>variant</strong> onun il/versiyası, <strong>xidmət</strong> isə həmin variantın necə təklif olunduğudur.</span>
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

      <section className="admin-help-topics">
        <p>DİGƏR MÖVZULAR</p>
        <div>
          {tutorialTopics.map((topic) => (
            <button key={topic} type="button">
              {topic}
              <ChevronsRight size={14} />
            </button>
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

function EditorDrawer({
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
  onClose: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const formId = editor.type === "car" ? "admin-car-editor-form" : "admin-blog-editor-form";
  const title =
    editor.type === "car"
      ? editor.car?.title ?? "Yeni avtomobil"
      : editor.blog?.title ?? "Yeni məqalə";
  const subtitle = editor.type === "car" ? editor.car?.brand ?? "Carbon parkı" : "Carbon məqaləsi";
  const image = editor.type === "car" ? editor.car?.thumbnail : editor.blog?.image;
  const isEditing = editor.mode === "edit";
  const deleteTitle = editor.type === "car" ? "Avtomobili sil" : "Məqaləni sil";
  const deleteCopy =
    editor.type === "car"
      ? "Bu avtomobil idarə panelindən və bağlı siyahılardan silinəcək."
      : "Bu məqalə idarə panelindən və saytdakı blog siyahısından silinəcək.";
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDrawerError(null);
    setJustSaved(false);
    setIsSaving(true);

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

        onCarSaved(result.car);
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

      onBlogSaved(result.blog);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1800);
    } finally {
      setIsSaving(false);
    }
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
    <div className="admin-drawer-layer">
      <button type="button" className="admin-drawer-backdrop" onClick={onClose} aria-label="Redaktoru bağla" />
      <aside className="admin-drawer">
        <header className="admin-drawer-header">
          <span className="admin-drawer-thumb">
            {image ? <Image src={image} alt={title} fill sizes="64px" /> : editor.type === "car" ? <CarFront size={22} /> : <Newspaper size={22} />}
          </span>
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <StatusDot active={editor.type === "car" ? editor.car?.isActive : editor.blog?.isActive} />
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose}>
            <X size={17} />
          </button>
        </header>

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

        <footer className="admin-drawer-footer">
          {isEditing ? (
            <button
              type="button"
              className="admin-danger-button"
              onClick={() => setConfirmDelete(true)}
              disabled={isSaving || isDeleting}
            >
              <Trash2 size={15} />
              {deleteTitle}
            </button>
          ) : null}
          <button
            type="button"
            className="admin-secondary-button"
            onClick={onClose}
            disabled={isSaving || isDeleting}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            form={formId}
            className={`admin-primary-button${justSaved ? " is-saved" : ""}`}
            disabled={isSaving || isDeleting}
          >
            {justSaved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {isSaving
              ? "Saxlanılır..."
              : justSaved
                ? "Saxlanıldı"
                : "Dəyişiklikləri saxla"}
          </button>
        </footer>
      </aside>

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
    </div>
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
  const [variantCount, setVariantCount] = useState(initialVariantCount);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeHelp, setActiveHelp] = useState<"prices" | "variants" | null>(null);
  const selectedVariant = Math.min(selectedVariantIndex, variantCount - 1);

  return (
    <>
      <nav className="admin-drawer-tabs">
        <TabButton value="general" active={activeTab} onClick={onTab}>Ümumi</TabButton>
        <TabButton value="technical" active={activeTab} onClick={onTab}>Texniki</TabButton>
        <TabButton value="images" active={activeTab} onClick={onTab}>Şəkillər</TabButton>
        <TabButton value="prices" active={activeTab} onClick={onTab}>Qiymətlər</TabButton>
        <TabButton value="variants" active={activeTab} onClick={onTab}>Variantlar {variantCount}</TabButton>
        <TabButton value="services" active={activeTab} onClick={onTab}>Xidmətlər</TabButton>
        <TabButton value="wedding" active={activeTab} onClick={onTab}>Toy</TabButton>
      </nav>

      <form id={formId} onSubmit={onSubmit} className="admin-editor-form">
        <input name="id" type="hidden" defaultValue={car?.id ?? ""} />
        <input name="variantCount" type="hidden" value={variantCount} readOnly />

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

        <section className={`admin-tab-panel${activeTab === "prices" ? "" : " is-hidden"}`}>
          <div className="admin-mini-section">
            <div className="admin-section-heading">
              <h3>İcarə qiymətləri</h3>
              <button type="button" onClick={() => setActiveHelp(activeHelp === "prices" ? null : "prices")}>
                ?
              </button>
              {activeHelp === "prices" ? (
                <div className="admin-context-help">
                  <strong>Bu qiymət harada görünür?</strong>
                  <p>Əsas variantın 1-3 gün qiyməti avtomobil kartında başlanğıc qiymət kimi görünür. Digər aralıqlar rezervasiya müddəti seçiləndə istifadə olunur.</p>
                  <button type="button" onClick={() => setActiveHelp(null)}>Bağla</button>
                </div>
              ) : null}
            </div>
            <div className="admin-price-grid">
              {rentalPriceKeys.map((key) => (
                <PriceField key={key} label={rentalPriceLabels[key]} name={`rental_${key}`} defaultValue={car?.rentalPrices[key]} />
              ))}
            </div>
          </div>
          <div className="admin-mini-section">
            <h3>Transfer qiymətləri</h3>
            <div className="admin-price-grid">
              {transferPriceKeys.map((key) => (
                <PriceField key={key} label={transferPriceLabels[key]} name={`transfer_${key}`} defaultValue={car?.transferPrices[key]} />
              ))}
            </div>
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "variants" ? "" : " is-hidden"}`}>
          <div className="admin-variant-overview">
            <div>
              <div className="admin-section-heading">
                <h3>Variantlar</h3>
                <button type="button" onClick={() => setActiveHelp(activeHelp === "variants" ? null : "variants")}>
                  ?
                </button>
                {activeHelp === "variants" ? (
                  <div className="admin-context-help">
                    <strong>Variant nədir?</strong>
                    <p>Eyni avtomobil modelinin fərqli il və ya versiyasıdır. Məsələn, Hyundai Sonata modelində 2022 və 2024 ayrı variant ola bilər.</p>
                    <button type="button" onClick={() => setActiveHelp(null)}>Bağla</button>
                  </div>
                ) : null}
              </div>
              <p>
                Bu modelin fərqli il və versiyalarını idarə edin. Birinci sətir əsas variantdır və saytda əsas qiymət kimi görünür.
              </p>
            </div>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => {
                setSelectedVariantIndex(variantCount);
                setVariantCount((count) => count + 1);
              }}
            >
              <Plus size={14} />
              Variant əlavə et
            </button>
          </div>

          <div className="admin-variant-table">
            <div className="admin-variant-table-head">
              <span>Variant</span>
              <span>İl</span>
              <span>Mühərrik</span>
              <span>İcarə</span>
              <span>Transfer</span>
              <span>Toy</span>
              <span>Status</span>
            </div>

            {Array.from({ length: variantCount }, (_, index) => {
              const variant = formVariants[index];
              const isMainVariant = index === 0;
              const price = variantStartingPrice(variant);

              return (
                <button
                  key={`${car?.id ?? "new"}-variant-row-${index}`}
                  type="button"
                  className={`admin-variant-table-row${selectedVariant === index ? " is-active" : ""}`}
                  onClick={() => setSelectedVariantIndex(index)}
                >
                  <span>
                    <strong>{variantDisplayName(variant, index)}</strong>
                    {isMainVariant ? <small>Əsas</small> : null}
                  </span>
                  <span>{variant?.manufactureYear ?? "-"}</span>
                  <span>{variant?.engine ?? car?.engine ?? "-"}</span>
                  <span>{price !== null ? `${price} ₼-dan` : "-"}</span>
                  <span>{car?.transferAvailable ? "Aktiv" : "-"}</span>
                  <span>{car?.weddingAvailable ? "Aktiv" : "-"}</span>
                  <StatusDot active />
                </button>
              );
            })}
          </div>

          <div className="admin-variant-editors">
            {Array.from({ length: variantCount }, (_, index) => {
              const variant = formVariants[index];
              const isMainVariant = index === 0;

              return (
                <div
                  className={`admin-variant-card${selectedVariant === index ? "" : " is-hidden"}`}
                  key={`${car?.id ?? "new"}-variant-editor-${index}`}
                >
                  <input name={`variant_${index}_id`} type="hidden" defaultValue={variant?.id ?? ""} />

                  <div className="admin-variant-card-head">
                    <span>
                      <Rows3 size={14} />
                      {variantDisplayName(variant, index)}
                    </span>
                    {isMainVariant ? <small>Saytda əsas qiymət</small> : <small>Əlavə variant</small>}
                  </div>

                  <div className="admin-variant-subtabs">
                    <span>Ümumi</span>
                    <span>Texniki</span>
                    <span>Şəkillər</span>
                    <span>Xidmət qiymətləri</span>
                  </div>

                  {!isMainVariant ? (
                    <p className="admin-muted-copy">
                      Yalnız il və qiymət yazmaq kifayətdir. Boş saxlanan mühərrik, şəkil və texniki məlumatlar saytda əsas avtomobildən götürüləcək.
                    </p>
                  ) : null}

                  <div className="admin-form-grid">
                    <Field
                      label="Variant adı (istəyə bağlı)"
                      name={`variant_${index}_label`}
                      defaultValue={variant?.label}
                      placeholder="E 200 AMG"
                    />
                    <Field label="İl" name={`variant_${index}_manufactureYear`} type="number" defaultValue={variant?.manufactureYear} placeholder="2024" />
                    <Field label="Kuzov" name={`variant_${index}_bodyStyle`} defaultValue={variant?.bodyStyle} placeholder={isMainVariant ? "W214 / Sedan" : "Boş qalarsa əsas məlumat istifadə olunur"} />
                    <Field label="Mühərrik" name={`variant_${index}_engine`} defaultValue={variant?.engine} placeholder={isMainVariant ? "2.0 L" : car?.engine ?? "Boş qalarsa əsas məlumat istifadə olunur"} />
                    <Field
                      label={isMainVariant ? "Şəkil URL-i (boş olsa modelin əsas şəkli)" : "Variant şəkli (boş olsa modelin əsas şəkli)"}
                      name={`variant_${index}_thumbnail`}
                      defaultValue={variant?.thumbnail}
                      placeholder="https://..."
                      span
                    />
                  </div>

                  <div className="admin-price-grid">
                    {rentalPriceKeys.map((key) => (
                      <PriceField
                        key={key}
                        label={rentalPriceLabels[key]}
                        name={`variant_${index}_rental_${key}`}
                        defaultValue={variant?.rentalPrices[key]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "services" ? "" : " is-hidden"}`}>
          <div className="admin-toggle-row">
            <Toggle label="Saytda aktiv" name="isActive" defaultChecked={car?.isActive ?? true} description="Avtomobil saytda görünür." />
            <Toggle label="İcarədə göstər" name="rentalVisible" defaultChecked={car?.rentalVisible ?? true} description="İcarə siyahısında göstər." />
            <Toggle label="Transfer üçün aktiv" name="transferAvailable" defaultChecked={car?.transferAvailable} description="Transfer bölməsində istifadə et." />
            <Toggle label="Toy avtomobili" name="weddingAvailable" defaultChecked={car?.weddingAvailable} description="Toy kolleksiyasında göstər." />
          </div>
        </section>

        <section className={`admin-tab-panel${activeTab === "wedding" ? "" : " is-hidden"}`}>
          <div className="admin-form-grid">
            <PriceField label="Toy qiyməti" name="weddingPrice" defaultValue={car?.weddingPrice} />
            <TextAreaField label="Toy təsviri" name="weddingDescription" rows={5} defaultValue={car?.weddingDescription} />
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
