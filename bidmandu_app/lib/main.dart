import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/sell_screen.dart';
import 'screens/my_products_screen.dart';
import 'screens/transactions_screen.dart';
import 'screens/payment_screen.dart';
import 'screens/auction_detail_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const BidmanduApp());
}

class BidmanduApp extends StatelessWidget {
  const BidmanduApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bidmandu',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF2A2A2A),
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: const Color(0xFFC41E3A),
          secondary: const Color(0xFFFDC02F),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF2A2A2A),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      initialRoute: '/home',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/home': (context) => const HomeScreen(),
        '/sell': (context) => SellScreen(),
        '/my_products': (context) => MyProductsScreen(),
        '/transactions': (context) => TransactionsScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/auction_detail') {
          final auctionId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => AuctionDetailScreen(auctionId: auctionId),
          );
        }
        if (settings.name == '/payment') {
          final txnId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => PaymentScreen(txnId: txnId),
          );
        }
        return null;
      },
    );
  }
}