import Layout from "@/components/Layout";
import { load } from "outstatic/server";
import ContentGrid from "@/components/ContentGrid";
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";
import { Highlighter } from "@/components/ui/highlighter";
import Header from "@/components/Header";
import Image from "next/image";
import { OstDocument } from "outstatic";

// 1. Type Definitions untuk keamanan data TypeScript
type Post = {
  tags?: { value: string; label: string }[];
} & OstDocument;

type Project = {
  tags?: { value: string; label: string }[];
} & OstDocument;

export default async function Index() {
  const { content, allPosts, allProjects } = await getData();
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;
  const remainingPosts = allPosts.slice(1);

  return (
    <Layout>
      <div className="bg-[#ffffff] min-h-screen pb-20 font-mono text-slate-800">
        <div className="sticky top-0 z-30 shadow-sm bg-white">
          <Header />
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-12">
          {/* --- HERO SECTION: Code Editor Persona --- */}
          <section className="mb-16 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-[#f3f3f3] border-b border-slate-200 px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-slate-500 lowercase tracking-tighter font-regular font-mono">
                index.tsx
              </span>
            </div>
            <div className="p-6 md:p-10 flex gap-6">
              {/* Line Numbers */}
              <div className="hidden md:block text-slate-300 text-right select-none text-sm leading-[2.5rem] font-mono">
                01 <br /> 02 <br /> 03 <br /> 04 <br /> 05
              </div>
              <div className="flex-1">
                {/* Heading dalam gaya Comment */}
                <h1 className="mb-8 text-3xl md:text-5xl font-bold tracking-tight leading-tight font-mono text-slate-400">
                  <span className="text-slate-300 italic">// </span>
                  Personal notes on <br />
                  <span className="text-blue-500 italic">technology</span>,{" "}
                  <span className="text-purple-500 italic">design</span>, <br />
                  and the{" "}
                  <span className="text-slate-800 italic">
                    <Highlighter action="box" color="#FF9800">
                      curiosities
                    </Highlighter>
                  </span>{" "}
                  in between.
                </h1>

                {/* Bio / Description tambahan */}
                <div
                  className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-2 border-slate-100 pl-6 italic font-mono"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </section>

          {/* --- FEATURED SECTION --- */}
          {featuredPost ? (
            <section className="mb-20">
              <div className="flex items-center gap-0.5">
                <div className="bg-blue-600 border-t border-x border-slate-200 px-5 py-2.5 rounded-t-md text-[11px] font-bold text-white flex items-center gap-2.5 z-10">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                    <path d="M13 2v7h7" />
                  </svg>
                  featured_article.md
                </div>
              </div>

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="block group"
              >
                <div className="bg-white border border-slate-200 rounded-b-md rounded-tr-md overflow-hidden shadow-sm group-hover:border-blue-400 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                    <div className="md:col-span-5 relative aspect-video md:aspect-auto overflow-hidden bg-slate-100 border-r border-slate-100">
                      {featuredPost.coverImage && (
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex gap-3 mb-6">
                        {featuredPost.tags?.map((tag) => (
                          <span
                            key={tag.value}
                            className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 border border-purple-100"
                          >
                            #{tag.label}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-[1.1] group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h3>
                      <div className="text-slate-500 text-sm leading-relaxed mb-10 italic">
                        {"// description:"}
                        <p className="pl-4 border-l-2 border-slate-100 line-clamp-2 mt-2 not-italic">
                          {featuredPost.description}
                        </p>
                      </div>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          last_modified:{" "}
                          {new Date(featuredPost.publishedAt)
                            .toLocaleDateString("en-GB")
                            .toUpperCase()}
                        </div>
                        <span className="inline-flex items-center gap-2 text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase">
                          read_more()
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          ) : (
            /* Empty State for Featured Post */
            <div className="mb-20 p-12 border-2 border-dashed border-slate-100 rounded-lg text-center bg-slate-50/30">
              <div className="text-slate-300 font-mono text-xs uppercase tracking-[0.3em]">
                // waiting for featured_content.commit
              </div>
            </div>
          )}

          {/* --- CONTENT LIST SECTIONS --- */}
          <div className="space-y-24">
            <ContentGrid
              title="query.results.all_posts"
              items={remainingPosts}
              collection="posts"
            />

            <ContentGrid
              title="side_experiment.log"
              items={allProjects}
              collection="projects"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

// --- DATA FETCHING ---
async function getData() {
  const db = await load();

  // Ambil konten halaman home
  const page = await db
    .find({ collection: "pages", slug: "home" }, ["content"])
    .first();

  const content = page
    ? await markdownToHtml(page.content)
    : "// No introduction content found.";

  // Ambil semua postingan
  const allPosts = await db
    .find<Post>({ collection: "posts", status: "published" }, [
      "title",
      "publishedAt",
      "slug",
      "coverImage",
      "description",
      "tags",
    ])
    .sort({ publishedAt: -1 })
    .toArray();

  // Ambil semua proyek
  const allProjects = await db
    .find<Project>({ collection: "projects", status: "published" }, [
      "title",
      "slug",
      "coverImage",
      "description",
      "publishedAt",
      "tags",
    ])
    .sort({ publishedAt: -1 })
    .toArray();

  return { content, allPosts, allProjects };
}
