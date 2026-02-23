import Layout from "@/components/Layout";
import { load } from "outstatic/server";
import ContentGrid from "@/components/ContentGrid";
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";
import { Highlighter } from "@/components/ui/highlighter";

export default async function Index() {
  const { content, allPosts, allProjects } = await getData();
  const featuredPost = allPosts[0];
  const remainingPosts = allPosts.slice(1);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <section className=" mb-16">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Hello!</h2>
            <h1 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
              I am{" "}
              <Highlighter action="highlight" color="orange">
                Dasteen
              </Highlighter>
              <Highlighter action="circle" color="blue">
              , nice to meet you.
              </Highlighter>
            </h1>
            <div
              className="prose lg:prose-xl mx-auto text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </section>

          {featuredPost && (
            <div className="mb-16">
              <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                Artikel Terbaru
              </h2>
              <Link
                href={`/posts/${featuredPost.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64 md:h-auto bg-gray-200">
                    {featuredPost.coverImage && (
                      <img
                        src={featuredPost.coverImage}
                        className="w-full h-full object-cover"
                        alt={featuredPost.title}
                      />
                    )}
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {featuredPost.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {remainingPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Artikel Lainnya
              </h2>
              <ContentGrid items={remainingPosts} collection="posts" />
            </div>
          )}

          {allProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Proyek
              </h2>
              <ContentGrid items={allProjects} collection="projects" />
            </div>
          )}
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

  return {
    content,
    allPosts,
    allProjects,
  };
}
