import { Link } from 'react-router-dom';
import {
  Warehouse,
  Cpu,
  Package,
  ClipboardList,
  ShoppingCart,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

const features = [
  {
    icon: Warehouse,
    title: 'Warehouse Management',
    description: 'Manage multiple warehouses with detailed information including location, status, and capacity tracking.',
  },
  {
    icon: Cpu,
    title: 'Device Tracking',
    description: 'Track devices with serial numbers, IMEI, and condition monitoring across bins and zones.',
  },
  {
    icon: Package,
    title: 'Inventory Control',
    description: 'Real-time inventory visibility with move tracking, history, and stock level monitoring.',
  },
  {
    icon: ClipboardList,
    title: 'Pick Lists',
    description: 'Create and manage picking tasks with efficient workflows for order fulfillment.',
  },
  {
    icon: ShoppingCart,
    title: 'Order Management',
    description: 'Handle customer orders from creation through picking, packing, and shipping.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Generate detailed reports on inventory, devices, orders, and picking performance.',
  },
];

const benefits = [
  'Role-based access control with Manager and Worker permissions',
  'Real-time audit logging for all system actions',
  'Responsive design for desktop and mobile use',
  'RESTful API for integrations and automation',
];

export function HeroPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              W
            </div>
            <span className="font-semibold text-foreground tracking-tight">wareX</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to={ROUTES.AUTH.LOGIN}>Log In</Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.AUTH.REGISTER}>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Warehouse Management{' '}
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Track devices, manage inventory, and fulfill orders with wareX.
                A modern warehouse management system built for efficiency and scale.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to={ROUTES.AUTH.REGISTER}>
                    Get Started
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={ROUTES.AUTH.LOGIN}>Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Everything you need to manage your warehouse
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive tools for tracking, managing, and optimizing your warehouse operations.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Built for teams
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Designed with security, scalability, and collaboration in mind.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to streamline your warehouse?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started today and take control of your inventory and operations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to={ROUTES.AUTH.REGISTER}>
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.AUTH.LOGIN}>Log In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                W
              </div>
              <span className="text-sm font-semibold text-foreground">wareX</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} wareX. All rights reserved.
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Shield className="size-3" />
                WMS
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
