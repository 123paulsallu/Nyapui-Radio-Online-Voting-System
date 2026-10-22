import Image from "next/image";

function PersonIcon() {
  return (
    <svg
      className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2ZM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm rounded-2xl border border-blue-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Image
            src="/img/logo.png"
            alt="Nyapui Radio logo"
            width={120}
            height={120}
            priority
            className="h-auto w-28"
          />
        </div>

        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-blue-900">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Enter your credentials to access the admin panel.
        </p>

        <form className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-blue-900"
            >
              Username
            </label>
            <div className="relative">
              <PersonIcon />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="h-10 w-full rounded-lg border border-blue-300 bg-white pr-3 pl-10 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-blue-900"
            >
              Password
            </label>
            <div className="relative">
              <LockIcon />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-10 w-full rounded-lg border border-blue-300 bg-white pr-3 pl-10 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 h-10 rounded-lg bg-blue-900 text-sm font-medium text-amber-400 transition-colors hover:bg-blue-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
