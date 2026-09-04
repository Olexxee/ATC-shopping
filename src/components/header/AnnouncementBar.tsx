export function AnnouncementBar() {
  return (
    <div className="bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-9 max-w-[1440px] items-center justify-center px-4 text-center text-xs font-medium tracking-wide sm:px-6 lg:px-8">
        <p>
          Import globally. Shop locally.{" "}
          <a
            href="/importation"
            className="ml-1 underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
}
