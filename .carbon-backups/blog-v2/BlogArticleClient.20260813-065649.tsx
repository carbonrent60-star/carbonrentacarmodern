"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
} from "lucide-react";
import type { BlogPost } from "../../data/blog";
import { formatBlogDate } from "../../data/blog";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BlogArticleClient({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  return (
    <main className="article-page">
      <header className="article-hero">
        <motion.div
          className="article-hero-copy"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease }}
        >
          <Link href="/blog" className="article-back">
            <ArrowLeft size={16} />
            Journal
          </Link>

          <div className="article-eyebrow">
            {post.eyebrow}
          </div>

          <h1>{post.title}</h1>

          <p>{post.intro}</p>

          <div className="article-meta">
            <span>{post.category}</span>
            <i />
            <span>{formatBlogDate(post.date)}</span>
            <i />
            <span>
              <Clock3 size={14} />
              {post.readingTime}
            </span>
          </div>
        </motion.div>
      </header>

      <motion.figure
        className="article-cover"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.15, ease }}
      >
        <img src={post.image} alt={post.title} />
      </motion.figure>

      <article className="article-body">
        <aside className="article-rail">
          <span>CARBON JOURNAL</span>
          <div />
          <small>{post.readingTime} oxu</small>
        </aside>

        <div className="article-prose">
          {post.sections.map((section, index) => (
            <motion.section
              key={`${post.slug}-${index}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.7, ease }}
            >
              {section.heading && <h2>{section.heading}</h2>}

              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}

              {section.quote && (
                <blockquote>
                  <span>“</span>
                  {section.quote}
                </blockquote>
              )}

              {section.image && (
                <figure className="article-inline-image">
                  <img
                    src={section.image}
                    alt={section.imageAlt || section.heading || post.title}
                  />
                </figure>
              )}
            </motion.section>
          ))}
        </div>
      </article>

      <section className="article-related">
        <div className="article-related-head">
          <div>
            <span>DAVAM ET</span>
            <h2>Daha çox Journal</h2>
          </div>

          <Link href="/blog">
            Hamısına bax
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="article-related-grid">
          {related.map((item) => (
            <Link
              href={`/blog/${item.slug}`}
              className="article-related-card"
              key={item.slug}
            >
              <div>
                <img src={item.image} alt={item.title} />
                <span>
                  <ArrowRight size={18} />
                </span>
              </div>

              <small>{item.category}</small>
              <h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
