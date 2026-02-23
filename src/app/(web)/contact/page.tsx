import Header from '@/components/Header'
import Layout from '@/components/Layout'

export default function ContactPage() {
  return (
    <Layout>
      <div className="bg-white min-h-screen font-mono text-slate-800 pb-20 text-sm">
      <div className="sticky top-0 z-40 bg-white">
          <Header />
        </div>
        <div className="max-w-5xl mx-auto px-5 pt-8">
         
          
          <article className="mt-8 border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
            {/* Tab Header */}
            <div className="bg-[#f3f3f3] flex items-center px-4 h-10 border-b border-slate-200">
              <div className="bg-white border-t-2 border-t-blue-500 border-x border-slate-200 px-4 h-full flex items-center gap-2 text-[11px] font-bold">
                <span className="text-blue-500 text-sm">TS</span>
                <span>contact.tsx</span>
              </div>
            </div>

            <div className="flex">
              {/* Line Numbers */}
              <div className="hidden md:block w-12 bg-[#fafafa] border-r border-slate-100 py-10 text-right pr-3 select-none text-slate-300 text-[11px] leading-[2.5rem]">
                01 <br/> 02 <br/> 03 <br/> 04 <br/> 05 <br/> 06 <br/> 07 <br/> 08 <br/> 09 <br/> 10
              </div>

              <div className="flex-1 p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tighter">
                  <span className="text-purple-600 mr-4">#</span>get_in_touch
                </h1>

                <div className="space-y-8">
                  {/* Email Section */}
                  <div>
                    <h2 className="text-blue-600 font-bold text-xs mb-3 uppercase">{"// email_address"}</h2>
                    <a 
                      href="mailto:hello@dast.in" 
                      className="text-xl md:text-2xl font-bold hover:text-blue-600 transition-colors"
                    >
                      hello@dast.in
                    </a>
                  </div>

                  {/* Socials Section */}
                  <div>
                    <h2 className="text-amber-500 font-bold text-xs mb-3 uppercase">{"/* social_links */"}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a href="https://linkedin.com/in/dastindarmawan" target="_blank" className="border border-slate-100 p-4 rounded hover:border-blue-200 transition-colors group">
                        <span className="text-slate-400 group-hover:text-blue-500">@</span> linkedin
                      </a>
                      {/* <a href="#" target="_blank" className="border border-slate-100 p-4 rounded hover:border-blue-200 transition-colors group">
                        <span className="text-slate-400 group-hover:text-blue-500">@</span> x_twitter
                      </a>
                      <a href="#" target="_blank" className="border border-slate-100 p-4 rounded hover:border-blue-200 transition-colors group">
                        <span className="text-slate-400 group-hover:text-blue-500">@</span> github
                      </a> */}
                      <a href="https://www.instagram.com/dastindrmwn/" target="_blank" className="border border-slate-100 p-4 rounded hover:border-blue-200 transition-colors group">
                        <span className="text-slate-400 group-hover:text-blue-500">@</span> instagram
                      </a>
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-sm italic text-slate-500">
                    <p>{"// Status: Currently open for new freelance projects and collaborations."}</p>
                    <p>{"// Response time: Usually within 24 hours."}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  )
}