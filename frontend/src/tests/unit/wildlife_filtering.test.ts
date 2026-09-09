import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  wildlifeService, 
  matchesCategory, 
  matchesRegion, 
  matchesSeason, 
  WildlifeSpecies 
} from '../../services/wildlifeService';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          in: vi.fn(() => ({
            in: vi.fn().mockResolvedValue({ data: [], error: null }),
          })),
        })),
        mockResolvedValue: vi.fn(),
        then: (resolve: any) => resolve({
          data: [
            {
              id: '1',
              slug: 'moose',
              common_name: 'Moose',
              scientific_name: 'Alces alces',
              facts: ['Category: Mammals'],
              habitats: [{ region: 'Eastern and Central Norway', best_months: ['May-October'] }]
            },
            {
              id: '2',
              slug: 'polar-bear',
              common_name: 'Polar Bear',
              scientific_name: 'Ursus maritimus',
              facts: ['Category: Mammals'],
              habitats: [{ region: 'Svalbard', best_months: ['Spring-Summer', 'Winter'] }]
            },
            {
              id: '3',
              slug: 'atlantic-puffin',
              common_name: 'Atlantic Puffin',
              scientific_name: 'Fratercula arctica',
              facts: ['Category: Birds'],
              habitats: [{ region: 'Røst, Bleik, Svalbard', best_months: ['Summer'] }]
            },
            {
              id: '4',
              slug: 'orca',
              common_name: 'Orca',
              scientific_name: 'Orcinus orca',
              facts: ['Category: Marine'],
              habitats: [{ region: 'Northern Norway fjords', best_months: ['November-January'] }]
            },
            {
              id: '5',
              slug: 'red-fox',
              common_name: 'Red Fox',
              scientific_name: 'Vulpes vulpes',
              facts: ['Category: Mammals'],
              habitats: [{ region: 'All over Norway', best_months: ['All year'] }]
            }
          ],
          error: null,
        }),
      })),
    })),
  },
}));

describe('Wildlife Filtering & Search Capabilities', () => {
  beforeEach(() => {
    wildlifeService.clearCache();
  });
  const sampleSpecies: WildlifeSpecies = {
    id: 's1',
    slug: 'atlantic-puffin',
    common_name: 'Atlantic Puffin',
    scientific_name: 'Fratercula arctica',
    conservation_status: 'Vulnerable',
    description: 'Iconic seabird',
    category: 'Birds',
    status: 'PUBLISHED',
    habitats: [
      { id: 'h1', region: 'Northern Norway and Svalbard', best_months: ['May', 'June', 'July', 'August'], description: 'Coastal bird cliffs' }
    ]
  };

  it('correctly filters species by category', () => {
    expect(matchesCategory(sampleSpecies, 'All')).toBe(true);
    expect(matchesCategory(sampleSpecies, 'Birds')).toBe(true);
    expect(matchesCategory(sampleSpecies, 'Mammals')).toBe(false);
    expect(matchesCategory(sampleSpecies, 'Marine')).toBe(false);
  });

  it('correctly matches species by region keywords and habitats', () => {
    expect(matchesRegion(sampleSpecies.habitats, 'All')).toBe(true);
    expect(matchesRegion(sampleSpecies.habitats, 'Northern Norway')).toBe(true);
    expect(matchesRegion(sampleSpecies.habitats, 'Svalbard')).toBe(true);
    expect(matchesRegion(sampleSpecies.habitats, 'Eastern Norway')).toBe(false);
  });

  it('correctly matches species by season months', () => {
    expect(matchesSeason(sampleSpecies.habitats, 'All')).toBe(true);
    expect(matchesSeason(sampleSpecies.habitats, 'Summer')).toBe(true);
    expect(matchesSeason(sampleSpecies.habitats, 'Winter')).toBe(false);
  });

  it('returns filtered and paginated results with accurate count', async () => {
    const birdsResult = await wildlifeService.getPaginatedSpecies({ category: 'Birds' }, 1, 10);
    expect(birdsResult.count).toBe(1);
    expect(birdsResult.data[0].common_name).toBe('Atlantic Puffin');

    const marineResult = await wildlifeService.getPaginatedSpecies({ category: 'Marine' }, 1, 10);
    expect(marineResult.count).toBe(1);
    expect(marineResult.data[0].common_name).toBe('Orca');

    const mammalsResult = await wildlifeService.getPaginatedSpecies({ category: 'Mammals' }, 1, 10);
    expect(mammalsResult.count).toBe(3); // Moose, Polar Bear, Red Fox
  });

  it('filters by region accurately in paginated query', async () => {
    const svalbardResult = await wildlifeService.getPaginatedSpecies({ region: 'Svalbard' }, 1, 10);
    // Polar bear (Svalbard), Puffin (Svalbard), Red Fox (All over Norway)
    expect(svalbardResult.count).toBeGreaterThanOrEqual(2);
    const names = svalbardResult.data.map(d => d.common_name);
    expect(names).toContain('Polar Bear');
    expect(names).toContain('Atlantic Puffin');
  });

  it('filters by search term across common and scientific names', async () => {
    const searchResult = await wildlifeService.getPaginatedSpecies({ searchTerm: 'alces' }, 1, 10);
    expect(searchResult.count).toBe(1);
    expect(searchResult.data[0].common_name).toBe('Moose');
  });
});
