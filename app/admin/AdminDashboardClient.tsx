"use client";

import Image from "next/image";
import Link from "next/link";
import {
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
  Newspaper,
  Plane,
  Plus,
  Rows3,
  Save,
  Search,
  Settings,
  Trash2,
  X,
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
import type { Car } from "@/data/cars";
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

type ViewKey = "overview" | "cars" | "transfer" | "weddings" | "blog" | "media" | "settings";
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
      { key: "transfer", label: "Transfer", icon: Plane },
      { key: "weddings", label: "Toy avtomobilləri", icon: Heart },
    ],
  },
  {
    label: "MƏZMUN",
    items: [
      { key: "blog", label: "Blog", icon: Newspaper },
      { key: "media", label: "Şəkillər", icon: Images },
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

function carServices(car: AdminCar) {
  return [
    car.rentalVisible !== false ? "İcarə" : null,
    car.transferAvailable ? "Transfer" : null,
    car.weddingAvailable ? "Toy" : null,
  ].filter(Boolean) as string[];
}

function variantPriceLabel(car: AdminCar) {
  const count = car.variants?.length ?? 0;

  return count ? `${count} variant` : "Variant yoxdur";
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
  const [sortKey, setSortKey] = useState("sort");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [cars, setCars] = useState(() => carsResult.cars);
  const [blogs, setBlogs] = useState(() => blogsResult.blogs);
  const [localNotice, setLocalNotice] = useState<string | null>(null);

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
    setLocalNotice("Avtomobil yadda saxlanıldı.");
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
    setLocalNotice("Blog məqaləsi yadda saxlanıldı.");
  };

  const removeCar = (id: string) => {
    setCars((items) => items.filter((item) => item.id !== id));
    setEditor(null);
    setLocalNotice("Avtomobil silindi.");
  };

  const removeBlog = (slug: string) => {
    setBlogs((items) => items.filter((item) => item.slug !== slug));
    setEditor(null);
    setLocalNotice("Blog məqaləsi silindi.");
  };

  const filteredCars = useMemo(() => {
    const query = carQuery.trim().toLowerCase();

    return cars
      .filter((car) => {
        const matchesQuery = !query
          ? true
          : [car.title, car.brand, car.category, car.slug].some((value) =>
              value?.toLowerCase().includes(query)
            );
        const matchesCategory = categoryFilter === "all" || car.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" ? car.isActive !== false : car.isActive === false);

        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortKey === "title") {
          return a.title.localeCompare(b.title);
        }

        if (sortKey === "price") {
          return (startPrice(a) ?? 0) - (startPrice(b) ?? 0);
        }

        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });
  }, [cars, carQuery, categoryFilter, statusFilter, sortKey]);

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
          <form action={logoutAction}>
            <button type="submit" title={collapsed ? "Çıxış" : undefined}>
              <LogOut size={16} />
              <span>Çıxış</span>
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
            <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-secondary-button">
              Sayta bax
              <ExternalLink size={14} />
            </Link>
            <ShellButton onClick={() => setCollapsed((value) => !value)} title="Menyunu yığ">
              {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </ShellButton>
          </div>
        </header>

        <div className="admin-content">
          <Alerts alerts={alerts} flags={flags} />
          {localNotice ? (
            <div className="admin-alert admin-alert-success">
              {localNotice}
            </div>
          ) : null}

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
              sortKey={sortKey}
              layout={layout}
              onQuery={setCarQuery}
              onCategory={setCategoryFilter}
              onStatus={setStatusFilter}
              onSort={setSortKey}
              onLayout={setLayout}
              onNew={() => openCarEditor()}
              onEdit={openCarEditor}
            />
          ) : null}

          {view === "transfer" ? (
            <ServiceCarsView
              title="Transfer"
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
          onClose={() => setEditor(null)}
        />
      ) : null}
    </main>
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
  sortKey,
  layout,
  onQuery,
  onCategory,
  onStatus,
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
  sortKey: string;
  layout: "list" | "grid";
  onQuery: (value: string) => void;
  onCategory: (value: string) => void;
  onStatus: (value: string) => void;
  onSort: (value: string) => void;
  onLayout: (value: "list" | "grid") => void;
  onNew: () => void;
  onEdit: (car?: AdminCar, index?: number) => void;
}) {
  const categories = Array.from(new Set(allCars.map((car) => car.category)));

  return (
    <div className="admin-view">
      <PageTitle
        eyebrow="AVTOMOBİL PARKI"
        title="Avtomobillər"
        subtitle="Avtomobil parkını idarə edin"
        action={<button type="button" className="admin-primary-button" onClick={onNew}><Plus size={16} /> Yeni avtomobil</button>}
      />

      <div className="admin-toolbar">
        <label className="admin-search-field">
          <Search size={15} />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Avtomobil axtar..." />
          {query ? (
            <button type="button" onClick={() => onQuery("")} aria-label="Axtarışı təmizlə">
              <X size={14} />
            </button>
          ) : null}
        </label>
        <select value={category} onChange={(event) => onCategory(event.target.value)}>
          <option value="all">Bütün kateqoriyalar</option>
          {categories.map((item) => (
            <option key={item} value={item}>{categoryLabels[item] ?? item}</option>
          ))}
        </select>
        <select value={status} onChange={(event) => onStatus(event.target.value)}>
          <option value="all">Status</option>
          <option value="active">Aktiv</option>
          <option value="hidden">Gizli</option>
        </select>
        <select value={sortKey} onChange={(event) => onSort(event.target.value)}>
          <option value="sort">Sırala</option>
          <option value="title">Ada görə</option>
          <option value="price">Qiymətə görə</option>
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
        <small>
          {car.brand}
          {car.manufactureYear ? ` · ${car.manufactureYear}` : ""}
        </small>
      </span>
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
        <span>Kateqoriya</span>
        <span>İl</span>
        <span>{mode === "wedding" ? "Toy" : "İcarə"}</span>
        <span>Variantlar</span>
        <span>Xidmətlər</span>
        <span>Status</span>
        <span />
      </div>
      <div className="admin-data-table">
        {cars.map((car, index) => (
          <button key={car.id} type="button" className="admin-table-row" onClick={() => onEdit(car, index)}>
            <CarIdentity car={car} mode={mode} />
            <span>{categoryLabels[car.category] ?? car.category}</span>
            <span>{car.manufactureYear ?? "-"}</span>
            <span>{displayPrice(car, mode) ? `${displayPrice(car, mode)} ₼` : "-"}</span>
            <span>{variantPriceLabel(car)}</span>
            <span className="admin-service-list">{carServices(car).join(", ") || "-"}</span>
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
  onClose: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (editor.type === "car") {
        const result = await saveCarInlineAction(formData);

        if (!result.ok) {
          setDrawerError(adminClientMessage(result.error));
          return;
        }

        onCarSaved(result.car);
        return;
      }

      const result = await saveBlogInlineAction(formData);

      if (!result.ok) {
        setDrawerError(adminClientMessage(result.error));
        return;
      }

      onBlogSaved(result.blog);
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
          setDrawerError(adminClientMessage("database-delete-failed"));
          return;
        }

        const result = await deleteCarInlineAction(id);

        if (!result.ok) {
          setDrawerError(adminClientMessage(result.error));
          return;
        }

        onCarDeleted(result.id);
        return;
      }

      const slug = editor.blog?.slug;

      if (!slug) {
        setDrawerError(adminClientMessage("database-delete-failed"));
        return;
      }

      const result = await deleteBlogInlineAction(slug);

      if (!result.ok) {
        setDrawerError(adminClientMessage(result.error));
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
            className="admin-primary-button"
            disabled={isSaving || isDeleting}
          >
            <Save size={15} />
            {isSaving ? "Saxlanılır..." : "Dəyişiklikləri saxla"}
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
  const initialVariantCount = Math.max(car?.variants?.length ?? 0, 1);
  const [variantCount, setVariantCount] = useState(initialVariantCount);

  return (
    <>
      <nav className="admin-drawer-tabs">
        <TabButton value="general" active={activeTab} onClick={onTab}>Ümumi</TabButton>
        <TabButton value="technical" active={activeTab} onClick={onTab}>Texniki</TabButton>
        <TabButton value="images" active={activeTab} onClick={onTab}>Şəkillər</TabButton>
        <TabButton value="prices" active={activeTab} onClick={onTab}>Qiymətlər</TabButton>
        <TabButton value="variants" active={activeTab} onClick={onTab}>Variantlar</TabButton>
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
            <h3>İcarə qiymətləri</h3>
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
          <div className="admin-mini-section">
            <h3>İl / kuzov variantları</h3>
            <p className="admin-muted-copy">
              Eyni modelin fərqli il, kuzov və qiymətlərini əlavə edin. Boş variantlar saxlanılmayacaq.
            </p>
          </div>

          {Array.from({ length: variantCount }, (_, index) => {
            const variant = car?.variants?.[index];

            return (
              <div className="admin-variant-card" key={`${car?.id ?? "new"}-${index}`}>
                <input name={`variant_${index}_id`} type="hidden" defaultValue={variant?.id ?? ""} />

                <div className="admin-variant-card-head">
                  <span>
                    <Rows3 size={14} />
                    Variant {index + 1}
                  </span>
                </div>

                <div className="admin-form-grid">
                  <Field label="Variant adı" name={`variant_${index}_label`} defaultValue={variant?.label} placeholder="W213 Facelift" />
                  <Field label="İl" name={`variant_${index}_manufactureYear`} type="number" defaultValue={variant?.manufactureYear} placeholder="2021" />
                  <Field label="Kuzov" name={`variant_${index}_bodyStyle`} defaultValue={variant?.bodyStyle} placeholder="W213 / F10 / SUV" />
                  <Field label="Mühərrik" name={`variant_${index}_engine`} defaultValue={variant?.engine} placeholder="2.0" />
                  <Field
                    label="Variant şəkli (boş olsa əsas şəkil)"
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

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => setVariantCount((count) => count + 1)}
          >
            <Plus size={14} />
            Variant əlavə et
          </button>
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
