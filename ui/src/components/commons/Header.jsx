import { Github } from "lucide-react";

import { GITHUB_REPO_URL } from "constants";

const Header = () => (
  <header className="flex h-12 shrink-0 items-center justify-between bg-slate-900 border-b border-slate-700 px-4 text-white sm:px-6">
    <span className="text-sm font-semibold tracking-tight">Customer Support</span>
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View source on GitHub"
      className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Github className="size-4" />
      <span className="hidden sm:inline">GitHub</span>
    </a>
  </header>
);

export default Header;
