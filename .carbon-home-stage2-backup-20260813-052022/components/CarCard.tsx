"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Fuel,
  Gauge,
  Users,
} from "lucide-react";
import {
  type Car,
  getShortTermPrice,
} from "@/data/cars";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CarCard({
  car,
  index,
}: {
  car: Car;
  index: number;
}) {
  const price = getShortTermPrice(car);

  return (
    <motion.article
      className="car-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.75,
        delay: Math.min(index * 0.08, 0.2),
        ease,
      }}
    >
      <div className="car-image-area">
        <div className="car-card-top">
          <span className="car-category">{car.category}</span>

          {car.transferAvailable && (
            <span className="transfer-badge">
              Transfer
            </span>
          )}
        </div>

        <motion.img
          src={car.thumbnail}
          alt={car.title}
          className="car-image"
          loading="lazy"
          whileHover={{ scale: 1.035 }}
          transition={{
            duration: 0.7,
            ease,
          }}
        />

        <motion.a
          className="car-open"
          href={`/avtomobiller/${car.slug}`}
          whileHover={{
            scale: 1.08,
            rotate: 4,
          }}
          whileTap={{ scale: 0.94 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 25,
          }}
          aria-label={`${car.title} avtomobilinə bax`}
        >
          <ArrowUpRight size={18} strokeWidth={1.6} />
        </motion.a>
      </div>

      <div className="car-card-content">
        <div className="car-name-row">
          <div>
            <span className="car-brand">{car.brand}</span>
            <h3>{car.title}</h3>
          </div>

          <div className="car-price">
            {price !== null ? (
              <>
                <strong>{price} ₼</strong>
                <span>/ gün</span>
              </>
            ) : (
              <span>Qiymət üçün əlaqə</span>
            )}
          </div>
        </div>

        <div className="car-specs">
          {car.seats !== null && (
            <span>
              <Users size={15} strokeWidth={1.5} />
              {car.seats} yer
            </span>
          )}

          <span>
            <Gauge size={15} strokeWidth={1.5} />
            {car.transmission}
          </span>

          <span>
            <Fuel size={15} strokeWidth={1.5} />
            {car.fuel}
          </span>

          {car.baggage !== null && (
            <span>
              <BriefcaseBusiness size={15} strokeWidth={1.5} />
              {car.baggage}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
