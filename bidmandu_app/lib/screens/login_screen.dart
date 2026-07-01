import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();

  Future<void> _login() async {
    final identifier = _identifierController.text.trim();
    final password = _passwordController.text.trim();
    if (identifier.isEmpty || password.isEmpty) return;

    try {
      final res = await ApiService.post('/auth/login', body: {
        'identifier': identifier,
        'password': password,
      });
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['access_token']);
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        _showError('Login failed');
      }
    } catch (e) {
      _showError('Network error');
    }
  }

  void _showError(String msg) {
    showDialog(context: context, builder: (_) => AlertDialog(title: Text('Error'), content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset('assets/logobid.png', fit: BoxFit.cover, color: Colors.black54, colorBlendMode: BlendMode.darken),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(30),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('assets/logobid.png', width: 100),
                  const SizedBox(height: 10),
                  const Text('Bidmandu', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
                  const Text("Nepal's Premier C2C Bidding Platform", style: TextStyle(color: Colors.white70)),
                  const SizedBox(height: 40),
                  TextField(
                    controller: _identifierController,
                    decoration: InputDecoration(
                      filled: true, fillColor: Colors.white,
                      hintText: 'Email or phone',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 15),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      filled: true, fillColor: Colors.white,
                      hintText: 'Password',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _login,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFC41E3A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/register'),
                    child: const Text("Don't have an account? Register", style: TextStyle(color: Color(0xFFFDC02F))),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}