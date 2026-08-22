import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:go_router/go_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _userName = 'Guest';
  String _auroraForecast = 'Loading...';
  
  @override
  void initState() {
    super.initState();
    _fetchUserData();
    _fetchAuroraForecast();
  }

  Future<void> _fetchUserData() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user != null) {
      final res = await Supabase.instance.client
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
      if (res != null && mounted) {
        setState(() {
          _userName = res['full_name'] ?? 'Guest';
        });
      }
    }
  }

  Future<void> _fetchAuroraForecast() async {
    try {
      // Use 10.0.2.2 for Android emulator to hit host localhost
      final url = Uri.parse('http://10.0.2.2:8000/api/v1/predict/aurora');
      final res = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "latitude": 69.6492,
          "longitude": 18.9553,
          "date": DateTime.now().toIso8601String()
        }),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body)['data']['forecast'];
        if (mounted) {
          setState(() {
            _auroraForecast = 'KP Index: ${data["kp_index"]} • ${data["probability_percentage"]}% chance';
          });
        }
      }
    } catch (e) {
      if (mounted) setState(() => _auroraForecast = 'Prediction unavailable');
    }
  }
  
  Future<void> _signOut() async {
    await Supabase.instance.client.auth.signOut();
    if (mounted) context.go('/login');
  }
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('🇳🇴', style: TextStyle(fontSize: 24)),
            SizedBox(width: 8),
            Text('Norway SmartLife', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut),
            onPressed: _signOut,
          ),
          IconButton(
            icon: const Icon(LucideIcons.bell),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good evening, $_userName',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Where are you going?',
              style: TextStyle(color: Colors.white70, fontSize: 16),
            ),
            const SizedBox(height: 24),
            
            // Search Bar Mock
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: const Row(
                children: [
                  Icon(LucideIcons.search, color: Colors.white54),
                  SizedBox(width: 12),
                  Text('Search Norway...', style: TextStyle(color: Colors.white54)),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Dashboard Widgets
            _buildDashboardCard(
              title: 'Aurora Tonight',
              subtitle: _auroraForecast,
              icon: LucideIcons.sparkles,
              color: const Color(0xFF00FF9D),
            ),
            const SizedBox(height: 16),
            _buildDashboardCard(
              title: 'Weather Near You',
              subtitle: '2°C • Light Snow',
              icon: LucideIcons.cloudSnow,
              color: Colors.blueAccent,
            ),
            const SizedBox(height: 16),
            _buildDashboardCard(
              title: 'Plan with AI',
              subtitle: 'Tap to ask Voice AI',
              icon: LucideIcons.mic,
              color: Colors.purpleAccent,
              onTap: () => context.go('/planner'),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (index) {
          if (index == 2) {
            context.go('/map');
          } else if (index == 3) {
            context.go('/trips');
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.compass), label: 'Explore'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.map), label: 'Map'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.briefcase), label: 'Trips'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: 'Me'),
        ],
      ),
    );
  }

  Widget _buildDashboardCard({required String title, required String subtitle, required IconData icon, required Color color, VoidCallback? onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white10),
        ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                const SizedBox(height: 4),
                Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 14)),
              ],
            ),
          ),
          const Icon(LucideIcons.chevronRight, color: Colors.white54),
        ],
      ),
    );
  }
}
