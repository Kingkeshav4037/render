import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../core/database_helper.dart';

class TripsScreen extends StatefulWidget {
  const TripsScreen({super.key});

  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen> {
  List<Map<String, dynamic>> _offlineTrips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTrips();
  }

  Future<void> _loadTrips() async {
    final trips = await DatabaseHelper.instance.getOfflineTrips();
    if (mounted) {
      setState(() {
        _offlineTrips = trips;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Offline Trips', style: TextStyle(fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.go('/'),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _offlineTrips.isEmpty
              ? const Center(child: Text('No offline trips saved.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _offlineTrips.length,
                  itemBuilder: (context, index) {
                    final trip = _offlineTrips[index];
                    return Card(
                      color: Colors.white.withOpacity(0.05),
                      margin: const EdgeInsets.only(bottom: 16),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(trip['title'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                const Icon(LucideIcons.cloudOff, color: Colors.greenAccent, size: 16),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text('${trip['destination']} • ${trip['date']}', style: const TextStyle(color: Colors.white70)),
                            const SizedBox(height: 12),
                            Text(trip['details'], style: const TextStyle(height: 1.5)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
