"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCarbonCopy } from "@/lib/carbon-locale";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CarFront,
  Clock3,
  Gem,
  MapPin,
  Mountain,
  Plane,
  ShieldCheck,
  Sparkles,
  Gauge,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    number: "01",
    kicker: "ŞƏHƏR / GÜNLÜK",
    title: "Gündəlik",
    accent: "avtomobil icarəsi.",
    description:
      "Qısa şəhər səyahətləri və ya bir günlük səfərlər üçün ideal seçimdir. Büdcənizə və stilinizə uyğun olaraq iqtisadi, standart və ya lüks avtomobillərdən birini seçə bilərsiniz.",
    detail:
      "Bütün icarələrə tam sığorta və limitsiz kilometr daxildir.",
    icon: CalendarDays,
    href: "/avtomobiller",
    action: "Avtomobillərə bax",
    meta: ["1+ gün", "Tam sığorta", "Geniş seçim"],
  },
  {
    number: "02",
    kicker: "TRANSFER / AIRPORT",
    title: "Hava limanı",
    accent: "transferi.",
    description:
      "Uçuşlarınızı izləyən peşəkar sürücülərlə hava limanına vaxtında çatın və ya qarşılanın. Rahat və təhlükəsiz avtomobillərlə səfər edin, gecikmə stressindən uzaq olun.",
    detail:
      "Transferlər həm fərdi, həm də qrup səfərləri üçün mövcuddur.",
    icon: Plane,
    href: "/elaqe",
    action: "Transfer sifariş et",
    meta: ["24/7", "Qarşılama", "Sürücü ilə"],
  },
  {
    number: "03",
    kicker: "UZUN MÜDDƏT / FLEX",
    title: "Uzunmüddətli",
    accent: "icarə.",
    description:
      "Bir neçə həftəlik və ya aylıq avtomobil ehtiyaclarınız üçün sərfəli uzunmüddətli icarə paketləri təklif edirik. Bu xidmət şirkətlər və fərdi istifadəçilər üçün idealdır.",
    detail:
      "Texniki baxım və servis də paketə daxildir.",
    icon: Clock3,
    href: "/elaqe",
    action: "Təklif al",
    meta: ["Həftəlik", "Aylıq", "Servis daxil"],
  },
  {
    number: "04",
    kicker: "XÜSUSİ GÜNLƏR / EVENT",
    title: "Toy və",
    accent: "xüsusi günlər.",
    description:
      "Toy, nişan, fotosessiya və digər xüsusi günlər üçün lüks avtomobillər təqdim edirik. Mercedes, BMW və klassik modellərlə unudulmaz anlar yaşayın.",
    detail:
      "Avtomobil bəzədilmiş formada da təqdim oluna bilər.",
    icon: Gem,
    href: "/toy-avtomobilleri",
    action: "Toy kolleksiyası",
    meta: ["Premium", "Fotosessiya", "Xüsusi gün"],
  },
  {
    number: "05",
    kicker: "AZADLIQ / SELF DRIVE",
    title: "Sürücüsüz",
    accent: "icarə.",
    description:
      "Sərbəst şəkildə avtomobil idarə etmək istəyənlər üçün sürücüsüz icarə xidməti. Müxtəlif avtomobil modelləri ilə istədiyiniz vaxt və yerdə istifadə edin.",
    detail:
      "Sadəcə sənədlərinizi təqdim edin və yol sizin olsun.",
    icon: Gauge,
    href: "/avtomobiller",
    action: "Avtomobil seç",
    meta: ["Sərbəst", "Rahat proses", "Sizin marşrut"],
  },
  {
    number: "06",
    kicker: "SUV / OFF-ROAD",
    title: "SUV və",
    accent: "off-road icarəsi.",
    description:
      "Dağlıq və kənar yollar üçün SUV və off-road avtomobilləri icarəyə verilir. Güclü mühərrik və tam ötürücü sistemlə istənilən yolda təhlükəsiz səyahət edin.",
    detail:
      "Macəra sevənlər üçün ideal seçimdir.",
    icon: Mountain,
    href: "/avtomobiller",
    action: "SUV modellərə bax",
    meta: ["SUV", "4×4", "Uzun səfər"],
  },
];

export default function ServicesClient() {
  const { copy } = useCarbonCopy();
  const localizedServices = services.map((service, index) => ({
    ...service,
    ...copy.servicesPage.items[index],
  }));

  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-shell">
          <motion.div
            className="services-hero-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="services-hero-kicker">
              <i />
              <span>CARBON SERVICES</span>
            </div>

            <span className="services-index">01 — 06</span>
          </motion.div>

          <div className="services-hero-grid">
            <motion.div
              className="services-hero-main"
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              <h1>
                {copy.servicesPage.heroTitle1}
                <br />
                <em>{copy.servicesPage.heroTitle2}</em>
              </h1>
            </motion.div>

            <motion.div
              className="services-hero-side"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              <p>
                {copy.servicesPage.heroText}
              </p>

              <a href="#services-list">
                {copy.servicesPage.discover}
                <ArrowDown size={15} />
              </a>
            </motion.div>
          </div>

          <div className="services-hero-footer">
            <div>
              <ShieldCheck size={17} />
              <span>{copy.servicesPage.footerStats[0]}</span>
            </div>
            <i />
            <div>
              <MapPin size={17} />
              <span>{copy.servicesPage.footerStats[1]}</span>
            </div>
            <i />
            <div>
              <Sparkles size={17} />
              <span>{copy.servicesPage.footerStats[2]}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="services-intro" id="services-list">
        <div className="services-shell">
          <div className="services-section-line">
            <span>{copy.servicesPage.sectionLabel}</span>
            <span>{copy.servicesPage.sectionCount}</span>
          </div>

          <div className="services-intro-grid">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              {copy.servicesPage.introTitle1}
              <br />
              <em>{copy.servicesPage.introTitle2}</em>
            </motion.h2>

            <p>
              {copy.servicesPage.introText}
            </p>
          </div>
        </div>
      </section>

      <section className="services-list">
        <div className="services-shell">
          {localizedServices.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                className="services-row"
                key={service.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: Math.min(index * 0.03, 0.12),
                  ease,
                }}
              >
                <div className="services-row-number">
                  {service.number}
                </div>

                <div className="services-row-icon">
                  <Icon size={25} strokeWidth={1.35} />
                </div>

                <div className="services-row-title">
                  <span>{service.kicker}</span>
                  <h3>
                    {service.title}
                    <br />
                    <em>{service.accent}</em>
                  </h3>
                </div>

                <div className="services-row-content">
                  <p>{service.description}</p>
                  <small>{service.detail}</small>

                  <div className="services-row-meta">
                    {service.meta.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <Link href={service.href}>
                    <span>{service.action}</span>
                    <i>
                      <ArrowRight size={15} />
                    </i>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="services-process">
        <div className="services-shell">
          <div className="services-section-line services-section-line-dark">
            <span>NECƏ İŞLƏYİR?</span>
            <span>03 ADDIM</span>
          </div>

          <div className="services-process-heading">
            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              Yolunuzu seçin.
              <br />
              <em>Qalanını biz həll edək.</em>
            </motion.h2>
          </div>

          <div className="services-process-grid">
            <article>
              <span>01</span>
              <CarFront size={24} />
              <h3>Seçiminizi edin</h3>
              <p>
                Sizə uyğun avtomobili və ya xidməti müəyyən edin.
              </p>
            </article>

            <article>
              <span>02</span>
              <CalendarDays size={24} />
              <h3>Tarixi müəyyən edin</h3>
              <p>
                İcarə və ya transfer üçün uyğun tarix və detalları seçin.
              </p>
            </article>

            <article>
              <span>03</span>
              <CarFront size={24} />
              <h3>Yola çıxın</h3>
              <p>
                Təsdiqdən sonra avtomobiliniz hazırdır. Sizə yalnız
                sürmək qalır.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="services-final">
        <div className="services-shell services-final-grid">
          <div>
            <span>CARBON RENT A CAR</span>
            <h2>
              Səfəriniz
              <br />
              <em>buradan başlayır.</em>
            </h2>
          </div>

          <div className="services-final-side">
            <p>
              Avtomobilinizi seçin və rezervasiyanızı bir neçə
              addımda başladın.
            </p>

            <div>
              <Link href="/avtomobiller" className="services-primary">
                Avtomobil seç
                <ArrowRight size={16} />
              </Link>

              <Link href="/elaqe" className="services-secondary">
                Əlaqə saxla
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
