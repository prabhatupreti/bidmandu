import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

class PaymentScreen extends StatefulWidget {
  final String txnId;
  const PaymentScreen({super.key, required this.txnId});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  Map<String, dynamic>? details;
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchDetails();
  }

  Future<void> fetchDetails() async {
    try {
      final res = await ApiService.get('/transactions/${widget.txnId}/payment-details');
      if (res.statusCode == 200) {
        setState(() => details = jsonDecode(res.body));
      }
    } catch (e) {}
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (loading || details == null) return Scaffold(appBar: AppBar(title: Text('Payment')), body: Center(child: CircularProgressIndicator()));

    final amount = details!['amountDue'];
    final ref = details!['paymentRef'];
    final qrUrl = details!['staticQrUrl'];

    return Scaffold(
      appBar: AppBar(title: Text('Complete Payment')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text('Amount Due', style: TextStyle(color: Colors.grey)),
                    Text('NRs. ${NumberFormat('#,##0').format(amount)}', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFFC41E3A))),
                    SizedBox(height: 10),
                    Text('Reference: $ref', style: TextStyle(fontFamily: 'monospace')),
                    SizedBox(height: 10),
                    if (qrUrl.isNotEmpty)
                      CachedNetworkImage(imageUrl: qrUrl, height: 200),
                    SizedBox(height: 10),
                    Text('Scan QR with any banking app and include the reference in remarks.', style: TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // In a real app, you'd open camera to capture proof
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Upload proof (camera integration needed)')));
                },
                style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFFDC02F), foregroundColor: Colors.black),
                child: Text('Upload Payment Proof'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}