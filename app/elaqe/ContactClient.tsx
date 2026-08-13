"use client";

import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

type FormType = "general" | "complaint" | "review";

type FieldProps = {
  label: string;
  children: ReactNode;
  wide?: boolean;
};

const modes = [
  {
    id: "general" as const,
    index: "01",
    label: "Ümumi sorğu",
    short: "Sualınız var?",
    description:
      "İcarə, avtomobillər, rezervasiya və xidmətlər haqqında bizə yazın.",
    icon: CircleHelp,
  },
  {
    id: "complaint" as const,
    index: "02",
    label: "Şikayət",
    short: "Problem bildirin",
    description:
      "Qarşılaşdığınız problemi ətraflı paylaşın. Hər müraciət diqqətlə araşdırılır.",
    icon: MessageSquareText,
  },
  {
    id: "review" as const,
    index: "03",
    label: "Rəy",
    short: "Təcrübənizi bölüşün",
    description:
      "Xidmət təcrübənizi bizimlə paylaşın və daha yaxşı olmağımıza kömək edin.",
    icon: Star,
  },
];

function Field({ label, children, wide = false }: FieldProps) {
  return (
    <label className={`contact-field${wide ? " contact-field-wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function buildReference() {
  const value = Math.floor(100000 + Math.random() * 900000);
  return `CR-${value}`;
}

export default function ContactClient() {
  const [mode, setMode] = useState<FormType>("general");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const activeMode = useMemo(
    () => modes.find((item) => item.id === mode) ?? modes[0],
    [mode],
  );

  function changeMode(next: FormType) {
    setMode(next);
    setSubmitted(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const ref = buildReference();
    setReference(ref);
    setSubmitted(true);

    const labels: Record<string, string> = {
      general: "ÜMUMİ SORĞU",
      complaint: "ŞİKAYƏT",
      review: "RƏY",
    };

    const lines = [
      `Carbon Rent A Car — ${labels[mode]}`,
      `Müraciət: ${ref}`,
      "",
    ];

    for (const [key, rawValue] of data.entries()) {
      const value = String(rawValue).trim();

      if (!value || key === "type") continue;

      const names: Record<string, string> = {
        name: "Ad",
        surname: "Soyad",
        phone: "Əlaqə nömrəsi",
        email: "Email",
        topic: "Mövzu",
        rentalDate: "İcarə tarixi",
        vehicle: "Avtomobil",
        employee: "Xidmət göstərən əməkdaş",
        complaintCategory: "Şikayətin mövzusu",
        message: mode === "review" ? "Rəy" : "Mesaj",
      };

      lines.push(`${names[key] ?? key}: ${value}`);
    }

    lines.push("");
    lines.push(`Müraciət kodu: ${ref}`);

    const subject =
      mode === "complaint"
        ? `Carbon — Şikayət ${ref}`
        : mode === "review"
          ? `Carbon — Rəy ${ref}`
          : `Carbon — Sorğu ${ref}`;

    const mailto =
      `mailto:info@crbnrnt.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;

    window.setTimeout(() => {
      window.location.href = mailto;
    }, 650);
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-orb contact-hero-orb-a" />
        <div className="contact-hero-orb contact-hero-orb-b" />

        <div className="contact-shell contact-hero-shell">
          <motion.div
            className="contact-hero-copy"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease }}
          >
            <div className="contact-kicker">
              <span />
              CARBON SUPPORT
            </div>

            <h1>
              Əlaqə və
              <br />
              <em>dəstək.</em>
            </h1>

            <p>
              Sizi dinləmək xidmətimizin bir hissəsidir. Sualınızı,
              rəyinizi və ya şikayətinizi birbaşa Carbon komandası ilə
              paylaşın.
            </p>
          </motion.div>

          <motion.div
            className="contact-hero-status"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease }}
          >
            <div className="contact-status-top">
              <span className="contact-status-dot" />
              <span>DƏSTƏK XƏTTİ AKTİVDİR</span>
            </div>

            <strong>24/7</strong>

            <p>
              Səfərinizlə bağlı təcili vəziyyətlər üçün telefonla
              əlaqə saxlaya bilərsiniz.
            </p>

            <a href="tel:+994504840006">
              <Phone size={15} />
              +994 50 484 00 06
              <ArrowUpRight size={15} />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="contact-channels">
        <div className="contact-shell">
          <div className="contact-section-label">
            <span>ƏLAQƏ KANALLARI</span>
            <span>01</span>
          </div>

          <div className="contact-channel-grid">
            <motion.a
              href="tel:+994504840006"
              className="contact-channel-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="contact-channel-icon">
                <Phone size={20} />
              </div>

              <div>
                <small>TELEFON</small>
                <strong>+994 50 484 00 06</strong>
                <span>Birbaşa Carbon komandası</span>
              </div>

              <ArrowUpRight size={17} className="contact-channel-arrow" />
            </motion.a>

            <motion.a
              href="mailto:info@crbnrnt.com"
              className="contact-channel-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="contact-channel-icon">
                <Mail size={20} />
              </div>

              <div>
                <small>EMAIL</small>
                <strong>info@crbnrnt.com</strong>
                <span>Yazılı müraciətlər üçün</span>
              </div>

              <ArrowUpRight size={17} className="contact-channel-arrow" />
            </motion.a>

            <motion.div
              className="contact-channel-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="contact-channel-icon">
                <MapPin size={20} />
              </div>

              <div>
                <small>ÜNVAN</small>
                <strong>Ələsgər Qayıbov küç. 1222</strong>
                <span>Bakı, Azərbaycan</span>
              </div>

              <MapPin size={16} className="contact-channel-arrow" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="contact-workspace">
        <div className="contact-shell">
          <div className="contact-section-label">
            <span>MÜRACİƏT MƏRKƏZİ</span>
            <span>02</span>
          </div>

          <div className="contact-workspace-heading">
            <div>
              <span className="contact-mini-kicker">BİZƏ YAZIN</span>

              <h2>
                Nə barədə
                <br />
                <em>danışmaq istəyirsiniz?</em>
              </h2>
            </div>

            <p>
              Uyğun müraciət növünü seçin. Forma yalnız sizə lazım olan
              məlumatları göstərəcək.
            </p>
          </div>

          <div className="contact-mode-grid">
            {modes.map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;

              return (
                <motion.button
                  type="button"
                  key={item.id}
                  className={`contact-mode-card${active ? " is-active" : ""}`}
                  onClick={() => changeMode(item.id)}
                  whileTap={{ scale: 0.985 }}
                  layout
                >
                  <div className="contact-mode-top">
                    <span>{item.index}</span>

                    <div>
                      <Icon size={19} />
                    </div>
                  </div>

                  <strong>{item.label}</strong>
                  <small>{item.short}</small>

                  <p>{item.description}</p>

                  <div className="contact-mode-select">
                    <span>{active ? "SEÇİLİB" : "SEÇ"}</span>

                    <span className="contact-mode-circle">
                      {active ? (
                        <Check size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="contact-form-stage">
            <div className="contact-form-aside">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease }}
                >
                  <span className="contact-form-number">
                    {activeMode.index}
                  </span>

                  <div className="contact-form-aside-icon">
                    <activeMode.icon size={23} />
                  </div>

                  <h3>{activeMode.label}</h3>
                  <p>{activeMode.description}</p>

                  <div className="contact-form-assurance">
                    <ShieldCheck size={16} />

                    <span>
                      Məlumatlarınız yalnız müraciətinizi cavablandırmaq
                      məqsədilə istifadə olunur.
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="contact-form-panel">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key={mode}
                    onSubmit={submit}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <input type="hidden" name="type" value={mode} />

                    <div className="contact-form-head">
                      <div>
                        <small>
                          {mode === "general"
                            ? "ÜMUMİ MÜRACİƏT"
                            : mode === "complaint"
                              ? "ŞİKAYƏT FORMASI"
                              : "RƏY FORMASI"}
                        </small>

                        <h3>
                          {mode === "general"
                            ? "Sualınızı bizə göndərin."
                            : mode === "complaint"
                              ? "Problemi bizə bildirin."
                              : "Təcrübənizi paylaşın."}
                        </h3>
                      </div>

                      <span className="contact-form-estimate">
                        <Clock3 size={14} />
                        2 dəq.
                      </span>
                    </div>

                    <div className="contact-form-grid">
                      <Field label="AD">
                        <input
                          name="name"
                          placeholder="Adınız"
                          autoComplete="given-name"
                          required
                        />
                      </Field>

                      <Field label="SOYAD">
                        <input
                          name="surname"
                          placeholder="Soyadınız"
                          autoComplete="family-name"
                          required={mode !== "review"}
                        />
                      </Field>

                      {mode !== "review" && (
                        <>
                          <Field label="ƏLAQƏ NÖMRƏSİ">
                            <input
                              name="phone"
                              type="tel"
                              placeholder="+994 50 000 00 00"
                              autoComplete="tel"
                              required
                            />
                          </Field>

                          <Field label="EMAIL">
                            <input
                              name="email"
                              type="email"
                              placeholder="email@example.com"
                              autoComplete="email"
                            />
                          </Field>
                        </>
                      )}

                      {mode === "general" && (
                        <Field label="MÖVZU" wide>
                          <select name="topic" defaultValue="" required>
                            <option value="" disabled>
                              Müraciətin mövzusunu seçin
                            </option>
                            <option value="Rezervasiya">
                              Rezervasiya
                            </option>
                            <option value="Avtomobil seçimi">
                              Avtomobil seçimi
                            </option>
                            <option value="Qiymət və depozit">
                              Qiymət və depozit
                            </option>
                            <option value="Sığorta">
                              Sığorta
                            </option>
                            <option value="Transfer">
                              Transfer
                            </option>
                            <option value="Toy avtomobilləri">
                              Toy avtomobilləri
                            </option>
                            <option value="Digər">
                              Digər
                            </option>
                          </select>
                        </Field>
                      )}

                      {mode === "complaint" && (
                        <>
                          <Field label="ŞİKAYƏTİNİZ NƏ İLƏ BAĞLIDIR?" wide>
                            <select
                              name="complaintCategory"
                              defaultValue=""
                              required
                            >
                              <option value="" disabled>
                                Kateqoriya seçin
                              </option>
                              <option value="Avtomobil">
                                Avtomobil
                              </option>
                              <option value="Rezervasiya">
                                Rezervasiya
                              </option>
                              <option value="Ödəniş / depozit">
                                Ödəniş / depozit
                              </option>
                              <option value="Əməkdaş / xidmət">
                                Əməkdaş / xidmət
                              </option>
                              <option value="Təhvil / qaytarılma">
                                Təhvil / qaytarılma
                              </option>
                              <option value="Digər">
                                Digər
                              </option>
                            </select>
                          </Field>

                          <Field label="İCARƏ TARİXİ">
                            <span className="contact-input-icon">
                              <CalendarDays size={16} />

                              <input
                                name="rentalDate"
                                type="date"
                              />
                            </span>
                          </Field>

                          <Field label="AVTOMOBİLİN MARKASI / MODELİ">
                            <span className="contact-input-icon">
                              <CarFront size={16} />

                              <input
                                name="vehicle"
                                placeholder="Məs: Mercedes E-Class"
                              />
                            </span>
                          </Field>
                        </>
                      )}

                      {(mode === "complaint" || mode === "review") && (
                        <Field
                          label="XİDMƏT GÖSTƏRƏN ƏMƏKDAŞ"
                          wide={mode === "review"}
                        >
                          <span className="contact-input-icon">
                            <UserRound size={16} />

                            <input
                              name="employee"
                              placeholder="Adı bilirsinizsə qeyd edin"
                            />
                          </span>
                        </Field>
                      )}

                      <Field
                        label={
                          mode === "review"
                            ? "RƏYİNİZ"
                            : mode === "complaint"
                              ? "ŞİKAYƏTİNİZ"
                              : "MESAJINIZ"
                        }
                        wide
                      >
                        <textarea
                          name="message"
                          rows={7}
                          placeholder={
                            mode === "review"
                              ? "Təcrübənizi bizimlə bölüşün..."
                              : mode === "complaint"
                                ? "Qarşılaşdığınız vəziyyəti mümkün qədər ətraflı izah edin..."
                                : "Sualınızı və ya müraciətinizi yazın..."
                          }
                          required
                        />
                      </Field>
                    </div>

                    <div className="contact-form-footer">
                      <p>
                        Göndər düyməsi cihazınızda email tətbiqini
                        müraciət məlumatları ilə açacaq.
                      </p>

                      <motion.button
                        type="submit"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>
                          Müraciəti hazırla
                          <small>CARBON SUPPORT</small>
                        </span>

                        <span className="contact-submit-icon">
                          <Send size={17} />
                        </span>
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    className="contact-success"
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <div className="contact-success-icon">
                      <Check size={27} />
                    </div>

                    <span>MÜRACİƏT HAZIRDIR</span>

                    <h3>
                      Emailiniz
                      <br />
                      <em>hazırlanır.</em>
                    </h3>

                    <p>
                      Email tətbiqiniz açıldıqda məlumatları yoxlayıb
                      göndərə bilərsiniz.
                    </p>

                    <div className="contact-reference">
                      <small>MÜRACİƏT KODU</small>
                      <strong>{reference}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                    >
                      Formaya qayıt
                      <ArrowRight size={15} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-care">
        <div className="contact-shell">
          <motion.div
            className="contact-care-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease }}
          >
            <div className="contact-care-decoration" />

            <div>
              <span>
                <Sparkles size={14} />
                CARBON CARE
              </span>

              <h2>
                Səfərdən əvvəl,
                <br />
                səfər zamanı,
                <br />
                <em>səfərdən sonra.</em>
              </h2>
            </div>

            <div className="contact-care-side">
              <Headphones size={32} strokeWidth={1.2} />

              <p>
                Məqsədimiz sadəcə avtomobil təqdim etmək deyil.
                Bütün icarə təcrübəsi boyunca sizin üçün əlçatan
                qalmaqdır.
              </p>

              <a href="tel:+994504840006">
                İndi zəng et
                <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
