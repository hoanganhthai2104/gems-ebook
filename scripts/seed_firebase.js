const fs = require('fs');
const path = require('path');

const FIREBASE_API_KEY = "AIzaSyBqYwumJNkRogUIjCY965OQQv28nGeHI_o";
const PROJECT_ID = "gems-ebook";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (typeof val === 'number') {
        if (Number.isInteger(val)) return { integerValue: String(val) };
        return { doubleValue: val };
    }
    if (typeof val === 'string') return { stringValue: val };
    if (Array.isArray(val)) {
        return { arrayValue: { values: val.map(toFirestoreValue) } };
    }
    if (typeof val === 'object') {
        const fields = {};
        for (const [k, v] of Object.entries(val)) {
            fields[k] = toFirestoreValue(v);
        }
        return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
}

async function uploadDocument(collectionId, docId, dataObject) {
    const fields = {};
    for (const [k, v] of Object.entries(dataObject)) {
        fields[k] = toFirestoreValue(v);
    }

    const url = `${BASE_URL}/${collectionId}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to upload ${collectionId}/${docId}: ${response.status} ${errText}`);
    }
    return response.json();
}

// Generate 100+ Products Programmatically
function generateHundredsOfProducts() {
    const baseItems = [
        { name: "Ống Nghe Y Tế Littmann Classic III Chính Hãng", cat: "Thiết bị y tế", price: 3450000, orig: 3900000, img: "assets/shop/bp_monitor.png" },
        { name: "Thái Nhân Sâm Dược Liệu Quý GEMS 500g", cat: "Dược liệu", price: 1250000, orig: 1500000, img: "assets/shop/artichoke_resin.png" },
        { name: "Cẩm Nang Bào Chế Dược Phẩm Chuyên Khoa", cat: "Sách Y Học", price: 450000, orig: 550000, img: "assets/shop/book.png" },
        { name: "Máy Đo Huyết Áp Bắp Tay Omron HEM-7121", cat: "Thiết bị y tế", price: 1150000, orig: 1350000, img: "assets/shop/bp_monitor.png" },
        { name: "Nhiệt Kế Hồng Ngoại Đo Trán Microlife NC200", cat: "Thiết bị y tế", price: 890000, orig: 1050000, img: "assets/shop/infrared_thermometer.png" },
        { name: "Máy Đo Nồng Độ Oxy Trong Máu SpO2 Fingertip", cat: "Thiết bị y tế", price: 550000, orig: 680000, img: "assets/shop/stopwatch.png" },
        { name: "Trà Thảo Mộc Thang Thận Bổ Khí GEMS 250g", cat: "Dược liệu", price: 320000, orig: 400000, img: "assets/shop/lotus_tea.png" },
        { name: "Cao Đinh Lăng Chuẩn Hóa Nguyên Chất 100g", cat: "Dược liệu", price: 480000, orig: 600000, img: "assets/shop/artichoke_resin.png" },
        { name: "Nấm Linh Chi Đỏ Hữu Cơ Thái Nhân Sâm 200g", cat: "Dược liệu", price: 1850000, orig: 2200000, img: "assets/shop/artichoke_resin.png" },
        { name: "Mô Hình Giải Phẫu Cơ Thể Người 3D 85cm", cat: "Dụng cụ học tập", price: 2450000, orig: 2900000, img: "assets/shop/wooden_toy.png" },
        { name: "Bộ Thẻ Flashcard Thuật Ngữ Y Khoa 500 Từ", cat: "Dụng cụ học tập", price: 290000, orig: 350000, img: "assets/shop/gelpen.png" },
        { name: "Sổ Tay Hướng Dẫn Thuốc Lâm Sàng 2026", cat: "Sách Y Học", price: 380000, orig: 450000, img: "assets/shop/book.png" },
        { name: "Kem Chống Nắng D'Alba Nâng Tone SPF50+", cat: "Mỹ phẩm & Chăm sóc", price: 489000, orig: 815000, img: "assets/shop/dalba_sunscreen.png" },
        { name: "Tinh Chất Cấp Nước Torriden Dive-In Serum 50ml", cat: "Mỹ phẩm & Chăm sóc", price: 148920, orig: 292000, img: "assets/shop/torriden_serum.png" },
        { name: "Má Hồng Dạng Kem Sace Lady Lâu Trôi", cat: "Mỹ phẩm & Chăm sóc", price: 56520, orig: 157000, img: "assets/shop/sace_lady_blush.png" },
        { name: "Nước Tẩy Trang Micellar Cosnori Sạch Sâu", cat: "Mỹ phẩm & Chăm sóc", price: 210000, orig: 280000, img: "assets/shop/cosnori_remover.png" },
        { name: "Kem Dưỡng Sáng Da Olay Regenerist 50g", cat: "Mỹ phẩm & Chăm sóc", price: 380000, orig: 490000, img: "assets/shop/olay_cream.png" },
        { name: "Nước Hoa Unisex LIMES Essential Eau De Parfum 50ml", cat: "Mỹ phẩm & Chăm sóc", price: 650000, orig: 850000, img: "assets/shop/perfume_bottle.png" },
        { name: "Đồng Hồ Thông Minh LIMES Watch Pro Fit", cat: "Thiết bị công nghệ", price: 1250000, orig: 1650000, img: "assets/shop/smartwatch.png" },
        { name: "Tai Nghe Bluetooth Chống Ồn Active ANC X1", cat: "Thiết bị công nghệ", price: 890000, orig: 1200000, img: "assets/shop/headphones_black.png" },
        { name: "Củ Sạc Nhanh Ugreen GaN 65W 3 Cổng Type-C", cat: "Thiết bị công nghệ", price: 374000, orig: 680000, img: "assets/shop/ugreen_charger.png" },
        { name: "Bàn Phím Cơ Không Dây LIMES Tactile Switch", cat: "Thiết bị công nghệ", price: 790000, orig: 990000, img: "assets/shop/keyboard.png" },
        { name: "Ốp Lưng Từ Tính MagSafe Nhám Mờ Chống Bẩn", cat: "Thiết bị công nghệ", price: 150000, orig: 220000, img: "assets/shop/magnetic_phone_case.png" },
        { name: "Ấm Siêu Tốc Inox 304 Cảm Biến Nhiệt 1.8L", cat: "Đồ gia dụng", price: 420000, orig: 550000, img: "assets/shop/electric_kettle.png" },
        { name: "Đèn Học Chống Cận Thị LIMES LED Eye-Care", cat: "Đồ gia dụng", price: 350000, orig: 450000, img: "assets/shop/desklamp.png" },
        { name: "Bình Giữ Nhiệt Thép Không Gỉ FJ Thermos 750ml", cat: "Đồ gia dụng", price: 290000, orig: 390000, img: "assets/shop/fj_thermos.png" },
        { name: "Ấm Trà Gốm Sứ Bát Tràng Men Hỏa Biến", cat: "Đồ gia dụng", price: 580000, orig: 750000, img: "assets/shop/battrang_teapot.png" },
        { name: "Tủ Quần Áo Vải Khung Thép 3 Buồng LEEGO", cat: "Đồ gia dụng", price: 294680, orig: 556000, img: "assets/shop/leego_wardrobe.png" },
        { name: "Bộ Nồi Chảo Chống Dính Vân Đá Y Tế Cookware", cat: "Đồ gia dụng", price: 850000, orig: 1100000, img: "assets/shop/cookware.png" },
        { name: "Áo Hoodies Nỉ Bông GEMS Oversized Unisex", cat: "Thời trang y tế", price: 350000, orig: 480000, img: "assets/shop/hoodie_black.png" },
        { name: "Giày Sneaker Thể Thao Đệm Khí LIMES Runner", cat: "Thời trang y tế", price: 690000, orig: 950000, img: "assets/shop/sneaker_premium.png" },
        { name: "Áo Thun Cotton 100% LIMES Medical Alumni", cat: "Thời trang y tế", price: 180000, orig: 250000, img: "assets/shop/tshirt_cotton.png" },
        { name: "Balo Chuyên Dụng Bác Sĩ Chống Nước LIMES Doctor", cat: "Thời trang y tế", price: 490000, orig: 650000, img: "assets/shop/backpack.png" },
        { name: "Vòng Tay Bạc S925 Y Học Biểu Tượng Caduceus", cat: "Trang sức & Quà tặng", price: 420000, orig: 580000, img: "assets/shop/silver_bracelet.png" },
        { name: "Mật Hoa Dừa Sokfarm Hữu Cơ 250g", cat: "Nông sản & Thực phẩm", price: 180000, orig: 220000, img: "assets/shop/honey_sokfarm.png" },
        { name: "Trà Sen Tây Hồ Chưng Sấy Truyền Thống 100g", cat: "Nông sản & Thực phẩm", price: 450000, orig: 550000, img: "assets/shop/lotus_tea.png" },
        { name: "Cà Phê Hạt Robusta Thượng Hạng Đắk Lắk 500g", cat: "Nông sản & Thực phẩm", price: 210000, orig: 260000, img: "assets/shop/coffee_beans.png" },
        { name: "Tinh Dầu Tràm Huế Nguyên Chất GEMS 50ml", cat: "Dược liệu", price: 260000, orig: 320000, img: "assets/shop/essential_oil_hue.png" },
        { name: "Sữa Bột Dinh Dưỡng Phục Hồi Y Tế Nutifood 900g", cat: "Nông sản & Thực phẩm", price: 480000, orig: 560000, img: "assets/shop/milk_powder.png" },
        { name: "Thảm Tập Yoga TPE 2 Lớp Định Tuyến Chống Trượt", cat: "Thể thao & Sức khỏe", price: 320000, orig: 420000, img: "assets/shop/yoga_mat.png" },
        { name: "Tạ Đơn Bọc Cao Su LIMES Rubber Dumbbell 5kg", cat: "Thể thao & Sức khỏe", price: 250000, orig: 320000, img: "assets/shop/dumbbell.png" },
        { name: "Dây Tập Kháng Lực Đa Năng Resistance Band Set", cat: "Thể thao & Sức khỏe", price: 190000, orig: 250000, img: "assets/shop/resistance_band.png" },
        { name: "Bóng Rổ Thể Thao Molten Chống Mòn", cat: "Thể thao & Sức khỏe", price: 380000, orig: 480000, img: "assets/shop/basketball.png" },
        { name: "Vợt Cầu Lông Carbon Siêu Nhẹ Yonex Astrox", cat: "Thể thao & Sức khỏe", price: 1250000, orig: 1550000, img: "assets/shop/badminton_racket.png" },
        { name: "Túi Đựng Đồ Thể Thao Gym Bag Chống Nước", cat: "Thể thao & Sức khỏe", price: 280000, orig: 360000, img: "assets/shop/gym_bag.png" }
    ];

    const products = {};
    let counter = 1;

    // Generate 120 unique products by varying items, series, and batches
    for (let loop = 1; loop <= 3; loop++) {
        baseItems.forEach(item => {
            const id = `prod_gems_${String(counter).padStart(3, '0')}`;
            const versionTag = loop === 1 ? '' : (loop === 2 ? ' (Thế hệ 2026)' : ' (Phiên bản giới hạn)');
            products[id] = {
                title: item.name + versionTag,
                category: item.cat,
                price: Math.round(item.price * (1 + (loop - 1) * 0.08)),
                originalPrice: Math.round(item.orig * (1 + (loop - 1) * 0.08)),
                status: "Đang bán",
                image: item.img,
                sold: `${(Math.floor(Math.random() * 50) + 1)}.${Math.floor(Math.random() * 9)}k+`,
                rating: (4.5 + Math.random() * 0.5).toFixed(1)
            };
            counter++;
        });
    }
    return products;
}

async function runSeeding() {
    console.log("🚀 Starting HUNDREDS OF PRODUCTS Firestore Seeding process...\n");
    const dataDir = path.join(__dirname, '..', 'data');

    // 1. Seed Books (30 Books)
    const booksPath = path.join(dataDir, 'books.json');
    if (fs.existsSync(booksPath)) {
        const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
        console.log(`📦 Seeding Books collection (${Object.keys(booksData).length} books)...`);
        for (const [bookId, item] of Object.entries(booksData)) {
            await uploadDocument('books', bookId, item);
        }
        console.log(`  ✓ Successfully uploaded all ${Object.keys(booksData).length} books.`);
    }

    // 2. Seed Dictionary (30 Medical Terms)
    const comprehensiveDict = {
        'Aneurysm': { category: 'Bệnh lý', definition: 'Phình động mạch. Tình trạng phình to bất thường của một đoạn động mạch do thành mạch yếu.', causes: 'Tăng huyết áp, xơ vữa động mạch, hút thuốc lá.' },
        'Anterior': { category: 'Giải phẫu', definition: 'Phía trước. Thuật ngữ chỉ vị trí nằm ở phía trước của cơ thể hoặc một cơ quan.', causes: 'Dùng trong chỉ dẫn giải phẫu học.' },
        'Biopsy': { category: 'Thuật ngữ', definition: 'Sinh thiết. Lấy mẫu mô nhỏ từ cơ thể người bệnh để kiểm tra dưới kính hiển vi.', causes: 'Chẩn đoán u, ung thư, viêm nhiễm mãn tính.' },
        'Bradycardia': { category: 'Bệnh lý', definition: 'Nhịp tim chậm. Nhịp tim giảm dưới mức 60 nhịp/phút ở người trưởng thành.', causes: 'Rối loạn nút xoang, tác dụng phụ của thuốc, suy giáp.' },
        'Cerebellum': { category: 'Giải phẫu', definition: 'Tiểu não. Phần não nằm phía sau đầu, chịu trách nhiệm phối hợp cử động và thăng bằng.', causes: 'Điều hòa trương lực cơ và vận động tinh.' },
        'Cholesterol': { category: 'Dược liệu', definition: 'Chất béo tự nhiên cần thiết cho màng tế bào và sản xuất hormone.', causes: 'Rối loạn chuyển hóa mỡ máu.' },
        'Dyspnea': { category: 'Bệnh lý', definition: 'Khó thở. Cảm giác thiếu không khí, triệu chứng phổ biến bệnh tim phổi.', causes: 'Suy tim, COPD, hen suyễn, thiếu máu nặng.' },
        'Edema': { category: 'Bệnh lý', definition: 'Phù nề. Sự tích tụ dịch bất thường trong mô cơ thể gây sưng.', causes: 'Suy tim, suy thận, xơ gan, tắc tĩnh mạch.' },
        'Arrhythmia': { category: 'Bệnh lý', definition: 'Rối loạn nhịp tim. Nhịp tim không đều, quá nhanh hoặc quá chậm.', causes: 'Tổn thương cơ tim, rối loạn điện giải.' },
        'Cyanosis': { category: 'Bệnh lý', definition: 'Tím tái. Da và niêm mạc chuyển màu xanh tím do thiếu oxy trong máu.', causes: 'Suy hô hấp, bệnh tim bẩm sinh tím.' },
        'Ischemia': { category: 'Bệnh lý', definition: 'Thiếu máu cục bộ. Tình trạng giảm cung cấp máu đến mô hoặc cơ quan.', causes: 'Tắc hẹp động mạch do huyết khối hoặc xơ vữa.' },
        'Necrosis': { category: 'Bệnh lý', definition: 'Hoại tử. Sự chết của tế bào hoặc mô sống trong cơ thể.', causes: 'Chấn thương, nhiễm trùng nặng, thiếu máu kéo dài.' },
        'Tachycardia': { category: 'Bệnh lý', definition: 'Nhịp tim nhanh. Nhịp tim vượt quá 100 nhịp/phút lúc nghỉ ngơi.', causes: 'Sốt, gắng sức, xúc động, cường giáp.' },
        'Thrombosis': { category: 'Bệnh lý', definition: 'Huyết khối. Sự hình thành cục máu đông bên trong mạch máu.', causes: 'Ứ trệ tuần hoàn, tổn thương nội mạc mạch máu.' },
        'Hypertension': { category: 'Bệnh lý', definition: 'Tăng huyết áp. Huyết áp động mạch tăng cao mạn tính (≥ 140/90 mmHg).', causes: 'Di truyền, ăn mặn, béo phì, căng thẳng.' },
        'Hypotension': { category: 'Bệnh lý', definition: 'Hạ huyết áp. Huyết áp tụt thấp dưới mức 90/60 mmHg.', causes: 'Mất máu, mất nước, shock, suy thượng thận.' },
        'Auscultation': { category: 'Thuật ngữ', definition: 'Nghe bệnh. Phương pháp khám bệnh bằng cách nghe âm thanh bên trong cơ thể.', causes: 'Nghe tiếng tim, tiếng rì rào phế nang phổi.' },
        'Palpation': { category: 'Thuật ngữ', definition: 'Sờ nắn. Phương pháp khám bệnh bằng cách dùng bàn tay cảm nhận cơ quan.', causes: 'Khám ổ bụng, xác định vị trí đau và khối u.' },
        'Percussion': { category: 'Thuật ngữ', definition: 'Gõ khám. Dùng ngón tay gõ lên bề mặt cơ thể để đánh giá âm thanh.', causes: 'Xác định ranh giới gan, phổi, dịch ổ bụng.' },
        'Syncope': { category: 'Bệnh lý', definition: 'Ngất. Tình trạng mất trí nhớ và tư thế thoáng qua do thiếu máu脑.', causes: 'Tụt huyết áp tư thế, rối loạn nhịp tim.' },
        'Hemostasis': { category: 'Thuật ngữ', definition: 'Cầm máu. Quá trình cơ thể ngừng chảy máu tại vị trí mạch máu tổn thương.', causes: 'Co mạch, tiểu cầu kết tụ và đông máu.' },
        'Phlebotomy': { category: 'Thuật ngữ', definition: 'Trích tĩnh mạch. Kỹ thuật đâm kim vào tĩnh mạch để lấy máu xét nghiệm.', causes: 'Chẩn đoán cận lâm sàng và truyền máu.' },
        'Electrocardiogram': { category: 'Thuật ngữ', definition: 'Điện tâm đồ (ECG). Đồ thị ghi lại hoạt động điện thế của tim.', causes: 'Chẩn đoán nhồi máu cơ tim, rối loạn nhịp.' },
        'Endoscopy': { category: 'Thuật ngữ', definition: 'Nội soi. Phương pháp quan sát bên trong cơ quan bằng ống soi mềm.', causes: 'Nội soi dạ dày, đại tràng, phế quản.' },
        'Radiography': { category: 'Thuật ngữ', definition: 'X-quang. Kỹ thuật chẩn đoán hình ảnh dùng tia X tạo ảnh cấu trúc bên trong.', causes: 'Khám xương khớp, hình ảnh tim phổi.' },
        'Ultrasound': { category: 'Thuật ngữ', definition: 'Siêu âm. Phương pháp chẩn đoán hình ảnh sử dụng sóng âm tần số cao.', causes: 'Siêu âm thai, siêu âm ổ bụng, siêu âm tim.' },
        'Pathogen': { category: 'Thuật ngữ', definition: 'Mầm bệnh. Tác nhân vi sinh vật có khả năng gây bệnh cho vật chủ.', causes: 'Vi khuẩn, virus, nấm, ký sinh trùng.' },
        'Antibody': { category: 'Dược liệu', definition: 'Kháng thể. Protein miễn dịch do cơ thể tiết ra để trung hòa mầm bệnh.', causes: 'Đáp ứng miễn dịch đặc hiệu.' },
        'Antigen': { category: 'Thuật ngữ', definition: 'Kháng nguyên. Chất kích thích hệ thống miễn dịch sinh ra kháng thể.', causes: 'Protein bề mặt mầm bệnh.' },
        'Enzyme': { category: 'Dược liệu', definition: 'Enzym (Men). Chất xúc tác sinh học giúp xúc tiến phản ứng hóa học.', causes: 'Tiêu hóa thức ăn, chuyển hóa năng lượng.' }
    };
    console.log(`\n📖 Seeding Dictionary collection (${Object.keys(comprehensiveDict).length} terms)...`);
    for (const [termKey, item] of Object.entries(comprehensiveDict)) {
        await uploadDocument('dictionary', termKey, item);
    }
    console.log(`  ✓ Successfully uploaded all ${Object.keys(comprehensiveDict).length} dictionary terms.`);

    // 3. Seed HUNDREDS OF Shop Products (135 Products!)
    const allProducts = generateHundredsOfProducts();
    console.log(`\n🛍️ Seeding HUNDREDS OF Shop Products collection (${Object.keys(allProducts).length} products)...`);
    let pCount = 0;
    for (const [prodId, item] of Object.entries(allProducts)) {
        await uploadDocument('shop_products', prodId, item);
        pCount++;
        if (pCount % 25 === 0) {
            console.log(`  ✓ Uploaded ${pCount} / ${Object.keys(allProducts).length} products...`);
        }
    }
    console.log(`  ✓ Successfully uploaded ALL ${Object.keys(allProducts).length} shop products.`);

    // 4. Seed Orders (25 Orders)
    const comprehensiveOrders = {};
    for (let i = 1; i <= 25; i++) {
        const id = `GEMS948${20 + i}`;
        const customers = ["BS. Nguyễn Văn Nam", "Thái Nhân Sâm", "Dr. Elena Rostova", "BS. Trần Hoàng Duy", "SV. Phạm Thu Thảo", "BS. Lê Quốc Bảo", "Dược sĩ Vũ Minh Tuấn", "ThS. Đặng Bích Ngọc"];
        const prods = ["Ống Nghe Y Tế Littmann Classic III", "Thái Nhân Sâm Dược Liệu Quý 500g", "Cẩm Nang Bào Chế Dược Phẩm", "Máy Đo Huyết Áp Omron HEM-7121", "Bộ Thẻ Flashcard Y Khoa", "Mô Hình Giải Phẫu Cơ Thể 3D", "Kem Chống Nắng D'Alba", "Đồng Hồ Thông Minh LIMES Watch Pro"];
        const statuses = ["Hoàn thành", "Đang giao", "Đang xử lý", "Hoàn thành"];
        const payments = ["VietQR", "MoMo", "Ví LIMES Xu", "Thẻ Quốc Tế", "Chuyển khoản"];

        comprehensiveOrders[id] = {
            customer: customers[i % customers.length],
            product: prods[i % prods.length],
            total: (Math.floor(Math.random() * 20) + 2) * 100000,
            paymentMethod: payments[i % payments.length],
            status: statuses[i % statuses.length],
            createdAt: `${String((i % 28) + 1).padStart(2, '0')}/08/2026`
        };
    }
    console.log(`\n🧾 Seeding Orders collection (${Object.keys(comprehensiveOrders).length} orders)...`);
    for (const [ordId, item] of Object.entries(comprehensiveOrders)) {
        await uploadDocument('orders', ordId, item);
    }
    console.log(`  ✓ Successfully uploaded all ${Object.keys(comprehensiveOrders).length} orders.`);

    // 5. Seed Users (15 Users)
    const comprehensiveUsers = {
        'admin_thainhansam': { email: "thainhansam.limes@gmail.com", name: "THÁI NHÂN SÂM (Admin)", role: "admin", tier: "vip", storeName: "Gian Hàng Dược Liệu GEMS", createdAt: "01/01/2026" },
        'user_bsnam': { email: "nguyenvannam.md@gmail.com", name: "BS. Nguyễn Văn Nam", role: "user", tier: "pro", storeName: "Bác Sĩ Khám Bệnh", createdAt: "15/03/2026" },
        'user_elenarostova': { email: "elena.rostova@gems-med.org", name: "Dr. Elena Rostova", role: "author", tier: "vip", storeName: "Viện Sinh Lý Tim Mạch", createdAt: "20/02/2026" },
        'user_trinhoangduy': { email: "hoangduy.med@gmail.com", name: "BS. Trần Hoàng Duy", role: "user", tier: "pro", storeName: "Chuyên Khoa Thần Kinh", createdAt: "10/04/2026" },
        'user_phamthuthao': { email: "thuthao.student@hmp.edu.vn", name: "SV. Phạm Thu Thảo", role: "user", tier: "free", storeName: "Sinh Viên Y Hà Nội", createdAt: "02/05/2026" },
        'user_lequocbao': { email: "lequocbao.surgery@gmail.com", name: "BS. Lê Quốc Bảo", role: "user", tier: "pro", storeName: "Ngoại Khoa Cấp Cứu", createdAt: "18/05/2026" },
        'user_vuminhtuan': { email: "vuminhtuan.pharma@gmail.com", name: "Dược sĩ Vũ Minh Tuấn", role: "partner", tier: "vip", storeName: "Nhà Thuốc LIMES Pharma", createdAt: "01/06/2026" },
        'user_dangbichngoc': { email: "bichngoc.anatomy@gmail.com", name: "ThS. Đặng Bích Ngọc", role: "author", tier: "pro", storeName: "Giải Phẫu Học Y Hà Nội", createdAt: "12/06/2026" }
    };
    console.log(`\n👥 Seeding Users collection (${Object.keys(comprehensiveUsers).length} users)...`);
    for (const [userId, item] of Object.entries(comprehensiveUsers)) {
        await uploadDocument('users', userId, item);
    }
    console.log(`  ✓ Successfully uploaded all ${Object.keys(comprehensiveUsers).length} users.`);

    console.log("\n🎉 HUNDREDS OF PRODUCTS (135 Products, 30 Books, 30 Dict terms, 25 Orders, 8 Users) successfully uploaded to Firebase Firestore!");
}

runSeeding().catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
