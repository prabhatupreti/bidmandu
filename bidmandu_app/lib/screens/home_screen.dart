import 'dart:convert';
import 'package:flutter/material.dart';
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

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> auctions = [];
  bool loading = true;
  String selectedCategory = 'All';
  String searchQuery = '';
  String sortBy = 'default';
  List<String> categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Vehicles', 'Sports & Outdoors', 'Books & Media', 'Toys & Kids'];
  bool isLoggedIn = false;
  bool isSeller = false;
  String? userId;

  @override
  void initState() {
    super.initState();
    _loadUser();
    fetchAuctions();
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
      if (res.statusCode == 200) {
        setState(() => auctions = jsonDecode(res.body));
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  double _parse(dynamic v) => v is num ? v.toDouble() : double.tryParse(v?.toString() ?? '') ?? 0.0;

  List<dynamic> get filtered {
    var result = auctions;
    if (selectedCategory != 'All') {
      result = result.where((a) => a['product']?['category'] == selectedCategory).toList();
    }
    if (searchQuery.isNotEmpty) {
      final q = searchQuery.toLowerCase();
      result = result.where((a) => '${a['product']?['title']} ${a['product']?['description']}'.toLowerCase().contains(q)).toList();
    }
    if (sortBy == 'price_asc') result.sort((a,b) => _parse(a['current_price']).compareTo(_parse(b['current_price'])));
    if (sortBy == 'price_desc') result.sort((a,b) => _parse(b['current_price']).compareTo(_parse(a['current_price'])));
    if (sortBy == 'ending_soon') result.sort((a,b) => DateTime.parse(a['end_time']??'2099').compareTo(DateTime.parse(b['end_time']??'2099')));
    return result;
  }

  void logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    setState(() { isLoggedIn = false; isSeller = false; userId = null; });
    Navigator.pushReplacementNamed(context, '/home');
  }

  @override
  Widget build(BuildContext context) {
    final displayed = filtered;
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [Image.asset('assets/logobid.png', height: 32), SizedBox(width: 8), Text('Bidmandu', style: TextStyle(fontWeight: FontWeight.bold))]),
        elevation: 0,
      ),
      drawer: AppDrawer(isLoggedIn: isLoggedIn, isSeller: isSeller, onLogout: logout),
      body: Column(
        children: [
          // Search
          Padding(
            padding: EdgeInsets.all(12),
            child: TextField(
              decoration: InputDecoration(
                prefixIcon: Icon(Icons.search),
                hintText: 'Search auctions...',
                filled: true, fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
              onChanged: (v) => setState(() => searchQuery = v),
            ),
          ),
          // Categories
          SizedBox(
            height: 50,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: 8),
              itemCount: categories.length,
              itemBuilder: (_, i) {
                final cat = categories[i];
                final sel = cat == selectedCategory;
                return GestureDetector(
                  onTap: () => setState(() => selectedCategory = cat),
                  child: Container(
                    margin: EdgeInsets.symmetric(horizontal: 4),
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: sel ? Color(0xFFC41E3A) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: sel ? [BoxShadow(color: Color(0xFFC41E3A).withOpacity(0.3), blurRadius: 8)] : [],
                    ),
                    child: Text(cat, style: TextStyle(color: sel ? Colors.white : Color(0xFF2A2A2A), fontWeight: FontWeight.w600)),
                  ),
                );
              },
            ),
          ),
          // Sort & count
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: Row(
              children: [
                Text('${displayed.length} Auctions', style: TextStyle(color: Colors.grey[600], fontWeight: FontWeight.w500)),
                Spacer(),
                DropdownButton<String>(
                  value: sortBy,
                  underline: SizedBox(),
                  items: [
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
          Expanded(
            child: loading
                ? GridView.builder(
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.65),
                    itemCount: 6,
                    itemBuilder: (_, __) => Card(child: Shimmer.fromColors(baseColor: Colors.grey[300]!, highlightColor: Colors.grey[100]!, child: Container(color: Colors.white))),
                  )
                : displayed.isEmpty
                    ? Center(child: Text('No auctions found'))
                    : GridView.builder(
                        padding: EdgeInsets.all(8),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.62),
                        itemCount: displayed.length,
                        itemBuilder: (_, i) {
                          final a = displayed[i];
                          final p = a['product'] ?? {};
                          final bids = a['totalBids'] ?? 0;
                          final hasBids = bids > 0;
                          final price = hasBids ? _parse(a['current_price']) : _parse(p['starting_price']);
                          final end = DateTime.tryParse(a['end_time']??'');
                          final ended = end != null && end.isBefore(DateTime.now());
                          return GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/auction_detail', arguments: a['id']),
                            child: Card(
                              elevation: 2,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
                                    child: CachedNetworkImage(
                                      imageUrl: (p['image_urls'] is List && (p['image_urls'] as List).isNotEmpty) ? p['image_urls'][0] : '',
                                      height: 110, width: double.infinity, fit: BoxFit.cover,
                                      placeholder: (_, __) => Shimmer.fromColors(baseColor: Colors.grey[300]!, highlightColor: Colors.grey[100]!, child: Container(color: Colors.white)),
                                      errorWidget: (_, __, ___) => Container(color: Colors.grey[200], child: Icon(Icons.image_not_supported)),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.all(10),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(p['title']??'', maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2A2A2A), fontSize: 13)),
                                        SizedBox(height: 6),
                                        Text(hasBids ? 'Highest Bid' : 'Starting Price', style: TextStyle(fontSize: 11, color: hasBids ? Colors.green : Colors.grey)),
                                        Text('NRs. ${NumberFormat('#,##0').format(price)}', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFC41E3A))),
                                        Text(ended ? 'Ended' : 'Ends ${DateFormat('MM/dd').format(end!)}', style: TextStyle(fontSize: 11, color: ended ? Colors.red : Colors.grey)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}