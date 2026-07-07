import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

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
      final res =
          await ApiService.get('/transactions/${widget.txnId}/payment-details');
      if (res.statusCode == 200) {
        setState(() => details = res.data);   // Dio auto-parses
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (loading || details == null)
      return Scaffold(
          appBar: AppBar(title: const Text('Payment')),
          body: const Center(child: CircularProgressIndicator()));

    final amount = details!['amountDue'];
    final ref = details!['paymentRef'];
    final qrUrl = details!['staticQrUrl'] ?? '';

    return Scaffold(
      appBar: AppBar(title: const Text('Complete Payment')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text('Amount Due',
                        style: TextStyle(color: Colors.grey[400])),
                    const SizedBox(height: 8),
                    Text(
                        'NRs. ${NumberFormat('#,##0').format(amount)}',
                        style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFDC02F))),
                    const SizedBox(height: 16),
                    Text('Reference: $ref',
                        style: const TextStyle(
                            fontFamily: 'monospace', color: Colors.white70)),
                    const SizedBox(height: 16),
                    if (qrUrl.isNotEmpty)
                      CachedNetworkImage(
                        imageUrl: qrUrl,
                        height: 200,
                        placeholder: (_, __) =>
                            const CircularProgressIndicator(),
                        errorWidget: (_, __, ___) =>
                            const Icon(Icons.qr_code, size: 80, color: Colors.grey),
                      ),
                    const SizedBox(height: 12),
                    Text(
                      'Scan this QR using any banking app and include the reference in remarks.',
                      style: TextStyle(color: Colors.grey[500], fontSize: 12),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Payment Summary',
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            fontSize: 16)),
                    const SizedBox(height: 12),
                    _buildRow('Item Amount', 'NRs. ${NumberFormat('#,##0').format(amount)}'),
                    _buildRow('Platform Fee (5%)',
                        'NRs. ${NumberFormat('#,##0').format(amount * 0.05)}'),
                    const Divider(color: Colors.white10),
                    _buildRow('Total', 'NRs. ${NumberFormat('#,##0').format(amount)}',
                        bold: true),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  // TODO: implement proof upload
                },
                icon: const Icon(Icons.camera_alt),
                label: const Text('Upload Payment Proof'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFDC02F),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[500])),
          Text(value,
              style: TextStyle(
                  fontWeight: bold ? FontWeight.bold : FontWeight.normal,
                  color: Colors.white)),
        ],
      ),
    );
  }
}