import type { OstDocument } from 'outstatic'
import Link from 'next/link'
import Image from 'next/image'

type Item = {
  tags?: { value: string; label: string }[]
} & OstDocument

type Props = {
  collection: 'posts' | 'projects'
  title: string
  items: Item[]
  priority?: boolean
}

const ContentGrid = ({ title, items, collection, priority = false }: Props) => {
  // Pengecekan jika konten kosong
  if (items.length === 0) {
    return (
      <section id={collection} className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 bg-slate-300"></div>
          <h2 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </h2>
          <div className="h-px flex-1 bg-slate-50"></div>
        </div>
        
        <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 p-12 rounded-sm text-center font-mono">
          <div className="text-slate-400 text-xs mb-2 italic">
            // No records found in {collection}.collection
          </div>
          <div className="text-[10px] text-slate-300 uppercase tracking-widest">
            status: 404_empty_array
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={collection} className="mt-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 bg-blue-500"></div>
        <h2 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-100"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, id) => (
          <Link key={item.slug} href={`/${collection}/${item.slug}`} className="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300 hover:border-blue-600 hover:shadow-md">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
              <Image
                src={item.coverImage ?? ''}
                alt={item.title}
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                fill
                priority={priority && id <= 2}
              />
            </div>

            <div className="p-4 flex-1 flex flex-col font-mono text-[11px]">
              <div className="flex justify-between items-center mb-3 text-slate-400 border-b border-slate-50 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">id</span>
                  <span className="truncate max-w-[100px]">{item.slug}</span>
                </div>
                <span className="text-[9px] italic">uuid</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 leading-relaxed line-clamp-2 mb-4">
                {"// "} {item.description || "No description found."}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-50">
                <span className="text-purple-500 font-bold text-[9px]">TAGS</span>
                <div className="flex gap-1.5 overflow-hidden">
                  {item.tags?.slice(0, 2).map((tag) => (
                    <span key={tag.value} className="text-slate-400 truncate">
                      '{tag.label}'
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 px-4 py-2 border-t border-slate-100 flex justify-between items-center font-mono text-[9px]">
              <span className="text-slate-400">
                {new Date(item.publishedAt).toLocaleDateString("id-ID")}
              </span>
              <span className="text-blue-600 font-bold group-hover:underline uppercase">
                Read_More()
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ContentGrid