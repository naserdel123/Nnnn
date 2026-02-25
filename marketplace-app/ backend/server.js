const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// إنشاء مجلد التحميلات
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// تخزين المنتجات في الذاكرة (للتبسيط - يمكن استخدام قاعدة بيانات لاحقاً)
let products = [];

// إعداد Multer لرفع الصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('يجب رفع صورة فقط'));
        }
    }
});

// ========== API Routes ==========

// الحصول على جميع المنتجات
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        count: products.length,
        products: products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
});

// إضافة منتج جديد
app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        const { name, city, price, currency, sellerName, phone } = req.body;
        
        if (!name || !city || !price || !currency || !sellerName) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const product = {
            id: uuidv4(),
            name,
            city,
            price: parseFloat(price),
            currency,
            sellerName,
            phone: phone || '',
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: new Date().toISOString()
        };

        products.push(product);

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنتج بنجاح',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// حذف منتج
app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'المنتج غير موجود'
        });
    }
    
    products.splice(index, 1);
    res.json({
        success: true,
        message: 'تم حذف المنتج'
    });
});

// البحث في المنتجات
app.get('/api/products/search', (req, res) => {
    const { city, query } = req.query;
    let results = products;

    if (city) {
        results = results.filter(p => 
            p.city.toLowerCase().includes(city.toLowerCase())
        );
    }

    if (query) {
        results = results.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    res.json({
        success: true,
        count: results.length,
        products: results
    });
});

// صحة التطبيق
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
  
