/**
 * Norway SmartLife — User Acceptance Testing (UAT) & Real-User Playbook (Phase F)
 * Standardized protocol for evaluating end-user usability, friction points, and task completion.
 */

export interface UATTask {
  id: string;
  category: 'DISCOVERY' | 'SEARCH' | 'AUTH' | 'FAVORITES' | 'PLANNER' | 'BOOKING' | 'COMMERCE' | 'CANCELLATION' | 'EXPORT';
  title: string;
  scenario: string;
  startingUrl: string;
  expectedOutcome: string;
  successCriteria: string[];
  commonFrictionChecks: string[];
}

export const UAT_PLAYBOOK_TASKS: UATTask[] = [
  {
    id: 'UAT-01',
    category: 'DISCOVERY',
    title: 'Discover Geirangerfjord Destination Details',
    scenario: 'You want to research Geirangerfjord for an upcoming summer vacation in Norway.',
    startingUrl: '/home',
    expectedOutcome: 'User navigates to /explore or /explore/geirangerfjord, sees high-res images, climate info, highlights, and nearby activities.',
    successCriteria: [
      'Locates navigation link to Explore or Destinations',
      'Selects Geirangerfjord without confusion',
      'Views highlights, photo gallery, and seasonal travel advice',
    ],
    commonFrictionChecks: [
      'Are images crisp and matching the actual fjord?',
      'Does the page load without layout shift?',
      'Is the call-to-action button obvious?',
    ],
  },
  {
    id: 'UAT-02',
    category: 'SEARCH',
    title: 'Global Search across Multiple Categories',
    scenario: 'Search for "Lofoten" to find stays, hiking activities, and regional food.',
    startingUrl: '/home',
    expectedOutcome: 'User presses search shortcut or clicks search icon, types "Lofoten", sees grouped category results, and clicks through to a stay or activity.',
    successCriteria: [
      'Search modal opens smoothly on desktop and mobile',
      'Debounced results render instantly with category badges (Stay, Activity, Food)',
      'Clicking a result redirects directly to the chosen page',
    ],
    commonFrictionChecks: [
      'Does search work seamlessly on mobile keyboards?',
      'Is there an informative empty state if a typo is entered?',
    ],
  },
  {
    id: 'UAT-03',
    category: 'AUTH',
    title: 'Account Registration & Profile Setup',
    scenario: 'Register for a new traveler account and customize your currency and preferred travel styles.',
    startingUrl: '/register',
    expectedOutcome: 'Account created with email verification, redirected to complete profile modal, preferences saved.',
    successCriteria: [
      'Clear form validation messages for password strength',
      'Successful account creation and automatic session initialization',
      'User preferences (currency NOK, nature/culture) persisted in profile',
    ],
    commonFrictionChecks: [
      'Are error messages announced clearly to screen readers?',
      'Does the returnTo parameter preserve the user intended destination?',
    ],
  },
  {
    id: 'UAT-04',
    category: 'FAVORITES',
    title: 'Save Favorites as Guest and Migrate on Login',
    scenario: 'Browse several stays/attractions as an anonymous guest, heart 2 items, then log in and verify they appear in My Favorites.',
    startingUrl: '/explore',
    expectedOutcome: 'Guest clicks heart icon -> prompted to login -> after login, favorites are synced to Supabase account.',
    successCriteria: [
      'Heart icon toggles visual state',
      'Login redirect preserves intended favorite action',
      'My Favorites page displays all saved items with category filter tabs',
    ],
    commonFrictionChecks: [
      'Do favorites persist across browser refreshes?',
      'Is removing a favorite instantaneous?',
    ],
  },
  {
    id: 'UAT-05',
    category: 'PLANNER',
    title: 'Build a Multi-Day Trip Itinerary',
    scenario: 'Create a new 4-day trip named "Fjord & Northern Lights Journey" starting in Bergen and ending in Tromsø.',
    startingUrl: '/planner',
    expectedOutcome: 'Trip created with day slots, attractions added, schedule calculated.',
    successCriteria: [
      'Title, date range, and budget saved smoothly',
      'Can add activities and accommodations to specific days',
      'Total estimated cost calculated automatically',
    ],
    commonFrictionChecks: [
      'Is drag-and-drop or reordering intuitive on mobile?',
      'Are schedule conflict alerts clearly explained?',
    ],
  },
  {
    id: 'UAT-06',
    category: 'PLANNER',
    title: 'Detect and Resolve Schedule Conflicts',
    scenario: 'Add two activities in the same time window on Day 2 and verify conflict alert.',
    startingUrl: '/planner',
    expectedOutcome: 'System displays smart conflict badge warning of time overlap and offers time adjustment.',
    successCriteria: [
      'Smart warnings panel highlights time overlap in amber/red',
      'Adjusting time clears the conflict alert in real time',
    ],
    commonFrictionChecks: [
      'Is the warning actionable without confusing the traveler?',
    ],
  },
  {
    id: 'UAT-07',
    category: 'BOOKING',
    title: 'Real-Time Stay Booking & 15-Minute Inventory Hold',
    scenario: 'Select dates for Juvet Landscape Hotel, verify availability, acquire temporary hold, and checkout.',
    startingUrl: '/stays',
    expectedOutcome: 'Date picker verifies no blackout/overlap, 15-minute countdown starts at checkout, payment confirmed.',
    successCriteria: [
      'Real-time availability validated on backend',
      '15-minute reservation timer visible during checkout',
      'Booking status reflects CONFIRMED in My Bookings',
    ],
    commonFrictionChecks: [
      'Is the total price calculation with MVA clear?',
      'Does the user receive a confirmation banner with booking reference?',
    ],
  },
  {
    id: 'UAT-08',
    category: 'COMMERCE',
    title: 'Eco-Marketplace Gear Order',
    scenario: 'Add a Norwegian Merino Wool Sweater to the cart and complete purchase.',
    startingUrl: '/products',
    expectedOutcome: 'Cart updates badge count, checkout processes address and payment, receipt rendered.',
    successCriteria: [
      'Cart drawer slide-in works smoothly',
      'Quantity and total update reactively',
      'Order details visible in My Orders dashboard',
    ],
    commonFrictionChecks: [
      'Are shipping terms and tax rates transparent?',
    ],
  },
  {
    id: 'UAT-09',
    category: 'EXPORT',
    title: 'MVA Tax Invoice Generation & Download',
    scenario: 'Open a confirmed booking or order and download the official tax invoice.',
    startingUrl: '/user/bookings',
    expectedOutcome: 'Official Norwegian Tax compliant receipt rendered and printable/downloadable.',
    successCriteria: [
      'Includes Norwegian org number (NO 984 123 456 MVA)',
      'Itemized MVA tax breakdown (12% lodging / 25% standard)',
      'Instant print preview window opens',
    ],
    commonFrictionChecks: [
      'Does the layout format cleanly on A4 / Letter paper?',
    ],
  },
  {
    id: 'UAT-10',
    category: 'CANCELLATION',
    title: 'Self-Service Booking Cancellation & Refund Request',
    scenario: 'Cancel an upcoming stay booking 10 days in advance and verify 100% refund policy calculation.',
    startingUrl: '/user/bookings',
    expectedOutcome: 'Modal displays cancellation policy, calculates refund amount, changes booking to CANCELLED.',
    successCriteria: [
      'Clear policy explanation before final confirmation',
      'Inventory hold released back to available pool',
      'Notification dispatched informing traveler of refund processing',
    ],
    commonFrictionChecks: [
      'Is accidental cancellation prevented with a confirmation prompt?',
    ],
  },
  {
    id: 'UAT-11',
    category: 'PLANNER',
    title: 'Trip Sharing via Public Link',
    scenario: 'Set trip visibility to "Shared with Link", copy the link, and open in an incognito window.',
    startingUrl: '/user/trips',
    expectedOutcome: 'Anonymous viewer sees full day-by-day itinerary without accessing account settings.',
    successCriteria: [
      'Share modal offers 1-click link copying and Web Share API',
      'Shared trip route loads without authentication prompt',
      'Private account details and editing controls are securely hidden',
    ],
    commonFrictionChecks: [
      'Does the page look attractive to non-registered prospective travelers?',
    ],
  },
  {
    id: 'UAT-12',
    category: 'EXPORT',
    title: 'Export Itinerary to iCalendar (.ics) and PDF',
    scenario: 'Export your scheduled trip into Apple Calendar / Google Calendar (.ics).',
    startingUrl: '/user/trips',
    expectedOutcome: 'Valid RFC 5545 .ics file downloaded with timestamps and geo-coordinates.',
    successCriteria: [
      '.ics file imports cleanly into calendar applications',
      'Print itinerary button launches clean styled printable layout',
    ],
    commonFrictionChecks: [
      'Are timezones formatted correctly for Norwegian standard time?',
    ],
  },
];

export const uatPlaybook = {
  getTasks(): UATTask[] {
    return UAT_PLAYBOOK_TASKS;
  },

  getTaskById(id: string): UATTask | undefined {
    return UAT_PLAYBOOK_TASKS.find((t) => t.id === id);
  },

  getTasksByCategory(category: UATTask['category']): UATTask[] {
    return UAT_PLAYBOOK_TASKS.filter((t) => t.category === category);
  },
};
