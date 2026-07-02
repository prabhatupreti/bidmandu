import 'dart:async';
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

class _AuctionDetailScreenState extends State<AuctionDetailScreen>
    with SingleTickerProviderStateMixin {
  Map<String, dynamic>? auction;
  Map<String, dynamic>? product;
  int totalBids = 0;
  bool loading = true;
  final _bidCtrl = TextEditingController();
  Timer? _countdownTimer;
  Duration _timeLeft = Duration.zero;
  late AnimationController _pulseController;
  int _selectedImage = 0;
  String? bidError;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 800))
      ..repeat(reverse: true);
    fetchDetails();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _countdownTimer?.cancel();
    _bidCtrl.dispose();
    super.dispose();
  }

  double _parse(dynamic v) =>
      v is num ? v.toDouble() : double.tryParse(v?.toString() ?? '') ?? 0.0;

  Future<void> fetchDetails() async {
    try {
      final res = await ApiService.get('/auctions/list');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final match = data.firstWhere((a) => a['id'] == widget.auctionId,
            orElse: () => null);
        if (match != null) {
          setState(() {
            auction = match;
            product = match['product'];
            totalBids = match['totalBids'] ?? 0;
          });
          _startCountdown(DateTime.tryParse(auction!['end_time'] ?? ''));
        }
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  void _startCountdown(DateTime? endTime) {
    _countdownTimer?.cancel();
    if (endTime == null) return;
    void tick() {
      final remaining = endTime.difference(DateTime.now());
      setState(
          () => _timeLeft = remaining.isNegative ? Duration.zero : remaining);
      if (remaining.isNegative) _countdownTimer?.cancel();
    }
    tick();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) => tick());
  }

  Future<void> placeBid() async {
    final amountText = _bidCtrl.text.trim();
    if (amountText.isEmpty) return;
    final amount = double.tryParse(amountText);
    if (amount == null) return;

    final minBid = hasBids
        ? _parse(auction!['current_price'])
        : _parse(product?['starting_price']);
    if (amount <= minBid) {
      setState(() => bidError =
          'Bid must be higher than NRs. ${NumberFormat('#,##0').format(minBid)}');
      return;
    }
    setState(() => bidError = null);

    try {
      final res = await ApiService.post('/bids',
          body: {'auctionId': widget.auctionId, 'amount': amount});
      if (res.statusCode == 201 || res.statusCode == 200) {
        _bidCtrl.clear();
        fetchDetails();
      }
    } catch (_) {
      setState(() => bidError = 'Bid failed. Please try again.');
    }
  }

  bool get hasBids => totalBids > 0;
  double get displayPrice => hasBids
      ? _parse(auction!['current_price'])
      : _parse(product?['starting_price']);

  // ---------------- Centered Dual‑Card Price Row ----------------
  Widget _buildCenteredPriceRow() {
    final startPrice = _parse(product?['starting_price']);
    return Row(
      children: [
        // Left: Starting Price
        Expanded(
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E24),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withOpacity(0.03)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text("STARTING PRICE",
                    style: TextStyle(
                        color: Colors.white.withOpacity(0.4),
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5)),
                const SizedBox(height: 4),
                Text("NRs. ${NumberFormat('#,##0').format(startPrice)}",
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        // Right: Current Bid
        Expanded(
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: hasBids
                  ? const Color(0xFFC41E3A).withOpacity(0.1)
                  : const Color(0xFF1E1E24),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: hasBids
                      ? const Color(0xFFC41E3A).withOpacity(0.2)
                      : Colors.white.withOpacity(0.03)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text("CURRENT BID",
                    style: TextStyle(
                        color: hasBids
                            ? const Color(0xFFC41E3A)
                            : Colors.white.withOpacity(0.4),
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5)),
                const SizedBox(height: 4),
                Text(
                    "NRs. ${NumberFormat('#,##0').format(displayPrice)}",
                    style: const TextStyle(
                        color: Color(0xFFFDC02F),
                        fontSize: 16,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    if (loading || auction == null)
      return Scaffold(
          appBar: AppBar(title: const Text('Loading...')),
          body: const Center(child: CircularProgressIndicator()));

    final isEnded = _timeLeft == Duration.zero;
    final isUrgent =
        !isEnded && _timeLeft.inMinutes < 5 && _timeLeft.inMinutes > 0;
    final images = (product?['image_urls'] is List
        ? product!['image_urls'] as List
        : <dynamic>[]);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: const Color(0xFF1A1A1A),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  if (images.isNotEmpty)
                    PageView.builder(
                      itemCount: images.length,
                      onPageChanged: (i) => setState(() => _selectedImage = i),
                      itemBuilder: (_, i) => CachedNetworkImage(
                        imageUrl: images[i],
                        fit: BoxFit.cover,
                        placeholder: (_, __) => Shimmer.fromColors(
                            baseColor: Colors.grey[800]!,
                            highlightColor: Colors.grey[700]!,
                            child: Container(color: Colors.white)),
                        errorWidget: (_, __, ___) => Container(
                            color: Colors.grey[900],
                            child: const Icon(Icons.image_not_supported,
                                size: 80)),
                      ),
                    )
                  else
                    Container(color: Colors.grey[900]),
                  if (images.length > 1)
                    Positioned(
                      bottom: 16,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                            images.length,
                            (i) => Container(
                                  width: 8,
                                  height: 8,
                                  margin:
                                      const EdgeInsets.symmetric(horizontal: 4),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: i == _selectedImage
                                        ? const Color(0xFFC41E3A)
                                        : Colors.grey,
                                  ),
                                )),
                      ),
                    ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(product?['title'] ?? '',
                      style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Chip(
                          label: Text(
                              '$totalBids ${totalBids == 1 ? 'Bid' : 'Bids'}',
                              style: const TextStyle(color: Colors.white)),
                          backgroundColor: const Color(0xFF242424)),
                      const SizedBox(width: 8),
                      Chip(
                          label: Text(product?['category'] ?? 'N/A',
                              style: const TextStyle(color: Colors.white)),
                          backgroundColor: const Color(0xFF242424)),
                      const SizedBox(width: 8),
                      Chip(
                          label: Text(product?['condition'] ?? 'N/A',
                              style: const TextStyle(color: Colors.white)),
                          backgroundColor: const Color(0xFF242424)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // Replaced the old single price card with the centered dual‑card
                  _buildCenteredPriceRow(),
                  const SizedBox(height: 24),
                  // Countdown
                  if (!isEnded) ...[
                    Text('Time Remaining',
                        style: TextStyle(color: Colors.grey[500])),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (_timeLeft.inDays > 0) ...[
                          _buildTimeBlock(
                              _timeLeft.inDays.toString().padLeft(2, '0'),
                              'Days'),
                          const Text(':',
                              style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white)),
                        ],
                        _buildTimeBlock(
                            _timeLeft.inHours.remainder(24).toString().padLeft(2, '0'),
                            'Hrs'),
                        const Text(':',
                            style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white)),
                        _buildTimeBlock(
                            _timeLeft.inMinutes.remainder(60).toString().padLeft(2, '0'),
                            'Min'),
                        const Text(':',
                            style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white)),
                        _buildTimeBlock(
                            _timeLeft.inSeconds.remainder(60).toString().padLeft(2, '0'),
                            'Sec'),
                      ],
                    ),
                    if (isUrgent)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: AnimatedBuilder(
                          animation: _pulseController,
                          builder: (context, _) => Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                                color: const Color(0xFFC41E3A).withOpacity(
                                    0.1 + _pulseController.value * 0.1),
                                borderRadius: BorderRadius.circular(20)),
                            child: const Text('Ending Soon!',
                                style: TextStyle(
                                    color: Color(0xFFC41E3A),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12)),
                          ),
                        ),
                      ),
                  ] else ...[
                    Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 12, horizontal: 24),
                      decoration: BoxDecoration(
                          color: Colors.red[900],
                          borderRadius: BorderRadius.circular(8)),
                      child: const Text('Auction Ended',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white)),
                    ),
                  ],
                  const SizedBox(height: 24),
                  // Bidding input
                  if (!isEnded) ...[
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _bidCtrl,
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              hintText: 'Enter higher amount',
                              hintStyle:
                                  TextStyle(color: Colors.grey[500]),
                              filled: true,
                              fillColor: const Color(0xFF242424),
                              border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: BorderSide.none),
                            ),
                            onChanged: (_) => setState(() => bidError = null),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          onPressed: placeBid,
                          style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFC41E3A),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 24, vertical: 16),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16))),
                          child: const Text('Bid Now',
                              style: TextStyle(fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    if (bidError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(bidError!,
                            style: const TextStyle(
                                color: Colors.red, fontSize: 13)),
                      ),
                  ],
                  const SizedBox(height: 24),
                  Text('Description',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: Colors.grey[300])),
                  const SizedBox(height: 8),
                  Text(product?['description'] ?? '',
                      style: TextStyle(color: Colors.grey[400])),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeBlock(String value, String label) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
              color: const Color(0xFF242424),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.white10)),
          child: Text(value,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'monospace')),
        ),
        const SizedBox(height: 4),
        Text(label,
            style: TextStyle(fontSize: 10, color: Colors.grey[500])),
      ],
    );
  }
}