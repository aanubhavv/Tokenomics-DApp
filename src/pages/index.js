import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`relative flex min-h-screen flex-col items-center justify-center p-24 bg-black ${inter.className}`}
    >
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 opacity-30 blur-3xl"></div>
      </div>
      <h1 className="relative text-3xl font-bold text-white">Tokenomics DApp</h1>
      <h2 className="relative text-xl mb-12 text-gray-400">By Anubhav Garg</h2>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2">
        <a
          href="/admin"
          className="group relative rounded-lg border border-transparent px-5 py-4 transition-all duration-300 hover:border-blue-500 hover:bg-blue-900/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold text-white group-hover:text-blue-500">
            Register{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-gray-400">
            Register and manage your organization.
          </p>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        </a>

        <a
          href="/claim"
          className="group relative rounded-lg border border-transparent px-5 py-4 transition-all duration-300 hover:border-green-500 hover:bg-green-900/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold text-white group-hover:text-green-500">
            Claim{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-gray-400">
            Claim your allocated tokens!
          </p>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        </a>
      </div>
    </main>
  );
}
