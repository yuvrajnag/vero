import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-24">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.png" alt="Vero Logo" className="h-6 w-auto grayscale brightness-200" />
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-tight">Product</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">Platform</Link>
              <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-white transition-colors">Security</Link>
              <Link href="#" className="hover:text-white transition-colors">Monitor</Link>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-tight">Features</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">Agents</Link>
              <Link href="#" className="hover:text-white transition-colors">Insights</Link>
              <Link href="#" className="hover:text-white transition-colors">Integrations</Link>
              <Link href="#" className="hover:text-white transition-colors">Changelog</Link>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-tight">Company</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Customers</Link>
              <Link href="#" className="hover:text-white transition-colors">Careers</Link>
              <Link href="#" className="hover:text-white transition-colors">Blog</Link>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-tight">Resources</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-white transition-colors">Technicians</Link>
              <Link href="#" className="hover:text-white transition-colors">Status</Link>
            </div>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-tight">Connect</h4>
            <div className="flex flex-col gap-3 text-sm text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">Contact us</Link>
              <Link href="#" className="hover:text-white transition-colors">Twitter (X)</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex gap-6 pt-12 border-t border-white/5 text-xs text-zinc-600 font-medium">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">DPA</Link>
          <div className="ml-auto opacity-40">
            © {new Date().getFullYear()} Vero
          </div>
        </div>
      </div>
    </footer>
  );
}
