import type { Metadata } from "next";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import "./admin.css";
import {
  isAdminAuthenticated,
  listAdminBlogs,
  listAdminCars,
  loginAction,
} from "./actions";
import { createPageMetadata } from "@/lib/seo";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Carbon Idare Paneli",
  description:
    "Carbon Rent A Car idare paneli. Avtomobiller, sekiller, qiymetler ve blog mezmunu ucun mexfi idareetme sahesi.",
  path: "/admin",
  noIndex: true,
});

const adminErrorMessages: Record<string, string> = {
  "missing-admin-env": "Evvelce ADMIN_PASSWORD elave edin.",
  "wrong-password": "Sifre duzgun deyil.",
  "missing-supabase-admin-env":
    "Supabase server melumatlari tapilmadi. SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY deyerlerini yoxlayin.",
  "image-too-large": "Sekil cox boyukdur. Maksimum 50 MB olculu sekil yukleyin.",
  "image-upload-failed":
    "Sekil yuklenmedi. Supabase Storage bucket ve icazelerini yoxlayin.",
  "required-fields-missing": "Model adi, URL adi ve brend saheleri mutleq doldurulmalidir.",
  "image-required": "Avtomobil ucun esas sekil URL elave edin ve ya sekil yukleyin.",
  "blog-body-required": "Meqale metni bos ola bilmez.",
  "blog-table-missing":
    "Supabase-de blog_posts cedveli yaradilmadib. supabase/migrations icindeki blog cedveli SQL-ni Supabase SQL Editor-da bir defe isledin.",
  "database-save-failed": "Melumat bazaya yazilmadi. Supabase cedvelini ve acarlari yoxlayin.",
  "database-delete-failed": "Avtomobil silinmedi. Supabase baglantisini yoxlayin.",
  "unknown-error": "Gozlenilmeyen xeta bas verdi. Zehmet olmasa yeniden cehd edin.",
};

function getAdminErrorMessage(error?: string | string[]) {
  const code = Array.isArray(error) ? error[0] : error;

  if (!code) {
    return null;
  }

  return adminErrorMessages[code] ?? adminErrorMessages["unknown-error"];
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
      <main className="admin-login-shell">
        <section className="admin-login-card">
          <div className="admin-login-brand">
            <span>C</span>
            <div>
              <p>CARBON ADMIN</p>
              <strong>Fleet management console</strong>
            </div>
          </div>

          <div className="admin-login-copy">
            <span>Secure access</span>
            <h1>Carbon idarəetmə mərkəzi</h1>
            <p>
              Avtomobil parkı, qiymətlər, media və blog məzmununu sürətli,
              sakit və təhlükəsiz idarə edin.
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
              <ArrowRight size={16} />
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

  return (
    <AdminDashboardClient
      carsResult={result}
      blogsResult={blogResult}
      alerts={{
        error: errorMessage,
        carError: result.error,
        blogError: blogResult.error,
        missingSupabase: !result.configured,
      }}
      flags={{
        saved: Boolean(params.saved),
        seeded: Boolean(params.seeded),
        deleted: Boolean(params.deleted),
        blogSaved: Boolean(params.blogSaved),
        blogsSeeded: Boolean(params.blogsSeeded),
        blogDeleted: Boolean(params.blogDeleted),
      }}
    />
  );
}
