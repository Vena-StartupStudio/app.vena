interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
}

export default function ErrorMessage({ title = 'Something went wrong', message, retry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-rose-400 bg-rose-50 p-4 text-rose-800">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm mt-1">{message}</p>
      {retry ? (
        <button
          onClick={retry}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
