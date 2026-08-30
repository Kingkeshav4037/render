import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Waves, Navigation, Compass, Sparkles, ArrowRight, ShieldCheck, Ship, Camera, Sun, Leaf, Snowflake, MapPin, Anchor, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocations } from '../../hooks/useLocations';
import { Location } from '../../services/map/mapService';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { AsyncStateWrapper } from '../../components/shared/AsyncStateWrapper';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { PageHeader } from '../../components/ui/PageHeader';
import { SEO } from '../../components/shared/SEO';

const FJORD_HIGHLIGHTS = [
  {
    title: "Geirangerfjord",
    badge: "UNESCO World Heritage",
    region: "Sunnmøre / Western Norway",
    description: "Deep emerald waters flanked by near-vertical cliffs and legendary cascades including the Seven Sisters and the Suitor.",
    image: "/images/fjords_1786935800026.jpg",
    slug: "geirangerfjord",
    tags: ["Waterfalls", "Kayaking", "UNESCO"]
  },
  {
    title: "Nærøyfjord",
    badge: "UNESCO World Heritage",
    region: "Sogn / Western Norway",
    description: "The narrowest branch of the Sognefjord, with towering 1,700m peaks pressing right against the tranquil shoreline.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=naeroyfjord+norway&w=1200",
    slug: "flam",
    tags: ["Electric Catamaran", "Flåm Railway", "Scenic Inlets"]
  },
  {
    title: "Hardangerfjord",
    badge: "Orchard & Glacier Fjord",
    region: "Vestland",
    description: "Norway's second longest fjord, famed for spring fruit blossoms, Folgefonna glacier, and the Vøringsfossen waterfall.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=hardangerfjord+norway&w=1200",
    slug: "hardangerfjord",
    tags: ["Cider Route", "Glaciers", "Trolltunga Access"]
  },
  {
    title: "Lysefjord & Pulpit Rock",
    badge: "Adventure Fjord",
    region: "Ryfylke / Rogaland",
    description: "Famous for the sheer 604m Preikestolen plateau and the suspended Kjeragbolten boulder.",
    image: "/images/preikestolen_1786936002797.jpg",
    slug: "southern-norway",
    tags: ["Preikestolen", "Kjerag", "Rock Climbs"]
  }
];

const FJORD_SEASONS = [
  {
    season: "Spring (May – Jun)",
    icon: Leaf,
    title: "Fruit Blossoms & Roaring Waterfalls",
    description: "Snowmelt turns hundreds of cliffside waterfalls into roaring torrents while thousands of apple trees bloom in Hardanger."
  },
  {
    season: "Summer (Jul – Aug)",
    icon: Sun,
    title: "Midnight Cruising & Kayak Treks",
    description: "Warmest fjord waters, long sunny days, silent electric ferry excursions, and high-cliff hiking."
  },
  {
    season: "Autumn & Winter (Sep – Apr)",
    icon: Snowflake,
    title: "Quiet Waters & Fjord Snowscapes",
    description: "Tranquil mist, golden foliage, snow-capped peaks reflecting in mirror-smooth fjords, and cozy waterside saunas."
  }
];

const FJORD_EXPERIENCES = [
  {
    title: "Silent Electric Fjord Cruises",
    description: "Glide without diesel noise or exhaust on high-tech battery-electric catamarans through narrow UNESCO branches.",
    icon: Ship,
    link: "/activities?type=CRUISE"
  },
  {
    title: "Sea Kayaking & SUP",
    description: "Paddle at water level right beneath 1,000-meter sheer rock faces and discover hidden fjord caves.",
    icon: Waves,
    link: "/activities"
  },
  {
    title: "Panoramic Clifftop Viewpoints",
    description: "Visit Stegastein, Ørnevegen (Eagle Road), and Flydalsjuvet for breathtaking bird's-eye fjord vistas.",
    icon: Camera,
    link: "/places"
  }
];

export const Fjords = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const { data: fetchedFjords, isLoading, error } = useLocations({
    category: ['FJORD']
  });

  const fjords: Location[] = useMemo(() => {
    return (fetchedFjords as Location[]) || [];
  }, [fetchedFjords]);

  const filteredFjords = useMemo(() => {
    if (selectedRegion === 'ALL') return fjords;
    return fjords.filter((f: Location) => 
      (f.region && f.region.toLowerCase().includes(selectedRegion.toLowerCase())) ||
      (selectedRegion === 'Western' && (f.name.includes('Geiranger') || f.name.includes('Flåm') || f.name.includes('Hardanger') || f.name.includes('Sognefjord') || f.name.includes('Bergen'))) ||
      (selectedRegion === 'Northern' && (f.name.includes('Tromsø') || f.name.includes('Lofoten') || f.name.includes('Alta')))
    );
  }, [fjords, selectedRegion]);

  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      <SEO 
        title="The Great Norwegian Fjords | Norway SmartLife"
        description="Explore the majestic Norwegian fjords. Discover UNESCO World Heritage fjords, zero-emission silent catamarans, kayak routes, and dramatic cliffside viewpoints."
      />

      {/* 1. Fjords Hero */}
      <PageHeader
        title="The Norwegian Fjords"
        description="Carved by prehistoric glaciers over millions of years, Norway's fjords represent one of the world's most dramatic maritime landscapes."
        breadcrumb="Fjords"
        backgroundImage="/images/fjords_1786935800026.jpg"
      >
        <div className="flex flex-wrap items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-snow/80">
            <Waves className="w-5 h-5 text-fjord-teal" />
            <span className="font-sans text-sm font-medium">Over 1,190 Named Fjords</span>
          </div>
          <div className="flex items-center gap-2 text-snow/80">
            <Ship className="w-5 h-5 text-fjord-teal" />
            <span className="font-sans text-sm font-medium">Zero-Emission Silent Electric Ferries</span>
          </div>
        </div>
      </PageHeader>

      {/* 2. Introduction to Norway's Fjord Landscapes */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="bg-midnight/70 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-2">Maritime Wonders</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-snow mb-4">
            Nature’s Cathedral: Deep Valleys Carved by Glacial Giants
          </h2>
          <p className="text-snow/75 text-base leading-relaxed max-w-4xl mb-8 font-light">
            Formed during successive ice ages when massive glaciers carved U-shaped valleys below sea level, Norwegian fjords are unique marine ecosystems where saltwater arms reach up to 200 kilometers inland. Today, they are safeguarded as UNESCO World Heritage sites and pioneers in green maritime transport.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            {FJORD_EXPERIENCES.map((exp) => {
              const Icon = exp.icon;
              return (
                <Link
                  key={exp.title}
                  to={exp.link}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-fjord-teal hover:bg-white/10 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="p-3 bg-white/10 rounded-xl text-fjord-teal w-fit mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-snow mb-1.5 group-hover:text-fjord-teal transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-snow/65 leading-relaxed mb-4">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-arctic-gold">
                    <span>Explore Experience</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured World-Renowned Fjords */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Spotlight</span>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">World-Renowned Norwegian Fjords</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FJORD_HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-midnight border border-white/10 rounded-2xl overflow-hidden group flex flex-col hover:border-fjord-teal transition-all shadow-lg"
            >
              <div className="h-56 relative overflow-hidden">
                <OptimizedImage
                  src={item.image}
                  alt={item.title}
                  category="landscape"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-fjord-teal border border-white/10 rounded-lg">
                  {item.badge}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-arctic-gold font-bold uppercase tracking-wider mb-1.5">
                  <MapPin size={12} />
                  <span>{item.region}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-snow mb-2 group-hover:text-fjord-teal transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-snow/70 leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.map(t => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 text-snow/60">
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/explore/${item.slug}`}
                  className="inline-flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold hover:text-snow transition-colors pt-3 border-t border-white/10"
                >
                  <span>Explore Fjord</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Best Seasonal Inspiration */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Timing Your Trip</span>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">Fjord Seasons & Best Visiting Windows</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FJORD_SEASONS.map((fs) => {
            const Icon = fs.icon;
            return (
              <div key={fs.season} className="bg-midnight border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-fjord-teal mb-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{fs.season}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-snow mb-2">{fs.title}</h3>
                  <p className="text-xs text-snow/70 leading-relaxed">{fs.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Fjord Sustainable Cruising & Green Maritime Banner */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
        <div className="bg-gradient-to-r from-fjord-teal/20 via-midnight to-midnight border border-fjord-teal/40 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-fjord-teal text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-5 h-5" /> Green Travel & Maritime Protection
            </div>
            <h3 className="text-3xl font-display font-bold text-snow mb-4">Silent Electric Fjord Expeditions</h3>
            <p className="text-sm text-snow/80 leading-relaxed">
              Norway is the first nation to mandate zero-emission regulations for World Heritage fjords by 2026. Sail silently through mist-shrouded valleys on battery-electric catamarans with zero noise pollution.
            </p>
          </div>
          <Link
            to="/activities?type=CRUISE"
            className="px-8 py-4 bg-fjord-teal hover:bg-white text-deep-night font-bold text-xs uppercase tracking-widest rounded-xl transition-all shrink-0 shadow-lg"
          >
            Find Fjord Cruises
          </Link>
        </div>
      </section>

      {/* 6. All Fjord Destinations Grid with Region Selector */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Catalog</span>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">All Fjord Destinations</h2>
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'Western', 'Northern'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-fjord-teal text-deep-night shadow-md'
                    : 'bg-white/5 text-snow/70 hover:bg-white/10 hover:text-snow border border-white/10'
                }`}
              >
                {reg === 'ALL' ? 'All Regions' : `${reg} Fjords`}
              </button>
            ))}
          </div>
        </div>

        <AsyncStateWrapper
          isLoading={isLoading}
          error={error}
          data={filteredFjords}
          emptyMessage="No fjord destinations match this region."
          errorMessage="Unable to load fjord catalog."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-midnight h-[400px] animate-pulse border border-white/5 rounded-2xl" />
              ))}
            </div>
          }
        >
          {(fjordsList: Location[]) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fjordsList.map((fjord: Location, idx: number) => (
                <motion.div
                  key={fjord.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-midnight border border-white/10 hover:border-fjord-teal transition-all duration-500 rounded-2xl overflow-hidden group flex flex-col relative shadow-lg"
                >
                  <Link to={`/explore/${fjord.slug}`} className="absolute inset-0 z-10" aria-label={fjord.name} />

                  <div className="h-64 relative overflow-hidden bg-black/40">
                    <OptimizedImage
                      src={fjord.hero_image_url || fjord.image_url || '/images/fjords_1786935800026.jpg'}
                      alt={fjord.name}
                      category="landscape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 pointer-events-none" />

                    <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-fjord-teal border border-white/10 rounded-lg">
                      FJORD
                    </div>

                    <FavoriteButton
                      itemType="LOCATION"
                      itemId={fjord.id}
                      className="absolute top-4 right-4 z-20 text-snow hover:text-nordic-red transition-colors"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-2xl text-snow mb-3 group-hover:text-fjord-teal transition-colors">
                      {fjord.name}
                    </h3>

                    <p className="font-sans text-sm text-snow/70 line-clamp-2 leading-relaxed mb-6 flex-1">
                      {fjord.description}
                    </p>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold">
                      <span>Explore Fjord Details</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AsyncStateWrapper>
      </section>
    </div>
  );
};

export default Fjords;
