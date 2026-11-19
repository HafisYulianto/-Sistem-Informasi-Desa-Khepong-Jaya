import { getHomepageSections, getPosts, getUMKMProducts } from '@/lib/data/api';
import HeroSlider from '@/components/home/HeroSlider';
import GreetingKades from '@/components/home/GreetingKades';
import StatisticsSection from '@/components/home/StatisticsSection';
import HomeFeedSection from '@/components/home/HomeFeedSection';

export default async function HomePage() {
  const [sections, posts, umkm] = await Promise.all([
    getHomepageSections(),
    getPosts(3),
    getUMKMProducts(),
  ]);

  return (
    <div className="flex flex-col">
      {sections.map((section) => {
        switch (section.section_type) {
          case 'hero_slider':
            return (
              <HeroSlider
                key={section.id}
                slides={section.content.slides || []}
              />
            );

          case 'greeting_kades':
            return (
              <GreetingKades
                key={section.id}
                content={section.content}
              />
            );

          case 'statistics':
            return (
              <StatisticsSection
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                content={section.content}
              />
            );

          case 'custom_section':
            return (
              <section key={section.id} className="py-16 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {section.title && (
                    <div className="text-center max-w-2xl mx-auto mb-10">
                      <h2 className="text-3xl font-extrabold text-slate-800">
                        {section.title}
                      </h2>
                      {section.subtitle && (
                        <p className="text-slate-500 mt-2 text-sm">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                  {section.content?.html && (
                    <div
                      className="prose-desa max-w-4xl mx-auto text-slate-700"
                      dangerouslySetInnerHTML={{ __html: section.content.html }}
                    />
                  )}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Latest news feed & UMKM Showcase */}
      <HomeFeedSection posts={posts} umkm={umkm} />
    </div>
  );
}
