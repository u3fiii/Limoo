export default function PhoneFrame({ children }) {
  return (
    <div className="flex min-h-dvh items-stretch justify-center bg-bg md:min-h-full md:items-center md:bg-frame-bg md:p-8">
      <div
        className="
          relative flex h-dvh w-full flex-col overflow-hidden
          md:aspect-[390/844] md:h-[844px] md:w-[390px] md:max-h-[calc(100dvh-2rem)]
          md:rounded-[2rem] md:bg-frame-bezel md:p-[10px] md:shadow-lg
        "
      >
        <div
          dir="rtl"
          lang="fa"
          className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-bg font-sans text-text md:rounded-[1.4rem]"
        >
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  )
}
