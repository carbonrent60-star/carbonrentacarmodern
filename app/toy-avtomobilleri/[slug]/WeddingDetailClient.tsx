"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Gauge,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Car } from "@/data/cars";
import {
  translateCarValue,
  useCarbonCopy,
} from "@/lib/carbon-locale";

import CarbonNavbar from "@/components/CarbonNavbar";
const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "Toy avtomobili necə rezervasiya olunur?",
    a: "Avtomobili seçdikdən sonra “Müraciət et” düyməsi vasitəsilə komandamızla əlaqə saxlayın. Tarix və saat dəqiqləşdirildikdən sonra rezervasiya təsdiqlənir.",
  },
  {
    q: "Avtomobil sürücü ilə təqdim olunur?",
    a: "Toy və xüsusi tədbir sifarişlərində xidmət şərtləri seçilmiş avtomobilə və tədbirin formatına görə əvvəlcədən razılaşdırılır.",
  },
  {
    q: "Fotosessiya üçün istifadə etmək mümkündür?",
    a: "Bəli. Avtomobilin fotosessiya və digər xüsusi tədbirlər üçün istifadəsini müraciət zamanı qeyd edə bilərsiniz.",
  },
  {
    q: "Qiymətə hansı xidmətlər daxildir?",
    a: "Xidmətin müddəti, marşrut və əlavə istəklər yekun qiymətə təsir edə bilər. Komandamız müraciətdən sonra bütün detalları sizə təqdim edəcək.",
  },
];

const weddingDetailText = {
  az: {
    back: "Toy avtomobilləri",
    category: "CARBON / WEDDING",
    seats: "yer",
    engine: "mühərrik",
    forSpecial: "XÜSUSİ GÜNLƏR ÜÇÜN",
    intro:
      "Toy, nişan, fotosessiya və xüsusi tədbiriniz üçün premium avtomobil təcrübəsi.",
    price: "Qiymət",
    starts: "/ başlayır",
    includes: [
      ["Tarix üzrə rezervasiya", "Tədbir gününüzə uyğun planlama"],
      ["Vaxtın dəqiqləşdirilməsi", "Komandamız sizinlə əvvəlcədən əlaqə saxlayır"],
      ["Fotosessiya", "Xüsusi çəkiliş planını müraciətdə qeyd edin"],
      ["Etibarlı xidmət", "Carbon komandası tərəfindən təşkil olunur"],
    ],
    request: "Müraciət et",
    confirmDetails: "Tarix və detalları dəqiqləşdirin",
    processLabel: "XİDMƏT PROSESİ",
    processTitle1: "Sadə və",
    processTitle2: " problemsiz.",
    processIntro:
      "Xüsusi gününüzdə avtomobil məsələsini düşünməyin. Prosesi əvvəlcədən birlikdə planlaşdırırıq.",
    steps: [
      ["01", "Avtomobili seçin", "Kolleksiyadan sizə uyğun modeli seçin."],
      ["02", "Tarixi bildirin", "Toy və ya tədbir tarixini komandamızla dəqiqləşdirin."],
      ["03", "Detalları razılaşdırın", "Saat, marşrut və xüsusi istəkləri əvvəlcədən planlaşdırın."],
      ["04", "Günün dadını çıxarın", "Qalan təşkilati avtomobil detallarını bizə buraxın."],
    ],
    faqTitle1: "Bilmək istədiyiniz",
    faqTitle2: " hər şey.",
    faqs,
    otherLabel: "DİGƏR SEÇİMLƏR",
    otherTitle: "Digər toy avtomobilləri",
    viewAll: "Hamısına bax",
    final1: "Xüsusi gününüz",
    final2: " Carbon ilə.",
    contact: "Əlaqə saxla",
  },
  en: {
    back: "Wedding cars",
    category: "CARBON / WEDDING",
    seats: "seats",
    engine: "engine",
    forSpecial: "FOR SPECIAL DAYS",
    intro:
      "A premium car experience for your wedding, engagement, photo session or special event.",
    price: "Price",
    starts: "/ starts from",
    includes: [
      ["Reservation by date", "Planning around your event day"],
      ["Time confirmation", "Our team contacts you in advance"],
      ["Photo session", "Mention the special shoot plan in your request"],
      ["Reliable service", "Organized by the Carbon team"],
    ],
    request: "Send request",
    confirmDetails: "Confirm date and details",
    processLabel: "SERVICE PROCESS",
    processTitle1: "Simple and",
    processTitle2: " smooth.",
    processIntro:
      "Do not worry about the car on your special day. We plan the process together in advance.",
    steps: [
      ["01", "Choose the car", "Choose the model that fits you from the collection."],
      ["02", "Share the date", "Confirm the wedding or event date with our team."],
      ["03", "Agree on details", "Plan the time, route and special requests in advance."],
      ["04", "Enjoy the day", "Leave the remaining car organization details to us."],
    ],
    faqTitle1: "Everything you want",
    faqTitle2: " to know.",
    faqs: [
      {
        q: "How is a wedding car reserved?",
        a: "After choosing the car, contact our team through the send request button. The reservation is confirmed after the date and time are agreed.",
      },
      {
        q: "Is the car provided with a driver?",
        a: "For wedding and special event orders, service terms are agreed in advance according to the selected car and event format.",
      },
      {
        q: "Can it be used for a photo session?",
        a: "Yes. Mention photo session or special event use when sending the request.",
      },
      {
        q: "What is included in the price?",
        a: "Duration, route and extra requests can affect the final price. Our team will share all details after your request.",
      },
    ],
    otherLabel: "OTHER OPTIONS",
    otherTitle: "Other wedding cars",
    viewAll: "View all",
    final1: "Your special day",
    final2: " with Carbon.",
    contact: "Contact us",
  },
  ru: {
    back: "Свадебные автомобили",
    category: "CARBON / СВАДЬБА",
    seats: "мест",
    engine: "двигатель",
    forSpecial: "ДЛЯ ОСОБЫХ ДНЕЙ",
    intro:
      "Премиальный автомобильный опыт для свадьбы, помолвки, фотосессии или особого мероприятия.",
    price: "Цена",
    starts: "/ от",
    includes: [
      ["Бронирование по дате", "Планирование под день вашего мероприятия"],
      ["Подтверждение времени", "Наша команда связывается с вами заранее"],
      ["Фотосессия", "Укажите план съемки в заявке"],
      ["Надежный сервис", "Организуется командой Carbon"],
    ],
    request: "Отправить заявку",
    confirmDetails: "Подтвердить дату и детали",
    processLabel: "ПРОЦЕСС УСЛУГИ",
    processTitle1: "Просто и",
    processTitle2: " спокойно.",
    processIntro:
      "В особый день не думайте об автомобиле. Мы заранее планируем процесс вместе.",
    steps: [
      ["01", "Выберите автомобиль", "Выберите подходящую модель из коллекции."],
      ["02", "Сообщите дату", "Уточните дату свадьбы или мероприятия с нашей командой."],
      ["03", "Согласуйте детали", "Заранее спланируйте время, маршрут и особые пожелания."],
      ["04", "Наслаждайтесь днем", "Оставьте остальные автомобильные детали нам."],
    ],
    faqTitle1: "Все, что вы хотите",
    faqTitle2: " знать.",
    faqs: [
      {
        q: "Как забронировать свадебный автомобиль?",
        a: "После выбора автомобиля свяжитесь с командой через кнопку заявки. Бронирование подтверждается после уточнения даты и времени.",
      },
      {
        q: "Автомобиль предоставляется с водителем?",
        a: "Для свадеб и особых мероприятий условия заранее согласуются в зависимости от автомобиля и формата события.",
      },
      {
        q: "Можно использовать для фотосессии?",
        a: "Да. Укажите фотосессию или особый формат использования при отправке заявки.",
      },
      {
        q: "Что входит в цену?",
        a: "Длительность, маршрут и дополнительные пожелания могут влиять на финальную стоимость. Команда сообщит все детали после заявки.",
      },
    ],
    otherLabel: "ДРУГИЕ ВАРИАНТЫ",
    otherTitle: "Другие свадебные автомобили",
    viewAll: "Смотреть все",
    final1: "Ваш особый день",
    final2: " с Carbon.",
    contact: "Связаться",
  },
} as const;

export default function WeddingDetailClient({
  car,
  relatedCars,
}: {
  car: Car;
  relatedCars: Car[];
}) {
  const { locale } = useCarbonCopy();
  const t = weddingDetailText[locale];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="wedding-detail-page">
      <CarbonNavbar light active="wedding" />
      

      <section className="wedding-detail-hero">
        <div className="wedding-inner">
          <Link
            href="/toy-avtomobilleri"
            className="wedding-back"
          >
            <ArrowLeft size={14} />
            {t.back}
          </Link>

          <div className="wedding-detail-grid">
            <motion.div
              className="wedding-detail-visual"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: .8, ease }}
            >
              <div className="wedding-detail-meta">
                <span>{t.category}</span>
                <span>{translateCarValue(car.category, locale)}</span>
              </div>

              <div className="wedding-detail-image">
                <div className="wedding-car-shadow" />
                <img src={car.thumbnail} alt={car.title} />
              </div>

              <div className="wedding-detail-specs">
                {car.seats != null && (
                  <span>
                    <Users size={14} />
                    <strong>{car.seats}</strong>
                    {t.seats}
                  </span>
                )}

                {car.engine && (
                  <span>
                    <Gauge size={14} />
                    <strong>{car.engine}</strong>
                    {t.engine}
                  </span>
                )}

                <span>
                  <Sparkles size={14} />
                  <strong>{translateCarValue(car.transmission, locale)}</strong>
                </span>
              </div>
            </motion.div>

            <motion.aside
              className="wedding-detail-summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: .8,
                delay: .12,
                ease,
              }}
            >
              <span className="wedding-kicker">
                {t.forSpecial}
              </span>

              <h1>{car.title}</h1>

              <p>
                {t.intro}
              </p>

              <div className="wedding-price-panel">
                <span>{t.price}</span>

                <div>
                  <strong>
                    {car.weddingPrice ?? "—"} ₼
                  </strong>
                  <small>{t.starts}</small>
                </div>
              </div>

              <div className="wedding-includes">
                <div>
                  <CalendarHeart size={16} />
                  <span>
                    <strong>{t.includes[0][0]}</strong>
                    {t.includes[0][1]}
                  </span>
                </div>

                <div>
                  <Clock3 size={16} />
                  <span>
                    <strong>{t.includes[1][0]}</strong>
                    {t.includes[1][1]}
                  </span>
                </div>

                <div>
                  <Camera size={16} />
                  <span>
                    <strong>{t.includes[2][0]}</strong>
                    {t.includes[2][1]}
                  </span>
                </div>

                <div>
                  <ShieldCheck size={16} />
                  <span>
                    <strong>{t.includes[3][0]}</strong>
                    {t.includes[3][1]}
                  </span>
                </div>
              </div>

              <Link
                href="/#contact"
                className="wedding-primary-cta"
              >
                <span>
                  {t.request}
                  <small>
                    {t.confirmDetails}
                  </small>
                </span>

                <ArrowRight size={18} />
              </Link>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="wedding-experience">
        <div className="wedding-inner">
          <div className="wedding-section-top">
            <div>
              <span>{t.processLabel}</span>
              <h2>
                {t.processTitle1}
                <em>{t.processTitle2}</em>
              </h2>
            </div>

            <p>
              {t.processIntro}
            </p>
          </div>

          <div className="wedding-process-grid">
            {t.steps.map(([number, title, text]) => (
              <div key={number}>
                <span>{number}</span>
                <Check size={17} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wedding-faq">
        <div className="wedding-inner">
          <div className="wedding-faq-heading">
            <span>FAQ</span>

            <h2>
              {t.faqTitle1}
              <em>{t.faqTitle2}</em>
            </h2>
          </div>

          <div className="wedding-faq-list">
            {t.faqs.map((item, index) => {
              const open = openFaq === index;

              return (
                <div
                  className={`wedding-faq-item ${
                    open ? "open" : ""
                  }`}
                  key={item.q}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(open ? null : index)
                    }
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>{item.q}</strong>

                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                    >
                      <ChevronDown size={17} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="wedding-faq-answer"
                      >
                        <p>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {relatedCars.length > 0 && (
        <section className="wedding-related">
          <div className="wedding-inner">
            <div className="wedding-section-top">
              <div>
                <span>{t.otherLabel}</span>
                <h2>{t.otherTitle}</h2>
              </div>

              <Link href="/toy-avtomobilleri">
                {t.viewAll}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="wedding-related-grid">
              {relatedCars.map((item) => (
                <Link
                  href={`/toy-avtomobilleri/${item.slug}`}
                  key={item.slug}
                >
                  <div>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                    />
                  </div>

                  <small>{item.brand}</small>

                  <h3>{item.title}</h3>

                  <p>
                    <strong>{item.weddingPrice} ₼</strong>
                    <span> {t.starts}</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wedding-final">
        <div className="wedding-inner wedding-final-inner">
          <div>
            <Heart size={19} />
            <h2>
              {t.final1}
              <em>{t.final2}</em>
            </h2>
          </div>

          <Link href="/#contact">
            {t.contact}
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
