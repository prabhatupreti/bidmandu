import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000'; // Android emulator → localhost

  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  static Future<http.Response> get(String path) async {
    final headers = await _getHeaders();
    return http.get(Uri.parse('$baseUrl$path'), headers: headers);
  }

  static Future<http.Response> post(String path, {Map<String, dynamic>? body}) async {
    final headers = await _getHeaders();
    return http.post(Uri.parse('$baseUrl$path'),
        headers: headers, body: body != null ? jsonEncode(body) : null);
  }

  static Future<http.Response> patch(String path, {Map<String, dynamic>? body}) async {
    final headers = await _getHeaders();
    return http.patch(Uri.parse('$baseUrl$path'),
        headers: headers, body: body != null ? jsonEncode(body) : null);
  }

  static Future<http.StreamedResponse> multipartPost(
      String path, Map<String, String> fields, Map<String, String> files) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token') ?? '';
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl$path'));
    request.headers['Authorization'] = 'Bearer $token';
    request.fields.addAll(fields);
    for (final entry in files.entries) {
      request.files.add(await http.MultipartFile.fromPath(entry.key, entry.value));
    }
    return request.send();
  }
}