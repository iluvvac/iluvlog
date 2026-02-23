import Layout from "@/components/Layout";
import { load } from "outstatic/server";
import ContentGrid from "@/components/ContentGrid";
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";
import { Highlighter } from "@/components/ui/highlighter";
import Header from "@/components/Header";

export default async function Index() {
  const { content, allPosts, allProjects } = await getData();
  const featuredPost = allPosts[0] as any;
  const remainingPosts = allPosts.slice(1);

  return (
    <Layout>
      <div className="bg-[#ffffff] min-h-screen pb-20 font-mono text-slate-800">
        <div className="sticky top-0 z-30 shadow-sm bg-white">
          <Header />
        </div>
        <div className="max-w-5xl mx-auto px-6 pt-12">
          {/* Editor Header Style */}
          <section className="mb-16 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-[#f3f3f3] border-b border-slate-200 px-4 py-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">
                index.tsx — iluvlog
              </span>
            </div>
            <div className="p-6 md:p-10 flex gap-6">
              {/* Line Numbers */}
              <div className="hidden md:block text-slate-300 text-right select-none text-sm leading-[2.5rem]">
                01 <br /> 02 <br /> 03 <br /> 04 <br /> 05
              </div>
              <div className="flex-1">
                <h1 className="mb-8 text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  <span className="text-purple-600">const</span>{" "}
                  <span className="text-blue-600">Dasteen</span> = () ={">"}{" "}
                  {"{"} <br />
                  <span className="pl-6 block">
                    I am{" "}
                    <Highlighter action="highlight" color="#fff176">
                      Dasteen
                    </Highlighter>
                    <Highlighter action="circle" color="#42a5f5">
                      , nice to meet you.
                    </Highlighter>
                  </span>
                  {"}"}
                </h1>
                <div
                  className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-2 border-slate-100 pl-6 italic"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </section>

          {/* Featured Post - Code Editor Aesthetic */}
          {featuredPost && (
            <div className="mb-20">
              {/* Window Tab Bar */}
              <div className="flex items-center gap-0.5">
                <div className="bg-blue-600 border-t border-x border-slate-200 px-5 py-2.5 rounded-t-md text-[11px] font-mono font-bold text-white flex items-center gap-2.5 shadow-[0_-2px_5px_rgba(0,0,0,0.02)] z-10">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-blue-500"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                    <path d="M13 2v7h7" />
                  </svg>
                  featured_article.md
                </div>
                {/* Background Tab (Decorative) */}
                <div className="hidden md:flex bg-slate-50/50 border-t border-x border-slate-100 px-4 py-2.5 rounded-t-md text-[10px] font-mono text-slate-400 items-center gap-2 italic">
                  config.json
                </div>
              </div>

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="block group"
              >
                <div className="bg-white border border-slate-200 rounded-b-md rounded-tr-md overflow-hidden shadow-sm group-hover:border-blue-400 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                    {/* Visual Data Section (Full Color) */}
                    <div className="md:col-span-5 relative aspect-video md:aspect-auto overflow-hidden bg-slate-100 border-r border-slate-100">
                      {featuredPost.coverImage && (
                        <img
                          src={featuredPost.coverImage}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={featuredPost.title}
                        />
                      )}
                      {/* Syntax Label Overlay */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-mono font-bold text-slate-600 border border-slate-200 shadow-sm">
                        TYPE: IMAGE_COVER
                      </div>
                    </div>

                    {/* Code Body Section */}
                    <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center font-mono">
                      {/* Tags as Keywords */}
                      <div className="flex gap-3 mb-6">
                        {featuredPost.tags?.map((tag: any) => (
                          <span
                            key={tag.value}
                            className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-sm border border-purple-100"
                          >
                            #{tag.label}
                          </span>
                        ))}
                      </div>

                      {/* Focused Title */}
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-[1.1] group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h3>

                      {/* Meta Description as Code Comment */}
                      <div className="text-slate-500 text-sm leading-relaxed mb-10">
                        <span className="text-slate-300 block mb-1">
                          {"// description:"}
                        </span>
                        <p className="pl-4 border-l-2 border-slate-100 line-clamp-2">
                          {featuredPost.description ||
                            "No metadata description found for this source file."}
                        </p>
                      </div>

                      {/* Footer: Date & Execute Function */}
                      <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          LAST_MODIFIED:{" "}
                          {new Date(featuredPost.publishedAt)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            .toUpperCase()}
                        </div>

                        <span className="inline-flex items-center gap-2 text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          READ_MORE()
                          <svg
                            viewBox="0 0 24 24"
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Bottom Sections */}
          <div className="space-y-20">
            {/* Database Schema 3 Columns */}
            {remainingPosts.length > 0 && (
              <section className="mt-20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-blue-500"></div>
                  <h2 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    query.results.all_posts
                  </h2>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {remainingPosts.map((post: any) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 hover:border-blue-600 hover:shadow-md"
                    >
                      {/* 1. Image Data Section */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-slate-300">
                            NULL_BLOB
                          </div>
                        )}
                      </div>

                      {/* 2. Database Record Body */}
                      <div className="p-4 flex-1 flex flex-col font-mono text-[11px]">
                        {/* ID Row */}
                        <div className="flex justify-between items-center mb-3 text-slate-400 border-b border-slate-50 pb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500 font-bold">id</span>
                            <span>{post.slug}</span>
                          </div>
                          <span className="text-[9px] italic">uuid</span>
                        </div>

                        {/* Title - Bold and Clean */}
                        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>

                        {/* Meta Description - Comment Style */}
                        <p className="text-slate-500 leading-relaxed line-clamp-2 mb-4">
                          {"// "} {post.description || "No description found."}
                        </p>

                        {/* Tags - Row Value */}
                        <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-50">
                          <span className="text-purple-500 font-bold text-[9px]">
                            TAGS
                          </span>
                          <div className="flex gap-1.5 overflow-hidden">
                            {post.tags?.slice(0, 2).map((tag: any) => (
                              <span
                                key={tag.value}
                                className="text-slate-400 truncate"
                              >
                                '{tag.label}'
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3. Footer Relationship */}
                      <div className="bg-slate-50/50 px-4 py-2 border-t border-slate-100 flex justify-between items-center font-mono text-[9px]">
                        <span className="text-slate-400">
                          {new Date(post.publishedAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        <span className="text-blue-600 font-bold group-hover:underline">
                          READ_MORE()
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {allProjects.length > 0 && (
              <ContentGrid
                title="side_experiment.log"
                items={allProjects}
                collection="projects"
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

async function getData() {
  const db = await load();
  const page = await db
    .find({ collection: "pages", slug: "home" }, ["content"])
    .first();
  const content = await markdownToHtml(page.content);
  const allPosts = await db
    .find({ collection: "posts", status: "published" }, [
      "title",
      "publishedAt",
      "slug",
      "coverImage",
      "description",
      "tags",
    ])
    .sort({ publishedAt: -1 })
    .toArray();
  const allProjects = await db
    .find({ collection: "projects", status: "published" }, [
      "title",
      "slug",
      "coverImage",
    ])
    .sort({ publishedAt: -1 })
    .toArray();
  return { content, allPosts, allProjects };
}
