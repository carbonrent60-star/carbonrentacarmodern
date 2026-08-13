import { cars } from "../data/cars";

export default function Fleet() {
  return (
    <section className="fleet" id="cars">
      <div className="fleet-container">
        <div className="fleet-heading">
          <div>
            <div className="fleet-kicker">
              <span />
              AVTOMOBİLLƏR
            </div>

            <h2>
              Səfəriniz üçün
              <br />
              <span>doğru avtomobili seçin.</span>
            </h2>
          </div>

          <div className="fleet-heading-right">
            <p>
              Şəhər gəzintisindən biznes görüşlərinə qədər hər ehtiyac üçün
              seçilmiş avtomobillər.
            </p>

            <a href="/avtomobiller">
              Bütün avtomobillər
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="car-grid">
          {cars.map((car, index) => (
            <a
              className="car-card"
              href={`/avtomobiller/${car.slug}`}
              key={car.id}
            >
              <div className="car-visual">
                <div className="car-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="car-category">{car.category}</div>

                <div className="car-placeholder">
                  <span>{car.brand}</span>
                  <strong>{car.model}</strong>
                </div>

                <div className="car-arrow">↗</div>
              </div>

              <div className="car-info">
                <div>
                  <span>{car.brand}</span>
                  <h3>{car.model}</h3>
                </div>

                <div className="car-price">
                  <strong>{car.price} ₼</strong>
                  <span>/ gün</span>
                </div>
              </div>

              <div className="car-specs">
                <span>{car.year}</span>
                <span>{car.transmission}</span>
                <span>{car.fuel}</span>
                <span>{car.seats} yer</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
