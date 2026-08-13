"use client";

import { motion } from "motion/react";
import { Quote, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useCarbonCopy } from "@/lib/carbon-locale";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomeTestimonials() {
  const { copy } = useCarbonCopy();
  const testimonials = copy.testimonials.items;
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="home-testimonials">
      <div className="home-testimonials-glow" />
      <div className="home-testimonials-inner">
        <motion.div
          className="home-testimonials-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.32 }}
          transition={{ duration: 0.75, ease }}
        >
          <div>
            <span className="home-testimonials-kicker">
              <i />
              {copy.testimonials.kicker}
            </span>
            <h2>
              {copy.testimonials.title1}
              <br />
              <em>{copy.testimonials.title2}</em>
            </h2>
          </div>

          <p>{copy.testimonials.intro}</p>
        </motion.div>

        <motion.div
          className="home-testimonials-stats"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
        >
          {copy.testimonials.stats.map(([value, label], index) => (
            <div key={`${value}-${label}`}>
              {index === 0 ? <Star size={15} /> : index === 1 ? <Sparkles size={15} /> : <ShieldCheck size={15} />}
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <div className="home-testimonials-rail-wrap">
          <div className="home-testimonials-rail">
            {marqueeItems.map((item, index) => (
              <article
                className="home-testimonial-card"
                key={`${item.name}-${index}`}
              >
                <div className="home-testimonial-top">
                  <span>{String((index % testimonials.length) + 1).padStart(2, "0")}</span>
                  <Quote size={18} strokeWidth={1.35} />
                </div>

                <p>{item.text}</p>

                <div className="home-testimonial-person">
                  <span>{item.name.slice(0, 1)}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
