"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import {
  blogPosts,
  formatBlogDate,
} from "../data/blog";

const ease = [0.22, 1, 0.36, 1] as const;

function ArticleImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`cj-image ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease }}
    >
      <img src={src} alt={alt} />
    </motion.div>
  );
}

export default function BlogClient() {
  const [category, setCategory] = useState("Hamısı");
  const reduceMotion = useReducedMotion();

  const categories = useMemo(
    () => [
      "Hamısı",
      ...Array.from(
        new Set(blogPosts.map((post) => post.category)),
      ),
    ],
    [],
  );

  const visible =
    category === "Hamısı"
      ? blogPosts
      : blogPosts.filter(
          (post) => post.category === category,
        );

  const featured = visible[0];
  const stories = visible.slice(1);

  return (
    <main className="cj-page">

      <section className="cj-intro">
        <div className="cj-shell">
          <motion.div
            className="cj-intro-grid"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 22 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            <div className="cj-intro-main">
              <div className="cj-overline">
                <span>CARBON</span>
                <i />
                JOURNAL
              </div>

              <h1>
                Yol üçün
                <br />
                <span>daha yaxşı fikirlər.</span>
              </h1>
            </div>

            <div className="cj-intro-side">
              <p>
                Avtomobil, səyahət, sığorta və düzgün
                seçim haqqında qısa, praktik bələdçilər.
              </p>

              <div className="cj-issue">
                <span>JOURNAL / 2026</span>
                <strong>
                  {String(blogPosts.length).padStart(2, "0")}
                </strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="cj-filter-wrap">
        <div className="cj-shell">
          <div className="cj-filter-bar">
            <span className="cj-filter-label">
              Kateqoriya
            </span>

            <div className="cj-filters">
              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={active ? "active" : ""}
                  >
                    {active && (
                      <motion.span
                        className="cj-filter-active"
                        layoutId="journal-filter-active"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}

                    <span className="cj-filter-text">
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 12 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, y: -8 }
          }
          transition={{ duration: 0.35, ease }}
        >
          {featured && (
            <section className="cj-feature-section">
              <div className="cj-shell">
                <div className="cj-section-label">
                  <span>01</span>
                  <p>Seçilmiş məqalə</p>
                  <i />
                  <small>
                    {String(visible.length).padStart(2, "0")} yazı
                  </small>
                </div>

                <article className="cj-feature">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="cj-feature-media"
                  >
                    <ArticleImage
                      src={featured.image}
                      alt={featured.title}
                      className="cj-feature-image"
                    />

                    <div className="cj-media-index">
                      01
                    </div>

                    <motion.div
                      className="cj-hover-action"
                      whileHover={{
                        scale: 1.06,
                        rotate: 3,
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </motion.div>
                  </Link>

                  <div className="cj-feature-copy">
                    <div className="cj-meta">
                      <span>{featured.category}</span>
                      <i />
                      <span>
                        {formatBlogDate(featured.date)}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${featured.slug}`}
                      className="cj-feature-title"
                    >
                      <h2>{featured.title}</h2>
                    </Link>

                    <p>{featured.description}</p>

                    <div className="cj-feature-bottom">
                      <span>
                        <Clock3 size={13} />
                        {featured.readingTime}
                      </span>

                      <Link
                        href={`/blog/${featured.slug}`}
                        className="cj-text-link"
                      >
                        Oxumağa başla
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          )}

          {stories.length > 0 && (
            <section className="cj-stories">
              <div className="cj-shell">
                <div className="cj-section-label">
                  <span>02</span>
                  <p>Son yazılar</p>
                  <i />
                  <small>Carbon Journal</small>
                </div>

                <div className="cj-editorial-grid">
                  {stories.map((post, index) => (
                    <motion.article
                      className={`cj-story cj-story-${
                        index + 1
                      }`}
                      key={post.slug}
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, y: 24 }
                      }
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.12,
                      }}
                      transition={{
                        duration: 0.65,
                        delay: Math.min(
                          index * 0.055,
                          0.18,
                        ),
                        ease,
                      }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="cj-story-media"
                      >
                        <ArticleImage
                          src={post.image}
                          alt={post.title}
                        />

                        <span className="cj-story-number">
                          {String(index + 2).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="cj-story-arrow">
                          <ArrowUpRight size={17} />
                        </span>
                      </Link>

                      <div className="cj-story-copy">
                        <div className="cj-meta">
                          <span>{post.category}</span>
                          <i />
                          <span>{post.readingTime}</span>
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                        >
                          <h3>{post.title}</h3>
                        </Link>

                        <p>{post.description}</p>

                        <div className="cj-story-foot">
                          <span>
                            {formatBlogDate(post.date)}
                          </span>

                          <Link
                            href={`/blog/${post.slug}`}
                          >
                            Oxu
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      <section className="cj-end">
        <div className="cj-shell">
          <motion.div
            className="cj-end-card"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="cj-end-label">
              CARBON RENT A CAR
            </div>

            <div className="cj-end-main">
              <h2>
                Oxumaq kifayətdir.
                <br />
                <span>İndi yola çıx.</span>
              </h2>

              <Link href="/avtomobiller">
                Avtomobillərə bax
                <span>
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
