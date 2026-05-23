/** Decorative blurred nebula blobs used as a full-screen background on most pages. */
export default function Nebulae({ teal = false }: { teal?: boolean }) {
  return (
    <>
      <div className="fixed rounded-full pointer-events-none z-0 blur-[90px] w-[700px] h-[500px] bg-indigo-deep opacity-[0.14] -top-[180px] -left-[120px] animate-[nf_18s_ease-in-out_infinite_alternate]" />
      <div className="fixed rounded-full pointer-events-none z-0 blur-[90px] w-[600px] h-[450px] bg-pink opacity-[0.1] -bottom-[120px] -right-[80px] animate-[nf_18s_ease-in-out_infinite_alternate] [animation-delay:-7s]" />
      {teal && (
        <div className="fixed rounded-full pointer-events-none z-0 blur-[90px] w-[450px] h-[350px] bg-[#0d9488] opacity-[0.08] top-[30%] left-[38%] animate-[nf_18s_ease-in-out_infinite_alternate] [animation-delay:-13s]" />
      )}
    </>
  )
}
