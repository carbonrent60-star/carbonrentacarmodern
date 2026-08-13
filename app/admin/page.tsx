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
  isAdminAuthenticated,
  listAdminCars,
  loginAction,
  logoutAction,
  saveCarAction,
  seedCarsAction,
} from "./actions";
import {
  carCategories,
  rentalPriceKeys,
  transferPriceKeys,
} from "@/lib/supabase/cars";
import type { Car } from "@/data/cars";

type AdminCar = Car & {
  isActive?: boolean;
  sortOrder?: number;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Carbon İdarə Paneli",
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
              <Field label="Əsas şəkil URL" name="thumbnail" defaultValue={thumbnail} />
              <label className="admin-field admin-file-field">
                <span>Əsas şəkil yüklə</span>
                <span className="admin-file-control">
                  <ImageUp size={16} />
                  Fayl seç
                  <small>PNG, JPG, WEBP · 50 MB</small>
                </span>
                <input name="imageFile" type="file" accept="image/*" />
              </label>
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
  const rentalCount = result.cars.filter((car) => car.rentalVisible !== false).length;
  const transferCount = result.cars.filter((car) => car.transferAvailable).length;
  const weddingCount = result.cars.filter((car) => car.weddingAvailable).length;

  return (
    <main className="admin-shell">
      <div className="admin-grid-surface" />
      <header className="admin-header">
        <div>
          <p>CARBON İDARƏ</p>
          <h1>Park idarəsi.</h1>
          <div className="admin-source-pill">
            <Database size={14} />
            Mənbə: {result.source === "supabase" ? "Supabase" : "lokal ehtiyat"}
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-ghost-button">
            <LogOut size={16} />
            Çıxış
          </button>
        </form>
      </header>

      {errorMessage ? <div className="admin-alert">{errorMessage}</div> : null}
      {result.error ? <div className="admin-alert">{result.error}</div> : null}
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
      </section>

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
    </main>
  );
}
