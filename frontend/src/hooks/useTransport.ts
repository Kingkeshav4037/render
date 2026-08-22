import { useQuery } from '@tanstack/react-query';
import { transportService, RouteWithLocations } from '../services/transportService';

export interface TransportMode {
  id: string;
  name: string;
  type: string; // 'train', 'ferry', 'bus', 'flight', 'ev'
  description: string;
  is_eco: boolean;
  image_url: string;
}

export const demoTransportModes: TransportMode[] = [
  {
    id: 'mode-train',
    name: 'Scenic Railway',
    type: 'train',
    description: 'Experience some of the most beautiful train journeys in the world, including the Flåm Railway.',
    is_eco: true,
    image_url: '/images/trolltunga_1786936111320.jpg'
  },
  {
    id: 'mode-ferry',
    name: 'Electric Ferry',
    type: 'ferry',
    description: 'Cruise the majestic fjords silently and emission-free on our modern electric ferries.',
    is_eco: true,
    image_url: '/images/fjords_1786935800026.jpg'
  },
  {
    id: 'mode-ev',
    name: 'EV Rental',
    type: 'ev',
    description: 'Rent an electric vehicle and explore Norway with the worlds best charging infrastructure.',
    is_eco: true,
    image_url: '/images/northern_lights_1786935879330.jpg'
  }
];

export const useTransportModes = () => {
  return useQuery({
    queryKey: ['transport-modes'],
    queryFn: async (): Promise<TransportMode[]> => {
      return demoTransportModes;
    },
  });
};

export const useTransportRoutes = (filters?: { mode?: string }) => {
  return useQuery({
    queryKey: ['transport-routes', filters],
    queryFn: async (): Promise<RouteWithLocations[]> => {
      // mode can be passed directly, if mapped properly
      return await transportService.getRoutes({ mode: filters?.mode });
    },
  });
};
