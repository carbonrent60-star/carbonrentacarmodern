"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock3 } from "lucide-react";
import {
  blogPosts,
  formatBlogDate,
} from "../data/blog";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BlogClient() {
  const [category, setCategory] = useState("Hamısı");

  const categories = useMemo(
    () => [
      "Hamısı",
      ...Array.from(new Set(blogPosts.map((post) => post.category))),
    ],
    [],
  );

  const visible =
    category === "Hamısı"
      ? blogPosts
      : blogPosts.filter((post) => post.category === category);

  const featured = visible[0];

  return (
    <main className="carbon-journal">
      <section className="journal-hero">
        <div className="journal-orb journal-orb-one" />
        <div className="journal-orb journal-orb-two" />

        <motion.div
          className="journal-hero-inner"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="journal-kicker">
            <span />
            CARBON JOURNAL
          </div>

          <h1>
            Yolda lazım olan
            <br />
            <em>fikirlər.</em>
          </h1>

          <div className="journal-hero-bottom">
            <p>
              Avtomobil seçimi, sığorta, səyahət və yol təcrübəsi
              haqqında praktik bələdçilər.
            </p>

            <div className="journal-count">
              <strong>{String(blogPosts.length).padStart(2, "0")}</strong>
              <span>MƏQALƏ</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="journal-content">
        <motion.div
          className="journal-filter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "is-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </motion.div>

        {featured && (
          <motion.article
            key={`featured-${featured.slug}`}
            className="journal-featured"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <Link
              href={`/blog/${featured.slug}`}
              className="journal-featured-media"
            >
              <img src={featured.image} alt={featured.title} />
              <div className="journal-image-shade" />
              <span className="journal-featured-index">01</span>
            </Link>

            <div className="journal-featured-copy">
              <div className="journal-meta">
                <span>{featured.category}</span>
                <i />
                <span>{formatBlogDate(featured.date)}</span>
              </div>

              <h2>{featured.title}</h2>
              <p>{featured.description}</p>

              <Link
                href={`/blog/${featured.slug}`}
                className="journal-read-link"
              >
                Məqaləni oxu
                <span>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </motion.article>
        )}

        <div className="journal-section-head">
          <span>SEÇİLMİŞ YAZILAR</span>
          <span>{visible.length} məqalə</span>
        </div>

        <motion.div
          layout
          className="journal-grid"
        >
          {visible.slice(1).map((post, index) => (
            <motion.article
              layout
              key={post.slug}
              className={`journal-card ${
                index === 2 ? "journal-card-wide" : ""
              }`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: Math.min(index * 0.06, 0.24),
                ease,
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="journal-card-media"
              >
                <img src={post.image} alt={post.title} />
                <div className="journal-image-shade" />

                <div className="journal-card-arrow">
                  <ArrowRight size={19} />
                </div>
              </Link>

              <div className="journal-card-body">
                <div className="journal-meta">
                  <span>{post.category}</span>
                  <i />
                  <span>{formatBlogDate(post.date)}</span>
                </div>

                <h3>
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p>{post.description}</p>

                <div className="journal-card-foot">
                  <span>
                    <Clock3 size={14} />
                    {post.readingTime}
                  </span>

                  <Link href={`/blog/${post.slug}`}>
                    Oxu <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <section className="journal-cta">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease }}
          >
            <span>YOLA HAZIRSAN?</span>
            <h2>
              Növbəti səfərini
              <br />
              Carbon ilə başla.
            </h2>

            <a href="/avtomobiller">
              Avtomobillərə bax
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </section>
      </section>
    </main>
  );
}
