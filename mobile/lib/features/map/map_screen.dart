import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';

class SmartMapScreen extends StatelessWidget {
  const SmartMapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Norway Smart Map', style: TextStyle(fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.go('/'),
        ),
      ),
      body: FlutterMap(
        options: const MapOptions(
          initialCenter: LatLng(60.4720, 8.4689), // Norway
          initialZoom: 5.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            userAgentPackageName: 'com.norwaysmartlife.mobile',
          ),
          MarkerLayer(
            markers: [
              Marker(
                point: const LatLng(69.6492, 18.9553), // Tromsø
                width: 80,
                height: 80,
                child: Column(
                  children: [
                    const Icon(LucideIcons.sparkles, color: Color(0xFF00FF9D), size: 30),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(4)),
                      child: const Text('Tromsø', style: TextStyle(color: Colors.white, fontSize: 10)),
                    )
                  ],
                ),
              ),
              Marker(
                point: const LatLng(59.9139, 10.7522), // Oslo
                width: 80,
                height: 80,
                child: Column(
                  children: [
                    const Icon(LucideIcons.mapPin, color: Colors.blueAccent, size: 30),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(4)),
                      child: const Text('Oslo', style: TextStyle(color: Colors.white, fontSize: 10)),
                    )
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
