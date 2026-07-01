import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'dart:convert';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  Future<void> _register() async {
    final email = _emailController.text.trim();
    final phone = _phoneController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) return;

    try {
      final res = await ApiService.post('/auth/register', body: {
        'email': email,
        'phone': phone,
        'password': password,
      });
      if (res.statusCode == 201 || res.statusCode == 200) {
        // Auto login
        final loginRes = await ApiService.post('/auth/login', body: {
          'identifier': email,
          'password': password,
        });
        if (loginRes.statusCode == 200) {
          final data = jsonDecode(loginRes.body);
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', data['access_token']);
          Navigator.pushReplacementNamed(context, '/home');
        }
      } else {
        _showError('Registration failed');
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
                  const Text("Create your account", style: TextStyle(color: Colors.white70)),
                  const SizedBox(height: 40),
                  TextField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      filled: true, fillColor: Colors.white,
                      hintText: 'Email',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                  const SizedBox(height: 15),
                  TextField(
                    controller: _phoneController,
                    decoration: InputDecoration(
                      filled: true, fillColor: Colors.white,
                      hintText: 'Phone (optional)',
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
                      onPressed: _register,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFDC02F),
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Register', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Already have an account? Sign In", style: TextStyle(color: Color(0xFFFDC02F))),
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