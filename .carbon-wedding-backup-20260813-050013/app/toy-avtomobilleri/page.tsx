import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Gauge,
  Users,
} from "lucide-react";
import { cars } from "@/data/cars";

export const metadata = {
  title: "Toy Avtomobilləri | Carbon Rent A Car",
  description:
    "Toy, nişan və xüsusi günlər üçün premium avtomobillər. Carbon Rent A Car.",
};

export default function WeddingCarsPage() {
  const weddingCars = cars.filter(
    (car) => car.weddingAvailable && car.weddingPrice != null
  );

  return (
    <main className="wedding-page">
      <header className="wedding-nav">
        <Link href="/" className="wedding-logo">
          <Image
            src="/images/carbon-logo.webp"
            alt="Carbon Rent A Car"
            width={180}
            height={65}
            priority
          />
        </Link>

        <nav>
          <Link href="/">Ana səhifə</Link>
          <Link href="/avtomobiller">Avtomobillər</Link>
          <Link href="/toy-avtomobilleri" className="active">
            Toy avtomobilləri
          </Link>
          <Link href="/#about">Haqqımızda</Link>
          <Link href="/#contact">Əlaqə</Link>
        </nav>

        <Link href="/#contact" className="wedding-nav-cta">
          Əlaqə saxla
          <ArrowRight size={14} />
        </Link>
      </header>

      <section className="wedding-hero">
        <div className="wedding-inner">
          <Link href="/" className="wedding-back">
            <ArrowLeft size={14} />
            Ana səhifə
          </Link>

          <div className="wedding-hero-grid">
            <div>
              <span className="wedding-kicker">
                CARBON / XÜSUSİ KOLLEKSİYA
              </span>

              <h1>
                Xüsusi gününüzə
                <em> xüsusi avtomobil.</em>
              </h1>
            </div>

            <div className="wedding-hero-copy">
              <p>
                Toy, nişan, fotosessiya və xüsusi tədbirlər üçün seçilmiş
                premium avtomobillər.
              </p>

              <div>
                <span>{String(weddingCars.length).padStart(2, "0")}</span>
                <small>AVTOMOBİL</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wedding-catalog">
        <div className="wedding-inner">
          <div className="wedding-section-top">
            <div>
              <span>SEÇİLMİŞ AVTOMOBİLLƏR</span>
              <h2>Toy kolleksiyası</h2>
            </div>

            <p>
              Klassik, sport və premium modellər arasından xüsusi gününüzə
              uyğun avtomobili seçin.
            </p>
          </div>

          <div className="wedding-grid">
            {weddingCars.map((car, index) => (
              <Link
                href={`/toy-avtomobilleri/${car.slug}`}
                className="wedding-card"
                key={car.slug}
              >
                <div className="wedding-card-top">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="wedding-card-type">
                    TOY
                  </span>
                </div>

                <div className="wedding-card-image">
                  <div className="wedding-car-shadow" />

                  <img
                    src={car.thumbnail}
                    alt={car.title}
                  />
                </div>

                <div className="wedding-card-content">
                  <div className="wedding-card-title">
                    <div>
                      <small>{car.brand}</small>
                      <h3>{car.title}</h3>
                    </div>

                    <ArrowRight size={18} />
                  </div>

                  <div className="wedding-card-specs">
                    {car.seats != null && (
                      <span>
                        <Users size={13} />
                        {car.seats} yer
                      </span>
                    )}

                    {car.engine && (
                      <span>
                        <Gauge size={13} />
                        {car.engine}
                      </span>
                    )}

                    <span>
                      <CalendarHeart size={13} />
                      Toy
                    </span>
                  </div>

                  <div className="wedding-card-price">
                    <span>Başlayır</span>

                    <strong>
                      {car.weddingPrice} ₼
                    </strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wedding-info">
        <div className="wedding-inner wedding-info-grid">
          <span>CARBON WEDDING</span>

          <h2>
            Detallar sizə deyil,
            <em> bizə qalsın.</em>
          </h2>

          <p>
            Avtomobil seçimi, vaxt və təşkilati detallar üçün komandamızla
            əlaqə saxlayın. Xüsusi gününüz üçün uyğun variantı birlikdə
            müəyyən edək.
          </p>

          <Link href="/#contact">
            Müraciət et
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
