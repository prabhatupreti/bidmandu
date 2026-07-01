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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('My Transactions')),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : transactions.isEmpty
              ? Center(child: Text('No transactions yet'))
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
                    final created = DateTime.tryParse(txn['created_at'] ?? '');
                    return Card(
                      margin: EdgeInsets.all(8),
                      child: ExpansionTile(
                        leading: Icon(Icons.receipt_long, color: Color(0xFFC41E3A)),
                        title: Text(product['title'] ?? 'Item', style: TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('$ref · $status'),
                        trailing: Text('NRs. ${NumberFormat('#,##0').format(amount)}', style: TextStyle(fontWeight: FontWeight.bold)),
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Item Details', style: TextStyle(fontWeight: FontWeight.bold)),
                                SizedBox(height: 8),
                                Text('Category: ${product['category'] ?? 'N/A'}'),
                                Text('Seller: $sellerAlias'),
                                if (created != null) Text('Date: ${DateFormat('MMM dd, yyyy').format(created)}'),
                                Divider(),
                                Text('Payment Breakdown', style: TextStyle(fontWeight: FontWeight.bold)),
                                SizedBox(height: 8),
                                Text('Winning Bid: NRs. ${NumberFormat('#,##0').format(amount)}'),
                                Text('Platform Fee (5%): NRs. ${NumberFormat('#,##0').format(fee)}'),
                                Text('Seller Payout: NRs. ${NumberFormat('#,##0').format(payout)}'),
                                Text('Total Paid: NRs. ${NumberFormat('#,##0').format(amount)}', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFC41E3A))),
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
}