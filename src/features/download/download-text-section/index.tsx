function DownloadTextSection({ description, buttons }) {
  return (
    <div className="flex flex-col gap-y-8 relative z-1">
      {description}
      {buttons}
    </div>
  )
}

export default DownloadTextSection
