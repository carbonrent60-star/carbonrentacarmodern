import type { Metadata } from "next";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import CarbonNavbar from "@/components/CarbonNavbar";
import { createPageMetadata } from "@/lib/seo";
import "../legal.css";

export const metadata: Metadata = createPageMetadata({
  title: "Şərtlər və Qaydalar | Carbon Rent A Car",
  description:
    "Carbon Rent A Car avtomobil kirayəsi, rezervasiya, ödəniş, depozit, sığorta və istifadə şərtləri.",
  path: "/sertler",
  keywords: [
    "avtomobil icarəsi şərtləri",
    "rent a car qaydaları",
    "avtomobil depozit qaydaları",
    "kirayə avtomobil sığorta şərtləri",
  ],
});

export default function TermsPage() {
  return (
    <>
      <CarbonNavbar light />

      <main className="legal-page">
        <header className="legal-hero">
          <div className="legal-shell legal-hero-grid">
            <div>
              <span className="legal-eyebrow">Hüquqi məlumat</span>
              <h1>Şərtlər və Qaydalar</h1>
            </div>

            <div className="legal-hero-side">
              <p>
                Carbon Rent A Car xidmətlərindən istifadə, rezervasiya,
                ödəniş, avtomobilin təhvil alınması və qaytarılması üçün
                tətbiq olunan əsas şərtlər.
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
              <span className="legal-rail-label">Carbon / Terms</span>
              <div className="legal-rail-line" />
              <p>9 bölmə</p>
            </aside>

            <article className="legal-article">
              <section className="legal-section">
                <span className="legal-number">01</span>
                <h2>Giriş</h2>
                <p>
                  Carbon Rent A Car xidmətlərindən istifadə etməklə,
                  aşağıda qeyd olunan şərtləri qəbul etmiş olursunuz.
                </p>
                <p>
                  Bu şərtlər saytımız vasitəsilə edilən bütün
                  rezervasiyalara və kirayə müqavilələrinə şamil olunur.
                </p>
              </section>

              <section className="legal-section">
                <span className="legal-number">02</span>
                <h2>Rezervasiya Şərtləri</h2>
                <ul className="legal-list">
                  <li>
                    Avtomobil kirayə etmək üçün minimum yaş həddi 21
                    yaşdır.
                  </li>
                  <li>
                    Müştərinin etibarlı sürücülük vəsiqəsi olmalıdır və
                    minimum 1 il sürücülük təcrübəsi tələb olunur.
                  </li>
                  <li>
                    Rezervasiya zamanı düzgün şəxsi məlumatların təqdim
                    edilməsi mütləqdir.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">03</span>
                <h2>Ödəniş və Depozit Qaydaları</h2>
                <ul className="legal-list">
                  <li>Ödəniş nağd, kartla və ya online mümkündür.</li>
                  <li>
                    Depozit məbləği avtomobilin sinfi, icarə müddəti,
                    sürücülük təcrübəsi və digər amillər nəzərə alınmaqla
                    təyin edilə və ya edilməyə bilər.
                  </li>
                  <li>
                    Depozit təyin olunubsa, götürülmüş depozit müqavilədə
                    mütləq şəkildə öz əksini tapmalıdır.
                  </li>
                  <li>
                    Kirayə müddəti bitdikdən sonra avtomobil qaytarılarkən
                    hər hansı cərimə və ya zərər olmadığı halda depozit
                    tam şəkildə qaytarılır.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">04</span>
                <h2>Təslim və Qaytarılma Qaydaları</h2>
                <ul className="legal-list">
                  <li>
                    Avtomobil razılaşdırılmış tarix və saatda təhvil
                    verilir.
                  </li>
                  <li>
                    Qaytarılma gecikərsə, əlavə ödəniş tətbiq oluna bilər.
                  </li>
                  <li>
                    Avtomobil eyni yanacaq səviyyəsi ilə qaytarılmalıdır.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">05</span>
                <h2>Sığorta Şərtləri</h2>
                <ul className="legal-list">
                  <li>
                    Bütün avtomobillər icbari və kasko sığorta ilə təmin
                    olunub.
                  </li>
                  <li>
                    Qəza halında dərhal şirkət və DYP ilə əlaqə
                    saxlanılmalıdır.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">06</span>
                <h2>İstifadə Məhdudiyyətləri</h2>
                <ul className="legal-list">
                  <li>
                    Avtomobilin üçüncü şəxslərə verilməsi qadağandır.
                  </li>
                  <li>
                    Avtomobil yalnız Azərbaycan Respublikasının ərazisində
                    istifadə oluna bilər.
                  </li>
                  <li>
                    Avtomobildən qanunsuz fəaliyyətlərdə və sürücülük
                    qaydalarını pozan hallarda istifadə qəti qadağandır.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">07</span>
                <h2>Texniki Problem Halları</h2>
                <ul className="legal-list">
                  <li>
                    Avtomobilin nasazlığı zamanı dərhal bizimlə əlaqə
                    saxlayın.
                  </li>
                  <li>
                    Zərurət yarandıqda 24/7 texniki yardım və əvəz
                    avtomobil təqdim olunur.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">08</span>
                <h2>Müştərinin Məsuliyyəti</h2>
                <ul className="legal-list">
                  <li>
                    Müştəri avtomobilə vurduğu hər hansı zərəri
                    kompensasiya etməklə məsuldur.
                  </li>
                  <li>
                    Avtomobilin salonunun təmiz saxlanılması və
                    avtomobildən istismar qaydalarına uyğun istifadə
                    edilməsi tələb olunur.
                  </li>
                </ul>
              </section>

              <section className="legal-section">
                <span className="legal-number">09</span>
                <h2>Şirkətin Hüquqları</h2>
                <ul className="legal-list">
                  <li>
                    Şirkət zəruri hallarda — sənədlərin uyğun olmaması və
                    ya təhlükəsizlik səbəbləri daxil olmaqla — sifarişi
                    qəbul etməmək hüququna malikdir.
                  </li>
                  <li>
                    Şirkət bu şərtləri xəbərdarlıq etmədən dəyişdirmək
                    hüququnu özündə saxlayır.
                  </li>
                  <li>
                    Dəyişikliklər saytımızda elan olunduğu tarixdən
                    qüvvəyə minir.
                  </li>
                </ul>
              </section>

              <div className="legal-contact">
                <span className="legal-contact-label">
                  Bizimlə əlaqə
                </span>

                <h2>Şərtlərlə bağlı sualınız var?</h2>

                <p>
                  Rezervasiya və ya kirayə şərtləri ilə bağlı əlavə
                  məlumat üçün komandamızla əlaqə saxlaya bilərsiniz.
                </p>

                <div className="legal-contact-links">
                  <a href="tel:+994504840006">
                    <Phone size={15} />
                    +994 50 484 00 06
                  </a>

                  <a href="tel:+994554840006">
                    <Phone size={15} />
                    +994 55 484 00 06
                  </a>

                  <a href="tel:+994994840006">
                    <Phone size={15} />
                    +994 99 484 00 06
                  </a>

                  <a href="mailto:contact@crbnrnt.az">
                    <Mail size={15} />
                    contact@crbnrnt.az
                  </a>

                  <a
                    href="https://maps.google.com/?q=Ələsgər+Qayıbov+12%2F22+Bakı"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin size={15} />
                    Ələsgər Qayıbov 12/22, Bakı
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <footer className="legal-closing">
          <div className="legal-shell legal-closing-inner">
            <p>
              <strong>Carbon Rent A Car</strong> komandası olaraq
              xidmətimizdən istifadə etdiyiniz üçün təşəkkür edirik və
              sizə rahat, təhlükəsiz səyahətlər arzulayırıq.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
