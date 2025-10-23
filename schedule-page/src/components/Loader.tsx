interface LoaderProps {
  label?: string
}

export default function Loader({ label }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      {label ? <p className="mt-4 text-sm font-medium">{label}</p> : null}
    </div>
  )
}
