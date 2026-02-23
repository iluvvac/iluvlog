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

          {/* Featured Post - Editor Tab Style */}
          {featuredPost && (
            <div className="mb-20">
              <div className="flex items-center mb-0">
                <div className="bg-white border-t border-x border-slate-200 px-4 py-2 rounded-t-md text-xs font-bold text-blue-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  featured_article.md
                </div>
              </div>

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="block group"
              >
                <div className="bg-white border border-slate-200 p-1 group-hover:border-blue-300 transition-colors shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                    <div className="md:col-span-5 aspect-video overflow-hidden">
                      {featuredPost.coverImage && (
                        <img
                          src={featuredPost.coverImage}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          alt={featuredPost.title}
                        />
                      )}
                    </div>
                    <div className="md:col-span-7 p-8">
                      <div className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">
                        # {featuredPost.tags?.[0]?.label || "Article"}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition">
                        {featuredPost.title}
                      </h3>
                      <p className="text-slate-500 text-base leading-relaxed line-clamp-2">
                        {"// "}
                        {featuredPost.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Bottom Sections */}
          <div className="space-y-20">
            {remainingPosts.length > 0 && (
              <ContentGrid
                title="all_posts.json"
                items={remainingPosts}
                collection="posts"
              />
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
