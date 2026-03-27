export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="spinner" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )
}
