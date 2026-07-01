import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class AppDrawer extends StatelessWidget {
  final bool isLoggedIn;
  final bool isSeller;
  final VoidCallback onLogout;

  const AppDrawer({
    super.key,
    required this.isLoggedIn,
    required this.isSeller,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Color(0xFF2A2A2A),
      child: SafeArea(
        child: Column(
          children: [
            // Brand header
            Container(
              padding: EdgeInsets.all(20),
              child: Row(
                children: [
                  Image.asset('assets/logobid.png', height: 50),
                  SizedBox(width: 12),
                  Text('Bidmandu', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            Divider(color: Colors.white24),
            // Navigation items
            ListTile(
              leading: Icon(Icons.home, color: Colors.white),
              title: Text('Home', style: TextStyle(color: Colors.white)),
              onTap: () { Navigator.pop(context); Navigator.pushReplacementNamed(context, '/home'); },
            ),
            if (isLoggedIn) ...[
              ListTile(
                leading: Icon(Icons.add_business, color: Colors.white),
                title: Text(isSeller ? 'List an Item' : 'Start Selling', style: TextStyle(color: Colors.white)),
                onTap: () { Navigator.pop(context); Navigator.pushNamed(context, '/sell'); },
              ),
              if (isSeller)
                ListTile(
                  leading: Icon(Icons.inventory_2, color: Colors.white),
                  title: Text('My Products', style: TextStyle(color: Colors.white)),
                  onTap: () { Navigator.pop(context); Navigator.pushNamed(context, '/my_products'); },
                ),
              ListTile(
                leading: Icon(Icons.receipt_long, color: Colors.white),
                title: Text('Transactions', style: TextStyle(color: Colors.white)),
                onTap: () { Navigator.pop(context); Navigator.pushNamed(context, '/transactions'); },
              ),
              Divider(color: Colors.white24),
              ListTile(
                leading: Icon(Icons.logout, color: Colors.red),
                title: Text('Logout', style: TextStyle(color: Colors.red)),
                onTap: () { Navigator.pop(context); onLogout(); },
              ),
            ] else ...[
              ListTile(
                leading: Icon(Icons.login, color: Color(0xFFFDC02F)),
                title: Text('Login', style: TextStyle(color: Color(0xFFFDC02F))),
                onTap: () { Navigator.pop(context); Navigator.pushNamed(context, '/login'); },
              ),
              ListTile(
                leading: Icon(Icons.person_add, color: Color(0xFFFDC02F)),
                title: Text('Register', style: TextStyle(color: Color(0xFFFDC02F))),
                onTap: () { Navigator.pop(context); Navigator.pushNamed(context, '/register'); },
              ),
            ],
          ],
        ),
      ),
    );
  }
}