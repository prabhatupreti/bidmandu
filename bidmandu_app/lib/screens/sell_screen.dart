import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import 'dart:io';

class SellScreen extends StatefulWidget {
  const SellScreen({super.key});
  @override
  State<SellScreen> createState() => _SellScreenState();
}

class _SellScreenState extends State<SellScreen> {
  bool isSeller = false;
  bool loadingUser = true;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token != null) {
      try {
        final parts = token.split('.');
        final payload = jsonDecode(utf8.decode(base64.decode(base64.normalize(parts[1]))));
        setState(() { isSeller = payload['is_seller'] == true; });
      } catch (_) {}
    }
    setState(() => loadingUser = false);
  }

  void _onKycSuccess() => setState(() => isSeller = true);

  @override
  Widget build(BuildContext context) {
    if (loadingUser) return Scaffold(appBar: AppBar(title: Text('Loading...')), body: Center(child: CircularProgressIndicator()));
    return Scaffold(
      appBar: AppBar(title: Text(isSeller ? 'List an Item' : 'Seller Verification')),
      body: isSeller ? ProductForm() : KycForm(onSuccess: _onKycSuccess),
    );
  }
}

// ---------- KYC Form ----------
class KycForm extends StatefulWidget {
  final VoidCallback onSuccess;
  const KycForm({super.key, required this.onSuccess});
  @override
  State<KycForm> createState() => _KycFormState();
}

class _KycFormState extends State<KycForm> {
  final _panCtrl = TextEditingController();
  File? _panImage, _selfie, _address;
  final _picker = ImagePicker();
  String? msg;

  Future<void> _submit() async {
    if (_panCtrl.text.isEmpty || _panImage == null || _selfie == null) {
      setState(() => msg = 'PAN number, PAN image, and selfie are required.');
      return;
    }
    try {
      final fields = {'pan_number': _panCtrl.text};
      final files = {
        'pan_image': _panImage!.path,
        'live_selfie': _selfie!.path,
      };
      if (_address != null) files['address_proof'] = _address!.path;
      final res = await ApiService.multipartPost('/kyc/apply', fields, files);
      if (res.statusCode == 201 || res.statusCode == 200) {
        setState(() => msg = 'KYC submitted!');
        widget.onSuccess();
      } else {
        setState(() => msg = 'Submission failed');
      }
    } catch (_) { setState(() => msg = 'Network error'); }
  }

  Future<void> _pickImage(String type) async {
    final file = await _picker.pickImage(source: ImageSource.gallery);
    if (file != null) {
      setState(() {
        if (type == 'pan') _panImage = File(file.path);
        if (type == 'selfie') _selfie = File(file.path);
        if (type == 'address') _address = File(file.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          Text('Complete KYC to start selling', style: TextStyle(fontSize: 16, color: Colors.grey)),
          SizedBox(height: 20),
          TextField(controller: _panCtrl, decoration: InputDecoration(labelText: 'PAN Number', border: OutlineInputBorder())),
          SizedBox(height: 15),
          _buildUpload('PAN Card Image *', _panImage, () => _pickImage('pan')),
          SizedBox(height: 15),
          _buildUpload('Live Selfie *', _selfie, () => _pickImage('selfie')),
          SizedBox(height: 15),
          _buildUpload('Address Proof (optional)', _address, () => _pickImage('address')),
          SizedBox(height: 25),
          ElevatedButton(
            onPressed: _submit,
            style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFFDC02F), foregroundColor: Colors.black, minimumSize: Size(double.infinity, 50)),
            child: Text('Submit KYC'),
          ),
          if (msg != null) Padding(padding: EdgeInsets.only(top: 10), child: Text(msg!)),
        ],
      ),
    );
  }

  Widget _buildUpload(String label, File? file, VoidCallback onTap) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        SizedBox(height: 8),
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: double.infinity,
            height: 120,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(10),
              color: Colors.grey[50],
            ),
            child: file != null
                ? ClipRRect(borderRadius: BorderRadius.circular(10), child: Image.file(file, fit: BoxFit.cover))
                : Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.cloud_upload, size: 40, color: Colors.grey), Text('Tap to upload')])),
          ),
        ),
      ],
    );
  }
}

// ---------- Product Form ----------
class ProductForm extends StatefulWidget {
  @override
  State<ProductForm> createState() => _ProductFormState();
}

class _ProductFormState extends State<ProductForm> {
  final _title = TextEditingController(), _desc = TextEditingController(), _price = TextEditingController();
  String _category = 'Electronics', _condition = 'Gently Used';
  List<File> _images = [];
  final _picker = ImagePicker();
  final _cats = ['Electronics','Fashion','Home & Garden','Vehicles','Sports & Outdoors','Books & Media','Toys & Kids','Other'];
  final _conds = ['Mint','Gently Used','Well Used','Refurbished','For Parts / Not Working'];

  Future<void> _pickImages() async {
    final files = await _picker.pickMultiImage();
    if (files != null) setState(() => _images = files.map((f) => File(f.path)).toList());
  }

  Future<void> _submit() async {
    if (_title.text.isEmpty || _desc.text.isEmpty || _price.text.isEmpty) return;
    try {
      final fields = {
        'title': _title.text, 'description': _desc.text,
        'category': _category, 'condition': _condition,
        'starting_price': _price.text,
      };
      final filesMap = <String, String>{};
      for (int i = 0; i < _images.length && i < 5; i++) {
        filesMap['images'] = _images[i].path;
      }
      final res = await ApiService.multipartPost('/products', fields, filesMap);
      if (res.statusCode == 201 || res.statusCode == 200) {
        final body = await res.stream.bytesToString();
        final data = jsonDecode(body);
        await ApiService.patch('/products/${data['id']}/submit');
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Product submitted!')));
        _title.clear(); _desc.clear(); _price.clear(); setState(() => _images = []);
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(
        children: [
          TextField(controller: _title, decoration: InputDecoration(labelText: 'Title', border: OutlineInputBorder())),
          SizedBox(height: 15),
          TextField(controller: _desc, maxLines: 4, decoration: InputDecoration(labelText: 'Description', border: OutlineInputBorder())),
          SizedBox(height: 15),
          DropdownButtonFormField<String>(value: _category, items: _cats.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(), onChanged: (v) => setState(() => _category = v!), decoration: InputDecoration(labelText: 'Category', border: OutlineInputBorder())),
          SizedBox(height: 15),
          DropdownButtonFormField<String>(value: _condition, items: _conds.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(), onChanged: (v) => setState(() => _condition = v!), decoration: InputDecoration(labelText: 'Condition', border: OutlineInputBorder())),
          SizedBox(height: 15),
          TextField(controller: _price, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: 'Starting Price (Rs.)', border: OutlineInputBorder())),
          SizedBox(height: 15),
          _buildImageUpload(),
          SizedBox(height: 25),
          ElevatedButton(onPressed: _submit, style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFC41E3A), foregroundColor: Colors.white, minimumSize: Size(double.infinity, 50)), child: Text('Submit for Approval')),
        ],
      ),
    );
  }

  Widget _buildImageUpload() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Product Images (up to 5)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        SizedBox(height: 8),
        GestureDetector(
          onTap: _pickImages,
          child: Container(
            width: double.infinity,
            height: 100,
            decoration: BoxDecoration(border: Border.all(color: Colors.grey), borderRadius: BorderRadius.circular(10), color: Colors.grey[50]),
            child: _images.isNotEmpty
                ? SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: _images.map((f) => Padding(padding: EdgeInsets.all(4), child: ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.file(f, width: 80, height: 80, fit: BoxFit.cover)))).toList()))
                : Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.add_photo_alternate, size: 30, color: Colors.grey), Text('Tap to add images')])),
          ),
        ),
      ],
    );
  }
}