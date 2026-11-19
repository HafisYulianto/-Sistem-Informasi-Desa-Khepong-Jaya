import { Users, Home, MapPin, ShoppingBag, Award, HeartHandshake } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  unit: string;
  icon?: string;
}

interface StatisticsSectionProps {
  title?: string | null;
  subtitle?: string | null;
  content: {
    stats?: StatItem[];
  };
}

const iconMap: Record<string, any> = {
  Users,
  Home,
  MapPin,
  ShoppingBag,
  Award,
  HeartHandshake,
};

export default function StatisticsSection({ title, subtitle, content }: StatisticsSectionProps) {
  const stats = content.stats || [];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-accent-light mb-2">
            {subtitle || 'Infografis & Statistik'}
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {title || 'Kependudukan & Wilayah Desa'}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = (stat.icon && iconMap[stat.icon]) || Users;
            return (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:bg-white/10 transition-all hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {stat.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
