import dynamic from 'next/dynamic'
import TimelineChart from '../components/TimelineChart'

const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-xl border border-stone-800 bg-stone-950/60 text-sm text-stone-300 md:h-[520px]">
      Loading Dallas map…
    </div>
  ),
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="flex flex-col gap-6 border-b border-stone-800/70 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-300/80">
            Community Resource Explorer
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50 md:text-4xl">
            Community Index Dashboard
          </h1>
          <p className="mt-3 text-sm text-stone-300">
            Track neighborhood wellbeing, spot policy gaps, and prioritize outreach using a live
            index built from benefits access, maternal health, and housing stability.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-stone-700/70 bg-stone-900/70 px-4 py-2 text-xs text-stone-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Last refresh: 2 hours ago
        </div>
      </header>

      <section className="grid gap-6 px-6 py-6 md:px-10 lg:grid-cols-[2.2fr_1fr]">
        <div className="rounded-2xl border border-stone-800/80 bg-stone-950/50 p-4 shadow-[0_0_60px_rgba(15,23,42,0.3)]">
          <MapView />
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-stone-800/80 bg-stone-950/60 p-4">
            <TimelineChart />
          </div>
          <div className="rounded-2xl border border-stone-800/80 bg-stone-950/60 p-5">
            <h2 className="text-lg font-semibold text-stone-50">Action Signals</h2>
            <ul className="mt-4 space-y-4 text-sm text-stone-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                Benefits access is trending up in Lakeview, but enrollment dips in the southeast
                corridor.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                Maternal care density improved after mobile clinic deployment, yet wait time rose
                14%.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                Housing stability risk remains high across West Haven; prioritize rental relief
                outreach.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
