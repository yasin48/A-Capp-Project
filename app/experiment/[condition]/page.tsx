import { notFound } from "next/navigation";

type Treatment={transparency:boolean;expertIdentity:boolean;immutability:boolean};

const CONDITIONS:Record<number,Treatment>={
1:{transparency:false,expertIdentity:false,immutability:false},
2:{transparency:false,expertIdentity:false,immutability:true},
3:{transparency:false,expertIdentity:true,immutability:false},
4:{transparency:false,expertIdentity:true,immutability:true},
5:{transparency:true,expertIdentity:false,immutability:false},
6:{transparency:true,expertIdentity:false,immutability:true},
7:{transparency:true,expertIdentity:true,immutability:false},
8:{transparency:true,expertIdentity:true,immutability:true},
};

const PRODUCT={title:"Maison Aurelia Heritage Handbag",subtitle:"Classic structured leather handbag · Brown",condition:"Pre-owned · Excellent condition",price:"£800",seller:"Verified marketplace seller",date:"18 August 2026"};

function Bag(){return <div role="img" aria-label="Brown structured luxury handbag" className="relative mx-auto h-[330px] w-[360px] max-w-full">
<div className="absolute left-1/2 top-7 h-28 w-48 -translate-x-1/2 rounded-t-[90px] border-[14px] border-[#5b2f1d] border-b-0"/>
<div className="absolute bottom-7 left-1/2 h-56 w-[310px] max-w-[92%] -translate-x-1/2 rounded-[38px] bg-gradient-to-b from-[#7a4327] to-[#5f301d] shadow-2xl"/>
<div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 font-serif text-4xl tracking-[0.2em] text-[#b87a56]/70">MA</div>
<div className="absolute bottom-[60px] left-1/2 h-7 w-12 -translate-x-1/2 rounded-md bg-[#c59a55] shadow"/>
</div>}

function Row({label,children}:{label:string;children:React.ReactNode}){return <div className="grid grid-cols-[132px_1fr] gap-4 border-b border-slate-100 py-3 last:border-b-0"><div className="text-sm text-slate-500">{label}</div><div className="text-sm leading-6 text-slate-800">{children}</div></div>}

export default function Page({params}:{params:{condition:string}}){
const condition=Number(params.condition); const t=CONDITIONS[condition]; if(!t) notFound();
return <>
<style>{`body nav, body footer { display:none !important; }`}</style>
<main className="min-h-screen bg-slate-50 text-slate-900"><div className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-10">
<header className="mb-7 flex items-center justify-between border-b border-slate-200 pb-5"><div><div className="text-xl font-semibold">LuxeMarket</div><div className="text-xs text-slate-500">Pre-owned luxury marketplace</div></div><div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">Secure marketplace</div></header>
<section className="grid gap-8 md:grid-cols-2 md:items-start">
<div className="rounded-3xl border border-stone-200 bg-stone-100 p-8 shadow-sm md:sticky md:top-8"><div className="flex min-h-[430px] items-center justify-center"><Bag/></div><div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-500"><div className="rounded-xl bg-white p-3">Front view</div><div className="rounded-xl bg-white p-3">Detail view</div><div className="rounded-xl bg-white p-3">Interior view</div></div></div>
<div>
<div className="mb-6"><div className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">{PRODUCT.condition}</div><h1 className="text-3xl font-semibold md:text-4xl">{PRODUCT.title}</h1><p className="mt-2 text-slate-600">{PRODUCT.subtitle}</p><div className="mt-5 text-3xl font-semibold">{PRODUCT.price}</div><div className="mt-2 text-sm text-slate-500">{PRODUCT.seller}</div></div>
<section className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 text-lg font-semibold text-emerald-900">✓ Authenticity verified</div><p className="mt-2 text-sm leading-6 text-emerald-950/80">This item has been checked for authenticity before being listed for sale.</p></section>
<section className="mb-5 min-h-[225px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Authentication information</h2>{t.transparency?<div className="mt-3"><Row label="Date checked">{PRODUCT.date}</Row><Row label="Checks completed">Materials, stitching, hardware, serial markings and construction</Row><Row label="Reference match">Consistent with verified manufacturer specifications</Row><Row label="Outcome"><span className="font-medium">Passed authentication</span></Row></div>:<div className="mt-3 flex min-h-[157px] items-start"><div><div className="text-sm text-slate-500">Verification result</div><div className="mt-2 font-medium">Authentic</div></div></div>}</section>
<section className="mb-5 min-h-[132px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Authentication review</h2><div className="mt-3 flex min-h-[56px] items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">{t.expertIdentity?"EC":"AS"}</div>{t.expertIdentity?<div><div className="font-medium">Emma Clarke</div><div className="text-sm text-slate-500">Luxury Authentication Specialist · 9 years' experience</div></div>:<div><div className="font-medium">Authentication specialist</div><div className="text-sm text-slate-500">Reviewer identity and credentials are not displayed.</div></div>}</div></section>
<section className="mb-6 min-h-[178px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Authentication record</h2>{t.immutability?<><p className="mt-2 text-sm leading-6 text-slate-600">The authentication result has been recorded on a blockchain ledger. Once recorded, the entry is designed to be permanent and resistant to alteration.</p><div className="mt-3 rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">Record: 0x7A4F...91C2 · 18 Aug 2026, 14:32</div></>:<><p className="mt-2 text-sm leading-6 text-slate-600">The marketplace recorded the authentication result on {PRODUCT.date}.</p><div className="mt-3 rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">Record: LM-184291 · 18 Aug 2026, 14:32</div></>}</section>
<button type="button" className="w-full rounded-xl bg-slate-900 px-5 py-4 font-medium text-white">Continue to purchase</button>
<div className="mt-4 flex items-center justify-center gap-5 pb-8 text-xs text-slate-400"><span>Buyer protection</span><span>•</span><span>Secure checkout</span><span>•</span><span>Returns policy</span></div>
</div></section></div></main></>}

export function generateStaticParams(){return Object.keys(CONDITIONS).map(condition=>({condition}))}
