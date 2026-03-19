import Layout from "@/components/Layout";
import { load } from "outstatic/server";
import ContentGrid from "@/components/ContentGrid";
import Header from '@/components/Header';
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";
import Image from "next/image";
import { OstDocument } from "outstatic";
import ToolsGrid, { ToolItem } from "@/components/ToolsGrid";

type Post = {
  tags?: { value: string; label: string }[];
} & OstDocument;

type Project = {
  tags?: { value: string; label: string }[];
} & OstDocument;

export default async function Index() {
  const { content, allPosts, allProjects, allTags } = await getData();
  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;

  const wallpaperUrl = "https://images.unsplash.com/photo-1644426358812-879f02d1d867?q=80&w=2728&auto=format&fit=crop";

  const myTools: ToolItem[] = [
    {
      title: "ASCII Generator",
      description: "Convert images to high-precision vector text grids instantly. Render directly in the browser and download as SVG.",
      icon: "🔤",
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
      href: "/tools/ascii-generator",
      tags: ["Vector", "Image"]
    }
  ];

  return (
    <Layout>
      <div 
        className="min-h-screen relative font-sans text-slate-900 bg-cover bg-center flex flex-col overflow-hidden" 
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
      >
        <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <Header />
        </div>

        <div className="flex-1 relative p-2 md:p-10 flex gap-10 items-start justify-center overflow-y-auto scrollbar-hide">
          
          <div className="hidden xl:flex flex-col gap-6 sticky top-0">
            <div className="w-72 bg-[#fff9c4] rounded-lg shadow-sm border border-black/5 flex flex-col transition-all hover:rotate-1 rotate-[-1deg] duration-500">
              <div className="bg-black/5 px-3 py-1.5 flex items-center gap-2 border-b border-black/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Personal Note</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-tight mb-4">
                  Personal notes on <br />
                  <span className="text-blue-600 italic">technology</span>, <br />
                  <span className="text-purple-600 italic">design</span>, and the <br />
                  curiosities in between.
                </h2>
                <div 
                  className="text-xs text-slate-600 leading-relaxed font-mono italic border-l border-slate-300 pl-3"
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl h-[92vh] md:h-[85vh] bg-white rounded-2xl shadow-lg flex flex-col border border-black/5 overflow-hidden">
            
            <div className="bg-[#f6f6f6] border-b border-slate-200 px-5 py-3 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex-1 flex justify-center">
                 <div className="text-[11px] font-bold text-slate-600 tracking-tight italic text-center truncate">
                  Finder
                 </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <aside className="w-48 bg-[#f3f3f3]/80 p-5 hidden md:block border-r border-slate-200 overflow-y-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-wider px-2">Favorites</p>
                <nav className="space-y-0.5 mb-10 text-[13px]">
                  <div className="bg-slate-200 text-slate-900 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-2 cursor-default">🏠 Home</div>
                  <div className="text-slate-600 px-3 py-1.5 hover:bg-slate-200/50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">📝 Articles</div>
                  <div className="text-slate-600 px-3 py-1.5 hover:bg-slate-200/50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">🚀 Projects</div>
                  <Link href="/tools/ascii-generator">
                    <div className="text-slate-600 px-3 py-1.5 hover:bg-slate-200/50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                      🔤 ASCII Generator
                    </div>
                  </Link>
                </nav>

                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-wider px-2">Tags</p>
                <div className="space-y-0.5 px-1 text-[12px]">
                  {allTags.map((tag) => (
                    <div key={tag} className="text-slate-600 px-3 py-1.5 hover:bg-slate-200/50 rounded-md flex items-center gap-2 cursor-pointer transition-colors capitalize">
                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow-sm"></div>
                      {tag}
                    </div>
                  ))}
                </div>
              </aside>

              <main className="flex-1 overflow-y-auto p-4 md:p-12 bg-white scroll-smooth custom-scrollbar">
                
                {featuredPost && (
                  <section className="mb-16 md:mb-20">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                        Featured Note
                      </span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>

                    <div className="w-full bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group relative flex flex-col">
                      <div className="relative aspect-square sm:aspect-video md:aspect-[21/9] w-full bg-slate-900 overflow-hidden">
                        {featuredPost.coverImage && (
                          <Image
                            src={featuredPost.coverImage}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                          />
                        )}
                        
                        <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

                        <div className="absolute inset-0 p-5 md:p-10 flex flex-col justify-end z-20">
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-8">
                            
                            <div className="flex-1 flex flex-col gap-2 md:gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                {featuredPost.tags?.slice(0, 1).map((tag) => (
                                  <span key={tag.value} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30 backdrop-blur-sm">
                                    {tag.label}
                                  </span>
                                ))}
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                  By Dasteen
                                </span>
                              </div>
                              
                              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight drop-shadow-sm line-clamp-2 md:line-clamp-none">
                                {featuredPost.title}
                              </h2>
                              
                              <p className="text-xs md:text-sm text-white/70 leading-relaxed font-mono italic max-w-xl border-l-2 border-slate-500/50 pl-3 md:pl-5 line-clamp-2 md:line-clamp-3">
                                  {featuredPost.description}
                              </p>
                            </div>
                            
                            <div className="shrink-0 pt-2 sm:pt-0">
                              <Link href={`/posts/${featuredPost.slug}`}>
                                <button className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-3.5 bg-white text-slate-900 hover:bg-slate-100 text-[10px] md:text-[11px] font-bold rounded-xl transition-all active:scale-95 uppercase tracking-widest shadow-lg">
                                  Read Note
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                <div className="space-y-20">
                  <ContentGrid title="All Archives" items={allPosts.slice(1)} collection="posts" />
                  {/* <ContentGrid title="Laboratory" items={allProjects} collection="projects" /> */}
                  <ToolsGrid title="Digital Tools" items={myTools} />
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

async function getData() {
  const db = await load();
  const page = await db.find({ collection: "pages", slug: "home" }, ["content"]).first();
  const content = page ? await markdownToHtml(page.content) : "Digital Artisan.";

  const allPosts = await db.find<Post>({ collection: "posts", status: "published" }, ["title", "publishedAt", "slug", "coverImage", "description", "tags"]).sort({ publishedAt: -1 }).toArray();
  const allProjects = await db.find<Project>({ collection: "projects", status: "published" }, ["title", "slug", "coverImage", "description", "publishedAt", "tags"]).sort({ publishedAt: -1 }).toArray();
  const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags?.map(t => t.label) || [])));

  return { content, allPosts, allProjects, allTags };
}