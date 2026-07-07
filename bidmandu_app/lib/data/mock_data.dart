// lib/data/mock_data.dart
class MockData {
  // ======================== USERS ========================
  static final List<Map<String, dynamic>> users = [
    {
      "id": "a0000000-0000-0000-0000-000000000001",
      "email": "admin@bidmandu.com",
      "phone": "9800000001",
      "password": "test1234",
      "is_seller": false,
      "role": "ADMIN"
    },
    {
      "id": "b0000000-0000-0000-0000-000000000001",
      "email": "sarita@bidmandu.com",
      "phone": "9800000011",
      "password": "test1234",
      "is_seller": true,
      "role": "BUYER"
    },
    {
      "id": "b0000000-0000-0000-0000-000000000002",
      "email": "ramesh@bidmandu.com",
      "phone": "9800000012",
      "password": "test1234",
      "is_seller": true,
      "role": "BUYER"
    },
    {
      "id": "b0000000-0000-0000-0000-000000000003",
      "email": "sunit@bidmandu.com",
      "phone": "9800000013",
      "password": "test1234",
      "is_seller": true,
      "role": "BUYER"
    },
    {
      "id": "b0000000-0000-0000-0000-000000000004",
      "email": "anita@bidmandu.com",
      "phone": "9800000014",
      "password": "test1234",
      "is_seller": true,
      "role": "BUYER"
    },
    {
      "id": "b0000000-0000-0000-0000-000000000005",
      "email": "prakash@bidmandu.com",
      "phone": "9800000015",
      "password": "test1234",
      "is_seller": true,
      "role": "BUYER"
    },
    {
      "id": "c0000000-0000-0000-0000-000000000001",
      "email": "buyer1@bidmandu.com",
      "phone": "9800000021",
      "password": "test1234",
      "is_seller": false,
      "role": "BUYER"
    },
    {
      "id": "c0000000-0000-0000-0000-000000000002",
      "email": "buyer2@bidmandu.com",
      "phone": "9800000022",
      "password": "test1234",
      "is_seller": false,
      "role": "BUYER"
    },
  ];

  // ======================== AUCTIONS ========================
  static List<Map<String, dynamic>> auctions = [
    {
      "id": "20000000-0000-0000-0000-000000000001",
      "product": {
        "id": "10000000-0000-0000-0000-000000000001",
        "title": "iPhone 14 Pro Max 128GB",
        "description": "Excellent condition, no scratches, 95% battery health.",
        "category": "Electronics",
        "condition": "Refurbished",
        "image_urls": ["https://picsum.photos/seed/iphone14/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000001",
        "seller": {"is_seller": true}
      },
      "current_price": 122000,
      "start_time": "2026-06-28T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000002",
      "product": {
        "id": "10000000-0000-0000-0000-000000000002",
        "title": "Samsung 55\" QLED 4K Smart TV",
        "description": "Bought 6 months ago, wall mount included.",
        "category": "Electronics",
        "condition": "Mint",
        "image_urls": ["https://picsum.photos/seed/samsungtv/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000001",
        "seller": {"is_seller": true}
      },
      "current_price": 87000,
      "start_time": "2026-06-29T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000003",
      "product": {
        "id": "10000000-0000-0000-0000-000000000003",
        "title": "Sony PlayStation 5 Digital Edition",
        "description": "Hardly used, includes two controllers.",
        "category": "Electronics",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/ps5/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000001",
        "seller": {"is_seller": true}
      },
      "current_price": 57000,
      "start_time": "2026-06-30T12:00:00Z",
      "end_time": "2026-07-10T12:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000004",
      "product": {
        "id": "10000000-0000-0000-0000-000000000004",
        "title": "Leather Jacket – Brando Classic",
        "description": "Genuine leather, size L, worn twice.",
        "category": "Fashion",
        "condition": "Well Used",
        "image_urls": ["https://picsum.photos/seed/leatherjacket/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000002",
        "seller": {"is_seller": true}
      },
      "current_price": 9000,
      "start_time": "2026-06-28T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000005",
      "product": {
        "id": "10000000-0000-0000-0000-000000000005",
        "title": "Nike Air Max 90 – Limited Edition",
        "description": "Brand new, never worn, US size 10.",
        "category": "Fashion",
        "condition": "Mint",
        "image_urls": ["https://picsum.photos/seed/airmax90/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000002",
        "seller": {"is_seller": true}
      },
      "current_price": 16000,
      "start_time": "2026-06-26T00:00:00Z",
      "end_time": "2026-07-10T18:00:00Z",
      "status": "ACTIVE",
      "totalBids": 2,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000006",
      "product": {
        "id": "10000000-0000-0000-0000-000000000006",
        "title": "Ray‑Ban Aviator Sunglasses",
        "description": "Polarized, original case included.",
        "category": "Fashion",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/rayban/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000002",
        "seller": {"is_seller": true}
      },
      "current_price": 6200,
      "start_time": "2026-06-30T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000007",
      "product": {
        "id": "10000000-0000-0000-0000-000000000007",
        "title": "Philips Air Fryer XXL",
        "description": "Used only a few times, all accessories present.",
        "category": "Home & Garden",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/airfryer/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000003",
        "seller": {"is_seller": true}
      },
      "current_price": 9200,
      "start_time": "2026-06-29T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000008",
      "product": {
        "id": "10000000-0000-0000-0000-000000000008",
        "title": "Wooden Dining Table 6‑Seater",
        "description": "Solid sheesham wood, 1 year old.",
        "category": "Home & Garden",
        "condition": "Mint",
        "image_urls": ["https://picsum.photos/seed/diningtable/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000003",
        "seller": {"is_seller": true}
      },
      "current_price": 36000,
      "start_time": "2026-06-25T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000009",
      "product": {
        "id": "10000000-0000-0000-0000-000000000009",
        "title": "Automatic Curtain Opener Robot",
        "description": "Works with Alexa, rarely used.",
        "category": "Home & Garden",
        "condition": "Well Used",
        "image_urls": ["https://picsum.photos/seed/curtainbot/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000003",
        "seller": {"is_seller": true}
      },
      "current_price": 4800,
      "start_time": "2026-06-30T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-00000000000a",
      "product": {
        "id": "10000000-0000-0000-0000-00000000000a",
        "title": "Honda Dio 2022 Scooter",
        "description": "Red color, 8,000 km, first owner.",
        "category": "Vehicles",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/hondadio/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000004",
        "seller": {"is_seller": true}
      },
      "current_price": 148000,
      "start_time": "2026-06-27T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-00000000000b",
      "product": {
        "id": "10000000-0000-0000-0000-00000000000b",
        "title": "Mountain E‑Bike – Haibike SDURO",
        "description": "750Wh battery, very good condition.",
        "category": "Vehicles",
        "condition": "Refurbished",
        "image_urls": ["https://picsum.photos/seed/ebike/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000004",
        "seller": {"is_seller": true}
      },
      "current_price": 100000,
      "start_time": "2026-06-28T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-00000000000c",
      "product": {
        "id": "10000000-0000-0000-0000-00000000000c",
        "title": "Roof Top Tent – Thule Tepui",
        "description": "Sleeps 3, used once, includes annex.",
        "category": "Vehicles",
        "condition": "Mint",
        "image_urls": ["https://picsum.photos/seed/rooftoptent/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000004",
        "seller": {"is_seller": true}
      },
      "current_price": 77000,
      "start_time": "2026-06-29T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-00000000000d",
      "product": {
        "id": "10000000-0000-0000-0000-00000000000d",
        "title": "Trekking Gear Set – Everest Base Camp",
        "description": "Sleeping bag, trekking pole, boots size 42.",
        "category": "Sports & Outdoors",
        "condition": "Mint",
        "image_urls": ["https://picsum.photos/seed/trekking/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000005",
        "seller": {"is_seller": true}
      },
      "current_price": 26000,
      "start_time": "2026-06-30T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 1,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-00000000000e",
      "product": {
        "id": "10000000-0000-0000-0000-00000000000e",
        "title": "Fitness Dumbbell Set 5‑25 kg",
        "description": "Rubber coated, hardly used.",
        "category": "Sports & Outdoors",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/dumbbells/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000005",
        "seller": {"is_seller": true}
      },
      "current_price": 12500,
      "start_time": "2026-06-29T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-00000000000f",
      "product": {
        "id": "10000000-0000-0000-0000-00000000000f",
        "title": "Inflatable Kayak 2‑Person",
        "description": "Includes pump, paddles, storage bag.",
        "category": "Sports & Outdoors",
        "condition": "Well Used",
        "image_urls": ["https://picsum.photos/seed/kayak/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000005",
        "seller": {"is_seller": true}
      },
      "current_price": 23000,
      "start_time": "2026-06-28T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000010",
      "product": {
        "id": "10000000-0000-0000-0000-000000000010",
        "title": "The Alchemist – First Edition",
        "description": "Hardcover, signed by Paulo Coelho.",
        "category": "Books & Media",
        "condition": "Mint",
        "image_urls": ["https://picsum.photos/seed/alchemist/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000001",
        "seller": {"is_seller": true}
      },
      "current_price": 18500,
      "start_time": "2026-06-30T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000011",
      "product": {
        "id": "10000000-0000-0000-0000-000000000011",
        "title": "Complete Harry Potter Box Set",
        "description": "All 7 books, excellent condition.",
        "category": "Books & Media",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/harrypotter/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000002",
        "seller": {"is_seller": true}
      },
      "current_price": 9800,
      "start_time": "2026-06-29T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000012",
      "product": {
        "id": "10000000-0000-0000-0000-000000000012",
        "title": "Nepali Folk Music Vinyl Collection",
        "description": "12 records from 1970s, good condition.",
        "category": "Books & Media",
        "condition": "Well Used",
        "image_urls": ["https://picsum.photos/seed/vinyl/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000003",
        "seller": {"is_seller": true}
      },
      "current_price": 7200,
      "start_time": "2026-06-30T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000013",
      "product": {
        "id": "10000000-0000-0000-0000-000000000013",
        "title": "Lego Technic Porsche 911 RSR",
        "description": "Completed model, all pieces included.",
        "category": "Toys & Kids",
        "condition": "Gently Used",
        "image_urls": ["https://picsum.photos/seed/lego911/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000004",
        "seller": {"is_seller": true}
      },
      "current_price": 18500,
      "start_time": "2026-06-28T00:00:00Z",
      "end_time": "2026-07-10T18:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
    {
      "id": "20000000-0000-0000-0000-000000000014",
      "product": {
        "id": "10000000-0000-0000-0000-000000000014",
        "title": "Remote Control Drone with Camera",
        "description": "4K video, GPS follow, barely used.",
        "category": "Toys & Kids",
        "condition": "Refurbished",
        "image_urls": ["https://picsum.photos/seed/drone/400/300"],
        "seller_id": "b0000000-0000-0000-0000-000000000005",
        "seller": {"is_seller": true}
      },
      "current_price": 36000,
      "start_time": "2026-06-29T00:00:00Z",
      "end_time": "2026-07-10T00:00:00Z",
      "status": "ACTIVE",
      "totalBids": 0,
      "winner_id": null
    },
  ];

  // ======================== TRANSACTIONS ========================
  static List<Map<String, dynamic>> transactions = [
    {
      "id": "txn-mock-1",
      "auction_id": "20000000-0000-0000-0000-000000000001",
      "buyer_id": "c0000000-0000-0000-0000-000000000001",
      "seller_id": "b0000000-0000-0000-0000-000000000001",
      "amount": 122000,
      "payment_ref_code": "PAY-TXN-0001",
      "status": "SETTLED",
      "payout_amount": 115900,
      "created_at": "2026-07-01T00:00:00Z",
      "product": {
        "title": "iPhone 14 Pro Max 128GB",
        "category": "Electronics",
        "image_url": "https://picsum.photos/seed/iphone14/400/300"
      },
      "seller_alias": "BM-B000"
    },
    {
      "id": "txn-mock-2",
      "auction_id": "20000000-0000-0000-0000-000000000005",
      "buyer_id": "c0000000-0000-0000-0000-000000000002",
      "seller_id": "b0000000-0000-0000-0000-000000000002",
      "amount": 16000,
      "payment_ref_code": "PAY-TXN-0002",
      "status": "SETTLED",
      "payout_amount": 15200,
      "created_at": "2026-06-28T00:00:00Z",
      "product": {
        "title": "Nike Air Max 90 – Limited Edition",
        "category": "Fashion",
        "image_url": "https://picsum.photos/seed/airmax90/400/300"
      },
      "seller_alias": "BM-B001"
    },
    {
      "id": "txn-mock-3",
      "auction_id": "20000000-0000-0000-0000-000000000007",
      "buyer_id": "c0000000-0000-0000-0000-000000000001",
      "seller_id": "b0000000-0000-0000-0000-000000000003",
      "amount": 9200,
      "payment_ref_code": "PAY-TXN-0003",
      "status": "CONFIRMED",
      "payout_amount": null,
      "created_at": "2026-06-30T00:00:00Z",
      "product": {
        "title": "Philips Air Fryer XXL",
        "category": "Home & Garden",
        "image_url": "https://picsum.photos/seed/airfryer/400/300"
      },
      "seller_alias": "BM-B002"
    },
    {
      "id": "txn-mock-4",
      "auction_id": "20000000-0000-0000-0000-00000000000a",
      "buyer_id": "c0000000-0000-0000-0000-000000000002",
      "seller_id": "b0000000-0000-0000-0000-000000000004",
      "amount": 148000,
      "payment_ref_code": "PAY-TXN-0004",
      "status": "PAYMENT_VERIFIED",
      "payout_amount": null,
      "created_at": "2026-06-30T12:00:00Z",
      "product": {
        "title": "Honda Dio 2022 Scooter",
        "category": "Vehicles",
        "image_url": "https://picsum.photos/seed/hondadio/400/300"
      },
      "seller_alias": "BM-B003"
    },
    {
      "id": "txn-mock-5",
      "auction_id": "20000000-0000-0000-0000-00000000000d",
      "buyer_id": "c0000000-0000-0000-0000-000000000001",
      "seller_id": "b0000000-0000-0000-0000-000000000005",
      "amount": 26000,
      "payment_ref_code": "PAY-TXN-0005",
      "status": "AWAITING_PAYMENT",
      "payout_amount": null,
      "created_at": "2026-07-01T06:00:00Z",
      "product": {
        "title": "Trekking Gear Set – Everest Base Camp",
        "category": "Sports & Outdoors",
        "image_url": "https://picsum.photos/seed/trekking/400/300"
      },
      "seller_alias": "BM-B004"
    },
    {
      "id": "txn-mock-6",
      "auction_id": "20000000-0000-0000-0000-000000000002",
      "buyer_id": "c0000000-0000-0000-0000-000000000002",
      "seller_id": "b0000000-0000-0000-0000-000000000001",
      "amount": 87000,
      "payment_ref_code": "PAY-TXN-0006",
      "status": "PROOF_SUBMITTED",
      "payout_amount": null,
      "created_at": "2026-07-01T03:00:00Z",
      "product": {
        "title": "Samsung 55\" QLED 4K Smart TV",
        "category": "Electronics",
        "image_url": "https://picsum.photos/seed/samsungtv/400/300"
      },
      "seller_alias": "BM-B000"
    },
  ];

  // ======================== MOCK STATE ========================
  static Map<String, String> userTokens = {};
  static String? currentUserId;
  static List<Map<String, dynamic>> myProducts = [];
  static final Map<String, List<Map<String, dynamic>>> bidsForAuction = {};

  // ======================== HELPERS ========================
  static String generateToken(Map<String, dynamic> user) {
    final payload =
        '${user["id"]}:${user["email"]}:${user["is_seller"]}:${user["role"]}';
    return 'mock-token-$payload';
  }

  static List<Map<String, dynamic>> getBidsForAuction(String auctionId) {
    return bidsForAuction[auctionId] ?? [];
  }

  static void addBid(String auctionId, Map<String, dynamic> bid) {
    bidsForAuction.putIfAbsent(auctionId, () => []);
    bidsForAuction[auctionId]!.add(bid);
  }
}