import 'package:shared_preferences/shared_preferences.dart';
import '../data/mock_data.dart';

// ---------- Fake response that mimics the structure screens expect ----------
class MockResponse {
  final int statusCode;
  final dynamic data;
  MockResponse(this.statusCode, this.data);
}

class ApiService {
  // Simulate network delay
  static Future<void> _delay() async {
    await Future.delayed(const Duration(milliseconds: 300));
  }

  // ----- Public methods (same signatures as before) -----
  static Future<MockResponse> get(String path) async {
    await _delay();
    return _handleMockGet(path);
  }

  static Future<MockResponse> post(String path, {Map<String, dynamic>? body}) async {
    await _delay();
    return _handleMockPost(path, body);
  }

  static Future<MockResponse> patch(String path, {Map<String, dynamic>? body}) async {
    await _delay();
    return _handleMockPatch(path, body);
  }

  static Future<MockResponse> multipartPost(
      String path, Map<String, String> fields, Map<String, String> files) async {
    await _delay();
    final body = <String, dynamic>{};
    body.addAll(fields);
    return _handleMockPost(path, body);
  }

  // ---------- Mock Handlers ----------
  static MockResponse _handleMockGet(String path) {
    if (path == '/auctions/list') {
      return MockResponse(200, MockData.auctions);
    }
    if (path.startsWith('/auctions/') && path.endsWith('/state')) {
      final id = path.split('/')[2];
      final auction = MockData.auctions.firstWhere(
        (a) => a['id'] == id,
        orElse: () => <String, dynamic>{},
      );
      if (auction.isEmpty) return MockResponse(404, {'message': 'Not found'});
      return MockResponse(200, {
        'currentPrice': auction['current_price'].toString(),
        'winnerId': auction['winner_id'] ?? '',
        'endTime': auction['end_time'],
        'version': '0',
      });
    }
    if (path == '/products/my') {
      final userId = MockData.currentUserId;
      if (userId == null) return MockResponse(401, {'message': 'Unauthorized'});
      final myAuctions = MockData.auctions
          .where((a) => a['product']['seller_id'] == userId)
          .toList();
      final result = myAuctions.map((a) {
        return {
          'product': a['product'],
          'auction': {
            'id': a['id'],
            'current_price': a['current_price'],
            'start_time': a['start_time'],
            'end_time': a['end_time'],
            'status': a['status'],
            'winner_id': a['winner_id'],
            'extension_count': 0,
          },
          'bids': MockData.getBidsForAuction(a['id']),
          'totalBids': a['totalBids'] ?? 0,
        };
      }).toList();
      return MockResponse(200, result);
    }
    if (path == '/transactions/my') {
      return MockResponse(200, MockData.transactions);
    }
    if (path.startsWith('/transactions/') && path.endsWith('/payment-details')) {
      final txnId = path.split('/')[2];
      final txn = MockData.transactions.firstWhere(
        (t) => t['id'] == txnId,
        orElse: () => <String, dynamic>{},
      );
      if (txn.isEmpty) return MockResponse(404, {'message': 'Not found'});
      return MockResponse(200, {
        'staticQrUrl': 'https://placehold.co/300x300/EEE/31343C?text=QR+Code',
        'accountName': 'Bidmandu Escrow',
        'amountDue': txn['amount'],
        'paymentRef': txn['payment_ref_code'],
        'instructions': 'This is a demo. No real payment required.',
      });
    }
    return MockResponse(404, {'message': 'Not found'});
  }

  static MockResponse _handleMockPost(String path, Map<String, dynamic>? body) {
    if (path == '/auth/login') {
      final identifier = body?['identifier'] as String?;
      final password = body?['password'] as String?;
      final user = MockData.users.firstWhere(
        (u) => u['email'] == identifier && u['password'] == password,
        orElse: () => <String, dynamic>{},
      );
      if (user.isEmpty) return MockResponse(401, {'message': 'Invalid credentials'});
      final token = MockData.generateToken(user);
      MockData.userTokens[user['id'] as String] = token;
      MockData.currentUserId = user['id'] as String;
      // Update the app's stored token
      SharedPreferences.getInstance().then((prefs) {
        prefs.setString('token', token);
      });
      return MockResponse(200, {
        'access_token': token,
        'user': {
          'id': user['id'],
          'email': user['email'],
          'is_seller': user['is_seller'],
          'role': user['role'],
        },
      });
    }
    if (path == '/auth/register') {
      final email = body?['email'] as String? ?? '';
      final phone = body?['phone'] as String? ?? '';
      final password = body?['password'] as String? ?? '';
      final newUser = <String, dynamic>{
        'id': 'mock-user-${DateTime.now().millisecondsSinceEpoch}',
        'email': email,
        'phone': phone,
        'password': password,
        'is_seller': false,
        'role': 'BUYER',
      };
      MockData.users.add(newUser);
      // Auto-login
      final token = MockData.generateToken(newUser);
      MockData.userTokens[newUser['id'] as String] = token;
      MockData.currentUserId = newUser['id'] as String;
      SharedPreferences.getInstance().then((prefs) {
        prefs.setString('token', token);
      });
      return MockResponse(201, {
        'access_token': token,
        'user': {
          'id': newUser['id'],
          'email': newUser['email'],
          'is_seller': newUser['is_seller'],
          'role': newUser['role'],
        },
      });
    }
    if (path == '/bids') {
      final auctionId = body?['auctionId'] as String?;
      final amount = (body?['amount'] as num?)?.toDouble();
      if (auctionId == null || amount == null) return MockResponse(400, {'message': 'Bad request'});
      final auction = MockData.auctions.firstWhere(
        (a) => a['id'] == auctionId,
        orElse: () => <String, dynamic>{},
      );
      if (auction.isEmpty) return MockResponse(404, {'message': 'Auction not found'});
      if (amount <= auction['current_price']) return MockResponse(409, {'message': 'BID_TOO_LOW'});
      auction['current_price'] = amount;
      auction['totalBids'] = (auction['totalBids'] ?? 0) + 1;
      MockData.addBid(auctionId, {
        'id': 'bid-${DateTime.now().millisecondsSinceEpoch}',
        'auction_id': auctionId,
        'user_id': MockData.currentUserId,
        'amount': amount,
        'created_at': DateTime.now().toIso8601String(),
      });
      return MockResponse(201, {'success': true, 'newPrice': amount});
    }
    if (path == '/kyc/apply') {
      final userId = MockData.currentUserId;
      if (userId != null) {
        final user = MockData.users.firstWhere(
          (u) => u['id'] == userId,
          orElse: () => <String, dynamic>{},
        );
        if (user.isNotEmpty) user['is_seller'] = true;
      }
      return MockResponse(201, {'message': 'KYC submitted and approved (mock)'});
    }
    if (path.startsWith('/auctions/') && path.endsWith('/accept-bid')) {
      final auctionId = path.split('/')[2];
      final auction = MockData.auctions.firstWhere(
        (a) => a['id'] == auctionId,
        orElse: () => <String, dynamic>{},
      );
      if (auction.isEmpty) return MockResponse(404, {'message': 'Not found'});
      auction['status'] = 'COMPLETED';
      auction['winner_id'] = body?['bidId'];
      return MockResponse(200, {'message': 'Bid accepted'});
    }
    if (path == '/products') {
      final newProduct = <String, dynamic>{
        'id': 'mock-prod-${DateTime.now().millisecondsSinceEpoch}',
        'title': body?['title'] ?? '',
        'description': body?['description'] ?? '',
        'category': body?['category'] ?? 'Other',
        'condition': body?['condition'] ?? 'Gently Used',
        'image_urls': <String>[],
        'seller_id': MockData.currentUserId,
        'seller': {'is_seller': true},
      };
      MockData.myProducts.add(newProduct);
      return MockResponse(201, newProduct);
    }
    if (path.startsWith('/products/') && path.endsWith('/submit')) {
      return MockResponse(200, {'message': 'Submitted'});
    }
    return MockResponse(404, {'message': 'Not found'});
  }

  static MockResponse _handleMockPatch(String path, Map<String, dynamic>? body) {
    return MockResponse(200, {'message': 'Patched (mock)'});
  }
}