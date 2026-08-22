import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('trips.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);
    return await openDatabase(path, version: 1, onCreate: _createDB);
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE offline_trips (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        destination TEXT NOT NULL,
        date TEXT NOT NULL,
        details TEXT NOT NULL
      )
    ''');
    
    // Seed data
    await db.insert('offline_trips', {
      'id': '1',
      'title': 'Tromsø Aurora Hunt',
      'destination': 'Tromsø, Norway',
      'date': '2026-12-15',
      'details': '3-day trip focused on Northern Lights viewing. Cached for offline access.',
    });
  }

  Future<List<Map<String, dynamic>>> getOfflineTrips() async {
    final db = await instance.database;
    return await db.query('offline_trips');
  }
}
