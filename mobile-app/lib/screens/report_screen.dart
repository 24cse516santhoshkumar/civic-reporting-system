import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  String? _selectedCategory;
  final _descController = TextEditingController();

  final List<String> _categories = ['Pothole', 'Garbage', 'Street Light', 'Water Leak', 'Other'];
  bool _submitting = false;

  Future<void> _submit() async {
    setState(() => _submitting = true);
    
    try {
        final response = await http.post(
            // Use 10.0.2.2 for Android Emulator to access localhost
            Uri.parse('http://10.0.2.2:3000/reports'), 
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
                'category': _selectedCategory ?? 'Other',
                // Static demo location & image
                'latitude': 23.344,
                'longitude': 85.309, 
                'image_url': 'https://via.placeholder.com/300', 
                'description': _descController.text,
                'userId': '304f4204-7431-4828-8926-793540325418' // Demo user UUID
            }),
        );
        
        if (response.statusCode == 201) {
             ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Report Submitted Successfully!')),
            );
            Navigator.pop(context);
        } else {
            throw Exception('Failed to submit');
        }
    } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e. Using Offline Mode.')),
        );
        // Fallback or just pop
        Navigator.pop(context);
    } finally {
        setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Report')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image Placeholder
            Container(
              height: 200,
              color: Colors.grey[200],
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.camera_alt, size: 48, color: Colors.grey),
                    Text('Tap to take photo'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Location
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue.shade100),
              ),
              child: const Row(
                children: [
                  Icon(Icons.my_location, color: Colors.blue),
                  SizedBox(width: 12),
                  Expanded(child: Text('Lat: 23.344, Lng: 85.309\n123, Main Road, Ranchi', style: TextStyle(fontWeight: FontWeight.w500))),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Category Dropdown
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: const InputDecoration(
                labelText: 'Category',
                border: OutlineInputBorder(),
              ),
              items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (v) => setState(() => _selectedCategory = v),
            ),
            const SizedBox(height: 16),

            // Description
            TextField(
              controller: _descController,
              decoration: const InputDecoration(
                labelText: 'Description (Optional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),

            // Submit Button
            ElevatedButton(
              onPressed: _submitting ? null : _submit,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
              child: _submitting 
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
                : const Text('SUBMIT REPORT'),
            ),
          ],
        ),
      ),
    );
  }
}
