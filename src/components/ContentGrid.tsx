import type { OstDocument } from 'outstatic'
import Link from 'next/link'
import Image from 'next/image'

type Item = {
  tags?: { value: string; label: string }[]
} & OstDocument

type Props = {
  collection: 'posts' | 'projects'
  title?: string
  items: Item[]
  priority?: boolean
}

const ContentGrid = ({ title, items, collection, priority = false }: Props) => {
  return (
    <section id={collection}>
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-2">
        <span className="text-slate-400 text-lg">▼</span>
        <h2 className="text-sm font-bold tracking-tight text-slate-500 uppercase">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, id) => (
          <Link key={item.slug} href={`/${collection}/${item.slug}`} className="group">
            <div className="bg-white border border-slate-100 group-hover:border-slate-300 group-hover:shadow-md transition-all duration-200">
              <div className="relative aspect-video overflow-hidden border-b border-slate-100">
                <Image
                  src={item.coverImage ?? ''}
                  alt={item.title}
                  className="object-cover grayscale group-hover:grayscale-0 transition-all"
                  fill
                  priority={priority && id <= 2}
                />
              </div>

              <div className="p-5">
                <h3 className="text-md font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition truncate">
                  <span className="text-slate-400 mr-2">fn</span>
                  {item.title}
                </h3>
                
                {collection === 'posts' && (
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 italic">
                    {`/* ${item.description} */`}
                  </p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-1">
                  {item.tags?.map((tag) => (
                    <span key={tag.value} className="text-[10px] text-slate-400">
                      .{tag.label.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ContentGrid