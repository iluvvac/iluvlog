import Header from '@/components/Header'
import Layout from '@/components/Layout'
import markdownToHtml from '@/lib/markdownToHtml'
import { getDocumentSlugs, load } from 'outstatic/server'
import DateFormatter from '@/components/DateFormatter'
import Image from 'next/image'
import ContentGrid from '@/components/ContentGrid'
import { OstDocument } from 'outstatic'
import { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils'
import { notFound } from 'next/navigation'
import figlet from 'figlet'

type Project = {
  tags: { value: string; label: string }[]
} & OstDocument

type Params = Promise<{ slug: string }>

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params
  const { project } = await getData(params)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      url: absoluteUrl(`/projects/${project.slug}`),
      images: [{ url: absoluteUrl(project?.coverImage || '/images/og-image.png'), width: 1200, height: 630, alt: project.title }]
    }
  }
}

export default async function Project(props: { params: Params }) {
  const params = await props.params
  const { project, moreProjects, content, titleAscii } = await getData(params)

  return (
    <Layout>
      <div className="min-h-screen bg-white pb-24 font-mono text-slate-900 selection:bg-blue-500 selection:text-white">
        <div className="max-w-4xl mx-auto px-6">
          <Header />
          
          <main className="mt-12 space-y-12">
            {/* 1. Terminal Prompt & ASCII Title */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                <span className="text-emerald-500">➜</span>
                <span>~/projects/{project.slug}</span>
                <span className="text-slate-300">on</span>
                <span className="text-purple-500">main</span>
                <span className="animate-pulse">_</span>
              </div>

              <div className="overflow-x-auto no-scrollbar py-4 border-y border-slate-100">
                <pre className="text-[7px] md:text-[10px] leading-none font-black text-slate-950">
                  {titleAscii}
                </pre>
                <h1 className="sr-only">{project.title}</h1>
              </div>

              <div className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                <span className="text-slate-300 font-bold mr-2">#</span>
                {project.description}
              </div>
            </section>

            {/* 2. System Specs (Grid Metadata) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">published_at</span>
                <div className="text-xs font-bold"><DateFormatter dateString={project.publishedAt} /></div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">author_uid</span>
                <div className="text-xs font-bold">{project?.author?.name || 'iluvvac'}</div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">stack_tags</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tags?.map((tag) => (
                    <span key={tag.value} className="text-[10px] text-blue-600 font-bold">
                      [{tag.label}]
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. Primary Visual Output */}
            <section className="border border-slate-200 p-1 bg-slate-50 rounded-sm">
              <div className="relative aspect-video w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  alt={project.title}
                  src={project.coverImage ?? ''}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </section>

            {/* 4. Documentation Body */}
            <article className="prose prose-slate max-w-none 
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base
              prose-h2:text-sm prose-h2:font-black prose-h2:uppercase prose-h2:tracking-widest prose-h2:border-b prose-h2:pb-2
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded-sm
              prose-pre:bg-slate-950 prose-pre:text-emerald-400 prose-pre:rounded-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </article>

            {/* 5. Process Complete */}
            <div className="pt-12 flex items-center gap-4 opacity-30 group cursor-default">
              <span className="text-[10px] font-bold">EOF</span>
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[10px] font-bold group-hover:text-blue-600 transition-colors">RETURN 0</span>
            </div>
          </main>

          {/* Suggested Repositories */}
          <section className="mt-32">
            {moreProjects.length > 0 && (
              <div className="space-y-8">
                <div className="text-xs font-black text-slate-300 tracking-[0.4em] uppercase">
                  cat other_projects.log
                </div>
                <ContentGrid title="" items={moreProjects} collection="projects" />
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  )
}

async function getData(params: { slug: string }) {
  const db = await load()
  const project = await db
    .find<Project>({ collection: 'projects', slug: params.slug }, [
      'title', 'publishedAt', 'description', 'slug', 'author', 'content', 'coverImage'
    ])
    .first()

  if (!project) notFound()

  const titleAscii = figlet.textSync(project.title, {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  })

  const content = await markdownToHtml(project.content)
  const moreProjects = await db
    .find({ collection: 'projects', slug: { $ne: params.slug } }, ['title', 'slug', 'coverImage', 'description', 'publishedAt'])
    .limit(3)
    .toArray()

  return { project, content, moreProjects, titleAscii }
}

export async function generateStaticParams() {
  const posts = getDocumentSlugs('projects')
  return posts.map((slug) => ({ slug }))
}