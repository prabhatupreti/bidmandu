import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
    if (loadingUser)
      return Scaffold(
          appBar: AppBar(title: const Text('Loading...')),
          body: const Center(child: CircularProgressIndicator()));
    return Scaffold(
      backgroundColor: const Color(0xFF121214),
      appBar: AppBar(
        backgroundColor: const Color(0xFF121214),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          isSeller ? 'List an Item' : 'Seller Verification',
          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: isSeller ? const ProductForm() : KycForm(onSuccess: _onKycSuccess),
      ),
    );
  }
}

// ---------- KYC Form (themed) ----------
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
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildThemeTextField(label: 'PAN Number', ctrl: _panCtrl),
          const SizedBox(height: 18),
          _buildDropzone('PAN Card Image *', _panImage, () => _pickImage('pan')),
          const SizedBox(height: 18),
          _buildDropzone('Live Selfie *', _selfie, () => _pickImage('selfie')),
          const SizedBox(height: 18),
          _buildDropzone('Address Proof (optional)', _address, () => _pickImage('address')),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFDC02F),
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 4,
              ),
              child: const Text('Submit KYC', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ),
          if (msg != null) Padding(padding: const EdgeInsets.only(top: 10), child: Text(msg!, style: const TextStyle(color: Colors.red))),
        ],
      ),
    );
  }

  Widget _buildThemeTextField({required String label, required TextEditingController ctrl}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1E1E24),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.05)),
          ),
          child: TextField(
            controller: ctrl,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropzone(String label, File? file, VoidCallback onTap) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () { HapticFeedback.lightImpact(); onTap(); },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: double.infinity,
            height: 130,
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E24),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: file != null ? const Color(0xFFC41E3A) : Colors.white.withOpacity(0.1)),
            ),
            child: file != null
                ? Stack(
                    fit: StackFit.expand,
                    children: [
                      ClipRRect(borderRadius: BorderRadius.circular(16), child: Image.file(file, fit: BoxFit.cover)),
                      Positioned(
                        top: 8, right: 8,
                        child: GestureDetector(
                          onTap: () => setState(() {
                            if (label.contains('PAN')) _panImage = null;
                            if (label.contains('Selfie')) _selfie = null;
                            if (label.contains('Address')) _address = null;
                          }),
                          child: Container(
                            decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.black54),
                            child: const Icon(Icons.close, size: 18, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  )
                : Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.cloud_upload_outlined, color: const Color(0xFFC41E3A).withOpacity(0.8), size: 36),
                        const SizedBox(height: 12),
                        const Text("Tap to attach image", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500)),
                        const SizedBox(height: 4),
                        Text("PNG, JPG up to 10MB", style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12)),
                      ],
                    ),
                  ),
          ),
        ),
      ],
    );
  }
}

// ---------- Product Form (themed with fixed horizontal selectors) ----------
class ProductForm extends StatefulWidget {
  const ProductForm({super.key});

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
      for (int i = 0; i < _images.length && i < 5; i++) { filesMap['images'] = _images[i].path; }
      final res = await ApiService.multipartPost('/products', fields, filesMap);
      if (res.statusCode == 201 || res.statusCode == 200) {
        final body = await res.stream.bytesToString();
        final data = jsonDecode(body);
        await ApiService.patch('/products/${data['id']}/submit');
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Product submitted!')));
        _title.clear(); _desc.clear(); _price.clear(); setState(() => _images = []);
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildThemeTextField(label: "Title", ctrl: _title, placeholder: "Name your premium listing product"),
          const SizedBox(height: 18),
          _buildThemeTextField(label: "Description", ctrl: _desc, placeholder: "Provide comprehensive item conditions", maxLines: 4),
          const SizedBox(height: 18),
          // FIXED: Symmetrical horizontal pair
          Row(
            children: [
              Expanded(flex: 1, child: _buildTactileDropdownSelector(label: "Category", activeValue: _category, items: _cats, onSelect: (v) => setState(() => _category = v))),
              const SizedBox(width: 16),
              Expanded(flex: 1, child: _buildTactileDropdownSelector(label: "Condition", activeValue: _condition, items: _conds, onSelect: (v) => setState(() => _condition = v))),
            ],
          ),
          const SizedBox(height: 18),
          _buildThemeTextField(label: "Starting Price (Rs.)", ctrl: _price, placeholder: "e.g., 25000", keyboardType: TextInputType.number),
          const SizedBox(height: 24),
          // Image dropzone
          const Text("Product Images (up to 5)", style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () { HapticFeedback.lightImpact(); _pickImages(); },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: double.infinity,
              height: _images.isNotEmpty ? 110 : 140,
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E24),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _images.isNotEmpty ? const Color(0xFFC41E3A) : Colors.white.withOpacity(0.1)),
              ),
              child: _images.isNotEmpty
                  ? ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _images.length,
                      itemBuilder: (_, i) => Stack(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8),
                            child: ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.file(_images[i], width: 90, height: 90, fit: BoxFit.cover)),
                          ),
                          Positioned(
                            top: 2, right: 2,
                            child: GestureDetector(
                              onTap: () => setState(() => _images.removeAt(i)),
                              child: Container(
                                decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.black54),
                                child: const Icon(Icons.close, size: 16, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  : Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.cloud_upload_outlined, color: const Color(0xFFC41E3A).withOpacity(0.8), size: 36),
                        const SizedBox(height: 12),
                        const Text("Tap to add high-fidelity images", style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500)),
                        const SizedBox(height: 4),
                        Text("PNG, JPG up to 10MB each", style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12)),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 40),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFC41E3A),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 4,
                shadowColor: const Color(0xFFC41E3A).withOpacity(0.3),
              ),
              child: const Text("Publish Auction Lot", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThemeTextField({required String label, required TextEditingController ctrl, String placeholder = '', int maxLines = 1, TextInputType keyboardType = TextInputType.text}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1E1E24),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.05)),
          ),
          child: TextField(
            controller: ctrl,
            maxLines: maxLines,
            keyboardType: keyboardType,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 14),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTactileDropdownSelector({required String label, required String activeValue, required List<String> items, required Function(String) onSelect}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () {
            HapticFeedback.lightImpact();
            showModalBottomSheet(
              context: context,
              backgroundColor: const Color(0xFF1E1E24),
              shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
              builder: (_) => ListView(
                shrinkWrap: true,
                children: items.map((e) => ListTile(
                  title: Text(e, style: const TextStyle(color: Colors.white)),
                  trailing: e == activeValue ? const Icon(Icons.check, color: Color(0xFFC41E3A)) : null,
                  onTap: () { onSelect(e); Navigator.pop(context); },
                )).toList(),
              ),
            );
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E24),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(activeValue, style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w500)),
                Icon(Icons.keyboard_arrow_down_rounded, color: Colors.white.withOpacity(0.6), size: 20),
              ],
            ),
          ),
        ),
      ],
    );
  }
}