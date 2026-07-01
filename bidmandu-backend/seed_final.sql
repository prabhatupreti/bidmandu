-- ============================
-- SYSTEM CONFIG (Static QR)
-- ============================
INSERT INTO system_configs (key, value) VALUES ('STATIC_QR_URL', '/assets/qr.jpg')
ON CONFLICT (key) DO NOTHING;

-- ============================
-- USERS
-- ============================
INSERT INTO users (id, email, phone, password, is_seller, role, created_at, updated_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@bidmandu.com', '9800000001', 'test1234', false, 'ADMIN', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000001', 'sarita@bidmandu.com', '9800000011', 'test1234', true, 'BUYER', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000002', 'ramesh@bidmandu.com', '9800000012', 'test1234', true, 'BUYER', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000003', 'sunit@bidmandu.com', '9800000013', 'test1234', true, 'BUYER', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000004', 'anita@bidmandu.com', '9800000014', 'test1234', true, 'BUYER', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000005', 'prakash@bidmandu.com', '9800000015', 'test1234', true, 'BUYER', NOW(), NOW()),
  ('c0000000-0000-0000-0000-000000000001', 'buyer1@bidmandu.com', '9800000021', 'test1234', false, 'BUYER', NOW(), NOW()),
  ('c0000000-0000-0000-0000-000000000002', 'buyer2@bidmandu.com', '9800000022', 'test1234', false, 'BUYER', NOW(), NOW());

-- ============================
-- KYC APPROVED for all sellers
-- ============================
INSERT INTO seller_verifications (id, user_id, pan_number, pan_image_url, live_selfie_url, status, admin_notes, created_at) VALUES
  (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000001', 'PAN001', '/kyc/pan/dummy.jpg', '/kyc/selfie/dummy.jpg', 'APPROVED', 'OK', NOW()),
  (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000002', 'PAN002', '/kyc/pan/dummy.jpg', '/kyc/selfie/dummy.jpg', 'APPROVED', 'OK', NOW()),
  (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000003', 'PAN003', '/kyc/pan/dummy.jpg', '/kyc/selfie/dummy.jpg', 'APPROVED', 'OK', NOW()),
  (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000004', 'PAN004', '/kyc/pan/dummy.jpg', '/kyc/selfie/dummy.jpg', 'APPROVED', 'OK', NOW()),
  (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000005', 'PAN005', '/kyc/pan/dummy.jpg', '/kyc/selfie/dummy.jpg', 'APPROVED', 'OK', NOW());

-- ============================
-- PRODUCTS (20 items, with category & condition)
-- ============================
INSERT INTO products (id, seller_id, title, description, starting_price, image_urls, admin_approval_status, admin_approved_at, created_at, category, condition) VALUES
  ('10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'iPhone 14 Pro Max 128GB', 'Excellent condition, no scratches, 95% battery health.', 120000, 'https://picsum.photos/seed/iphone14/400/300', 'APPROVED', NOW(), NOW(), 'Electronics', 'Refurbished'),
  ('10000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Samsung 55" QLED 4K Smart TV', 'Bought 6 months ago, wall mount included.', 85000, 'https://picsum.photos/seed/samsungtv/400/300', 'APPROVED', NOW(), NOW(), 'Electronics', 'Mint'),
  ('10000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Sony PlayStation 5 Digital Edition', 'Hardly used, includes two controllers.', 55000, 'https://picsum.photos/seed/ps5/400/300', 'APPROVED', NOW(), NOW(), 'Electronics', 'Gently Used'),
  ('10000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Leather Jacket – Brando Classic', 'Genuine leather, size L, worn twice.', 8500, 'https://picsum.photos/seed/leatherjacket/400/300', 'APPROVED', NOW(), NOW(), 'Fashion', 'Well Used'),
  ('10000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Nike Air Max 90 – Limited Edition', 'Brand new, never worn, US size 10.', 15000, 'https://picsum.photos/seed/airmax90/400/300', 'APPROVED', NOW(), NOW(), 'Fashion', 'Mint'),
  ('10000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'Ray‑Ban Aviator Sunglasses', 'Polarized, original case included.', 6000, 'https://picsum.photos/seed/rayban/400/300', 'APPROVED', NOW(), NOW(), 'Fashion', 'Gently Used'),
  ('10000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003', 'Philips Air Fryer XXL', 'Used only a few times, all accessories present.', 9000, 'https://picsum.photos/seed/airfryer/400/300', 'APPROVED', NOW(), NOW(), 'Home & Garden', 'Gently Used'),
  ('10000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000003', 'Wooden Dining Table 6‑Seater', 'Solid sheesham wood, 1 year old.', 35000, 'https://picsum.photos/seed/diningtable/400/300', 'APPROVED', NOW(), NOW(), 'Home & Garden', 'Mint'),
  ('10000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000003', 'Automatic Curtain Opener Robot', 'Works with Alexa, rarely used.', 4500, 'https://picsum.photos/seed/curtainbot/400/300', 'APPROVED', NOW(), NOW(), 'Home & Garden', 'Well Used'),
  ('10000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-000000000004', 'Honda Dio 2022 Scooter', 'Red color, 8,000 km, first owner.', 145000, 'https://picsum.photos/seed/hondadio/400/300', 'APPROVED', NOW(), NOW(), 'Vehicles', 'Gently Used'),
  ('10000000-0000-0000-0000-00000000000b', 'b0000000-0000-0000-0000-000000000004', 'Mountain E‑Bike – Haibike SDURO', '750Wh battery, very good condition.', 98000, 'https://picsum.photos/seed/ebike/400/300', 'APPROVED', NOW(), NOW(), 'Vehicles', 'Refurbished'),
  ('10000000-0000-0000-0000-00000000000c', 'b0000000-0000-0000-0000-000000000004', 'Roof Top Tent – Thule Tepui', 'Sleeps 3, used once, includes annex.', 75000, 'https://picsum.photos/seed/rooftoptent/400/300', 'APPROVED', NOW(), NOW(), 'Vehicles', 'Mint'),
  ('10000000-0000-0000-0000-00000000000d', 'b0000000-0000-0000-0000-000000000005', 'Trekking Gear Set – Everest Base Camp', 'Sleeping bag, trekking pole, boots size 42.', 25000, 'https://picsum.photos/seed/trekking/400/300', 'APPROVED', NOW(), NOW(), 'Sports & Outdoors', 'Mint'),
  ('10000000-0000-0000-0000-00000000000e', 'b0000000-0000-0000-0000-000000000005', 'Fitness Dumbbell Set 5‑25 kg', 'Rubber coated, hardly used.', 12000, 'https://picsum.photos/seed/dumbbells/400/300', 'APPROVED', NOW(), NOW(), 'Sports & Outdoors', 'Gently Used'),
  ('10000000-0000-0000-0000-00000000000f', 'b0000000-0000-0000-0000-000000000005', 'Inflatable Kayak 2‑Person', 'Includes pump, paddles, storage bag.', 22000, 'https://picsum.photos/seed/kayak/400/300', 'APPROVED', NOW(), NOW(), 'Sports & Outdoors', 'Well Used'),
  ('10000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001', 'The Alchemist – First Edition', 'Hardcover, signed by Paulo Coelho.', 18000, 'https://picsum.photos/seed/alchemist/400/300', 'APPROVED', NOW(), NOW(), 'Books & Media', 'Mint'),
  ('10000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002', 'Complete Harry Potter Box Set', 'All 7 books, excellent condition.', 9500, 'https://picsum.photos/seed/harrypotter/400/300', 'APPROVED', NOW(), NOW(), 'Books & Media', 'Gently Used'),
  ('10000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000003', 'Nepali Folk Music Vinyl Collection', '12 records from 1970s, good condition.', 7000, 'https://picsum.photos/seed/vinyl/400/300', 'APPROVED', NOW(), NOW(), 'Books & Media', 'Well Used'),
  ('10000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000004', 'Lego Technic Porsche 911 RSR', 'Completed model, all pieces included.', 18000, 'https://picsum.photos/seed/lego911/400/300', 'APPROVED', NOW(), NOW(), 'Toys & Kids', 'Gently Used'),
  ('10000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000005', 'Remote Control Drone with Camera', '4K video, GPS follow, barely used.', 35000, 'https://picsum.photos/seed/drone/400/300', 'APPROVED', NOW(), NOW(), 'Toys & Kids', 'Refurbished');

-- ============================
-- AUCTIONS (each product gets an active auction)
-- ============================
INSERT INTO auctions (id, product_id, current_price, start_time, end_time, soft_close_window, extension_count, status) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 122000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '3 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 87000, NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 57000, NOW() - INTERVAL '12 hours', NOW() + INTERVAL '4 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 9000, NOW() - INTERVAL '3 days', NOW() + INTERVAL '2 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 16000, NOW() - INTERVAL '5 days', NOW() + INTERVAL '6 hours', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 6200, NOW() - INTERVAL '1 day', NOW() + INTERVAL '3 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 9200, NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', 36000, NOW() - INTERVAL '6 days', NOW() + INTERVAL '1 day', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', 4800, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', 148000, NOW() - INTERVAL '4 days', NOW() + INTERVAL '2 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b', 100000, NOW() - INTERVAL '3 days', NOW() + INTERVAL '1 day', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-00000000000c', '10000000-0000-0000-0000-00000000000c', 77000, NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-00000000000d', '10000000-0000-0000-0000-00000000000d', 26000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-00000000000e', '10000000-0000-0000-0000-00000000000e', 12500, NOW() - INTERVAL '2 days', NOW() + INTERVAL '4 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-00000000000f', '10000000-0000-0000-0000-00000000000f', 23000, NOW() - INTERVAL '3 days', NOW() + INTERVAL '1 day', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000010', 18500, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000011', 9800, NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', 7200, NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000013', 18500, NOW() - INTERVAL '3 days', NOW() + INTERVAL '6 hours', 120, 0, 'ACTIVE'),
  ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000014', 36000, NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 120, 0, 'ACTIVE');

-- ============================
-- BIDS (a few to show activity)
-- ============================
INSERT INTO bids (id, auction_id, user_id, amount, created_at) VALUES
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 122000, NOW() - INTERVAL '5 hours'),
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 87000, NOW() - INTERVAL '3 hours'),
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 16000, NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 36000, NOW() - INTERVAL '30 minutes');

-- ============================
-- TRANSACTIONS (for demo purchases)
-- ============================
INSERT INTO transactions (id, auction_id, buyer_id, seller_id, amount, payment_ref_code, status, admin_verified_at, buyer_confirmed_at, payout_amount, created_at) VALUES
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 122000, 'PAY-TXN-0001', 'SETTLED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 115900, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 16000, 'PAY-TXN-0002', 'SETTLED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', 15200, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 9200, 'PAY-TXN-0003', 'CONFIRMED', NOW() - INTERVAL '1 day', NULL, NULL, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '20000000-0000-0000-0000-00000000000a', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 148000, 'PAY-TXN-0004', 'PAYMENT_VERIFIED', NOW() - INTERVAL '12 hours', NULL, NULL, NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '20000000-0000-0000-0000-00000000000d', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 26000, 'PAY-TXN-0005', 'AWAITING_PAYMENT', NULL, NULL, NULL, NOW() - INTERVAL '6 hours'),
  (gen_random_uuid(), '20000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 87000, 'PAY-TXN-0006', 'PROOF_SUBMITTED', NULL, NULL, NULL, NOW() - INTERVAL '3 hours');