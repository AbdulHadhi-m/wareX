export function HeroFooter() {
  return (
    <footer className="bg-[#f2f4f6] border-t border-[#bfc7d2]/30 w-full py-10 mt-10 relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-start px-4 sm:px-6 gap-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              alt="wareX"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcPn6dMMVcRS2hNoiSs4Kk6HA5TEA_cT4gcjyG8M8zqIvwUdyb2rLj-bxk8qx8ejX37Jtn7V4Sxzg8mFUJQ-flPpgQn245HaecjGMkxrvdH1AqF93Pr5cverVPsSnk6GCkq4m-GSaYx84E5VOJBEfs2gcfIYjM-Z3s3yQMziatyTBceDe6c3IGPhDdwyrncRenin36y7jcrFZ49VgQiYv9dOMpnEi9z9xyJZxdUmpxwZX4lXaqCN0PDw"
            />
          </div>
          <p className="text-sm text-[#3f4850] max-w-xs leading-relaxed">
            Redefining industrial intelligence for the next century of logistics. Based in Zurich,
            serving the world.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-[#191c1e] tracking-wide">Platform</h4>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Automated Routing</a>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Spatial Intelligence</a>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Fleet Manager</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-[#191c1e] tracking-wide">Company</h4>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">About Us</a>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Security</a>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Careers</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-[#191c1e] tracking-wide">Support</h4>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Help Center</a>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">API Docs</a>
            <a href="#" className="text-[#3f4850] hover:text-[#006194] transition-colors text-sm">Contact</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-[#bfc7d2]/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#3f4850] text-xs opacity-70">
          &copy; 2024 wareX Intelligence Systems. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-[#3f4850] text-xs hover:text-[#006194] opacity-70">Privacy Policy</a>
          <a href="#" className="text-[#3f4850] text-xs hover:text-[#006194] opacity-70">Terms of Service</a>
          <a href="#" className="text-[#3f4850] text-xs hover:text-[#006194] opacity-70">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
