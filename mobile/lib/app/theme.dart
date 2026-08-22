import 'package:flutter/material.dart';

class AppTheme {
  static const Color navy950 = Color(0xFF0A0F1C);
  static const Color navy900 = Color(0xFF111827);
  static const Color auroraGreen = Color(0xFF00FF9D);
  
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: navy950,
      primaryColor: auroraGreen,
      colorScheme: const ColorScheme.dark(
        primary: auroraGreen,
        background: navy950,
        surface: navy900,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: navy950,
        elevation: 0,
        centerTitle: true,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: navy900,
        selectedItemColor: auroraGreen,
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
      ),
      fontFamily: 'Inter', // Assuming Inter is added
    );
  }
}
