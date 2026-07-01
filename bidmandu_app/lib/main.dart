import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/sell_screen.dart';
import 'screens/my_products_screen.dart';
import 'screens/transactions_screen.dart';
import 'screens/auction_detail_screen.dart';
import 'screens/payment_screen.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
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
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF1A1A1A),
        scaffoldBackgroundColor: const Color(0xFF121212),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1A1A1A),
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: true,
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFC41E3A),
          secondary: Color(0xFFFDC02F),
          surface: Color(0xFF1E1E1E),
          onSurface: Colors.white,
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme)
            .apply(bodyColor: Colors.white, displayColor: Colors.white),
        cardTheme: CardThemeData(
          color: const Color(0xFF1E1E1E),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Colors.white10, width: 1),
          ),
          elevation: 4,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF242424),
          labelStyle: const TextStyle(color: Colors.white54),
          floatingLabelStyle: const TextStyle(color: Color(0xFFC41E3A)),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFFC41E3A), width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        ),
        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: Color(0xFF1E1E1E),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
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