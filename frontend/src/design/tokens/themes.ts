// Norway SmartLife V6.0 Design Tokens - Themes
import { colors } from './colors';

export type PageThemeKey = keyof typeof colors.themes;

export const pageThemes: Record<string, PageThemeKey> = {
  '/': 'arcticGold',
  '/home': 'arcticGold',
  '/explore': 'royalFjord',
  '/stay': 'arcticGold',
  '/stay/:id': 'copper',
  '/food': 'coralCoast',
  '/food/:id': 'coralCoast',
  '/travel': 'oceanSteel',
  '/trails': 'moss',
  '/trails/:id': 'nordicSage',
  '/winter': 'glacierBlue',
  '/weather': 'glacierCyan',
  '/aurora': 'auroraViolet',
  '/safety': 'nordicRed',
  '/map': 'polarIndigo',
  '/planner': 'lavenderIce',
  '/deals': 'amber',
  '/products': 'midnightEmerald',
  '/smart-city': 'northernCyan',
  '/industry': 'midnightTheme',
  '/admin': 'midnightTheme',
};

export const getThemeForPath = (path: string): PageThemeKey => {
  if (pageThemes[path]) return pageThemes[path];
  
  for (const [route, theme] of Object.entries(pageThemes)) {
    if (route.includes(':')) {
      const baseRoute = route.split('/:')[0];
      if (path.startsWith(baseRoute)) {
        return theme;
      }
    }
  }
  
  return 'arcticGold'; // default fallback
};
