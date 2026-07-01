import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  List<dynamic> transactions = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchTransactions();
  }

  double _parse(dynamic v) {
    if (v == null) return 0.0;
    if (v is num) return v.toDouble();
    if (v is String) return double.tryParse(v) ?? 0.0;
    return 0.0;
  }

  Future<void> fetchTransactions() async {
    setState(() => loading = true);
    try {
      final res = await ApiService.get('/transactions/my');
      if (res.statusCode == 200) {
        setState(() => transactions = jsonDecode(res.body));
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  String _statusLabel(String status) {
    const map = {
      'AWAITING_PAYMENT': 'Awaiting Payment',
      'PROOF_SUBMITTED': 'Proof Submitted',
      'PAYMENT_VERIFIED': 'Payment Verified',
      'PROOF_REJECTED': 'Proof Rejected',
      'SHIPPED': 'Shipped',
      'CONFIRMED': 'Confirmed',
      'SETTLED': 'Settled',
    };
    return map[status] ?? status;
  }

  Color _statusColor(String status) {
    const map = {
      'AWAITING_PAYMENT': Colors.orange,
      'PROOF_SUBMITTED': Colors.blue,
      'PAYMENT_VERIFIED': Colors.green,
      'PROOF_REJECTED': Colors.red,
      'SHIPPED': Colors.purple,
      'CONFIRMED': Colors.indigo,
      'SETTLED': Colors.grey,
    };
    return map[status] ?? Colors.grey;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Transactions')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : transactions.isEmpty
              ? Center(
                  child: Text('No transactions yet',
                      style: TextStyle(color: Colors.grey[400])))
              : ListView.builder(
                  itemCount: transactions.length,
                  itemBuilder: (context, index) {
                    final txn = transactions[index];
                    final amount = _parse(txn['amount']);
                    final fee = amount * 0.05;
                    final payout = _parse(txn['payout_amount']);
                    final status = txn['status'] ?? 'Unknown';
                    final ref = txn['payment_ref_code'] ?? '';
                    final product = txn['product'] ?? {};
                    final sellerAlias = txn['seller_alias'] ?? 'Seller';

                    return Card(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                      child: ExpansionTile(
                        tilePadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        leading: Icon(Icons.receipt_long,
                            color: _statusColor(status)),
                        title: Text(product['title'] ?? 'Item',
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold)),
                        subtitle: Text('$ref · ${_statusLabel(status)}',
                            style: TextStyle(color: Colors.grey[400])),
                        trailing: Text(
                            'NRs. ${NumberFormat('#,##0').format(amount)}',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFFDC02F))),
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Payment Breakdown',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                        color: Colors.white)),
                                const SizedBox(height: 12),
                                _buildRow(
                                    'Winning Bid', 'NRs. ${NumberFormat('#,##0').format(amount)}'),
                                _buildRow('Platform Fee (5%)',
                                    'NRs. ${NumberFormat('#,##0').format(fee)}'),
                                _buildRow('Seller Payout',
                                    'NRs. ${NumberFormat('#,##0').format(payout)}'),
                                const Divider(color: Colors.white10),
                                _buildRow(
                                    'Total Paid',
                                    'NRs. ${NumberFormat('#,##0').format(amount)}',
                                    bold: true),
                                const SizedBox(height: 16),
                                const Text('Payment Progress',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: Colors.white)),
                                const SizedBox(height: 8),
                                _MilestoneTracker(currentStatus: status),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton(
                                        onPressed: () {},
                                        style: OutlinedButton.styleFrom(
                                            foregroundColor: const Color(0xFFC41E3A),
                                            side: const BorderSide(
                                                color: Color(0xFFC41E3A))),
                                        child: const Text('View Digital Receipt'),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: OutlinedButton(
                                        onPressed: () {},
                                        style: OutlinedButton.styleFrom(
                                            foregroundColor: Colors.red,
                                            side: const BorderSide(
                                                color: Colors.red)),
                                        child:
                                            const Text('Open Dispute Ticket'),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
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

class _MilestoneTracker extends StatelessWidget {
  final String currentStatus;
  const _MilestoneTracker({required this.currentStatus});

  static const stages = [
    'AWAITING_PAYMENT',
    'PROOF_SUBMITTED',
    'PAYMENT_VERIFIED',
    'SHIPPED',
    'CONFIRMED',
    'SETTLED'
  ];

  @override
  Widget build(BuildContext context) {
    final currentIdx = stages.indexOf(currentStatus);
    return Row(
      children: List.generate(stages.length * 2 - 1, (i) {
        if (i.isOdd) {
          return Expanded(
            child: Container(
              height: 2,
              color: i ~/ 2 < currentIdx
                  ? const Color(0xFFC41E3A)
                  : Colors.grey[700],
            ),
          );
        }
        final stageIdx = i ~/ 2;
        final done = stageIdx <= currentIdx;
        return Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: done ? const Color(0xFFC41E3A) : Colors.grey[700],
          ),
        );
      }),
    );
  }
}