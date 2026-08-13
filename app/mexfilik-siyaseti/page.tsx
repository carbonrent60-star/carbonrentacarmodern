import type { Metadata } from "next";
import { CalendarDays, Mail } from "lucide-react";
import CarbonNavbar from "@/components/CarbonNavbar";
import { createPageMetadata } from "@/lib/seo";
import "../legal.css";

export const metadata: Metadata = createPageMetadata({
  title: "Məxfilik Siyasəti | Carbon Rent A Car",
  description:
    "Carbon Rent A Car şəxsi məlumatların toplanması, istifadəsi və qorunması haqqında məxfilik siyasəti.",
  path: "/mexfilik-siyaseti",
});

export default function PrivacyPage() {
  return (
    <>
      <CarbonNavbar light />

      <main className="legal-page">
        <header className="legal-hero">
          <div className="legal-shell legal-hero-grid">
            <div>
              <span className="legal-eyebrow">Hüquqi məlumat</span>
              <h1>Məxfilik Siyasəti</h1>
            </div>

            <div className="legal-hero-side">
              <p>
                Məxfilik Siyasətimiz şəxsi məlumatlarınızın necə
                toplanması, istifadəsi və qorunması barədə məlumat verir.
                Məxfiliyiniz və təhlükəsizliyiniz bizim üçün prioritetdir.
              </p>

              <div className="legal-updated">
                <CalendarDays size={14} strokeWidth={1.7} />
                Ən son yeniləmə: 24 iyul 2025
              </div>
            </div>
          </div>
        </header>

        <div className="legal-content">
          <div className="legal-shell legal-content-grid">
            <aside className="legal-rail">
              <span className="legal-rail-label">Carbon / Privacy</span>
              <div className="legal-rail-line" />
              <p>10 bölmə</p>
            </aside>

            <article className="legal-article">
              <section className="legal-section">
                <span className="legal-number">01</span>
                <h2>Giriş</h2>
                <p>
                  Carbon Rent A Car olaraq müştərilərimizin məxfiliyinə
                  hörmətlə yanaşırıq və şəxsi məlumatlarınızın qorunmasına
                  sadiqik.
                </p>
                <p>
                  Bu məxfilik siyasəti sizə hansı məlumatları topladığımızı,
                  necə istifadə etdiyimizi və qoruduğumuzu izah edir.
                </p>
              </section>

              <section className="legal-section">
                <span className="legal-number">02</span>
                <h2>Toplanan Məlumatlar</h2>
                <p>
                  Saytımız vasitəsilə aşağıdakı şəxsi məlumatları toplaya
                  bilərik:
                </p>
                <ul className="legal-list">
                  <li>Ad və soyad</li>
                  <li>Telefon nömrəsi</li>
                  <li>Email ünvanı</li>
                  <li>Rezervasiya tarixləri və avtomobil seçimi</li>
                  <li>
                    Ödəniş məlumatları — online ödəniş etdiyiniz halda
                  </li>
                  <li>
                    İstifadəçi davranış məlumatları — cookies və analitika
                    vasitəsilə
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">03</span>
                <h2>Məlumatların Toplanma Yolları</h2>
                <ul className="legal-list">
                  <li>
                    <strong>Əlaqə formaları:</strong> sorğu, rezervasiya və
                    ya sual göndərdiyiniz zaman.
                  </li>
                  <li>
                    <strong>Rezervasiya forması:</strong> avtomobil seçimi
                    və tarix daxil etdikdə.
                  </li>
                  <li>
                    <strong>Cookies və analitika:</strong> saytın
                    funksionallığı və istifadə təcrübəsini təkmilləşdirmək
                    üçün.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">04</span>
                <h2>Məlumatların İstifadə Edilməsi</h2>
                <p>
                  Topladığımız məlumatlar aşağıdakı məqsədlərlə istifadə
                  edilir:
                </p>
                <ul className="legal-list">
                  <li>Rezervasiyanızı təsdiqləmək və xidmət göstərmək</li>
                  <li>Müştəri xidmətləri üçün əlaqə yaratmaq</li>
                  <li>Təhlükəsizlik və fırıldaqçılığın qarşısını almaq</li>
                  <li>
                    Kampaniya və yeniliklər barədə məlumat göndərmək —
                    yalnız razılığınız varsa
                  </li>
                  <li>
                    Saytın və xidmətlərimizin inkişafı üçün təhlil aparmaq
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">05</span>
                <h2>Məlumatların Paylaşılması</h2>
                <p>
                  Şəxsi məlumatlarınız üçüncü tərəflərlə paylaşılmır.
                  Aşağıdakı hallar istisna təşkil edir:
                </p>
                <ul className="legal-list">
                  <li>
                    Qanunvericiliyə uyğun olaraq hüquq-mühafizə
                    orqanlarının tələb etdiyi hallar
                  </li>
                  <li>
                    Şirkət daxilində məlumatların yalnız xidmət məqsədilə
                    istifadəsi
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">06</span>
                <h2>Təhlükəsizlik</h2>
                <p>
                  Məlumatlarınızın qorunması üçün zəruri texniki və
                  təşkilati təhlükəsizlik tədbirləri görülür.
                </p>
                <ul className="legal-list">
                  <li>SSL sertifikatı ilə şifrələnmiş əlaqə</li>
                  <li>Məlumat bazasının təhlükəsizlik tədbirləri</li>
                  <li>
                    İşçi heyətinə məxfilik siyasəti barədə təlimat
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">07</span>
                <h2>Məlumatların Saxlanması Müddəti</h2>
                <p>
                  Rezervasiya və əlaqə məlumatları xidmət müddəti və
                  qanunvericiliyə uyğun olaraq saxlanılır.
                </p>
              </section>

              <section className="legal-section">
                <span className="legal-number">08</span>
                <h2>İstifadəçi Hüquqları</h2>
                <p>Siz aşağıdakı hüquqlara maliksiniz:</p>
                <ul className="legal-list">
                  <li>Şəxsi məlumatlarınıza çıxış etmək</li>
                  <li>Onları düzəltmək və ya yeniləmək</li>
                </ul>
                <p>
                  Bu hüquqlarla bağlı müraciət etmək üçün bizimlə əlaqə
                  saxlaya bilərsiniz.
                </p>
              </section>

              <section className="legal-section">
                <span className="legal-number">09</span>
                <h2>Cookies Siyasəti</h2>
                <p>
                  Saytımız istifadəçi təcrübəsini yaxşılaşdırmaq üçün
                  cookies istifadə edir. Cookies-i brauzerinizin
                  ayarlarından idarə edə və ya silə bilərsiniz.
                </p>
                <p>
                  Saytımızdan istifadə etməklə cookies siyasətimizə
                  razılıq vermiş olursunuz.
                </p>
              </section>

              <section className="legal-section">
                <span className="legal-number">10</span>
                <h2>Dəyişikliklər</h2>
                <p>
                  Məxfilik siyasətimiz zaman-zaman yenilənə bilər.
                  Dəyişikliklər bu səhifədə yerləşdirilir və yenilənmə
                  tarixi göstərilir.
                </p>
                <p>
                  Siyasəti mütəmadi olaraq nəzərdən keçirməyiniz tövsiyə
                  olunur.
                </p>
              </section>

              <div className="legal-contact">
                <span className="legal-contact-label">
                  Məxfilik üzrə əlaqə
                </span>

                <h2>Məlumatlarınızla bağlı sualınız var?</h2>

                <p>
                  Şəxsi məlumatlarınıza çıxış, düzəliş və ya məxfilik
                  siyasəti ilə bağlı bizimlə əlaqə saxlaya bilərsiniz.
                </p>

                <div className="legal-contact-links">
                  <a href="mailto:info@crbnrnt.com">
                    <Mail size={15} />
                    info@crbnrnt.com
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <footer className="legal-closing">
          <div className="legal-shell legal-closing-inner">
            <p>
              <strong>Carbon Rent A Car</strong> komandası olaraq şəxsi
              məlumatlarınızın qorunmasına daim diqqət yetiririk.
              Bizi seçdiyiniz üçün təşəkkür edirik.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
