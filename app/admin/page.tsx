import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarHeart,
  CarFront,
  ChevronDown,
  Database,
  Eye,
  Gauge,
  ImageUp,
  KeyRound,
  LogOut,
  MapPinned,
  Newspaper,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import "./admin.css";
import {
  deleteCarAction,
  deleteBlogAction,
  isAdminAuthenticated,
  listAdminBlogs,
  listAdminCars,
  loginAction,
  logoutAction,
  saveBlogAction,
  saveCarAction,
  seedBlogsAction,
  seedCarsAction,
} from "./actions";
import {
  carCategories,
  rentalPriceKeys,
  transferPriceKeys,
} from "@/lib/supabase/cars";
import { createPageMetadata } from "@/lib/seo";
import type { Car } from "@/data/cars";
import type { AdminBlogPost } from "@/lib/supabase/blogs";
import AdminImageField from "./AdminImageField";

type AdminCar = Car & {
  isActive?: boolean;
  sortOrder?: number;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Carbon İdarə Paneli",
  description:
    "Carbon Rent A Car idarə paneli. Avtomobillər, şəkillər, qiymətlər və blog məzmunu üçün məxfi idarəetmə sahəsi.",
  path: "/admin",
  noIndex: true,
});

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

const categoryLabels: Record<string, string> = {
  Econom: "Ekonom",
  Comfort: "Komfort",
  Business: "Biznes",
  SUV: "SUV",
  Miniven: "Miniven",
  Sport: "Sport",
};

const adminErrorMessages: Record<string, string> = {
  "missing-admin-env": "Əvvəlcə ADMIN_PASSWORD əlavə edin.",
  "wrong-password": "Şifrə düzgün deyil.",
  "missing-supabase-admin-env":
    "Supabase server məlumatları tapılmadı. SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY dəyərlərini yoxlayın.",
  "image-too-large": "Şəkil çox böyükdür. Maksimum 50 MB ölçülü şəkil yükləyin.",
  "image-upload-failed":
    "Şəkil yüklənmədi. Supabase Storage bucket və icazələrini yoxlayın.",
  "required-fields-missing": "Model adı, URL adı və brend sahələri mütləq doldurulmalıdır.",
  "image-required": "Avtomobil üçün əsas şəkil URL əlavə edin və ya şəkil yükləyin.",
  "blog-body-required": "Məqalə mətni boş ola bilməz.",
  "blog-table-missing":
    "Supabase-də blog_posts cədvəli yaradılmayıb. supabase/migrations içindəki blog cədvəli SQL-ni Supabase SQL Editor-da bir dəfə işlədin.",
  "database-save-failed": "Məlumat bazaya yazılmadı. Supabase cədvəlini və açarları yoxlayın.",
  "database-delete-failed": "Avtomobil silinmədi. Supabase bağlantısını yoxlayın.",
  "unknown-error": "Gözlənilməyən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
};

function getAdminErrorMessage(error?: string | string[]) {
  const code = Array.isArray(error) ? error[0] : error;

  if (!code) {
    return null;
  }

  return adminErrorMessages[code] ?? adminErrorMessages["unknown-error"];
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
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

function ButtonIcon({ children }: { children: ReactNode }) {
  return <span className="admin-button-icon">{children}</span>;
}

function FormSection({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-form-section">
      <div className="admin-form-section-head">
        <span>{eyebrow}</span>
        <h3>{title}</h3>
        <i>{icon}</i>
      </div>
      {children}
    </section>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="admin-toggle">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

function CarForm({
  car,
  index,
  mode,
}: {
  car?: AdminCar;
  index: number;
  mode: "create" | "edit";
}) {
  const title = car?.title ?? "";
  const thumbnail = car?.thumbnail ?? "";
  const displayPrice =
    car?.rentalPrices.days1to3 ??
    car?.rentalPrices.days4to7 ??
    car?.rentalPrices.days8to15 ??
    car?.rentalPrices.days16to24 ??
    car?.rentalPrices.days25to30 ??
    car?.rentalPrices.days30plus ??
    car?.weddingPrice ??
    null;

  return (
    <form action={saveCarAction} className="admin-car-form">
      <input name="id" type="hidden" defaultValue={car?.id ?? ""} />

      <div className="admin-editor-layout">
        <aside className="admin-showroom">
          <div className="admin-showroom-grid" />
          <div className="admin-showroom-top">
            <span><i /> SEÇİLMİŞ AVTOMOBİL</span>
            <small>{categoryLabels[car?.category ?? ""] ?? "KATEQORİYA"}</small>
          </div>
          <strong className="admin-showroom-word">CARBON</strong>
          <div className="admin-showroom-image">
            {thumbnail ? (
              <Image src={thumbnail} alt={title || "Car image"} fill sizes="(max-width: 900px) 100vw, 390px" />
            ) : (
              <ImageUp size={38} strokeWidth={1.4} />
            )}
          </div>
          <div className="admin-showroom-bottom">
            <span>{title || "Yeni Carbon avtomobili"}</span>
            <b>{displayPrice ? `${displayPrice} ₼` : "Qiymət yoxdur"}</b>
          </div>
        </aside>

        <div className="admin-editor-main">
          <FormSection eyebrow="01 / ƏSAS" title="Saytda görünən məlumatlar" icon={<CarFront size={18} />}>
            <div className="admin-form-grid">
              <Field label="Model adı" name="title" defaultValue={title} placeholder="Mercedes S Class" />
              <Field label="URL adı" name="slug" defaultValue={car?.slug} placeholder="mercedes-s-class" />
              <Field label="Brend" name="brand" defaultValue={car?.brand} placeholder="Mercedes-Benz" />
              <label className="admin-field">
                <span>Kateqoriya</span>
                <select name="category" defaultValue={car?.category ?? "Business"}>
                  {carCategories.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category] ?? category}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Sıralama" name="sortOrder" type="number" defaultValue={car?.sortOrder ?? index + 1} />
            </div>
          </FormSection>

          <FormSection eyebrow="02 / TEXNİKİ" title="Komfort və göstəricilər" icon={<Settings2 size={18} />}>
            <div className="admin-spec-grid">
              <Field label="Oturacaq" name="seats" type="number" defaultValue={car?.seats} />
              <Field label="Baqaj" name="baggage" type="number" defaultValue={car?.baggage} />
              <Field
                label="Kiçik baqaj"
                name="smallBaggage"
                type="number"
                defaultValue={car?.smallBaggage}
              />
              <SelectField
                label="Yanacaq"
                name="fuel"
                defaultValue={car?.fuel ?? "Benzin"}
                options={["Benzin", "Dizel", "Hibrid", "Elektrik"]}
              />
              <Field label="Mühərrik" name="engine" defaultValue={car?.engine} placeholder="2.0" />
              <SelectField
                label="Sürətlər qutusu"
                name="transmission"
                defaultValue={car?.transmission ?? "Avtomat"}
                options={["Avtomat", "Mexanika"]}
              />
            </div>
          </FormSection>

          <FormSection eyebrow="03 / ŞƏKİLLƏR" title="Saytda istifadə olunan şəkillər" icon={<ImageUp size={18} />}>
            <div className="admin-media-grid">
              <AdminImageField
                label="Əsas şəkil"
                name="thumbnail"
                fileName="imageFile"
                defaultValue={thumbnail}
                title={title || "Avtomobil şəkli"}
              />
              <Field
                label="Toy şəkli URL"
                name="weddingThumbnail"
                defaultValue={car?.weddingThumbnail}
              />
            </div>
          </FormSection>

          <FormSection eyebrow="04 / GÖRÜNÜRLÜK" title="Avtomobil harada görünsün" icon={<Eye size={18} />}>
            <div className="admin-toggle-row">
              <Toggle label="Saytda aktiv" name="isActive" defaultChecked={car?.isActive ?? true} />
              <Toggle label="İcarədə görünsün" name="rentalVisible" defaultChecked={car?.rentalVisible ?? true} />
              <Toggle label="Transfer avtomobili" name="transferAvailable" defaultChecked={car?.transferAvailable} />
              <Toggle label="Toy avtomobili" name="weddingAvailable" defaultChecked={car?.weddingAvailable} />
            </div>
          </FormSection>

          <FormSection eyebrow="05 / İCARƏ" title="Günlük icarə qiymətləri" icon={<Gauge size={18} />}>
            <div className="admin-price-grid admin-price-grid-single">
              {rentalPriceKeys.map((key) => (
                <Field
                  key={key}
                  label={rentalPriceLabels[key]}
                  name={`rental_${key}`}
                  type="number"
                  defaultValue={car?.rentalPrices[key]}
                />
              ))}
            </div>
          </FormSection>

          <FormSection eyebrow="06 / TRANSFER" title="Marşrut üzrə transfer qiymətləri" icon={<MapPinned size={18} />}>
            <div className="admin-price-grid">
              {transferPriceKeys.map((key) => (
                <Field
                  key={key}
                  label={transferPriceLabels[key]}
                  name={`transfer_${key}`}
                  type="number"
                  defaultValue={car?.transferPrices[key]}
                />
              ))}
            </div>
          </FormSection>

          <FormSection eyebrow="07 / TOY" title="Xüsusi gün məlumatları" icon={<CalendarHeart size={18} />}>
            <div className="admin-form-grid admin-form-grid-wide">
              <Field
                label="Toy qiyməti"
                name="weddingPrice"
                type="number"
                defaultValue={car?.weddingPrice}
              />
              <label className="admin-field admin-field-span">
                <span>Toy təsviri</span>
                <textarea
                  name="weddingDescription"
                  rows={4}
                  defaultValue={car?.weddingDescription ?? ""}
                />
              </label>
            </div>
          </FormSection>
        </div>
      </div>

      <div className="admin-actions">
        <button type="submit" className="admin-primary-button">
          <ButtonIcon>{mode === "create" ? <Plus size={16} /> : <Save size={16} />}</ButtonIcon>
          {mode === "create" ? "Avtomobil əlavə et" : "Dəyişiklikləri saxla"}
        </button>
      </div>
    </form>
  );
}

function CarSummary({
  car,
  index,
}: {
  car: AdminCar;
  index: number;
}) {
  return (
    <summary>
      <span>{String(index + 1).padStart(2, "0")}</span>
      {car.thumbnail ? (
        <Image src={car.thumbnail} alt={car.title} width={130} height={80} />
      ) : (
        <i className="admin-car-placeholder">
          <CarFront size={22} />
        </i>
      )}
      <div>
        <strong>{car.title}</strong>
        <em>{car.brand}</em>
      </div>
      <div className="admin-card-tags">
        <i>{categoryLabels[car.category] ?? car.category}</i>
        {car.rentalVisible !== false ? <i>İcarə</i> : null}
        {car.transferAvailable ? <i>Transfer</i> : null}
        {car.weddingAvailable ? <i>Toy</i> : null}
      </div>
      <b className="admin-edit-pill">
        Redaktə et
        <ChevronDown size={14} />
      </b>
    </summary>
  );
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

function BlogForm({
  blog,
  index,
  mode,
}: {
  blog?: AdminBlogPost;
  index: number;
  mode: "create" | "edit";
}) {
  const cover = blog?.image ?? "";

  return (
    <form action={saveBlogAction} className="admin-car-form admin-blog-form">
      <div className="admin-blog-layout">
        <aside className="admin-blog-preview">
          <div className="admin-showroom-grid" />
          <span className="admin-blog-preview-kicker">CARBON BLOG</span>
          <strong>{blog?.title || "Yeni məqalə"}</strong>
          <p>{blog?.description || "Məqalə təsviri burada görünəcək."}</p>
          <div className="admin-blog-preview-image">
            {cover ? (
              <Image src={cover} alt={blog?.title || "Blog image"} fill sizes="(max-width: 900px) 100vw, 360px" />
            ) : (
              <Newspaper size={42} strokeWidth={1.35} />
            )}
          </div>
          <div className="admin-blog-preview-meta">
            <span>{blog?.category || "Kateqoriya"}</span>
            <span>{blog?.readingTime || "Oxu vaxtı"}</span>
          </div>
        </aside>

        <div className="admin-editor-main">
          <FormSection eyebrow="01 / MƏQALƏ" title="Blog kartı və URL məlumatları" icon={<Newspaper size={18} />}>
            <div className="admin-form-grid">
              <Field label="Başlıq" name="blogTitle" defaultValue={blog?.title} placeholder="Bakıda avtomobil seçimi" />
              <Field label="URL adı" name="blogSlug" defaultValue={blog?.slug} placeholder="bakida-avtomobil-secimi" />
              <Field label="Kateqoriya" name="blogCategory" defaultValue={blog?.category} placeholder="İcarə məsləhətləri" />
              <Field label="Tarix" name="blogDate" type="date" defaultValue={blog?.date} />
              <Field label="Oxu vaxtı" name="blogReadingTime" defaultValue={blog?.readingTime} placeholder="5 dəq" />
              <Field label="Sıralama" name="blogSortOrder" type="number" defaultValue={blog?.sortOrder ?? index + 1} />
            </div>
          </FormSection>

          <FormSection eyebrow="02 / MƏZMUN" title="Məqalənin əsas mətni" icon={<Sparkles size={18} />}>
            <div className="admin-blog-copy-grid">
              <Field label="Kiçik üst yazı" name="blogEyebrow" defaultValue={blog?.eyebrow} placeholder="CARBON GUIDE" />
              <label className="admin-field">
                <span>Qısa təsvir</span>
                <textarea name="blogDescription" rows={3} defaultValue={blog?.description ?? ""} />
              </label>
              <label className="admin-field admin-field-span">
                <span>Giriş mətni</span>
                <textarea name="blogIntro" rows={4} defaultValue={blog?.intro ?? ""} />
              </label>
              <Field
                label="Bölmə başlığı"
                name="blogSectionHeading"
                defaultValue={blog?.sections[0]?.heading}
                placeholder="Nələri nəzərə almaq lazımdır?"
              />
              <label className="admin-field admin-field-span admin-textarea-large">
                <span>Əsas məqalə mətni</span>
                <textarea
                  name="blogBody"
                  rows={10}
                  placeholder="Abzasları boş sətirlə ayırın."
                  defaultValue={blogBodyText(blog)}
                />
              </label>
              <label className="admin-field admin-field-span">
                <span>Sitat və ya vurğulu fikir</span>
                <textarea name="blogQuote" rows={3} defaultValue={blog?.sections[0]?.quote ?? ""} />
              </label>
            </div>
          </FormSection>

          <FormSection eyebrow="03 / MEDİA" title="Blog şəkilləri və görünürlük" icon={<ImageUp size={18} />}>
            <div className="admin-blog-copy-grid admin-blog-media-grid">
              <AdminImageField
                label="Blog örtük şəkli"
                name="blogImage"
                fileName="blogImageFile"
                defaultValue={cover}
                title={blog?.title || "Blog şəkli"}
                ratio="cover"
              />
              <label className="admin-field admin-field-span">
                <span>Əlavə şəkillər</span>
                <textarea
                  name="blogImages"
                  rows={4}
                  placeholder="Hər sətrə bir şəkil URL-i yazın."
                  defaultValue={blogImagesText(blog)}
                />
              </label>
              <Toggle label="Saytda aktiv" name="blogIsActive" defaultChecked={blog?.isActive ?? true} />
            </div>
          </FormSection>
        </div>
      </div>

      <div className="admin-actions">
        <button type="submit" className="admin-primary-button">
          <ButtonIcon>{mode === "create" ? <Plus size={16} /> : <Save size={16} />}</ButtonIcon>
          {mode === "create" ? "Blog əlavə et" : "Məqaləni saxla"}
        </button>
      </div>
    </form>
  );
}

function BlogSummary({
  blog,
  index,
}: {
  blog: AdminBlogPost;
  index: number;
}) {
  return (
    <summary>
      <span>{String(index + 1).padStart(2, "0")}</span>
      {blog.image ? (
        <Image src={blog.image} alt={blog.title} width={130} height={80} />
      ) : (
        <i className="admin-car-placeholder">
          <Newspaper size={22} />
        </i>
      )}
      <div>
        <strong>{blog.title}</strong>
        <em>{blog.category} · {blog.date}</em>
      </div>
      <div className="admin-card-tags">
        <i>{blog.readingTime}</i>
        <i>{blog.isActive === false ? "Gizli" : "Aktiv"}</i>
      </div>
      <b className="admin-edit-pill">
        Redaktə et
        <ChevronDown size={14} />
      </b>
    </summary>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const authenticated = await isAdminAuthenticated();
  const errorMessage = getAdminErrorMessage(params.error);

  if (!authenticated) {
    return (
      <main className="admin-shell admin-login-shell">
        <div className="admin-grid-surface" />
        <section className="admin-login-card">
          <div className="admin-login-brand">
            <span>C</span>
            <div>
              <p>CARBON İDARƏ</p>
              <strong>Avtomobil parkı idarə sistemi</strong>
            </div>
          </div>

          <div className="admin-login-copy">
            <span>TƏHLÜKƏSİZ GİRİŞ</span>
            <h1>Parkı rahat idarə edin.</h1>
            <p>
              Avtomobilləri, şəkilləri, qiymətləri və görünürlük ayarlarını bir Carbon panelindən idarə edin.
            </p>
          </div>

          <form action={loginAction} className="admin-login-form">
            <label>
              <span>Şifrə</span>
              <div className="admin-password-box">
                <KeyRound size={17} />
                <input name="password" type="password" autoComplete="current-password" />
              </div>
            </label>
            {errorMessage ? <small>{errorMessage}</small> : null}
            <button type="submit" className="admin-primary-button">
              Panelə daxil ol
              <ButtonIcon>
                <ArrowRight size={16} />
              </ButtonIcon>
            </button>
          </form>

          <div className="admin-login-status">
            <span>
              <ShieldCheck size={15} />
              Məxfi giriş
            </span>
            <span>Carbon Rent A Car</span>
          </div>
        </section>
      </main>
    );
  }

  const result = await listAdminCars();
  const blogResult = await listAdminBlogs();
  const rentalCount = result.cars.filter((car) => car.rentalVisible !== false).length;
  const transferCount = result.cars.filter((car) => car.transferAvailable).length;
  const weddingCount = result.cars.filter((car) => car.weddingAvailable).length;
  const activeBlogCount = blogResult.blogs.filter((blog) => blog.isActive !== false).length;

  return (
    <main className="admin-shell">
      <div className="admin-grid-surface" />
      <header className="admin-header">
        <div>
          <p>CARBON İDARƏ</p>
          <h1>İdarə paneli</h1>
          <span className="admin-header-copy">
            Avtomobil parkı, transfer ayarları, toy kolleksiyası, şəkillər və blog məzmunu üçün sadə idarəetmə mərkəzi.
          </span>
          <div className="admin-source-pill">
            <Database size={14} />
            Mənbə: {result.source === "supabase" ? "Supabase" : "lokal ehtiyat"}
          </div>
        </div>
        <aside className="admin-command-card">
          <span>
            <i />
            Sistem aktivdir
          </span>
          <strong>Carbon əməliyyat masası</strong>
          <p>
            Şəkil seçin, önizləməyə baxın, məlumatları yoxlayın və yalnız sonra yadda saxlayın.
          </p>
          <form action={logoutAction}>
            <button type="submit" className="admin-ghost-button">
              <LogOut size={16} />
              Çıxış
            </button>
          </form>
        </aside>
      </header>

      {errorMessage ? <div className="admin-alert">{errorMessage}</div> : null}
      {result.error ? <div className="admin-alert">{result.error}</div> : null}
      {blogResult.error ? <div className="admin-alert">{blogResult.error}</div> : null}
      {!result.configured ? (
        <div className="admin-alert">
          Yadda saxlama üçün Supabase env məlumatlarını əlavə edin: SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL və
          NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </div>
      ) : null}
      {params.saved ? <div className="admin-success">Avtomobil yadda saxlanıldı.</div> : null}
      {params.seeded ? <div className="admin-success">Lokal avtomobillər Supabase bazasına köçürüldü.</div> : null}
      {params.deleted ? <div className="admin-success">Avtomobil silindi.</div> : null}
      {params.blogSaved ? <div className="admin-success">Blog məqaləsi yadda saxlanıldı.</div> : null}
      {params.blogsSeeded ? <div className="admin-success">Lokal blog məqalələri Supabase bazasına köçürüldü.</div> : null}
      {params.blogDeleted ? <div className="admin-success">Blog məqaləsi silindi.</div> : null}

      <section className="admin-stats">
        <article>
          <CarFront size={18} />
          <span>Cəmi avtomobil</span>
          <strong>{result.cars.length}</strong>
        </article>
        <article>
          <Gauge size={18} />
          <span>İcarə</span>
          <strong>{rentalCount}</strong>
        </article>
        <article>
          <Sparkles size={18} />
          <span>Transfer</span>
          <strong>{transferCount}</strong>
        </article>
        <article>
          <ShieldCheck size={18} />
          <span>Toy</span>
          <strong>{weddingCount}</strong>
        </article>
        <article>
          <Newspaper size={18} />
          <span>Aktiv blog</span>
          <strong>{activeBlogCount}</strong>
        </article>
      </section>

      <section className="admin-section-block">
        <div className="admin-section-head">
          <div>
            <p>01 / AVTOMOBİLLƏR</p>
            <h2>Avtomobil parkı</h2>
          </div>
          <span>Qiymətlər, texniki göstəricilər, şəkillər və görünürlük ayarları bir yerdə idarə olunur.</span>
        </div>

        <div className="admin-section-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p>BAZA</p>
                <h2>Mövcud avtomobilləri bazaya köçür</h2>
                <span>
                  Supabase cədvəlini yaratdıqdan sonra lokal avtomobil parkını bazaya köçürmək üçün istifadə edin.
                </span>
              </div>
              <form action={seedCarsAction}>
                <button type="submit" className="admin-secondary-button">
                  <Database size={16} />
                  Bazaya köçür
                </button>
              </form>
            </div>
          </section>

          <details className="admin-panel admin-add-panel">
            <summary className="admin-add-summary">
              <div>
                <p>YENİ</p>
                <h2>Avtomobil əlavə et</h2>
                <span>
                  Yeni avtomobil yaratmaq üçün bura klikləyin. Mövcud avtomobillər aşağıda redaktə olunur.
                </span>
              </div>
              <b>
                <Plus size={16} />
                Yeni avtomobil
              </b>
            </summary>
            <CarForm index={result.cars.length} mode="create" />
          </details>
        </div>

        <section className="admin-list-heading">
          <div>
            <p>PARK</p>
            <h2>Mövcud avtomobillər</h2>
          </div>
          <span>Detalları açmaq üçün avtomobil sətrinə klikləyin.</span>
        </section>

        <section className="admin-list">
          {result.cars.map((car, index) => (
            <details key={car.id} className="admin-car-card">
              <CarSummary car={car} index={index} />
              <CarForm car={car} index={index} mode="edit" />
              <form action={deleteCarAction} className="admin-delete-form">
                <input name="id" type="hidden" value={car.id} readOnly />
                <button type="submit">
                  <Trash2 size={15} />
                  Avtomobili sil
                </button>
              </form>
            </details>
          ))}
        </section>
      </section>

      <section className="admin-section-block">
        <div className="admin-section-head admin-section-head-blog">
          <div>
            <p>02 / BLOG</p>
            <h2>Blog məzmunu</h2>
          </div>
          <span>Məqalələr əlavə edin, mövcud yazıları redaktə edin və saytda hansı yazıların görünəcəyini seçin.</span>
        </div>

        <div className="admin-section-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p>BLOQ BAZASI</p>
                <h2>Mövcud blogları bazaya köçür</h2>
                <span>
                  Lokal blog məqalələrini Supabase cədvəlinə əlavə edir. Sonra yazıları paneldən idarə edə bilərsiniz.
                </span>
              </div>
              <form action={seedBlogsAction}>
                <button type="submit" className="admin-secondary-button">
                  <Database size={16} />
                  Blogları köçür
                </button>
              </form>
            </div>
          </section>

          <details className="admin-panel admin-add-panel">
            <summary className="admin-add-summary">
              <div>
                <p>YENİ MƏQALƏ</p>
                <h2>Blog əlavə et</h2>
                <span>
                  Yeni məqalə yaratmaq üçün başlıq, şəkil, giriş və əsas mətn sahələrini doldurun.
                </span>
              </div>
              <b>
                <Plus size={16} />
                Yeni blog
              </b>
            </summary>
            <BlogForm index={blogResult.blogs.length} mode="create" />
          </details>
        </div>

        <section className="admin-list-heading">
          <div>
            <p>MƏQALƏLƏR</p>
            <h2>Mövcud bloglar</h2>
          </div>
          <span>Yazını açın, mətni dəyişin və saxlayın.</span>
        </section>

        <section className="admin-list admin-blog-list">
          {blogResult.blogs.map((blog, index) => (
            <details key={blog.slug} className="admin-car-card admin-blog-card">
              <BlogSummary blog={blog} index={index} />
              <BlogForm blog={blog} index={index} mode="edit" />
              <form action={deleteBlogAction} className="admin-delete-form">
                <input name="blogSlug" type="hidden" value={blog.slug} readOnly />
                <button type="submit">
                  <Trash2 size={15} />
                  Blogu sil
                </button>
              </form>
            </details>
          ))}
        </section>
      </section>
    </main>
  );
}
