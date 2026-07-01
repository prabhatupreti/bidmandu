import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../services/api_service.dart';

class AuctionDetailScreen extends StatefulWidget {
  final String auctionId;
  const AuctionDetailScreen({super.key, required this.auctionId});

  @override
  State<AuctionDetailScreen> createState() => _AuctionDetailScreenState();
}

class _AuctionDetailScreenState extends State<AuctionDetailScreen> {
  Map<String, dynamic>? auction;
  Map<String, dynamic>? product;
  int totalBids = 0;
  bool loading = true;
  final _bidCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchDetails();
  }

  double _parse(dynamic v) => v is num ? v.toDouble() : double.tryParse(v?.toString() ?? '') ?? 0.0;

  Future<void> fetchDetails() async {
    try {
      final res = await ApiService.get('/auctions/list');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final match = data.firstWhere((a) => a['id'] == widget.auctionId, orElse: () => null);
        if (match != null) {
          setState(() { auction = match; product = match['product']; totalBids = match['totalBids'] ?? 0; });
        }
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  Future<void> placeBid() async {
    final amount = double.tryParse(_bidCtrl.text);
    if (amount == null) return;
    try {
      final res = await ApiService.post('/bids', body: {'auctionId': widget.auctionId, 'amount': amount});
      if (res.statusCode == 201 || res.statusCode == 200) {
        _bidCtrl.clear();
        fetchDetails();
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    if (loading || auction == null) return Scaffold(appBar: AppBar(title: Text('Loading...')), body: Center(child: CircularProgressIndicator()));

    final hasBids = totalBids > 0;
    final startPrice = _parse(product?['starting_price']);
    final currentPrice = _parse(auction!['current_price']);
    final displayPrice = hasBids ? currentPrice : startPrice;
    final endTime = DateTime.tryParse(auction!['end_time'] ?? '');
    final isEnded = endTime != null && endTime.isBefore(DateTime.now());
    final timeLeft = isEnded ? Duration.zero : endTime!.difference(DateTime.now());
    final days = timeLeft.inDays;
    final hours = timeLeft.inHours.remainder(24);
    final minutes = timeLeft.inMinutes.remainder(60);
    final seconds = timeLeft.inSeconds.remainder(60);

    return Scaffold(
      appBar: AppBar(title: Text(product?['title'] ?? 'Auction')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (product?['image_urls'] != null && (product!['image_urls'] as List).isNotEmpty)
              ClipRRect(borderRadius: BorderRadius.circular(12), child: CachedNetworkImage(imageUrl: product!['image_urls'][0], height: 250, width: double.infinity, fit: BoxFit.cover, placeholder: (_, __) => Shimmer.fromColors(baseColor: Colors.grey[300]!, highlightColor: Colors.grey[100]!, child: Container(color: Colors.white)), errorWidget: (_, __, ___) => Container(color: Colors.grey[200], child: Icon(Icons.image_not_supported)))),
            SizedBox(height: 16),
            Text(product?['title'] ?? '', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF2A2A2A))),
            SizedBox(height: 8),
            Chip(label: Text('$totalBids ${totalBids == 1 ? 'Bid' : 'Bids'} Placed'), backgroundColor: Colors.blue[50]),
            SizedBox(height: 16),
            Card(
              color: Color(0xFF2A2A2A),
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    Text(isEnded ? 'Final Price' : (hasBids ? 'Current Highest Bid' : 'Starting Price'), style: TextStyle(color: Colors.grey[400])),
                    SizedBox(height: 8),
                    Text('NRs. ${NumberFormat('#,##0').format(displayPrice)}', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Color(0xFFFDC02F))),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            // Countdown with labels
            if (!isEnded) ...[
              Text('Time Remaining', style: TextStyle(color: Colors.grey)),
              SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildTimeBlock(days.toString().padLeft(2, '0'), 'Days'),
                  Text(':', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  _buildTimeBlock(hours.toString().padLeft(2, '0'), 'Hrs'),
                  Text(':', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  _buildTimeBlock(minutes.toString().padLeft(2, '0'), 'Min'),
                  Text(':', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  _buildTimeBlock(seconds.toString().padLeft(2, '0'), 'Sec'),
                ],
              ),
            ] else ...[
              Container(
                padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                decoration: BoxDecoration(color: Colors.red[50], borderRadius: BorderRadius.circular(8)),
                child: Text('Auction Ended', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.red)),
              ),
            ],
            SizedBox(height: 20),
            if (!isEnded)
              Row(
                children: [
                  Expanded(
                    child: TextField(controller: _bidCtrl, keyboardType: TextInputType.number, decoration: InputDecoration(hintText: 'Enter higher amount', border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)))),
                  ),
                  SizedBox(width: 10),
                  ElevatedButton(onPressed: placeBid, style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFC41E3A), foregroundColor: Colors.white, padding: EdgeInsets.symmetric(horizontal: 24, vertical: 15)), child: Text('Bid Now')),
                ],
              ),
            SizedBox(height: 20),
            Text('Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            SizedBox(height: 8),
            Text(product?['description'] ?? '', style: TextStyle(color: Colors.grey[800])),
            SizedBox(height: 16),
            Row(children: [Chip(label: Text(product?['category'] ?? 'N/A')), SizedBox(width: 10), Chip(label: Text(product?['condition'] ?? 'N/A'))]),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeBlock(String value, String label) {
    return Column(
      children: [
        Container(
          width: 44, height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(color: Color(0xFF2A2A2A), borderRadius: BorderRadius.circular(8)),
          child: Text(value, style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
        ),
        SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 10, color: Colors.grey)),
      ],
    );
  }
}