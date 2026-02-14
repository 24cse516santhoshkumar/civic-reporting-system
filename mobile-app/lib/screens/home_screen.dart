import 'package:flutter/material.dart';
import 'report_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nearby Issues'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications), onPressed: () {}),
        ],
      ),
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: index % 2 == 0 ? Colors.red[100] : Colors.green[100],
                child: Icon(
                  index % 2 == 0 ? Icons.warning : Icons.check,
                  color: index % 2 == 0 ? Colors.red : Colors.green,
                ),
              ),
              title: Text(index % 2 == 0 ? 'Pothole on Main St' : 'Street Light Fixed'),
              subtitle: Text('Ward 4 • ${index + 1} hours ago'),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        }, // trailing comma
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ReportScreen()),
          );
        },
        label: const Text('Report Issue'),
        icon: const Icon(Icons.camera_alt),
      ),
    );
  }
}
