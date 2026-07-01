import 'package:flutter/material.dart';

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
      backgroundColor: const Color(0xFF1A1A1A),
      child: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Image.asset('assets/logobid.png', height: 50),
                  const SizedBox(width: 12),
                  const Text('Bidmandu',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const Divider(color: Colors.white10),
            ListTile(
              leading: const Icon(Icons.home, color: Colors.white),
              title: const Text('Home', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(context, '/home');
              },
            ),
            if (isLoggedIn) ...[
              ListTile(
                leading: Icon(Icons.add_business,
                    color: isSeller ? Colors.white : const Color(0xFFFDC02F)),
                title: Text(isSeller ? 'List an Item' : 'Start Selling',
                    style: TextStyle(
                        color: isSeller ? Colors.white : const Color(0xFFFDC02F))),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/sell');
                },
              ),
              if (isSeller)
                ListTile(
                  leading: const Icon(Icons.inventory_2, color: Colors.white),
                  title: const Text('My Products',
                      style: TextStyle(color: Colors.white)),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/my_products');
                  },
                ),
              ListTile(
                leading: const Icon(Icons.receipt_long, color: Colors.white),
                title: const Text('Transactions',
                    style: TextStyle(color: Colors.white)),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/transactions');
                },
              ),
              const Divider(color: Colors.white10),
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text('Logout', style: TextStyle(color: Colors.red)),
                onTap: () {
                  Navigator.pop(context);
                  onLogout();
                },
              ),
            ] else ...[
              ListTile(
                leading: const Icon(Icons.login, color: Color(0xFFFDC02F)),
                title: const Text('Login',
                    style: TextStyle(color: Color(0xFFFDC02F))),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/login');
                },
              ),
              ListTile(
                leading: const Icon(Icons.person_add, color: Color(0xFFFDC02F)),
                title: const Text('Register',
                    style: TextStyle(color: Color(0xFFFDC02F))),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/register');
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}