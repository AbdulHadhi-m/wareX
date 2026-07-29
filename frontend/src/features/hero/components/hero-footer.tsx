import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Warehouse Management', href: '#' },
      { label: 'Inventory Management', href: '#' },
      { label: 'Order Management', href: '#' },
      { label: 'Pick Lists', href: '#' },
      { label: 'Device Tracking', href: '#' },
      { label: 'Reports & Analytics', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

export function HeroFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <svg className="size-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                ware<span className="text-emerald-400">X</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Internal role-based warehouse management & IMEI device tracking platform.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} wareX. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to={ROUTES.AUTH.LOGIN} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Sign in
            </Link>
            <Link to={ROUTES.AUTH.REGISTER} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
