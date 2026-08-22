import { TripPlanRequest, TripPlanResponse } from '../../types/planner';



// Simulates a call to a real AI backend endpoint
export const generateTripPlan = async (request: TripPlanRequest): Promise<TripPlanResponse> => {
  // In a real app, this would be:
  // const response = await fetch('https://api.smartlife.no/v1/planner/generate', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request)
  // });
  // return response.json();

  // Simulate network & AI processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `trip-${Math.random().toString(36).substring(7)}`,
        title: `${request.durationDays} Days in ${request.destinations.join(', ')}`,
        summary: `An optimized ${request.travelStyle.toLowerCase()} journey tailored to your interests in ${request.interests.join(' and ')}.`,
        days: Array.from({ length: request.durationDays }).map((_, i) => ({
          day: i + 1,
          date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          title: i === 0 ? 'Arrival & Orientation' : i === request.durationDays - 1 ? 'Departure' : 'Exploration',
          activities: [
            {
              id: `act-${Math.random().toString(36).substring(7)}`,
              time: '09:00',
              durationHours: 3,
              title: 'Morning Activity',
              description: 'Guided tour based on your interests.',
              location: request.destinations[0],
              type: 'activity',
              cost: 1500,
              currency: 'NOK'
            },
            {
              id: `act-${Math.random().toString(36).substring(7)}`,
              time: '13:00',
              durationHours: 1.5,
              title: 'Lunch',
              description: 'Local culinary experience.',
              location: request.destinations[0],
              type: 'dining',
              cost: 450,
              currency: 'NOK'
            }
          ]
        }))
      });
    }, 4500); // 4.5s processing time
  });
};
