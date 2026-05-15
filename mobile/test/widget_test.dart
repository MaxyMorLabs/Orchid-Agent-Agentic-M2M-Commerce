import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:orchid_watcher/main.dart';

void main() {
  testWidgets('App renders Orchid Watcher title', (tester) async {
    await tester.pumpWidget(const OrchidWatcherApp());
    expect(find.text('🌸 Orchid Watcher'), findsOneWidget);
  });
}
