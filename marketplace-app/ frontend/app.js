// ⚠️ غيّر هذا الرابط بعد نشرك على Render
const API_URL = 'https://YOUR-RENDER-URL.onrender.com';

// تحميل المنتجات في الصفحة الرئيسية
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const loading = document.getElementById('loading');
    const noProducts = document.getElementById('noProducts');
    const count = document.getElementById('productsCount');

    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();

        loading.style.display = 'none';

        if (data.products.length === 0) {
            noProducts.style.display = 'block';
            return;
        }

        count.textContent = `(${data.products.length})`;
        
        grid.innerHTML = data.products.map(product => `
            <div class="product-card">
                ${product.imageUrl ? 
                    `<img src="${API_URL}${product.imageUrl}" alt="${product.name}" class="product-image">` : 
                    `<div class="product-image" style="display: flex; align-items: center; justify-content: center; color: var(--gray);">
                        <i class="fas fa-image" style="font-size: 3rem;"></i>
                     </div>`
                }
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-location">
                        <i class="fas fa-map-marker-alt"></i> ${product.city}
                    </div>
                    <div class="product-price">
                        ${product.price} ${product.currency}
                    </div>
                    <div class="product-seller">
                        <i class="fas fa-user-circle"></i>
                        <span>${product.sellerName}</span>
                        ${product.phone ? `<span style="margin-right: auto; color: var(--success);"><i class="fas fa-phone"></i> ${product.phone}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        loading.innerHTML = `<p style="color: #ef4444;">حدث خطأ في تحميل المنتجات</p>`;
    }
}

// البحث عن منتجات
async function searchProducts() {
    const query = document.getElementById('searchInput').value;
    const city = document.getElementById('cityInput').value;
    const grid = document.getElementById('productsGrid');
    
    try {
        let url = `${API_URL}/api/products/search?`;
        if (query) url += `query=${encodeURIComponent(query)}&`;
        if (city) url += `city=${encodeURIComponent(city)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        document.getElementById('productsCount').textContent = `(${data.count})`;
        
        if (data.products.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray);">لا توجد نتائج للبحث</div>';
            return;
        }

        grid.innerHTML = data.products.map(product => `
            <div class="product-card">
                ${product.imageUrl ? 
                    `<img src="${API_URL}${product.imageUrl}" alt="${product.name}" class="product-image">` : 
                    `<div class="product-image" style="display: flex; align-items: center; justify-content: center; color: var(--gray);">
                        <i class="fas fa-image" style="font-size: 3rem;"></i>
                     </div>`
                }
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-location">
                        <i class="fas fa-map-marker-alt"></i> ${product.city}
                    </div>
                    <div class="product-price">
                        ${product.price} ${product.currency}
                    </div>
                    <div class="product-seller">
                        <i class="fas fa-user-circle"></i>
                        <span>${product.sellerName}</span>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        alert('حدث خطأ في البحث');
    }
}

// معاينة الصورة قبل الرفع
function setupImagePreview() {
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('imagePreview');
    
    if (!input) return;

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// إرسال نموذج البيع
function setupSellForm() {
    const form = document.getElementById('sellForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const successMsg = document.getElementById('successMessage');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';

        const formData = new FormData(form);

        try {
            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                form.style.display = 'none';
                successMsg.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                alert(data.message || 'حدث خطأ');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> نشر المنتج';
            }
        } catch (error) {
            alert('حدث خطأ في الاتصال بالخادم');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> نشر المنتج';
        }
    });
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupImagePreview();
    setupSellForm();
});
