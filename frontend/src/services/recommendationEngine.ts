import { supabase } from '../lib/supabase';
import { recentlyViewedService, RecentlyViewedItem } from './recentlyViewedService';
import { favoriteService } from './favoriteService';
import { tripService } from './tripService';

export interface RecommendationItem {
  id: string;
  type: 'DESTINATION' | 'STAY' | 'ACTIVITY' | 'RESTAURANT' | 'FOOD' | 'PRODUCT' | 'TRAIL';
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  route: string;
  rating?: number;
  price?: string;
  region?: string;
  tags?: string[];
  relevanceScore: number;
  matchReason: string;
}

export interface RecommendationSections {
  recommendedForYou: RecommendationItem[];
  youMayAlsoLike: RecommendationItem[];
  perfectForTrip: RecommendationItem[];
  exploreMore: RecommendationItem[];
}

// Fallback curated content pool with verified images and routes
const CANDIDATE_POOL: Omit<RecommendationItem, 'relevanceScore' | 'matchReason'>[] = [
  {
    id: 'dest-lofoten',
    type: 'DESTINATION',
    title: 'Lofoten Islands',
    subtitle: 'Dramatic peaks and arctic fjords',
    description: 'Experience jagged peaks, open sea, and secluded bays in Norway’s premier wilderness archipelago.',
    image_url: '/images/dest_lofoten_1787013753000.jpg',
    route: '/destinations',
    rating: 4.9,
    region: 'Nordland',
    tags: ['hiking', 'photography', 'aurora', 'adventure', 'fjords']
  },
  {
    id: 'dest-geiranger',
    type: 'DESTINATION',
    title: 'Geirangerfjord',
    subtitle: 'UNESCO World Heritage Fjord',
    description: 'Deep blue waters, majestic snow-covered peaks, and wild waterfalls including the Seven Sisters.',
    image_url: '/images/geirangerfjord_1786936111320.jpg',
    route: '/fjords',
    rating: 5.0,
    region: 'Møre og Romsdal',
    tags: ['fjords', 'nature', 'cruises', 'hiking', 'relaxed']
  },
  {
    id: 'dest-tromso',
    type: 'DESTINATION',
    title: 'Tromsø Arctic Hub',
    subtitle: 'Gateway to the Northern Lights',
    description: 'The Arctic capital offers world-class Northern Lights chasing, dog sledding, and vibrant fjord culture.',
    image_url: '/images/dest_tromso_1787013773000.jpg',
    route: '/destinations',
    rating: 4.8,
    region: 'Troms',
    tags: ['aurora', 'winter', 'wildlife', 'culture', 'arctic']
  },
  {
    id: 'dest-flam',
    type: 'DESTINATION',
    title: 'Flåm & Nærøyfjord',
    subtitle: 'The historic railway & sheer canyon fjord',
    description: 'Ride the world-famous Flåm Railway and cruise through the dramatic Nærøyfjord canyon.',
    image_url: '/images/fjord_naeroyfjord_1787013793000.jpg',
    route: '/fjords',
    rating: 4.9,
    region: 'Vestland',
    tags: ['fjords', 'railway', 'scenic', 'hiking', 'relaxed']
  },
  {
    id: 'stay-juvet',
    type: 'STAY',
    title: 'Juvet Landscape Hotel',
    subtitle: 'Architectural immersion in Valldal',
    description: 'Individual glass cabins built directly into the forest offering raw, unobstructed nature views.',
    image_url: '/images/hotel_juvet_1787013813000.jpg',
    route: '/stay/stay-1',
    rating: 4.9,
    price: 'NOK 3,200 / night',
    region: 'Møre og Romsdal',
    tags: ['luxury', 'design', 'nature', 'romantic', 'eco-certified']
  },
  {
    id: 'stay-manshausen',
    type: 'STAY',
    title: 'Manshausen Sea Cabins',
    subtitle: 'Cantilevered glass over the Steigen fjord',
    description: 'Award-winning sea cabins designed by Snorre Stinessen jutting over the crystal Arctic sea.',
    image_url: '/images/hotel_manshausen_1787013833000.jpg',
    route: '/stay/stay-2',
    rating: 5.0,
    price: 'NOK 2,900 / night',
    region: 'Nordland',
    tags: ['luxury', 'coastal', 'adventure', 'design', 'kayaking']
  },
  {
    id: 'trail-trolltunga',
    type: 'TRAIL',
    title: 'Trolltunga Cliff Hike',
    subtitle: 'Iconic 28km mountain trail',
    description: 'Hover 700 meters above Lake Ringedalsvatnet for Norway’s most breathtaking panoramic cliff edge.',
    image_url: '/images/trolltunga_1786936111320.jpg',
    route: '/hiking-trails',
    rating: 4.9,
    region: 'Vestland',
    tags: ['hiking', 'adventure', 'mountains', 'photography', 'challenging']
  },
  {
    id: 'trail-pulpit-rock',
    type: 'TRAIL',
    title: 'Preikestolen (Pulpit Rock)',
    subtitle: '604m plateau over the Lysefjord',
    description: 'One of the most spectacular viewing plateaus in the world with a friendly 4-hour return hike.',
    image_url: '/images/preikestolen_1786936111320.jpg',
    route: '/hiking-trails',
    rating: 4.9,
    region: 'Rogaland',
    tags: ['hiking', 'fjords', 'family', 'photography', 'moderate']
  },
  {
    id: 'act-aurora-chase',
    type: 'ACTIVITY',
    title: 'Arctic Aurora Chasing Safari',
    subtitle: 'Guided small-group polar expedition',
    description: 'Hunt the mystical Aurora Borealis with professional meteorology guides and thermal gear in Tromsø.',
    image_url: '/images/dest_tromso_1787013773000.jpg',
    route: '/travel',
    rating: 4.9,
    price: 'NOK 1,450',
    region: 'Troms',
    tags: ['aurora', 'adventure', 'photography', 'arctic', 'guided']
  },
  {
    id: 'act-fjord-kayaking',
    type: 'ACTIVITY',
    title: 'Nærøyfjord Kayak Tour',
    subtitle: 'Gliding beneath 1,000m cliffs',
    description: 'Paddle past cascading waterfalls and seal colonies in Norway’s narrowest UNESCO fjord.',
    image_url: '/images/fjord_naeroyfjord_1787013793000.jpg',
    route: '/travel',
    rating: 4.8,
    price: 'NOK 980',
    region: 'Vestland',
    tags: ['kayaking', 'fjords', 'eco', 'water', 'adventure']
  },
  {
    id: 'food-rakfisk',
    type: 'FOOD',
    title: 'Traditional Smoked Salmon & Rømmegrøt',
    subtitle: 'Authentic Nordic fjord culinary tasting',
    description: 'Locally cured salmon paired with traditional sour cream porridge and mountain flatbread.',
    image_url: '/images/food_salmon_soup_1787013873000.jpg',
    route: '/food',
    rating: 4.8,
    price: 'NOK 290',
    region: 'Vestland',
    tags: ['food', 'traditional', 'dining', 'culinary', 'seafood']
  },
  {
    id: 'prod-merino-sweater',
    type: 'PRODUCT',
    title: 'Arctic Merino Wool Knit',
    subtitle: 'Handcrafted weatherproof Norwegian wool',
    description: '100% pure Norwegian Merino wool sweater engineered for thermal insulation in sub-zero polar winds.',
    image_url: '/images/prod_merino_sweater_1787013913000.jpg',
    route: '/shop',
    rating: 4.9,
    price: 'NOK 1,890',
    tags: ['shop', 'clothing', 'sustainable', 'outdoor', 'gear']
  }
];

export const recommendationEngine = {
  /**
   * Extract interest tags and category affinities from user signals
   */
  async extractUserSignals(userId?: string | null): Promise<{
    preferredTags: Set<string>;
    preferredRegions: Set<string>;
    viewedIds: Set<string>;
    favoriteIds: Set<string>;
    tripRegions: Set<string>;
  }> {
    const preferredTags = new Set<string>();
    const preferredRegions = new Set<string>();
    const viewedIds = new Set<string>();
    const favoriteIds = new Set<string>();
    const tripRegions = new Set<string>();

    try {
      // 1. Recently Viewed signals
      const recent = await recentlyViewedService.getRecentlyViewed(userId);
      recent.forEach((item: RecentlyViewedItem) => {
        viewedIds.add(item.item_id);
        const match = CANDIDATE_POOL.find(c => c.id === item.item_id || c.title.toLowerCase() === item.title.toLowerCase());
        if (match) {
          match.tags?.forEach(t => preferredTags.add(t));
          if (match.region) preferredRegions.add(match.region);
        }
        if (item.metadata?.region) preferredRegions.add(item.metadata.region);
        if (item.metadata?.tags && Array.isArray(item.metadata.tags)) {
          item.metadata.tags.forEach((t: string) => preferredTags.add(t));
        }
      });

      // 2. Favorites signals
      if (userId) {
        const favs = await favoriteService.getFavorites(userId);
        favs.forEach(f => {
          favoriteIds.add(f.item_id);
          const match = CANDIDATE_POOL.find(c => c.id === f.item_id || c.title.toLowerCase() === f.item_id.toLowerCase());
          if (match) {
            match.tags?.forEach(t => preferredTags.add(t));
            if (match.region) preferredRegions.add(match.region);
          }
        });

        // 3. User Trips signals
        const userTrips = await tripService.fetchUserTrips(userId);
        userTrips.forEach(t => {
          if (t.title) {
            if (t.title.includes('Lofoten')) tripRegions.add('Nordland');
            if (t.title.includes('Fjord') || t.title.includes('Bergen')) tripRegions.add('Vestland');
            if (t.title.includes('Tromsø') || t.title.includes('Arctic')) tripRegions.add('Troms');
            if (t.title.includes('Geiranger')) tripRegions.add('Møre og Romsdal');
          }
        });
      }
    } catch (err) {
      console.warn('Error extracting user signals for recommendations:', err);
    }

    return { preferredTags, preferredRegions, viewedIds, favoriteIds, tripRegions };
  },

  /**
   * Score an item against user signals
   */
  scoreItem(
    item: typeof CANDIDATE_POOL[0],
    signals: {
      preferredTags: Set<string>;
      preferredRegions: Set<string>;
      viewedIds: Set<string>;
      favoriteIds: Set<string>;
      tripRegions: Set<string>;
    }
  ): { score: number; reason: string } {
    let score = 50; // baseline score
    let reasons: string[] = [];

    // Tag matching (+15 each)
    let tagMatches = 0;
    item.tags?.forEach(t => {
      if (signals.preferredTags.has(t)) {
        score += 15;
        tagMatches++;
      }
    });
    if (tagMatches > 0) {
      reasons.push(`Matches your interest in ${item.tags?.filter(t => signals.preferredTags.has(t)).join(', ')}`);
    }

    // Region matching (+20)
    if (item.region && signals.preferredRegions.has(item.region)) {
      score += 20;
      reasons.push(`Popular in ${item.region}`);
    }

    // Trip region matching (+30)
    if (item.region && signals.tripRegions.has(item.region)) {
      score += 30;
      reasons.push(`Perfect addition to your planned journey`);
    }

    // High rating bonus (+10)
    if (item.rating && item.rating >= 4.9) {
      score += 10;
    }

    // Boost if not yet viewed (+10 for discovery)
    if (!signals.viewedIds.has(item.id)) {
      score += 10;
    }

    const matchReason = reasons.length > 0 ? reasons[0] : 'Top-rated Norwegian experience';
    return { score, reason: matchReason };
  },

  /**
   * Get comprehensive personalized recommendation sections
   */
  async getPersonalizedRecommendations(userId?: string | null): Promise<RecommendationSections> {
    const signals = await this.extractUserSignals(userId);

    const scoredPool = CANDIDATE_POOL.map(item => {
      const { score, reason } = this.scoreItem(item, signals);
      return {
        ...item,
        relevanceScore: score,
        matchReason: reason,
      };
    });

    // 1. Recommended For You: Highest ranked overall
    const recommendedForYou = [...scoredPool]
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);

    // 2. You May Also Like: Similar to recently viewed / favorited
    const youMayAlsoLike = [...scoredPool]
      .filter(i => (i.tags?.some(t => signals.preferredTags.has(t))) || i.rating! >= 4.8)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);

    // 3. Perfect For Your Trip: Items located in user's trip regions
    const perfectForTrip = [...scoredPool]
      .filter(i => (i.region && signals.tripRegions.has(i.region)) || i.type === 'ACTIVITY' || i.type === 'STAY')
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);

    // 4. Explore More in Norway: High-rated items in other regions
    const exploreMore = [...scoredPool]
      .filter(i => !signals.viewedIds.has(i.id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);

    return {
      recommendedForYou,
      youMayAlsoLike,
      perfectForTrip,
      exploreMore,
    };
  },

  /**
   * Get items similar to a specific entity
   */
  async getSimilarItems(itemType: string, itemId: string, limit: number = 4): Promise<RecommendationItem[]> {
    const target = CANDIDATE_POOL.find(c => c.id === itemId);
    const targetTags = new Set(target?.tags || []);
    const targetRegion = target?.region;

    const similar = CANDIDATE_POOL.filter(c => c.id !== itemId)
      .map(item => {
        let score = 0;
        item.tags?.forEach(t => {
          if (targetTags.has(t)) score += 20;
        });
        if (targetRegion && item.region === targetRegion) score += 25;
        if (item.type === itemType) score += 15;

        return {
          ...item,
          relevanceScore: score,
          matchReason: `Similar to ${target?.title || 'places you explored'}`,
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return similar;
  }
};
