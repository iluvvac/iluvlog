import Link from 'next/link'
import Image from 'next/image'

export type ToolItem = {
  title: string
  description: string
  icon?: string
  coverImage?: string
  href: string
  tags: string[]
}

type Props = {
  title: string
  items: ToolItem[]
  priority?: boolean
}

export default function ToolsGrid({ title, items, priority = false }: Props) {
  if (items.length === 0) {
    return (
      <section className="mt-12 px-2">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            {title}
          </h2>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200 font-mono text-[10px] text-slate-300 uppercase tracking-widest">
          Empty
        </div>
      </section>
    )
  }

  return (
    <section className="mt-12 px-2">
      <div className="flex items-center gap-3 mb-10">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-100"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, id) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-5 outline-none"
          >
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-sm border border-black/[0.03] bg-slate-50 transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.01]">
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  fill
                  priority={priority && id <= 2}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-6xl grayscale group-hover:grayscale-0 transition-all duration-700">
                  {item.icon}
                </div>
              )}
              
              <div className="absolute top-4 left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-1">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1">
                <span>Interactive Tool</span>
                <span className="font-bold text-slate-400 uppercase">Dasteen</span>
              </div>

              <h3 className="text-[16px] font-black text-slate-900 leading-tight uppercase transition-colors group-hover:text-blue-600">
                {item.title}
              </h3>

              <p className="text-[11px] text-slate-500 leading-relaxed font-mono italic line-clamp-2">
                {"// "} {item.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[8px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}