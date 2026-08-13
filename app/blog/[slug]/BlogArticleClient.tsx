"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import type { BlogPost } from "../../data/blog";
import {
  blogUi,
  formatLocalizedBlogDate,
  localizeBlogPost,
  localizeBlogPosts,
} from "../../data/blog-localized";
import { useCarbonCopy } from "@/lib/carbon-locale";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BlogArticleClient({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  const { locale } = useCarbonCopy();
  const ui = blogUi[locale];
  const localizedPost = localizeBlogPost(post, locale);
  const localizedRelated = localizeBlogPosts(related, locale);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <main className="ca-page">
      {!reduceMotion && (
        <motion.div
          className="ca-progress"
          style={{ scaleX: progress }}
        />
      )}

      <header className="ca-header">
        <div className="ca-shell">
          <motion.div
            className="ca-header-top"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 14 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <Link href="/blog">
              <ArrowLeft size={14} />
              {ui.journal}
            </Link>

            <span>
              {localizedPost.category} /{" "}
              {formatLocalizedBlogDate(localizedPost.date, locale)}
            </span>
          </motion.div>

          <motion.div
            className="ca-heading"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 24 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.06,
              ease,
            }}
          >
            <div className="ca-kicker">
              <span>{localizedPost.eyebrow}</span>
            </div>

            <h1>{localizedPost.title}</h1>

            <div className="ca-heading-bottom">
              <p>{localizedPost.intro}</p>

              <div className="ca-reading">
                <Clock3 size={14} />
                <span>{localizedPost.readingTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <motion.div
        className="ca-cover-shell"
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 18 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.85,
          delay: 0.12,
          ease,
        }}
      >
        <figure className="ca-cover">
          <img src={localizedPost.image} alt={localizedPost.title} />

          <figcaption>
            <span>CARBON JOURNAL</span>
            <span>{localizedPost.category}</span>
          </figcaption>
        </figure>
      </motion.div>

      <article className="ca-article">
        <div className="ca-article-grid">
          <aside className="ca-rail">
            <div className="ca-rail-sticky">
              <span>{ui.article}</span>
              <strong>{localizedPost.readingTime}</strong>
              <i />
              <small>CARBON / 2026</small>
            </div>
          </aside>

          <div className="ca-prose">
            {localizedPost.sections.map((section, index) => (
              <motion.section
                key={`${post.slug}-${index}`}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 20 }
                }
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.65,
                  ease,
                }}
              >
                {section.heading && (
                  <div className="ca-section-heading">
                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>
                    <h2>{section.heading}</h2>
                  </div>
                )}

                {section.paragraphs.map(
                  (paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>
                      {paragraph}
                    </p>
                  ),
                )}

                {section.quote && (
                  <blockquote>
                    <span>“</span>
                    <p>{section.quote}</p>
                  </blockquote>
                )}

                {section.image && (
                  <figure className="ca-inline-image">
                    <img
                      src={section.image}
                      alt={
                        section.imageAlt ||
                        section.heading ||
                        localizedPost.title
                      }
                    />
                  </figure>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </article>

      {localizedRelated.length > 0 && (
        <section className="ca-related">
          <div className="ca-shell">
            <div className="ca-related-head">
              <div>
                <span>{ui.continue}</span>
                <h2>{ui.nextRead}</h2>
              </div>

              <Link href="/blog">
                {ui.allArticles}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="ca-related-grid">
              {localizedRelated.slice(0, 3).map(
                (item, index) => (
                  <motion.article
                    key={item.slug}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: 22 }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.06,
                      ease,
                    }}
                  >
                    <Link
                      href={`/blog/${item.slug}`}
                      className="ca-related-image"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                      />

                      <span>
                        <ArrowUpRight size={16} />
                      </span>
                    </Link>

                    <small>{item.category}</small>

                    <Link
                      href={`/blog/${item.slug}`}
                    >
                      <h3>{item.title}</h3>
                    </Link>
                  </motion.article>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
