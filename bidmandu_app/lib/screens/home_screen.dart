import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../services/api_service.dart';
import '../widgets/app_drawer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  List<dynamic> auctions = [];
  bool loading = true;
  String selectedCategory = 'All';
  String searchQuery = '';
  String sortBy = 'default';
  final List<String> categories = [
    'All', 'Electronics', 'Fashion', 'Home & Garden',
    'Vehicles', 'Sports & Outdoors', 'Books & Media', 'Toys & Kids'
  ];
  bool isLoggedIn = false;
  bool isSeller = false;
  String? userId;

  // Advanced filter state
  double priceMin = 0;
  double priceMax = 500000;
  bool activeOnly = false;
  bool endingSoon = false;
  bool newlyListed = false;
  bool noReserve = false;
  bool verifiedSellersOnly = false;
  String selectedLocation = 'Kathmandu Valley (All Regions)';
  List<String> conditionGrades = []; // e.g. ['Mint', 'Gently Used', 'Fair']

  late AnimationController _staggerController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _staggerController = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnimation = CurvedAnimation(parent: _staggerController, curve: Curves.easeOutCubic);
    _staggerController.forward();
    _loadUser();
    fetchAuctions();
  }

  @override
  void dispose() {
    _staggerController.dispose();
    super.dispose();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token != null) {
      try {
        final parts = token.split('.');
        final payload = jsonDecode(utf8.decode(base64.decode(base64.normalize(parts[1]))));
        setState(() {
          isLoggedIn = true;
          isSeller = payload['is_seller'] == true;
          userId = payload['sub'];
        });
      } catch (_) {}
    }
  }

  Future<void> fetchAuctions() async {
    setState(() => loading = true);
    try {
      final res = await ApiService.get('/auctions/list');
      if (res.statusCode == 200) setState(() => auctions = jsonDecode(res.body));
    } catch (_) {}
    setState(() => loading = false);
  }

  double _parse(dynamic v) =>
      v is num ? v.toDouble() : double.tryParse(v?.toString() ?? '') ?? 0.0;

  List<dynamic> get filtered {
    var result = auctions;
    if (userId != null) result = result.where((a) => a['product']?['seller_id'] != userId).toList();
    if (selectedCategory != 'All')
      result = result.where((a) => a['product']?['category'] == selectedCategory).toList();
    if (searchQuery.isNotEmpty) {
      final q = searchQuery.toLowerCase();
      result = result.where((a) =>
          '${a['product']?['title']} ${a['product']?['description']}'.toLowerCase().contains(q)).toList();
    }
    // Filters – price range, status, etc.
    result = result.where((a) {
      final price = _parse(a['current_price']);
      return price >= priceMin && price <= priceMax;
    }).toList();
    if (activeOnly) {
      result = result.where((a) {
        final end = DateTime.tryParse(a['end_time'] ?? '');
        return end != null && end.isAfter(DateTime.now());
      }).toList();
    }
    if (endingSoon) {
      result = result.where((a) {
        final end = DateTime.tryParse(a['end_time'] ?? '');
        if (end == null) return false;
        final remaining = end.difference(DateTime.now());
        return remaining.inMinutes < 60 && remaining.isNegative == false;
      }).toList();
    }
    if (newlyListed) {
      result = result.where((a) {
        final start = DateTime.tryParse(a['start_time'] ?? '');
        if (start == null) return false;
        return DateTime.now().difference(start).inHours < 24;
      }).toList();
    }
    // No Reserve – not yet implemented on backend, placeholder
    // verifiedSellersOnly – filter where product.seller.is_seller == true
    if (verifiedSellersOnly) {
      result = result.where((a) => a['product']?['seller']?['is_seller'] == true).toList();
    }
    // Condition grades (if we later add condition data to products)
    if (conditionGrades.isNotEmpty) {
      result = result.where((a) => conditionGrades.contains(a['product']?['condition'])).toList();
    }
    // Sorting
    if (sortBy == 'price_asc')
      result.sort((a, b) => _parse(a['current_price']).compareTo(_parse(b['current_price'])));
    if (sortBy == 'price_desc')
      result.sort((a, b) => _parse(b['current_price']).compareTo(_parse(a['current_price'])));
    if (sortBy == 'ending_soon')
      result.sort((a, b) => DateTime.parse(a['end_time'] ?? '2099').compareTo(DateTime.parse(b['end_time'] ?? '2099')));
    return result;
  }

  List<dynamic> get featuredLots {
    final sorted = List<dynamic>.from(filtered);
    sorted.sort((a, b) => _parse(b['current_price']).compareTo(_parse(a['current_price'])));
    return sorted.take(5).toList();
  }

  void logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    setState(() { isLoggedIn = false; isSeller = false; userId = null; });
    Navigator.pushReplacementNamed(context, '/home');
  }

  void _hapticTap() => HapticFeedback.lightImpact();

  // ===================== ADVANCED FILTER SHEET =====================
  void _showAdvancedFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (BuildContext ctx, StateSetter setModalState) {
            return Container(
              height: MediaQuery.of(sheetContext).size.height * 0.78,
              decoration: const BoxDecoration(
                color: Color(0xFF16161A),
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Refine Auction Feed",
                            style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                        TextButton(
                          onPressed: () {
                            setModalState(() {
                              // Reset all to defaults
                              priceMin = 0;
                              priceMax = 500000;
                              activeOnly = false;
                              endingSoon = false;
                              newlyListed = false;
                              noReserve = false;
                              verifiedSellersOnly = false;
                              conditionGrades.clear();
                              selectedLocation = 'Kathmandu Valley (All Regions)';
                            });
                          },
                          child: const Text("Reset All", style: TextStyle(color: Color(0xFFC41E3A))),
                        ),
                      ],
                    ),
                  ),
                  const Divider(color: Colors.white10, height: 1),

                  // Scrollable content
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(16),
                      physics: const BouncingScrollPhysics(),
                      children: [
                        // 1. Price Range
                        const Text("Price Boundary (NRs.)",
                            style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E1E24),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            children: [
                              RangeSlider(
                                values: RangeValues(priceMin, priceMax),
                                min: 0,
                                max: 500000,
                                activeColor: const Color(0xFFC41E3A),
                                inactiveColor: Colors.white10,
                                onChanged: (RangeValues vals) {
                                  setModalState(() {
                                    priceMin = vals.start;
                                    priceMax = vals.end;
                                  });
                                },
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text("Min: NRs. ${priceMin.toInt()}",
                                      style: const TextStyle(color: Colors.white60, fontSize: 12)),
                                  Text("Max: NRs. ${priceMax.toInt()}",
                                      style: const TextStyle(color: Colors.white60, fontSize: 12)),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // 2. Bidding Status Pills
                        const Text("Auction System Status",
                            style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildFilterPill("Active Matches Only", activeOnly, () {
                              setModalState(() => activeOnly = !activeOnly);
                            }),
                            _buildFilterPill("Ending Within 1 Hour", endingSoon, () {
                              setModalState(() => endingSoon = !endingSoon);
                            }),
                            _buildFilterPill("No Reserve Lots", noReserve, () {
                              setModalState(() => noReserve = !noReserve);
                            }),
                            _buildFilterPill("Verified Sellers Only", verifiedSellersOnly, () {
                              setModalState(() => verifiedSellersOnly = !verifiedSellersOnly);
                            }),
                            _buildFilterPill("Newly Listed (24h)", newlyListed, () {
                              setModalState(() => newlyListed = !newlyListed);
                            }),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // 3. Location Dropdown (simplified)
                        const Text("Item Location Radius",
                            style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E1E24),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.05)),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text("Kathmandu Valley (All Regions)",
                                  style: TextStyle(color: Colors.white, fontSize: 14)),
                              Icon(Icons.keyboard_arrow_down_rounded, color: Colors.white60),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        // 4. Condition Grade Checkboxes
                        const Text("Product Condition Grade",
                            style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 8),
                        _buildConditionRow("Mint Condition (Brand New Equivalent)",
                            conditionGrades.contains('Mint'), (val) {
                          setModalState(() {
                            if (val) {
                              conditionGrades.add('Mint');
                            } else {
                              conditionGrades.remove('Mint');
                            }
                          });
                        }),
                        _buildConditionRow("Gently Used / Refurbished",
                            conditionGrades.contains('Gently Used'), (val) {
                          setModalState(() {
                            if (val) {
                              conditionGrades.add('Gently Used');
                            } else {
                              conditionGrades.remove('Gently Used');
                            }
                          });
                        }),
                        _buildConditionRow("Fair Operational Quality",
                            conditionGrades.contains('Fair'), (val) {
                          setModalState(() {
                            if (val) {
                              conditionGrades.add('Fair');
                            } else {
                              conditionGrades.remove('Fair');
                            }
                          });
                        }),
                      ],
                    ),
                  ),

                  // Fixed Apply Button
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          // Apply filters and close
                          setState(() {});
                          Navigator.pop(ctx);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFC41E3A),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 0,
                        ),
                        child: const Text(
                          "Apply Configurations",
                          style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildFilterPill(String title, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFC41E3A).withOpacity(0.15) : const Color(0xFF1E1E24),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
              color: isSelected ? const Color(0xFFC41E3A) : Colors.white.withOpacity(0.05)),
        ),
        child: Text(
          title,
          style: TextStyle(
            color: isSelected ? const Color(0xFFC41E3A) : Colors.white70,
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildConditionRow(String title, bool isChecked, Function(bool) onChanged) {
    return CheckboxListTile(
      value: isChecked,
      title: Text(title, style: const TextStyle(color: Colors.white70, fontSize: 14)),
      contentPadding: EdgeInsets.zero,
      activeColor: const Color(0xFFC41E3A),
      checkColor: Colors.white,
      controlAffinity: ListTileControlAffinity.leading,
      onChanged: (bool? value) {
        onChanged(value ?? false);
      },
    );
  }

  // ===================== BUILD =====================
  @override
  Widget build(BuildContext context) {
    final displayed = filtered;
    final featured = featuredLots;
    return Scaffold(
      drawer: AppDrawer(isLoggedIn: isLoggedIn, isSeller: isSeller, onLogout: logout),
      backgroundColor: const Color(0xFF121214),
      body: Builder(
        builder: (scaffoldContext) {
          return Stack(
            children: [
              Positioned(
                top: -100,
                left: MediaQuery.of(scaffoldContext).size.width * 0.2,
                child: Container(
                  width: 250, height: 250,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFFC41E3A).withOpacity(0.15),
                  ),
                  child: BackdropFilter(filter: ImageFilter.blur(sigmaX: 80, sigmaY: 80), child: const SizedBox.expand()),
                ),
              ),
              SafeArea(
                child: CustomScrollView(
                  physics: const BouncingScrollPhysics(),
                  slivers: [
                    SliverAppBar(
                      backgroundColor: const Color(0xFF121214).withOpacity(0.8),
                      floating: true, pinned: false, automaticallyImplyLeading: false,
                      title: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              GestureDetector(
                                onTap: () { _hapticTap(); Scaffold.of(scaffoldContext).openDrawer(); },
                                child: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(color: const Color(0xFF1E1E24), borderRadius: BorderRadius.circular(12)),
                                  child: const Icon(Icons.menu, color: Colors.white, size: 22),
                                ),
                              ),
                              const SizedBox(width: 16),
                              const Text('BIDMANDU', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22, letterSpacing: 1.2, color: Colors.white)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: const Color(0xFF1E1E24), borderRadius: BorderRadius.circular(12)),
                            child: const Icon(Icons.notifications_none_outlined, color: Colors.white, size: 22),
                          ),
                        ],
                      ),
                    ),
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E1E24),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.05)),
                          ),
                          child: TextField(
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              hintText: "Search premium lots, electronics...",
                              hintStyle: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 15),
                              prefixIcon: Icon(Icons.search, color: Colors.white.withOpacity(0.6)),
                              suffixIcon: GestureDetector(
                                onTap: () => _showAdvancedFilterSheet(),
                                child: Container(
                                  margin: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(color: const Color(0xFFC41E3A), borderRadius: BorderRadius.circular(12)),
                                  child: const Icon(Icons.tune_rounded, color: Colors.white, size: 20),
                                ),
                              ),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            onChanged: (v) => setState(() => searchQuery = v),
                          ),
                        ),
                      ),
                    ),
                    if (featured.isNotEmpty)
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text("⚡ Live Fast Auctions", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 12),
                              SizedBox(
                                height: 180,
                                child: PageView.builder(
                                  itemCount: featured.length,
                                  onPageChanged: (_) => _hapticTap(),
                                  itemBuilder: (_, idx) {
                                    final lot = featured[idx];
                                    final p = lot['product'] ?? {};
                                    final end = DateTime.tryParse(lot['end_time'] ?? '');
                                    final timeLeft = end?.difference(DateTime.now());
                                    final isUrgent = timeLeft != null && timeLeft.inMinutes < 30 && timeLeft.isNegative == false;
                                    return GestureDetector(
                                      onTap: () => Navigator.pushNamed(scaffoldContext, '/auction_detail', arguments: lot['id']),
                                      child: Container(
                                        margin: const EdgeInsets.only(right: 12),
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(20),
                                          image: (p['image_urls'] is List && (p['image_urls'] as List).isNotEmpty)
                                              ? DecorationImage(image: CachedNetworkImageProvider(p['image_urls'][0]), fit: BoxFit.cover) : null,
                                          color: const Color(0xFF1E1E24),
                                        ),
                                        child: Container(
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(20),
                                            gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.transparent, Colors.black.withOpacity(0.85)]),
                                          ),
                                          padding: const EdgeInsets.all(16),
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.end,
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                children: [
                                                  if (timeLeft != null && !timeLeft.isNegative)
                                                    Container(
                                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                                      decoration: BoxDecoration(
                                                        color: isUrgent ? const Color(0xFFC41E3A) : const Color(0xFFFDC02F),
                                                        borderRadius: BorderRadius.circular(20),
                                                        boxShadow: [BoxShadow(color: (isUrgent ? const Color(0xFFC41E3A) : const Color(0xFFFDC02F)).withOpacity(0.4), blurRadius: 8)],
                                                      ),
                                                      child: Text(isUrgent ? 'Ending soon' : '${timeLeft.inDays}d ${timeLeft.inHours.remainder(24)}h',
                                                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                                    ),
                                                  Text("🔥 ${lot['totalBids'] ?? 0} Bids", style: const TextStyle(color: Color(0xFFFDC02F), fontWeight: FontWeight.bold, fontSize: 13)),
                                                ],
                                              ),
                                              const SizedBox(height: 12),
                                              Text(p['title'] ?? '', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                                              const SizedBox(height: 2),
                                              Text("Current: NRs. ${NumberFormat('#,##0').format(_parse(lot['current_price']))}", style: const TextStyle(color: Colors.white70, fontSize: 14)),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text("Explore Categories", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            TextButton(
                              onPressed: () { _hapticTap(); setState(() => selectedCategory = 'All'); },
                              child: const Text("See All", style: TextStyle(color: Color(0xFFC41E3A))),
                            ),
                          ],
                        ),
                      ),
                    ),
                    SliverToBoxAdapter(
                      child: SizedBox(
                        height: 40,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: categories.length,
                          itemBuilder: (_, i) {
                            final cat = categories[i];
                            final sel = cat == selectedCategory;
                            return GestureDetector(
                              onTap: () { _hapticTap(); setState(() => selectedCategory = cat); },
                              child: Container(
                                margin: const EdgeInsets.only(right: 8),
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                                decoration: BoxDecoration(
                                  color: sel ? const Color(0xFFC41E3A) : const Color(0xFF1E1E24),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: sel ? Colors.transparent : Colors.white.withOpacity(0.05)),
                                ),
                                child: Text(cat, style: TextStyle(color: sel ? Colors.white : Colors.white70, fontWeight: FontWeight.w600, fontSize: 13)),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text("Popular Active Lots", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            DropdownButton<String>(
                              value: sortBy,
                              dropdownColor: const Color(0xFF1E1E24),
                              underline: const SizedBox(),
                              style: const TextStyle(color: Colors.white),
                              items: const [
                                DropdownMenuItem(value: 'default', child: Text('Default')),
                                DropdownMenuItem(value: 'price_asc', child: Text('Price ↑')),
                                DropdownMenuItem(value: 'price_desc', child: Text('Price ↓')),
                                DropdownMenuItem(value: 'ending_soon', child: Text('Ending Soon')),
                              ],
                              onChanged: (v) => setState(() => sortBy = v!),
                            ),
                          ],
                        ),
                      ),
                    ),
                    loading
                        ? SliverGrid(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 16, crossAxisSpacing: 16, childAspectRatio: 0.76),
                            delegate: SliverChildBuilderDelegate(
                              (_, __) => Card(color: const Color(0xFF1E1E24), child: Shimmer.fromColors(baseColor: Colors.grey[800]!, highlightColor: Colors.grey[700]!, child: Container())),
                              childCount: 4,
                            ),
                          )
                        : displayed.isEmpty
                            ? const SliverFillRemaining(child: Center(child: Text('No auctions found', style: TextStyle(color: Colors.grey))))
                            : SliverPadding(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                sliver: SliverGrid(
                                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 16, crossAxisSpacing: 16, childAspectRatio: 0.76),
                                  delegate: SliverChildBuilderDelegate(
                                    (context, index) => _AnimatedAuctionCard(auction: displayed[index], index: index, animation: _staggerController, fadeAnimation: _fadeAnimation),
                                    childCount: displayed.length,
                                  ),
                                ),
                              ),
                    const SliverToBoxAdapter(child: SizedBox(height: 40)),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _AnimatedAuctionCard extends StatelessWidget {
  final dynamic auction;
  final int index;
  final AnimationController animation;
  final Animation<double> fadeAnimation;
  const _AnimatedAuctionCard({required this.auction, required this.index, required this.animation, required this.fadeAnimation});

  double _parse(dynamic v) => v is num ? v.toDouble() : double.tryParse(v?.toString() ?? '') ?? 0.0;

  @override
  Widget build(BuildContext context) {
    final p = auction['product'] ?? {};
    final totalBids = auction['totalBids'] ?? 0;
    final hasBids = totalBids > 0;
    final price = hasBids ? _parse(auction['current_price']) : _parse(p['starting_price']);
    final end = DateTime.tryParse(auction['end_time'] ?? '');
    final ended = end != null && end.isBefore(DateTime.now());
    final timeLeft = ended ? null : end!.difference(DateTime.now());
    final isUrgent = timeLeft != null && timeLeft.inMinutes < 30 && timeLeft.inMinutes > 0;

    final delay = Duration(milliseconds: 30 * index);
    final delayedAnimation = CurvedAnimation(parent: animation, curve: Interval((delay.inMilliseconds / 1000).clamp(0.0, 1.0), 1.0, curve: Curves.easeOutCubic));

    return AnimatedBuilder(
      animation: delayedAnimation,
      builder: (context, child) {
        final val = delayedAnimation.value;
        return Opacity(opacity: val, child: Transform.translate(offset: Offset(0, (1 - val) * 20), child: child));
      },
      child: GestureDetector(
        onTap: () { HapticFeedback.lightImpact(); Navigator.pushNamed(context, '/auction_detail', arguments: auction['id']); },
        child: Container(
          decoration: BoxDecoration(color: const Color(0xFF1E1E24), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.05))),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Stack(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                        image: (p['image_urls'] is List && (p['image_urls'] as List).isNotEmpty) ? DecorationImage(image: CachedNetworkImageProvider(p['image_urls'][0]), fit: BoxFit.cover) : null,
                        color: Colors.grey[900],
                      ),
                    ),
                    if (timeLeft != null && !ended)
                      Positioned(
                        top: 8, right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: isUrgent ? const Color(0xFFC41E3A) : Colors.black.withOpacity(0.6), borderRadius: BorderRadius.circular(8)),
                          child: Text(isUrgent ? 'Ending' : '⌛ ${timeLeft.inDays}d ${timeLeft.inHours.remainder(24)}h', style: const TextStyle(color: Color(0xFFFDC02F), fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      )
                    else if (ended)
                      Positioned(
                        top: 8, right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: Colors.red[900], borderRadius: BorderRadius.circular(8)),
                          child: const Text('Ended', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p['title'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(hasBids ? 'Highest Bid' : 'Starting Price', style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 11)),
                    const SizedBox(height: 2),
                    Text('NRs. ${NumberFormat('#,##0').format(price)}', style: const TextStyle(color: Color(0xFFFDC02F), fontWeight: FontWeight.bold, fontSize: 15)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}