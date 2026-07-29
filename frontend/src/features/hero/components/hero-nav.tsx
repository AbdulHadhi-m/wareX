import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const solutions = [
  { label: 'Warehouse Management System', href: '#' },
  { label: 'Multi-Warehouse Inventory', href: '#' },
  { label: 'B2C & B2B Order Fulfilment', href: '#' },
  { label: 'Pick, Pack & Dispatch Engine', href: '#' },
  { label: 'Device & Handheld Scanning', href: '#' },
  { label: 'Real-time Analytics & Control Tower', href: '#' },
];

const resources = [
  { label: 'Documentation', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Case Studies', href: '#' },
  { label: 'Help Center', href: '#' },
];

const company = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Contact Us', href: '#' },
];

const customerStories = [
  { label: 'Retail & Fashion', href: '#' },
  { label: 'Electronics & Tech', href: '#' },
  { label: 'FMCG & Grocery', href: '#' },
];

export function HeroNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100/80',
        scrolled ? 'shadow-sm py-3' : 'py-4',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-full bg-[#111827] flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <svg className="size-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-[#111827]">
              ware<span className="text-emerald-600">X</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-9">
            <DropdownMenu
              label="Solutions"
              isOpen={openDropdown === 'solutions'}
              onToggle={() => setOpenDropdown(openDropdown === 'solutions' ? null : 'solutions')}
              items={solutions}
            />
            <DropdownMenu
              label="Resources"
              isOpen={openDropdown === 'resources'}
              onToggle={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              items={resources}
            />
            <DropdownMenu
              label="Company"
              isOpen={openDropdown === 'company'}
              onToggle={() => setOpenDropdown(openDropdown === 'company' ? null : 'company')}
              items={company}
            />
            <DropdownMenu
              label="Customer stories"
              isOpen={openDropdown === 'customerStories'}
              onToggle={() => setOpenDropdown(openDropdown === 'customerStories' ? null : 'customerStories')}
              items={customerStories}
            />
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone & WhatsApp Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === 'phone' ? null : 'phone');
                }}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100/60"
              >
                <Phone className="size-4 stroke-[2.2]" />
                <ChevronDown className={cn("size-3.5 text-gray-500 transition-transform duration-200", openDropdown === 'phone' && 'rotate-180')} />
              </button>

              {openDropdown === 'phone' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 mt-3 w-80 sm:w-[340px] rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/10 p-5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Modal Header */}
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className="size-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                      <MessageCircle className="size-4 fill-emerald-600/10 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">Chat on Whatsapp</h4>
                      <p className="text-xs text-gray-400 font-normal">Message us for quick assistance</p>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 text-center mb-3">
                    {/* QR Code Graphic Image */}
                    <div className="size-48 mx-auto mb-3 bg-white p-2.5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src="/whatsapp-qr.png"
                        alt="WhatsApp QR Code"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    <p className="text-xs font-semibold text-gray-900 mb-1">Scan the QR code to chat</p>
                    <p className="text-[11px] text-gray-400 font-medium mb-3">or</p>

                    <a
                      href="https://wa.me/918590979867"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <span>Open Whatsapp</span>
                      <ChevronRight className="size-3.5 text-gray-600 stroke-[2.5]" />
                    </a>
                  </div>

                  {/* Bottom Phone Call Button */}
                  <a
                    href="tel:+918590979867"
                    className="w-full py-3 px-4 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="size-4 text-gray-800 stroke-[2.2]" />
                    <span>+91 85909 79867</span>
                  </a>
                </div>
              )}
            </div>

            {/* Book a Demo Button */}
            <Link to={ROUTES.AUTH.REGISTER}>
              <button className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-900 font-medium text-sm hover:border-gray-400 hover:bg-gray-50/80 transition-all shadow-xs">
                Book a demo
              </button>
            </Link>

            {/* Sign in Button */}
            <Link to={ROUTES.AUTH.LOGIN}>
              <button className="px-6 py-2.5 rounded-full bg-[#111827] text-white font-medium text-sm hover:bg-gray-800 transition-all shadow-sm">
                Sign in
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-5 py-6 space-y-5 shadow-xl">
          <MobileSection label="Solutions" items={solutions} />
          <MobileSection label="Resources" items={resources} />
          <MobileSection label="Company" items={company} />
          <MobileSection label="Customer stories" items={customerStories} />
          <div className="pt-4 flex flex-col gap-3">
            <Link to={ROUTES.AUTH.REGISTER}>
              <button className="w-full py-3 rounded-full border border-gray-300 text-gray-900 font-medium text-sm hover:bg-gray-50">
                Book a demo
              </button>
            </Link>
            <Link to={ROUTES.AUTH.LOGIN}>
              <button className="w-full py-3 rounded-full bg-[#111827] text-white font-medium text-sm hover:bg-gray-800">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownMenu({
  label,
  isOpen,
  onToggle,
  items,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        {label}
        <ChevronDown className={cn('size-4 text-gray-500 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-64 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3.5 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileSection({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
      <div className="space-y-1 pl-2">
        {items.map((item) => (
          <a key={item.label} href={item.href} className="block py-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

