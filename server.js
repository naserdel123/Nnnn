const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// In-memory database
let products = [
    { id: 1, name: 'iPhone 14 Pro Max', price: 4500, currency: 'ريال سعودي', city: 'الرياض', description: 'جديد مع الضمان سنة كاملة', facebookLink: 'https://facebook.com/seller1', imageUrl: null, createdAt: new Date() },
    { id: 2, name: 'MacBook Pro M2', price: 6000, currency: 'درهم إماراتي', city: 'دبي', description: 'مستعمل شهر واحد فقط، نظيف جداً', facebookLink: '', imageUrl: null, createdAt: new Date() },
    { id: 3, name: 'PlayStation 5', price: 2500, currency: 'دينار كويتي', city: 'الكويت', description: 'مع يدين إضافية و3 ألعاب', facebookLink: 'https://facebook.com/gamerkw', imageUrl: null, createdAt: new Date() },
    { id: 4, name: 'Samsung Galaxy S23', price: 3200, currency: 'ريال سعودي', city: 'جدة', description: 'لون أسود، ذاكرة 256GB', facebookLink: 'https://facebook.com/techstore', imageUrl: null, createdAt: new Date() },
    { id: 5, name: 'iPad Air 5', price: 2800, currency: 'جنيه مصري', city: 'القاهرة', description: 'مع قلم آبل وكفر حماية', facebookLink: '', imageUrl: null, createdAt: new Date() }
];
let nextId = 6;

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// 🏠 الصفحة الرئيسية الكاملة - كل شيء هنا!
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سوقنا - تسوق وبيع بكل سهولة</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #ec4899;
            --accent: #06b6d4;
            --dark: #0f172a;
            --light: #f8fafc;
            --gray: #64748b;
            --glass: rgba(255, 255, 255, 0.1);
            --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Tajawal', sans-serif; }
        body {
            background: var(--dark);
            color: var(--light);
            overflow-x: hidden;
            line-height: 1.6;
        }
        .bg-animation {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1;
            overflow: hidden;
        }
        .bg-circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            animation: float 20s infinite ease-in-out;
        }
        .bg-circle:nth-child(1) { width: 600px; height: 600px; background: var(--primary); top: -200px; right: -200px; }
        .bg-circle:nth-child(2) { width: 500px; height: 500px; background: var(--secondary); bottom: -150px; left: -150px; animation-delay: 5s; }
        .bg-circle:nth-child(3) { width: 400px; height: 400px; background: var(--accent); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 10s; }
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .navbar {
            position: fixed;
            top: 0; width: 100%;
            padding: 1rem 0;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--glass);
            z-index: 1000;
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a {
            color: var(--light);
            text-decoration: none;
            font-weight: 500;
            position: relative;
            padding: 0.5rem 0;
            cursor: pointer;
            transition: all 0.3s;
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0; right: 0;
            width: 0; height: 2px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s;
        }
        .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
        .nav-links a:hover { color: var(--primary); }
        .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 8rem 2rem 4rem;
        }
        .glitch {
            font-size: 6rem;
            font-weight: 900;
            position: relative;
            text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
            animation: glitch 725ms infinite;
        }
        @keyframes glitch {
            0% { text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00; }
            15% { text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00; }
            16% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; }
            49% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; }
            50% { text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00; }
            99% { text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00; }
            100% { text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff, -0.04em -0.025em 0 #fffc00; }
        }
        .hero-subtitle { font-size: 1.5rem; color: var(--gray); margin: 1rem 0; }
        .hero-desc { font-size: 1.1rem; color: var(--gray); margin-bottom: 2rem; }
        .hero-buttons { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; justify-content: center; }
        .btn {
            position: relative;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
        .btn-secondary {
            background: transparent;
            color: var(--light);
            border: 2px solid var(--primary);
        }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(99, 102, 241, 0.5); }
        .hero-stats {
            display: flex;
            gap: 2rem;
            margin-top: 4rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        .stat-card {
            background: var(--glass);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            text-align: center;
            min-width: 150px;
            transition: transform 0.3s;
        }
        .stat-card:hover { transform: translateY(-10px); }
        .stat-card i {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        .stat-card h3 { font-size: 2rem; font-weight: 800; }
        .stat-card p { color: var(--gray); font-size: 0.9rem; }
        .section { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; display: none; }
        .section.active { display: block; }
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            background: var(--glass);
            padding: 1.5rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .filters input, .filters select {
            padding: 1rem 1.5rem;
            border: 2px solid var(--glass);
            border-radius: 50px;
            background: rgba(255,255,255,0.05);
            color: var(--light);
            font-size: 1rem;
            flex: 1;
            min-width: 200px;
            transition: all 0.3s;
        }
        .filters input:focus, .filters select:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255,255,255,0.1);
        }
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }
        .product-card {
            background: var(--glass);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s;
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .product-card:hover { transform: translateY(-10px); box-shadow: var(--shadow); }
        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: rgba(255,255,255,0.3);
        }
        .product-info { padding: 1.5rem; }
        .product-title { font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--light); }
        .product-price {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        .product-location {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gray);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        .product-date {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gray);
            font-size: 0.8rem;
            margin-bottom: 1rem;
        }
        .product-location i, .product-date i { color: var(--accent); }
        .product-description {
            color: var(--gray);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        .product-actions { display: flex; gap: 0.5rem; }
        .btn-small { padding: 0.6rem 1.2rem; font-size: 0.9rem; }
        .sell-form {
            background: var(--glass);
            backdrop-filter: blur(10px);
            padding: 2.5rem;
            border-radius: 30px;
            border: 1px solid rgba(255,255,255,0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--light);
        }
        .form-group label i { margin-left: 0.5rem; color: var(--primary); }
        .form-group input, .form-group textarea, .form-group select {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--glass);
            border-radius: 15px;
            background: rgba(255,255,255,0.05);
            color: var(--light);
            font-size: 1rem;
            transition: all 0.3s;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(255,255,255,0.1);
        }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .image-upload {
            border: 2px dashed var(--primary);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            background: rgba(99, 102, 241, 0.05);
        }
        .image-upload:hover { background: rgba(99, 102, 241, 0.1); transform: scale(1.02); }
        .image-preview { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--gray); }
        .image-preview i { font-size: 3rem; color: var(--primary); }
        .image-preview img { max-width: 100%; max-height: 200px; border-radius: 10px; }
        .hidden { display: none !important; }
        .success-message {
            text-align: center;
            padding: 3rem;
            background: var(--glass);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .success-message i { font-size: 5rem; color: #10b981; margin-bottom: 1rem; }
        .success-message h3 { font-size: 1.8rem; margin-bottom: 1rem; color: var(--light); }
        .success-message p { color: var(--gray); margin-bottom: 1.5rem; }
        .loading {
            text-align: center;
            padding: 3rem;
            color: var(--gray);
        }
        .loading i { font-size: 3rem; color: var(--primary); animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .no-results {
            text-align: center;
            padding: 3rem;
            color: var(--gray);
            grid-column: 1 / -1;
        }
        .no-results i { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        .feature-card {
            background: var(--glass);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            text-align: center;
            transition: all 0.3s;
        }
        .feature-card:hover { transform: translateY(-10px); }
        .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 2000;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }
        .modal.active { display: flex; }
        .modal-content {
            background: var(--dark);
            border-radius: 30px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            border: 1px solid var(--glass);
            box-shadow: var(--shadow);
        }
        .close-btn {
            position: absolute;
            top: 1rem; left: 1rem;
            font-size: 2rem;
            color: var(--gray);
            cursor: pointer;
            z-index: 10;
            width: 40px; height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.1); color: var(--light); }
        @media (max-width: 768px) {
            .glitch { font-size: 3rem; }
            .form-row { grid-template-columns: 1fr; }
            .hero-stats { gap: 1rem; }
            .stat-card { padding: 1.5rem; min-width: 120px; }
            .filters { flex-direction: column; }
            .products-grid { grid-template-columns: 1fr; }
        }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: var(--dark); }
        ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--primary-dark); }
    </style>
</head>
<body>
    <div class="bg-animation">
        <div class="bg-circle"></div>
        <div class="bg-circle"></div>
        <div class="bg-circle"></div>
    </div>

    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <i class="fas fa-store"></i>
                <span>سوقنا</span>
            </div>
            <div class="nav-links">
                <a onclick="showSection('home')" class="active" id="nav-home">الرئيسية</a>
                <a onclick="showSection('buy')" id="nav-buy">الشراء</a>
                <a onclick="showSection('sell')" id="nav-sell">البيع</a>
            </div>
        </div>
    </nav>

    <!-- HOME SECTION -->
    <section id="home" class="section active">
        <div class="hero">
            <h1 class="glitch">سوقنا</h1>
            <p class="hero-subtitle">منصتك الأولى للتجارة الإلكترونية في كل المدن</p>
            <p class="hero-desc">اشتري وبيع بكل سهولة، دعم جميع العملات، واجهة عصرية</p>
            
            <div class="hero-buttons">
                <a onclick="showSection('buy')" class="btn btn-primary">
                    <i class="fas fa-shopping-cart"></i>
                    <span>تسوق الآن</span>
                </a>
                <a onclick="showSection('sell')" class="btn btn-secondary">
                    <i class="fas fa-plus-circle"></i>
                    <span>اعرض منتجك</span>
                </
