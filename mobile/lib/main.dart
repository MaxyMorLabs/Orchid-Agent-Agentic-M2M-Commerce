import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

const String kApiBase = String.fromEnvironment('API_URL', defaultValue: 'http://localhost:3001');

Future<void> _bgHandler(RemoteMessage msg) async {
  debugPrint('[BG] ${msg.notification?.title}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_bgHandler);
  runApp(const OrchidWatcherApp());
}

class OrchidWatcherApp extends StatelessWidget {
  const OrchidWatcherApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Orchid Watcher',
        theme: ThemeData(colorSchemeSeed: Colors.deepPurple, useMaterial3: true),
        home: const WatcherHome(),
      );
}

class WatcherHome extends StatefulWidget {
  const WatcherHome({super.key});
  @override
  State<WatcherHome> createState() => _WatcherHomeState();
}

class _WatcherHomeState extends State<WatcherHome> {
  List<dynamic> _activities = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _setupFCM();
    _fetchActivities();
  }

  void _setupFCM() {
    FirebaseMessaging.onMessage.listen((msg) {
      final n = msg.notification;
      if (n != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${n.title}: ${n.body}')),
        );
      }
      _fetchActivities();
    });
  }

  Future<void> _fetchActivities() async {
    try {
      final res = await http.get(Uri.parse('$kApiBase/agent/status'));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        setState(() { _activities = data['activities'] ?? []; _loading = false; });
      }
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('🌸 Orchid Watcher')),
        body: _loading
            ? const Center(child: CircularProgressIndicator())
            : _activities.isEmpty
                ? const Center(child: Text('No agent activity yet.'))
                : ListView.builder(
                    itemCount: _activities.length,
                    itemBuilder: (_, i) {
                      final a = _activities[i];
                      return ListTile(
                        leading: Icon(a['type'] == 'buy' ? Icons.shopping_cart : Icons.sell),
                        title: Text('${a['type'].toUpperCase()} ${a['amount']} ${a['asset']}'),
                        subtitle: Text(a['counterparty'] ?? ''),
                        trailing: Text(
                          DateTime.fromMillisecondsSinceEpoch(a['ts']).toLocal().toString().substring(11, 19),
                        ),
                      );
                    },
                  ),
        floatingActionButton: FloatingActionButton(
          onPressed: _fetchActivities,
          child: const Icon(Icons.refresh),
        ),
      );
}
