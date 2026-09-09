import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trees, Mountain, Sparkles, Feather, Compass, ArrowRight, Shield, Sun, Snowflake, Leaf, Waves, Droplets, CheckCircle, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocations } from '../../hooks/useLocations';
import { Location } from '../../services/map/mapService';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { AsyncStateWrapper } from '../../components/shared/AsyncStateWrapper';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { PageHeader } from '../../components/ui/PageHeader';
import { SEO } from '../../components/shared/SEO';

const LANDSCAPE_TYPES = [
  {
    name: "National Parks",
    icon: Trees,
    count: "47 Parks",
    description: "Vast protected wilderness zones protecting high alpine tundras and ancient plateaus.",
    filter: "NATIONAL_PARK"
  },
  {
    name: "Fjords & Waterways",
    icon: Waves,
    count: "1,190+ Fjords",
    description: "Glacial marine valleys with vertical cliffs, cascading waterfalls, and emerald waters.",
    filter: "FJORD"
  },
  {
    name: "Glaciers & Icecaps",
    icon: Snowflake,
    count: "Jostedalsbreen & Beyond",
    description: "Continental Europe's largest ice caps, blue ice tongue hikes, and glacial lagoons.",
    filter: "GLACIER"
  },
  {
    name: "Boreal Forests",
    icon: Leaf,
    count: "Taiga Biome",
    description: "Pristine pine and spruce ecosystems home to wild berries, mushrooms, and moose.",
    filter: "FOREST"
  }
];

const SEASONS = [
  {
    season: "Summer (Jun – Aug)",
    icon: Sun,
    highlight: "Midnight Sun & 24h Daylight",
    description: "Snow-free alpine hiking, flowering valleys, and endless evening golden hour above the Arctic Circle."
  },
  {
    season: "Autumn (Sep – Oct)",
    icon: Leaf,
    highlight: "Taiga Foliage & Wild Foraging",
    description: "Vibrant crimson and gold birch trees, peak cloudberry and chanterelle foraging, and crisp mountain air."
  },
  {
    season: "Winter (Nov – Mar)",
    icon: Snowflake,
    highlight: "Aurora Borealis & Polar Nights",
    description: "Dancing northern lights over snow-covered fjords, dog sledding, and Arctic ski touring."
  }
];

const NATURE_DISCIPLINES = [
  {
    title: "Wildlife Field Guide",
    description: "Discover Arctic foxes, Muskoxen, Puffins, and Orcas in their native habitats.",
    icon: Feather,
    route: "/wildlife",
    badge: "Fauna & Marine",
    color: "from-emerald-900/60 to-midnight"
  },
  {
    title: "Botanical Encyclopedia",
    description: "Explore boreal taiga trees, wild berry foraging, and rare alpine flora.",
    icon: Leaf,
    route: "/flora",
    badge: "Flora & Foraging",
    color: "from-teal-900/60 to-midnight"
  },
  {
    title: "Aurora Borealis Live Tracker",
    description: "Track live geomagnetic solar wind, Kp indices, and cloud cover over Tromsø and Alta.",
    icon: Sparkles,
    route: "/aurora",
    badge: "Night Skies",
    color: "from-purple-900/60 to-midnight"
  },
  {
    title: "Alpine Trails & Summits",
    description: "Conquer Besseggen, Preikestolen, and Trolltunga with live trail safety advisories.",
    icon: Mountain,
    route: "/trails",
    badge: "Adventure",
    color: "from-blue-900/60 to-midnight"
  }
];

const ALLEMANNSRETTEN_RULES = [
  {
    title: "Right to Roam",
    description: "You may hike, ski, and cycle freely across unfenced open countryside (utmark)."
  },
  {
    title: "Tent Camping Rules",
    description: "Pitch a tent for up to 2 nights in open country at least 150 meters away from inhabited houses or cabins."
  },
  {
    title: "Wild Foraging",
    description: "Pick wild berries, mushrooms, and flowers freely for personal consumption (special cloudberry rules apply in parts of northern Norway)."
  },
  {
    title: "Fire Season Safety",
    description: "Open campfires in or near forests and uncultivated land are strictly prohibited between April 15 and September 15."
  }
];

export const NatureHub = () => {
  const navigate = useNavigate();
  const [selectedLandscape, setSelectedLandscape] = useState<string>('ALL');

  const { data: nationalParks, isLoading, error } = useLocations({
    category: selectedLandscape === 'ALL' ? ['NATIONAL_PARK', 'NATURE_RESERVE', 'FJORD'] : [selectedLandscape]
  });

  const parks: Location[] = useMemo(() => {
    return (nationalParks as Location[]) || [];
  }, [nationalParks]);

  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      <SEO 
        title="Norway's Wild Nature & National Parks | Norway SmartLife"
        description="Immerse yourself in Norway's pristine national parks, ancient boreal forests, wildlife habitats, and protected Arctic wilderness."
      />

      {/* 1. Nature Hero */}
      <PageHeader
        title="Norway's Wild Nature"
        description="From towering glacial peaks and arctic tundra to ancient pine taiga and cascading fjords, explore the untamed beauty of the North."
        breadcrumb="Nature"
        backgroundImage="/images/besseggen_1786936349992.jpg"
      >
        <div className="flex flex-wrap items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-snow/80">
            <Trees className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">47 Protected National Parks</span>
          </div>
          <div className="flex items-center gap-2 text-snow/80">
            <Shield className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">Allemannsretten (Right to Roam)</span>
          </div>
        </div>
      </PageHeader>

      {/* 2. Norway's Natural Landscapes Introduction */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="bg-midnight/70 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-2">Ecosystem Diversity</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-snow mb-4">
            Untamed Arctic Wilderness & Protected Habitats
          </h2>
          <p className="text-snow/75 text-base leading-relaxed max-w-4xl mb-8 font-light">
            Norway spans over 13 degrees of latitude from the temperate southern coastal archipelagos to the high-Arctic glaciated plateaus of Svalbard. Over 85% of the national territory consists of uncultivated nature, protected under strict environmental statutes and open to everyone through the ancient right to roam.
          </p>

          {/* 3. Explore by Landscape Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LANDSCAPE_TYPES.map((lt) => {
              const Icon = lt.icon;
              const isSelected = selectedLandscape === lt.filter;
              return (
                <div
                  key={lt.name}
                  onClick={() => setSelectedLandscape(isSelected ? 'ALL' : lt.filter)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-arctic-gold/15 border-arctic-gold shadow-lg'
                      : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="p-3 bg-white/10 rounded-xl text-arctic-gold w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-lg text-snow">{lt.name}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-snow/50 bg-black/40 px-2 py-0.5 rounded">
                      {lt.count}
                    </span>
                  </div>
                  <p className="text-xs text-snow/65 leading-relaxed">{lt.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Seasonal Nature */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Phenology & Seasons</span>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">Natural Wonders by Season</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEASONS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.season} className="bg-midnight border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-arctic-gold mb-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{s.season}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-snow mb-2">{s.highlight}</h3>
                  <p className="text-xs text-snow/70 leading-relaxed">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Nature Experiences & Sub-Disciplines */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Exploration Hubs</span>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">Nature Experiences & Field Guides</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NATURE_DISCIPLINES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-b ${item.color} hover:border-arctic-gold/50 transition-all group flex flex-col justify-between relative shadow-lg`}
              >
                <Link to={item.route} className="absolute inset-0 z-10" aria-label={item.title} />
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-white/10 rounded-xl text-arctic-gold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-snow/60 px-2 py-1 bg-black/40 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-snow mb-2 group-hover:text-arctic-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-snow/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold">
                  <span>Enter Hub</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. Responsible Travel / Nature Guidance (Allemannsretten) */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="bg-gradient-to-br from-midnight via-[#132219] to-midnight border border-[#2F5233] rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-3 text-nordic-sage text-xs font-bold uppercase tracking-widest mb-3">
            <Shield className="w-5 h-5 text-nordic-sage" />
            <span>Outdoor Responsibility</span>
          </div>
          <h3 className="text-3xl font-display font-bold text-snow mb-3">
            Allemannsretten — The Norwegian Right to Roam
          </h3>
          <p className="text-snow/70 text-sm max-w-3xl mb-8 leading-relaxed">
            Codified in the Outdoor Recreation Act of 1957, *Allemannsretten* grants all people the right to access and enjoy nature, balanced by the strict duty to tread lightly, leave no trace, and respect wildlife and landowners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALLEMANNSRETTEN_RULES.map((rule, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-nordic-sage font-bold text-sm mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{rule.title}</span>
                </div>
                <p className="text-xs text-snow/70 leading-relaxed">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. All Natural Locations & National Parks */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Protected Wilderness</span>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">
              {selectedLandscape === 'ALL' ? 'All Protected Natural Destinations' : `${selectedLandscape.replace(/_/g, ' ')} Locations`}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {selectedLandscape !== 'ALL' && (
              <button
                onClick={() => setSelectedLandscape('ALL')}
                className="text-xs font-bold uppercase tracking-wider text-arctic-gold hover:text-white transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            )}
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-snow/60">
              {isLoading ? 'Loading...' : `${parks.length} Locations`}
            </span>
          </div>
        </div>

        <AsyncStateWrapper
          isLoading={isLoading}
          error={error}
          data={parks}
          emptyMessage="No natural destinations found for this filter."
          errorMessage="Unable to load natural destinations."
          skeleton={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-midnight h-[400px] animate-pulse border border-white/5 rounded-2xl" />
              ))}
            </div>
          }
        >
          {(parksList: Location[]) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parksList.map((park: Location, idx: number) => (
                <motion.div
                  key={park.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/explore/${park.slug}`)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/explore/${park.slug}`); }}
                  tabIndex={0}
                  role="link"
                  aria-label={`Explore ${park.name}`}
                  className="bg-midnight border border-white/10 hover:border-arctic-gold/50 transition-all duration-500 rounded-2xl overflow-hidden group flex flex-col relative shadow-lg cursor-pointer select-none"
                >
                  <Link to={`/explore/${park.slug}`} className="absolute inset-0 z-10" aria-label={park.name} />

                  <div className="h-64 relative overflow-hidden bg-black/40 pointer-events-none">
                    <OptimizedImage
                      src={park.hero_image_url || park.image_url || '/images/besseggen_1786936349992.jpg'}
                      alt={park.name}
                      category="landscape"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 pointer-events-none" />

                    <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400 border border-white/10 rounded-lg">
                      {park.type?.replace(/_/g, ' ') || 'NATIONAL PARK'}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    <FavoriteButton
                      itemType="LOCATION"
                      itemId={park.id}
                      className="w-9 h-9 text-snow hover:text-nordic-red transition-colors shadow-lg"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10 pointer-events-none">
                    <h3 className="font-display font-bold text-2xl text-snow mb-3 group-hover:text-arctic-gold transition-colors">
                      {park.name}
                    </h3>

                    <p className="font-sans text-sm text-snow/70 line-clamp-2 leading-relaxed mb-6 flex-1">
                      {park.description}
                    </p>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold">
                      <span>Explore National Park</span>
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

export default NatureHub;
