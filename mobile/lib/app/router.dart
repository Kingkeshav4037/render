import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../features/home/home_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/map/map_screen.dart';
import '../features/planner/planner_screen.dart';
import '../features/trips/trips_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final session = Supabase.instance.client.auth.currentSession;
      final isGoingToLogin = state.matchedLocation == '/login';
      
      if (session == null && !isGoingToLogin) {
        return '/login';
      }
      if (session != null && isGoingToLogin) {
        return '/';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/map',
        builder: (context, state) => const SmartMapScreen(),
      ),
      GoRoute(
        path: '/planner',
        builder: (context, state) => const TripPlannerScreen(),
      ),
      GoRoute(
        path: '/trips',
        builder: (context, state) => const TripsScreen(),
      ),
      // Future routes:
      // GoRoute(path: '/wallet', builder: (context, state) => const DigitalWalletScreen()),
    ],
  );
});
