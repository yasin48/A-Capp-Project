import { notFound } from "next/navigation";

type Treatment = {
  transparency: boolean;
  expertIdentity: boolean;
  immutability: boolean;
};

const CONDITIONS: Record<number, Treatment> = {
  1: { transparency: false, expertIdentity: false, immutability: false },
  2: { transparency: false, expertIdentity: false, immutability: true },
  3: { transparency: false, expertIdentity: true, immutability: false },
  4: { transparency: false, expertIdentity: true, immutability: true },
  5: { transparency: true, expertIdentity: false, immutability: false },
  6: { transparency: true, expertIdentity: false, immutability: true },
  7: { transparency: true, expertIdentity: true, immutability: false },
  8: { transparency: true, expertIdentity: true, immutability: true },
};

const PRODUCT = {
  title: "Maison Aurelia Heritage Handbag",
  subtitle: "Classic structured leather handbag · Brown",
  condition: "Pre-owned · Excellent condition",
  price: "£800",
  seller: "Verified marketplace seller",
  date: "18 August 2026",
};

function HandbagVisual() {
  return (
    <div aria-label="Brown structured luxury handbag" role="img" className="relative mx-auto h-[300px] w-[330px] max-w-full">
      <div className="absolute left-1/2 top-3 h-28 w-44 -translate-x-1/2 rounded-t-[80px] border-[15px] border-[#6b341d] border-b-0" />
      <div className="absolute bottom-5 left-1/2 h-56 w-[300px] max-w-[92%] -translate-x-1/2 rounded-[42px] bg-[#6b341d] shadow-2xl" />
      <div className="absolute bottom-[102px] left-1/2 -translate-x-1/2 font-serif text-5xl tracking-widest text-[#9b5e3d]">MA</div>
      <div className="absolute bottom-11 left-1/2 h-8 w-12 -translate-x-1/2 rounded-md bg-[#b88a44] shadow" />
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[132px_1fr] gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-sm leading-6 text-slate-800">{children}</div>
    </div>
  );
}

export default function ExperimentCondition({ params }: { params: { condition: string } }) {
  const condition = Number(params.condition);
  const treatment = CONDITIONS[condition];
  if (!treatment) notFound();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-10">
        <header className="mb-7 flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <div className="text-xl font-semibold tracking-tight">LuxeMarket</div>
            <div className="text-xs text-slate-500">Pre-owned luxury marketplace</div>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">Secure marketplace</div>
        </header>

        <section className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="rounded-3xl border border-stone-200 bg-stone-100 p-8 shadow-sm md:sticky md:top-8">
            <div className="flex min-h-[430px] items-center justify-center"><HandbagVisual /></div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
              <div className="rounded-xl bg-white p-3">Front view</div>
              <div className="rounded-xl bg-white p-3">Detail view</div>
              <div className="rounded-xl bg-white p-3">Interior view</div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <div className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">{PRODUCT.condition}</div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{PRODUCT.title}</h1>
              <p className="mt-2 text-slate-600">{PRODUCT.subtitle}</p>
              <div className="mt-5 text-3xl font-semibold">{PRODUCT.price}</div>
              <div className="mt-2 text-sm text-slate-500">{PRODUCT.seller}</div>
            </div>

            <section className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-lg font-semibold text-emerald-900"><span aria-hidden="true">✓</span>Authenticity verified</div>
              <p className="mt-2 text-sm leading-6 text-emerald-950/80">This item has been checked for authenticity before being listed for sale.</p>
            </section>

            <section className="mb-5 min-h-[225px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Authentication information</h2>
              {treatment.transparency ? (
                <div className="mt-3">
                  <DetailRow label="Date checked">{PRODUCT.date}</DetailRow>
                  <DetailRow label="Checks completed">Materials, stitching, hardware, serial markings and construction</DetailRow>
                  <DetailRow label="Reference match">Consistent with verified manufacturer specifications</DetailRow>
                  <DetailRow label="Outcome"><span className="font-medium">Passed authentication</span></DetailRow>
                </div>
              ) : (
                <div className="mt-3 flex min-h-[157px] items-start">
                  <div><div className="text-sm text-slate-500">Verification result</div><div className="mt-2 font-medium text-slate-800">Authentic</div></div>
                </div>
              )}
            </section>

            <section className="mb-5 min-h-[126px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Authentication review</h2>
              {treatment.expertIdentity ? (
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">EC</div>
                  <div><div className="font-medium">Emma Clarke</div><div className="text-sm leading-5 text-slate-500">Luxury Authentication Specialist · 9 years&apos; experience</div></div>
                </div>
              ) : (
                <div className="mt-3 flex min-h-[52px] items-center"><p className="text-sm text-slate-600">Reviewed by an authentication specialist.</p></div>
              )}
            </section>

            <section className={treatment.immutability ? "mb-6 min-h-[174px] rounded-2xl border border-indigo-200 bg-indigo-50 p-5" : "mb-6 min-h-[174px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"}>
              <h2 className={treatment.immutability ? "font-semibold text-indigo-950" : "font-semibold"}>Authentication record</h2>
              {treatment.immutability ? (
                <>
                  <p className="mt-2 text-sm leading-6 text-indigo-950/80">The authentication result has been recorded on a blockchain ledger. Once recorded, the entry is designed to be permanent and resistant to alteration.</p>
                  <div className="mt-3 rounded-lg bg-white/80 p-3 font-mono text-xs text-slate-600">Record: 0x7A4F...91C2 · 18 Aug 2026, 14:32</div>
                </>
              ) : (
                <div className="mt-2">
                  <p className="text-sm leading-6 text-slate-600">The marketplace recorded the authentication result on {PRODUCT.date}.</p>
                  <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Record reference: LM-184291</div>
                </div>
              )}
            </section>

            <button type="button" className="w-full rounded-xl bg-slate-900 px-5 py-4 font-medium text-white shadow-sm">Continue to purchase</button>
            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-400"><span>Buyer protection</span><span aria-hidden="true">•</span><span>Secure checkout</span><span aria-hidden="true">•</span><span>Returns policy</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(CONDITIONS).map((condition) => ({ condition }));
}
