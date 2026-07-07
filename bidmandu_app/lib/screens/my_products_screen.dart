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
        setState(() => products = res.data);   // Dio auto-parses
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  Future<void> acceptBid(String auctionId, String bidId) async {
    try {
      await ApiService.post('/auctions/$auctionId/accept-bid', body: {'bidId': bidId});
      fetchProducts();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bid accepted!')));
    } catch (_) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to accept bid')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Products')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : products.isEmpty
              ? Center(
                  child: Text('No listings yet',
                      style: TextStyle(color: Colors.grey[400])))
              : ListView.builder(
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    final item = products[index];
                    final product = item['product'] ?? {};
                    final auction = item['auction'] ?? {};
                    final bids = (item['bids'] as List<dynamic>?) ?? [];
                    final ended = auction['status'] != 'ACTIVE';
                    final auctionId = auction['id']?.toString() ?? '';
                    final startPrice = _parse(product['starting_price']);
                    final currentPrice = _parse(auction['current_price']);
                    final totalBids = item['totalBids'] ?? bids.length;

                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      child: ExpansionTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: CachedNetworkImage(
                            imageUrl: product['image_urls'] != null &&
                                    (product['image_urls'] as List).isNotEmpty
                                ? product['image_urls'][0]
                                : '',
                            width: 50, height: 50, fit: BoxFit.cover,
                            placeholder: (_, __) => Shimmer.fromColors(
                                baseColor: Colors.grey[800]!,
                                highlightColor: Colors.grey[700]!,
                                child: Container(color: Colors.white)),
                            errorWidget: (_, __, ___) =>
                                const Icon(Icons.image_not_supported, color: Colors.grey),
                          ),
                        ),
                        title: Text(product['title'] ?? 'No title',
                            style: const TextStyle(
                                color: Colors.white, fontWeight: FontWeight.bold)),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Starting: NRs. ${NumberFormat('#,##0').format(startPrice)}  •  Current: NRs. ${NumberFormat('#,##0').format(currentPrice)}',
                              style: TextStyle(color: Colors.grey[400], fontSize: 12),
                            ),
                            Text(
                              '${totalBids} ${totalBids == 1 ? 'bid' : 'bids'}  •  ${product['category'] ?? 'N/A'}  •  ${product['condition'] ?? 'N/A'}',
                              style: TextStyle(color: Colors.grey[500], fontSize: 12),
                            ),
                          ],
                        ),
                        trailing: ended
                            ? Chip(
                                label: const Text('SOLD', style: TextStyle(color: Colors.black)),
                                backgroundColor: const Color(0xFFFDC02F))
                            : null,
                        children: [
                          if (bids.isEmpty)
                            const Padding(
                              padding: EdgeInsets.all(16),
                              child: Text('No bids yet', style: TextStyle(color: Colors.grey)),
                            )
                          else
                            ...bids.map((bid) {
                              final bidId = bid['id']?.toString() ?? '';
                              return ListTile(
                                title: Text(bid['bidder_alias'] ?? 'Bidder',
                                    style: const TextStyle(color: Colors.white)),
                                subtitle: Text(
                                    'NRs. ${NumberFormat('#,##0').format(_parse(bid['amount']))}',
                                    style: TextStyle(color: Colors.grey[400])),
                                trailing: ended
                                    ? null
                                    : Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          TextButton(
                                            onPressed: () =>
                                                acceptBid(auctionId, bidId),
                                            child: const Text('Accept',
                                                style: TextStyle(color: Colors.green)),
                                          ),
                                          TextButton(
                                            onPressed: () {},
                                            child: const Text('Decline',
                                                style: TextStyle(color: Colors.grey)),
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