import Image from "next/image";
import "./admin.css";

export default function AdminLoading() {
  return (
    <main className="admin-loader-shell" aria-label="Carbon admin yüklənir">
      <section className="admin-loader-card">
        <div className="admin-loader-mark">
          <Image src="/images/carbon-logo.webp" alt="Carbon Rent A Car" width={118} height={68} priority />
        </div>
        <div>
          <span>CARBON ADMIN</span>
          <strong>Panel hazırlanır</strong>
          <small>Avtomobil parkı və rezervasiya məlumatları yüklənir.</small>
        </div>
        <i aria-hidden="true" />
      </section>
    </main>
  );
}
