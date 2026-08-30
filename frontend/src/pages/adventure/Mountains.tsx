import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, AlertTriangle, ShieldCheck, TrendingUp, Navigation, ArrowRight, Compass, Sun, Wind, CloudRain, MapPin, Footprints, Shield, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { SEO } from '../../components/shared/SEO';
import { OptimizedImage } from '../../components/shared/OptimizedImage';

const MOUNTAIN_RANGES = [
  {
    name: "Jotunheimen National Park",
    badge: "Home of the Giants",
    elevation: "2,469 m max",
    peaks: "250+ peaks over 2,000m",
    description: "Northern Europe's highest mountain range featuring Galdhøpiggen, Glittertind, and the famous knife-edge Besseggen ridge.",
    image: "/images/galdhopiggen_1786936412055.jpg",
    trailLink: "/trails/tr-005"
  },
  {
    name: "Sunnmøre Alps",
    badge: "Fjord-to-Summit",
    elevation: "1,700 m max",
    peaks: "Jagged Alpine Needles",
    description: "Dramatic pinnacles rising straight out of the Hjørundfjord, world-famous for mountaineering and summit ski-touring.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=sunnmore+alps+norway&w=1200",
    trailLink: "/trails"
  },
  {
    name: "Lofoten Wall",
    badge: "Arctic Sea Peaks",
    elevation: "1,161 m max",
    peaks: "Glaciated Sea Cliffs",
    description: "Granite walls shooting out of the Norwegian Sea, offering iconic panorama hikes like Reinebringen and Ryten.",
    image: "/images/ryten_1786936427556.jpg",
    trailLink: "/trails/tr-006"
  },
  {
    name: "Rondane National Park",
    badge: "Norway's First NP",
    elevation: "2,178 m max",
    peaks: "10 peaks over 2,000m",
    description: "Ancient rounded alpine massifs, vast lichen-covered valleys, and home to Norway's last wild reindeer herds.",
    image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=rondane+national+park+norway&w=1200",
    trailLink: "/trails"
  }
];

const TOP_SUMMITS = [
  {
    name: "Galdhøpiggen",
    elevation: "2,469 m",
    range: "Jotunheimen",
    difficulty: "Extreme (Glacier Crossing)",
    image: "/images/galdhopiggen_1786936412055.jpg",
    description: "The highest peak in Northern Europe, offering breathtaking vistas over the Styggebreen glacier.",
    trailId: "tr-005"
  },
  {
    name: "Besseggen Ridge",
    elevation: "1,743 m",
    range: "Jotunheimen",
    difficulty: "Hard / Demanding",
    image: "/images/besseggen_1786936349992.jpg",
    description: "Norway's legendary knife-edge ridge separating emerald Lake Gjende and dark blue Lake Bessvatnet.",
    trailId: "tr-003"
  },
  {
    name: "Trolltunga",
    elevation: "1,180 m",
    range: "Hardanger",
    difficulty: "Challenging (10-12 hrs)",
    image: "/images/trolltunga_1786936111320.jpg",
    description: "The 'Troll Tongue' rock cliff jutting 700 meters horizontally over Lake Ringedalsvatnet.",
    trailId: "tr-002"
  },
  {
    name: "Preikestolen",
    elevation: "604 m",
    range: "Ryfylke",
    difficulty: "Moderate (4 hrs)",
    image: "/images/preikestolen_1786936002797.jpg",
    description: "Pulpit Rock, a dramatic flat 25x25 meter mountain plateau towering straight above Lysefjord.",
    trailId: "tr-001"
  },
  {
    name: "Reinebringen",
    elevation: "448 m",
    range: "Lofoten",
    difficulty: "Steep Stairs (1,560 Steps)",
    image: "/images/lofoten_1787013505867.jpg",
    description: "A steep stone staircase hike rewarding climbers with the most iconic 360-degree panorama of the Lofoten Wall.",
    trailId: "tr-006"
  },
  {
    name: "Kjeragbolten",
    elevation: "1,084 m",
    range: "Ryfylke",
    difficulty: "Demanding",
    image: "/images/kjeragbolten_1786936275605.jpg",
    description: "A 5-cubic-meter boulder wedged tightly inside a 984-meter deep mountain crevasse.",
    trailId: "tr-004"
  }
];

const MOUNTAIN_ACTIVITIES = [
  {
    title: "Guided Glacier Treks",
    description: "Rope up with certified IFMGA guides to traverse crevasses and blue ice on Jostedalsbreen & Folgefonna.",
    route: "/activities",
    badge: "Glacier Traverse"
  },
  {
    title: "Via Ferrata Climbing",
    description: "Climb vertical granite routes with steel cables and suspension bridges in Loen and Romsdalen.",
    route: "/activities",
    badge: "Climbing"
  },
  {
    title: "Backcountry Ski Touring",
    description: "Earn your turns with skins on remote summits in the Sunnmøre Alps and Lyngen Alps.",
    route: "/resorts",
    badge: "Alpine Touring"
  }
];

const FJELLVETTREGLENE = [
  "1. Plan your trip and inform others about your route.",
  "2. Adapt the planned routes according to ability and conditions.",
  "3. Pay attention to weather forecasts and avalanche warnings.",
  "4. Be equipped for bad weather and frost, even on short trips.",
  "5. Bring the necessary equipment so you can help yourself and others.",
  "6. Choose safe routes. Recognize avalanche terrain and unsafe ice.",
  "7. Use a map and compass. Always know where you are.",
  "8. Don't be ashamed to turn around in time.",
  "9. Save your strength and dig yourself into the snow if necessary."
];

export const Mountains = () => {
  return (
    <div className="bg-deep-night min-h-screen text-snow selection:bg-fjord-teal/30">
      <SEO 
        title="Norwegian Mountains, Alpine Summits & Safety | Norway SmartLife"
        description="Conquer Norway's alpine peaks, from Galdhøpiggen and Besseggen to Trolltunga. Learn the 9 Fjellvettreglene mountain safety rules and explore iconic trail routes."
      />

      {/* 1. Mountains Hero */}
      <PageHeader
        title="Mountains & Alpine Summits"
        description="Home to over 300 peaks exceeding 2,000 meters, Norway's alpine ranges offer legendary ridges, glacier traverses, and panoramic summit routes."
        breadcrumb="Mountains"
        backgroundImage="/images/kjeragbolten_1786936275605.jpg"
      >
        <div className="flex flex-wrap items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-snow/80">
            <Mountain className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">Over 300 Peaks &gt; 2,000m</span>
          </div>
          <div className="flex items-center gap-2 text-snow/80">
            <ShieldCheck className="w-5 h-5 text-arctic-gold" />
            <span className="font-sans text-sm font-medium">Fjellvettreglene Mountain Safety Code</span>
          </div>
        </div>
      </PageHeader>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        {/* 2. Mountain Ranges & Alpine Hubs */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Alpine Massifs</span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-snow">Major Norwegian Mountain Ranges</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOUNTAIN_RANGES.map((range, idx) => (
              <motion.div
                key={range.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-midnight border border-white/10 rounded-2xl overflow-hidden group flex flex-col hover:border-arctic-gold/50 transition-all shadow-lg"
              >
                <div className="h-48 relative overflow-hidden bg-black/40">
                  <OptimizedImage
                    src={range.image}
                    alt={range.name}
                    category="trail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10 rounded-lg">
                    {range.badge}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-xl text-snow mb-1 group-hover:text-arctic-gold transition-colors">
                    {range.name}
                  </h3>
                  <div className="text-[11px] font-mono text-snow/60 mb-3 flex items-center justify-between">
                    <span>{range.elevation}</span>
                    <span>{range.peaks}</span>
                  </div>
                  <p className="text-xs text-snow/70 leading-relaxed mb-4 flex-1">
                    {range.description}
                  </p>

                  <Link
                    to={range.trailLink}
                    className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold hover:text-snow transition-colors"
                  >
                    <span>View Trails in Range</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Top Summits & Trails Catalog */}
        <section className="mb-20">
          <div className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Alpine Catalog</span>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">Iconic Peaks & Mountain Routes</h2>
            </div>
            <Link
              to="/trails"
              className="text-xs font-bold uppercase tracking-widest text-arctic-gold hover:text-white transition-colors flex items-center gap-1"
            >
              All Hiking Trails <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOP_SUMMITS.map((summit, idx) => (
              <motion.div
                key={summit.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-midnight border border-white/10 rounded-2xl overflow-hidden group flex flex-col hover:border-arctic-gold/50 transition-all relative shadow-lg"
              >
                <div className="h-64 relative overflow-hidden bg-black/40">
                  <OptimizedImage
                    src={summit.image}
                    alt={summit.name}
                    category="trail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-80 pointer-events-none" />

                  <div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-md px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-arctic-gold border border-white/10 rounded-lg">
                    {summit.range}
                  </div>

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-snow rounded-lg border border-white/10">
                    {summit.elevation}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs font-bold text-snow/60 uppercase tracking-wider mb-1">
                    {summit.difficulty}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-snow mb-3 group-hover:text-arctic-gold transition-colors">
                    {summit.name}
                  </h3>
                  <p className="text-xs text-snow/70 leading-relaxed mb-6 flex-1">
                    {summit.description}
                  </p>

                  <Link
                    to={`/trails/${summit.trailId}`}
                    className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold hover:text-snow transition-colors"
                  >
                    <span>View Trail Details</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Mountain Activities */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="text-arctic-gold text-xs font-bold uppercase tracking-widest block mb-1">Adventure Sports</span>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-snow">Mountain Activities & Climbing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOUNTAIN_ACTIVITIES.map((act) => (
              <Link
                key={act.title}
                to={act.route}
                className="bg-midnight border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-arctic-gold/50 transition-all group"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-arctic-gold bg-white/5 border border-white/10 px-2.5 py-1 rounded w-fit mb-4">
                    {act.badge}
                  </div>
                  <h3 className="font-display font-bold text-xl text-snow mb-2 group-hover:text-arctic-gold transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-snow/70 leading-relaxed">{act.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-arctic-gold">
                  <span>Browse Activities</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Fjellvettreglene: The 9 Norwegian Mountain Safety Rules */}
        <section className="bg-gradient-to-br from-midnight via-[#132219] to-midnight border border-[#2F5233] rounded-3xl p-8 md:p-12 mb-20 shadow-2xl">
          <div className="flex items-center gap-3 text-nordic-sage text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldCheck className="w-5 h-5 text-nordic-sage" />
            <span>Essential Mountain Code</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-snow mb-4">
            Fjellvettreglene — The 9 Mountain Safety Rules
          </h3>
          <p className="text-snow/70 text-sm max-w-3xl mb-8 leading-relaxed">
            Established by the Norwegian Trekking Association (DNT) and the Red Cross, these 9 principles are sacred in Norwegian outdoor culture to prevent accidents in unpredictable mountain weather.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {FJELLVETTREGLENE.map((rule, idx) => (
              <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-xl text-xs text-snow/80 leading-relaxed font-medium">
                {rule}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
            <span className="text-xs text-snow/60">Always check YR.no and Varsom.no for live weather & avalanche forecasts.</span>
            <div className="flex gap-4">
              <Link
                to="/guides"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-snow font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-white/15"
              >
                Hiking Packing Guides
              </Link>
              <Link
                to="/trails"
                className="px-6 py-3 bg-nordic-sage text-deep-night font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-md"
              >
                Browse All Hiking Trails
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Mountains;
