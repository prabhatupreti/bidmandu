import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../services/api_service.dart';

class MyProductsScreen extends StatefulWidget {
  const MyProductsScreen({super.key});

  @override
  State<MyProductsScreen> createState() => _MyProductsScreenState();
}

class _MyProductsScreenState extends State<MyProductsScreen> {
  List<dynamic> products = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  double _parse(dynamic v) {
    if (v == null) return 0.0;
    if (v is num) return v.toDouble();
    if (v is String) return double.tryParse(v) ?? 0.0;
    return 0.0;
  }

  Future<void> fetchProducts() async {
    setState(() => loading = true);
    try {
      final res = await ApiService.get('/products/my');
      if (res.statusCode == 200) {
        setState(() => products = jsonDecode(res.body));
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  Future<void> acceptBid(String auctionId, String bidId) async {
    try {
      await ApiService.post('/auctions/$auctionId/accept-bid', body: {'bidId': bidId});
      fetchProducts();
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Bid accepted!')));
    } catch (_) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to accept bid')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('My Products')),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : products.isEmpty
              ? Center(child: Text('No listings yet'))
              : ListView.builder(
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    final item = products[index];
                    final product = item['product'] ?? {};
                    final auction = item['auction'] ?? {};
                    final bids = (item['bids'] as List<dynamic>?) ?? [];
                    final ended = auction['status'] != 'ACTIVE';
                    final auctionId = auction['id']?.toString() ?? '';
                    return Card(
                      margin: EdgeInsets.all(8),
                      child: ExpansionTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: CachedNetworkImage(
                            imageUrl: product['image_urls'] != null && (product['image_urls'] as List).isNotEmpty ? product['image_urls'][0] : '',
                            width: 50, height: 50, fit: BoxFit.cover,
                            placeholder: (_, __) => Shimmer.fromColors(baseColor: Colors.grey[300]!, highlightColor: Colors.grey[100]!, child: Container(color: Colors.white)),
                            errorWidget: (_, __, ___) => Icon(Icons.image_not_supported),
                          ),
                        ),
                        title: Text(product['title'] ?? 'No title', style: TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('${bids.length} bids · NRs. ${NumberFormat('#,##0').format(_parse(auction['current_price']))}'),
                        trailing: ended
                            ? Chip(label: Text('SOLD', style: TextStyle(color: Colors.black)), backgroundColor: Color(0xFFFDC02F))
                            : null,
                        children: [
                          if (bids.isEmpty)
                            Padding(padding: EdgeInsets.all(16), child: Text('No bids yet'))
                          else
                            ...bids.map((bid) {
                              final bidId = bid['id']?.toString() ?? '';
                              return ListTile(
                                title: Text(bid['bidder_alias'] ?? 'Bidder'),
                                subtitle: Text('NRs. ${NumberFormat('#,##0').format(_parse(bid['amount']))}'),
                                trailing: ended
                                    ? null
                                    : Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          TextButton(
                                            onPressed: () => acceptBid(auctionId, bidId),
                                            child: Text('Accept', style: TextStyle(color: Colors.green)),
                                          ),
                                          TextButton(
                                            onPressed: () {},
                                            child: Text('Decline', style: TextStyle(color: Colors.grey)),
                                          ),
                                        ],
                                      ),
                              );
                            }),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}