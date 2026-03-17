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
  const shareUrl = `https://blog.dast.in/posts/${post.slug}`

  return (
    <Layout>
      <div 
        className="min-h-screen bg-cover bg-center font-sans text-[#1c1c1e] pb-32 flex flex-col items-center bg-fixed"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1771814574443-66eef88531f3?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
      >
        
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] w-full mb-6 md:mb-10">
          <Header />
        </div>

        {/* Wrapper untuk padding mobile */}
        <div className="w-full max-w-3xl px-4 md:px-0">
          <article className="w-full bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#d1d1d6] flex flex-col overflow-hidden">
            
            <div className="h-14 bg-white border-b border-[#e5e5ea] flex items-center px-4 justify-between shrink-0 sticky top-0 z-30">
              
              <div className="flex items-center gap-5 md:gap-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[#8a8a8e] text-[13px] font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                  Notes
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#8a8a8e]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>

            </div>

            <div className="p-5 md:p-16 overflow-y-auto bg-white">
              
              <div className="max-w-[640px] mx-auto">
                
                <div className="flex justify-center text-[#8a8a8e] text-[13px] mb-4 font-medium">
                  <span><DateFormatter dateString={post.publishedAt} /></span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#1c1c1e] tracking-tight leading-tight mb-8 text-center">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-6 border-b border-[#e5e5ea]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f0f5] rounded-md text-[11px] text-[#1c1c1e] font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#8a8a8e]"></div>
                    {post?.author?.name || 'Dastin Darmawan'}
                  </div>
                  {post.tags?.map(({ label }) => (
                    <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0f0f5] rounded-md text-[11px] text-[#1c1c1e] font-medium">
                      <div className="w-2 h-2 rounded-full bg-[#007aff]"></div>
                      {label}
                    </div>
                  ))}
                </div>

                {post.coverImage && (
                  <div className="relative mb-10 w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-lg bg-[#f0f0f5]">
                    <Image alt={post.title} src={post.coverImage} fill className="object-cover" priority />
                  </div>
                )}

                {headings.length > 0 && (
                  <div className="mb-10 text-[#1c1c1e]">
                    <span className="text-[12px] font-bold text-[#8a8a8e] uppercase tracking-widest block mb-4">Outline</span>
                    <ul className="flex flex-col gap-2">
                      {headings.map((h) => (
                        <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                          <a href={`#${h.id}`} className="text-[#007aff] hover:underline transition-colors font-medium text-[15px]">
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="max-w-none">
                  <div
                    className="prose prose-slate prose-lg max-w-none font-sans 
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#1c1c1e] prose-headings:scroll-mt-24
                    prose-p:text-[#1c1c1e] prose-p:leading-relaxed
                    prose-a:text-[#007aff] prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:shadow-sm
                    prose-pre:bg-[#f0f0f5] prose-pre:text-[#1c1c1e] prose-pre:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                <div className="mt-16 pt-8 border-t border-[#e5e5ea] flex flex-col items-center">
                  <span className="text-[11px] font-bold text-[#8a8a8e] uppercase tracking-widest mb-4">Share</span>
                  <div className="flex gap-4">
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#f0f0f5] hover:bg-[#e5e5ea] rounded-full text-sm font-medium text-[#1c1c1e] transition-colors">
                      X.com
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#f0f0f5] hover:bg-[#e5e5ea] rounded-full text-sm font-medium text-[#1c1c1e] transition-colors">
                      LinkedIn
                    </a>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#f0f0f5] hover:bg-[#e5e5ea] rounded-full text-sm font-medium text-[#1c1c1e] transition-colors">
                      WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </article>
        </div>

        {/* Wrapper untuk bagian More Notes di mobile */}
        {otherPosts.length > 0 && (
          <div className="w-full max-w-3xl mt-8 md:mt-12 mb-20 px-4 md:px-0">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[#d1d1d6] p-5 md:p-8">
              <h3 className="text-xl font-bold tracking-tight text-[#1c1c1e] mb-6 flex items-center gap-2">
                <span className="text-2xl">📓</span> More Notes
              </h3>
              <ContentGrid title="" items={otherPosts} collection="posts" />
            </div>
          </div>
        )}

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