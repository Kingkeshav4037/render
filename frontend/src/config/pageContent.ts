export interface PageContentRequirements {
  hero: boolean;
  map?: boolean;
  featuredList?: boolean;
  telemetry?: boolean;
  filters?: boolean;
  userReviews?: boolean;
  relatedDestinations?: boolean;
  experiences?: boolean;
  bookingForm?: boolean;
}

export const pageContentRequirements: Record<string, PageContentRequirements> = {
  wildlife: {
    hero: true,
    map: true,
    featuredList: true,
    experiences: true,
    relatedDestinations: true,
  },
  ev: {
    hero: true,
    map: true,
    telemetry: true,
    filters: true,
  },
  stayDetails: {
    hero: true,
    map: true,
    userReviews: true,
    bookingForm: true,
    featuredList: false,
  },
  energy: {
    hero: true,
    telemetry: true,
    map: true,
  }
};
