import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function HeroNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center">
      <nav
        className={`flex items-center justify-between px-6 py-3 rounded-full w-full max-w-[1200px] transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 shadow-md backdrop-blur-xl'
            : 'bg-white/60 backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center gap-2">
          <img
            alt="wareX"
            className="h-8 w-auto object-contain animate-logo-glow"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcPn6dMMVcRS2hNoiSs4Kk6HA5TEA_cT4gcjyG8M8zqIvwUdyb2rLj-bxk8qx8ejX37Jtn7V4Sxzg8mFUJQ-flPpgQn245HaecjGMkxrvdH1AqF93Pr5cverVPsSnk6GCkq4m-GSaYx84E5VOJBEfs2gcfIYjM-Z3s3yQMziatyTBceDe6c3IGPhDdwyrncRenin36y7jcrFZ49VgQiYv9dOMpnEi9z9xyJZxdUmpxwZX4lXaqCN0PDw"
          />
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-[#006194] font-bold text-sm border-b-2 border-[#006194] pb-1">
            Solutions
          </a>
          <a href="#" className="text-[#3f4850] hover:text-[#006194] font-medium text-sm transition-colors">
            Platform
          </a>
          <a href="#" className="text-[#3f4850] hover:text-[#006194] font-medium text-sm transition-colors">
            Intelligence
          </a>
          <a href="#" className="text-[#3f4850] hover:text-[#006194] font-medium text-sm transition-colors">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="text-[#3f4850] hover:text-[#006194] font-bold text-sm transition-colors"
          >
            Login
          </Link>
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="bg-[#007bb9] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-110 shadow-sm transition-all active:scale-95"
          >
            Request Demo
          </Link>
        </div>
      </nav>
    </div>
  );
}
