import Image from 'next/image'
import { Metadata } from 'next'
import { OstDocument } from 'outstatic'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import ContentGrid from '@/components/ContentGrid'
import markdownToHtml from '@/lib/markdownToHtml'
import { getDocumentSlugs, load } from 'outstatic/server'
import DateFormatter from '@/components/DateFormatter'
import { absoluteUrl } from '@/lib/utils'
import { notFound } from 'next/navigation'

type Post = {
  tags: { value: string; label: string }[]
} & OstDocument

type Params = Promise<{ slug: string }>

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

function getHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = []
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].replace(/<\/?[^>]+(>|$)/g, "")
    headings.push({
      level: parseInt(match[1]),
      id: slugify(text),
      text: text
    })
  }
  return headings
}

function addIdsToHeadings(content: string) {
  return content.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/g,
    (match, level, attributes, text) => {
      if (attributes.includes('id=')) return match
      const id = slugify(text.replace(/<\/?[^>]+(>|$)/g, ""))
      return `<h${level}${attributes} id="${id}">${text}</h${level}>`
    }
  )
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params
  const { post } = await getData(params)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: absoluteUrl(`/posts/${post.slug}`),
      images: [{ url: absoluteUrl(post?.coverImage || '/images/og-image.png'), width: 1200, height: 630, alt: post.title }]
    }
  }
}

export default async function Post(props: { params: Params }) {
  const params = await props.params
  const { post, otherPosts } = await getData(params)
  const headings = getHeadings(post.content)
  // const shareUrl = absoluteUrl(`/posts/${post.slug}`)
  const shareUrl = `https://blog.dast.in/posts/${post.slug}` //hardcode sementara

  return (
    <Layout>
      <div className="bg-white min-h-screen font-mono text-slate-800 pb-20 text-sm">
        <div className="sticky top-0 z-40 bg-white">
          <Header />
        </div>

        <div className="max-w-5xl mx-auto px-5 pt-8">
          <article className="mt-8 border border-slate-200 rounded-lg bg-white shadow-sm mb-10">
            <div className="sticky top-10 z-30 shadow-sm">
              <div className="bg-[#f3f3f3] flex items-center px-4 h-10 border-b border-slate-200 rounded-t-lg">
                <div className="bg-white border-t-2 border-t-blue-500 border-x border-slate-200 px-4 h-full flex items-center gap-2 text-[11px] font-bold">
                  <span className="text-blue-500 text-sm font-bold">M↓</span>
                  <span className="truncate">{post.slug}.md</span>
                </div>
              </div>

              {headings.length > 0 && (
                <div className="bg-white/95 backdrop-blur-md px-6 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar border-b border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Outline:</span>
                  <nav className="flex gap-6 whitespace-nowrap">
                    {headings.map((h) => (
                      <a key={h.id} href={`#${h.id}`} className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {h.level === 2 ? '## ' : '### '}{h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div className="bg-white/95 backdrop-blur-md px-6 py-1.5 flex items-center gap-4 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Share:</span>
                <div className="flex gap-5 text-[10px] font-bold">
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" className="text-slate-500 hover:text-blue-400">X.com</a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" className="text-slate-500 hover:text-blue-700">LinkedIn</a>
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} target="_blank" className="text-slate-500 hover:text-green-600">WhatsApp</a>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="hidden md:block w-12 bg-[#fafafa] border-r border-slate-100 py-10 text-right pr-3 select-none text-slate-300 text-[11px] leading-[2.5rem]">
                01 <br/> 02 <br/> 03 <br/> 04 <br/> 05 <br/> 06 <br/> 07 <br/> 08 <br/> 09 <br/> 10
              </div>

              <div className="flex-1 p-6 md:p-10">
                <div className="relative mb-10 w-full h-64 md:h-96 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 rounded-sm border border-slate-200">
                  <Image alt={post.title} src={post?.coverImage || ''} fill className="object-cover" priority />
                </div>

                <div className="mb-6 flex flex-wrap gap-3">
                  {post.tags?.map(({ label }) => (
                    <span key={label} className="text-blue-600 text-[11px] font-bold uppercase">.{label.toLowerCase()}</span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tighter">
                  <span className="text-purple-600 mr-4 font-bold">#</span>{post.title}
                </h1>

                <div className="flex flex-col gap-1 mb-10 text-slate-400 text-xs italic border-l-2 border-slate-100 pl-4">
                   <div>{"// Author: "}{post?.author?.name || 'Admin'}</div>
                   <div>{"// Published At: "}<DateFormatter dateString={post.publishedAt} /></div>
                </div>

                <div className="max-w-none">
                  <div
                    className="prose prose-slate prose-lg max-w-none font-sans 
                    prose-headings:font-mono prose-headings:scroll-mt-52
                    prose-pre:bg-[#f6f8fa] prose-pre:text-inherit"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </div>
          </article>

          {otherPosts.length > 0 && (
            <div className="mt-10 pt-10 border-t border-slate-100">
              <ContentGrid title="ls -l ../other_posts/" items={otherPosts} collection="posts" />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

async function getData(params: { slug: string }) {
  const db = await load()
  const post = await db.find<Post>({ collection: 'posts', slug: params.slug }, 
    ['title', 'publishedAt', 'description', 'slug', 'author', 'content', 'coverImage', 'tags']
  ).first()
  
  if (!post) notFound()
  
  const otherPosts = await db.find({ collection: 'posts', status: 'published', slug: { $ne: params.slug } }, 
    ['title', 'publishedAt', 'slug', 'coverImage', 'description', 'tags']
  ).sort({ publishedAt: -1 }).limit(3).toArray()
  
  const rawHtml = await markdownToHtml(post.content)
  const contentWithIds = addIdsToHeadings(rawHtml)

  return { 
    post: { ...post, content: contentWithIds }, 
    otherPosts: otherPosts as any[] 
  }
}

export async function generateStaticParams() {
  return getDocumentSlugs('posts').map((slug) => ({ slug }))
}