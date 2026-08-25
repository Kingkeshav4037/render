import { TripPlanRequest, TripPlanResponse } from '../../types/planner';

const DESTINATION_ACTIVITIES: Record<string, Array<{ title: string; desc: string; type: 'activity' | 'dining' | 'transport'; cost: number; duration: number }>> = {
  'Tromsø': [
    { title: 'Fjellheisen Cable Car & Storsteinen Panorama', desc: 'Panoramic views over Tromsø island and surrounding Arctic summits.', type: 'activity', cost: 395, duration: 2.5 },
    { title: 'Arctic Cathedral & Historical Harbor Walk', desc: 'Architectural landmark with towering stained glass and harbor heritage.', type: 'activity', cost: 80, duration: 2 },
    { title: 'Tromsø Reindeer Sledding & Sami Cultural Camp', desc: 'Traditional Sami camp experience with reindeer feeding and storytelling.', type: 'activity', cost: 1650, duration: 4 },
    { title: 'Emmas Drømmekjøkken Arctic Dining', desc: 'Celebrated local eatery serving fresh Atlantic halibut and cloudberry desserts.', type: 'dining', cost: 750, duration: 2 },
    { title: 'Silent Aurora Electric Boat Safari', desc: 'Zero-emission catamaran cruising dark coastal fjords to spot Northern Lights.', type: 'activity', cost: 1290, duration: 3.5 },
    { title: 'Polar Museum (Polarmuseet)', desc: 'Exhibitions of historic Arctic expeditions by Amundsen and Nansen.', type: 'activity', cost: 120, duration: 2 }
  ],
  'Bergen': [
    { title: 'Bryggen UNESCO Wharf & Hanseatic Museum', desc: 'Stroll through 14th-century wooden alleyways and merchant houses.', type: 'activity', cost: 150, duration: 2.5 },
    { title: 'Fløibanen Funicular to Mount Fløyen', desc: 'Scenic rail climb for panoramic vistas of Bergen peninsula and seven mountains.', type: 'activity', cost: 180, duration: 2 },
    { title: 'Bergen Fish Market (Fisketorget) Seafood Feast', desc: 'Freshly steamed king crab legs, wild Norwegian salmon, and fish soup.', type: 'dining', cost: 480, duration: 1.5 },
    { title: 'Mostraumen Fjord Cruise', desc: 'Navigating narrow tidal straits and cascading mountain waterfalls.', type: 'activity', cost: 790, duration: 3.5 },
    { title: 'Mount Ulriken Cable Car Trek', desc: 'Highest of the 7 mountains with sweeping views towards the North Sea.', type: 'activity', cost: 360, duration: 3 },
    { title: 'Troldhaugen Edvard Grieg Villa & Concert', desc: 'Composer Edvard Grieg historic home on Nordås Lake.', type: 'activity', cost: 190, duration: 2 }
  ],
  'Lofoten': [
    { title: 'Reinebringen Sherpa Steps Summit Trek', desc: 'Climb 1,560 stone steps for the iconic 360° view of Reinefjorden.', type: 'activity', cost: 0, duration: 3.5 },
    { title: 'Midnight Sun Sea Kayaking in Reinefjorden', desc: 'Paddle through crystal-clear waters beneath towering granite peaks.', type: 'activity', cost: 950, duration: 3 },
    { title: 'Børsen Spiseri Historic Quayside Dinner', desc: 'Traditional Lofoten stockfish and local venison in an 1828 fish warehouse.', type: 'dining', cost: 680, duration: 2 },
    { title: 'Nusfjord Historic Fishing Village Exploration', desc: 'UNESCO-listed historic rorbu village with open-air blacksmith and boathouse.', type: 'activity', cost: 100, duration: 2.5 },
    { title: 'Trollfjord High-Speed RIB Safari & Sea Eagles', desc: 'Dramatic passage into narrow 1,000m gorge with white-tailed sea eagle spotting.', type: 'activity', cost: 1100, duration: 2.5 },
    { title: 'Haukland & Uttakleiv White Sand Beaches', desc: 'Arctic turquoise waters surrounded by craggy alpine peaks.', type: 'activity', cost: 0, duration: 2 }
  ],
  'Oslo': [
    { title: 'Vigeland Sculpture Park & Frogner Manor', desc: 'World largest sculpture park by a single artist with over 200 granite statues.', type: 'activity', cost: 0, duration: 2.5 },
    { title: 'Munch Museum & Waterfront Opera House Roof Walk', desc: 'Iconic marble opera house and 13 floors of Edvard Munch masterpieces.', type: 'activity', cost: 200, duration: 3 },
    { title: 'Mathallen Gourmet Food Hall Tasting', desc: 'Artisanal brown cheeses, Norwegian cured meats, and craft cider.', type: 'dining', cost: 350, duration: 1.5 },
    { title: 'Oslofjord Island-Hopping Electric Ferry', desc: 'Public electric ferry stopping at Hovedøya monastery ruins and Lindøya.', type: 'activity', cost: 85, duration: 3 },
    { title: 'Holmenkollen Ski Jump & Museum', desc: 'Historic ski jump tower overlooking Oslo city and surrounding Nordmarka forest.', type: 'activity', cost: 190, duration: 2.5 },
    { title: 'Fram Polar Exploration Ship Museum', desc: 'Board the strongest wooden vessel ever constructed for Arctic expeditions.', type: 'activity', cost: 140, duration: 2 }
  ]
};

const GENERIC_ACTIVITIES = [
  { title: 'Scenic Fjord & Valley Panoramic Walk', desc: 'Gentle nature walk through glacial valleys with pristine waterfall views.', type: 'activity' as const, cost: 0, duration: 2.5 },
  { title: 'Traditional Nordic Farm-to-Table Lunch', desc: 'Local artisanal cheeses, sourdough, cured fish, and wild berries.', type: 'dining' as const, cost: 380, duration: 1.5 },
  { title: 'Stave Church & Cultural Heritage Tour', desc: 'Guided visit to medieval wooden architectural marvels with dragon carvings.', type: 'activity' as const, cost: 150, duration: 2 },
  { title: 'Scenic High-Mountain Road Drive & Viewpoint', desc: 'National Tourist Route viewpoint with modernist architecture and gorge vistas.', type: 'activity' as const, cost: 0, duration: 3 },
  { title: 'Local Fjord Seafood Dinner', desc: 'Freshly caught coastal cod and shellfish overlooking the water.', type: 'dining' as const, cost: 550, duration: 2 }
];

export const generateTripPlan = async (request: TripPlanRequest): Promise<TripPlanResponse> => {
  const mainDest = request.destinations[0] === 'Norway-wide' ? 'Bergen' : (request.destinations[0] || 'Tromsø');
  const availablePool = DESTINATION_ACTIVITIES[mainDest] || GENERIC_ACTIVITIES;

  return new Promise((resolve) => {
    setTimeout(() => {
      const days = Array.from({ length: request.durationDays }).map((_, i) => {
        const dayNumber = i + 1;
        const act1 = availablePool[(i * 2) % availablePool.length];
        const act2 = availablePool[(i * 2 + 1) % availablePool.length];
        const dateStr = new Date(Date.now() + i * 86400000).toISOString().split('T')[0];

        return {
          day: dayNumber,
          date: dateStr,
          title: i === 0 
            ? `Arrival in ${mainDest} & Fjord Orientation`
            : i === request.durationDays - 1 
              ? `Departure & Coastal Farewells`
              : `${mainDest} Exploration — Day ${dayNumber}`,
          activities: [
            {
              id: `act-${dayNumber}-1`,
              time: '09:30',
              durationHours: act1.duration,
              title: act1.title,
              description: act1.desc,
              location: mainDest,
              type: act1.type,
              cost: act1.cost,
              currency: 'NOK'
            },
            {
              id: `act-${dayNumber}-2`,
              time: '13:00',
              durationHours: 1.5,
              title: i % 2 === 0 ? 'Nordic Lunch & Coffee Break' : 'Quayside Harbor Dining',
              description: 'Authentic Norwegian culinary experience with local ingredients.',
              location: mainDest,
              type: 'dining' as const,
              cost: 320,
              currency: 'NOK'
            },
            {
              id: `act-${dayNumber}-3`,
              time: '15:30',
              durationHours: act2.duration,
              title: act2.title,
              description: act2.desc,
              location: mainDest,
              type: act2.type,
              cost: act2.cost,
              currency: 'NOK'
            }
          ]
        };
      });

      resolve({
        id: `trip-${Date.now()}`,
        title: `${request.durationDays} Days in ${request.destinations.join(', ')}`,
        summary: `A curated ${request.travelStyle.toLowerCase()} journey tailored to your interests in ${request.interests.length > 0 ? request.interests.join(', ') : 'nature and cultural heritage'}.`,
        days
      });
    }, 1200);
  });
};
