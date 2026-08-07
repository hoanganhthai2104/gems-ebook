/* js/modules/data.js - Static Data Catalogs for Books, Dictionary, and Quizzes */
(function() {
    window.BOOK_DATA = window.BOOK_DATA || [
        {
            id: "cothe",
            title: "Giải Phẫu Người & Cơ Thể Học",
            author: "PGS.TS Nguyễn Văn A",
            cover: "covers/cothe.png",
            category: "Giải Phẫu",
            description: "Tài liệu tra cứu chuyên sâu về cấu trúc hệ xương, hệ cơ và các cơ quan trong cơ thể người."
        },
        {
            id: "ditruyen",
            title: "Di Truyền Học Y Khoa",
            author: "GS.TS Trần Thị B",
            cover: "covers/ditruyen.png",
            category: "Di Truyền",
            description: "Tổng quan các đột biến gen, cơ chế di truyền phân tử và ứng dụng chẩn đoán y khoa."
        },
        {
            id: "thankinh",
            title: "Thần Kinh Học Lâm Sàng",
            author: "BS.CKII Lê Văn C",
            cover: "covers/thankinh.png",
            category: "Thần Kinh",
            description: "Hướng dẫn chẩn đoán và xử trí các bệnh lý thần kinh trung ương và ngoại biên."
        },
        {
            id: "thaoduoc",
            title: "Cẩm Nang Thảo Dược Y Học",
            author: "ThS.BS Hoàng Thị D",
            cover: "covers/thaoduoc.png",
            category: "Dược Lý",
            description: "Các vị thuốc nam, hoạt chất sinh học và phương pháp phối ngũ y học cổ truyền."
        },
        {
            id: "thucduong",
            title: "Dinh Dưỡng & Thực Dưỡng Y Khoa",
            author: "TS.BS Phạm Văn E",
            cover: "covers/thucduong.png",
            category: "Dinh Dưỡng",
            description: "Chế độ ăn lâm sàng cho bệnh nhân mạn tính và phòng ngừa chuyển hóa."
        },
        {
            id: "trathaomoc",
            title: "Trà Thảo Mộc & Trị Liệu",
            author: "BS. Vũ Thị F",
            cover: "covers/trathaomoc.png",
            category: "Dược Lý",
            description: "Tác dụng sinh học của các loại trà thảo dược hỗ trợ phục hồi sức khỏe."
        }
    ];

    window.DICTIONARY_DATA = window.DICTIONARY_DATA || [
        {
            id: "term-01",
            term: "Monoclonal Antibody (Kháng thể đơn dòng)",
            category: "Dược Lý",
            definition: "Kháng thể nhân tạo được sản xuất từ một dòng tế bào duy nhất, có khả năng gắn kết đặc hiệu với một epitope duy nhất trên nhân nguyên."
        },
        {
            id: "term-02",
            term: "Action Potential (Điện thế hoạt động)",
            category: "Thần Kinh",
            definition: "Sự biến đổi nhanh chóng của điện thế màng tế bào thần kinh hoặc cơ khi kích thích đạt ngưỡng."
        },
        {
            id: "term-03",
            term: "CRISPR-Cas9",
            category: "Di Truyền",
            definition: "Công nghệ chỉnh sửa gen chính xác cho phép cắt và thay thế các đoạn DNA cụ thể trong bộ gen."
        }
    ];

    window.QUIZ_DATA = window.QUIZ_DATA || {};

    window.syncCloudData = async function() {
        if (!window.db) return;
        try {
            const booksSnap = await window.db.collection('books').get();
            if (!booksSnap.empty) {
                const list = [];
                booksSnap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                window.BOOK_DATA = list;
            }

            const dictSnap = await window.db.collection('dictionary').get();
            if (!dictSnap.empty) {
                const list = [];
                dictSnap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                window.DICTIONARY_DATA = list;
            }
            console.log("🔥 Cloud data synced with Firebase Firestore! Books:", window.BOOK_DATA.length, "Terms:", window.DICTIONARY_DATA.length);
        } catch (err) {
            console.warn("Using offline fallback data:", err);
        }
    };

    window.catalogState = {
        category: 'all',
        viewMode: 'grid'
    };

    window.openAllBooksCatalog = function(category = 'all') {
        const view = document.getElementById('view-all-books-modal');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }
        window.filterCatalogCategory(category);
    };

    window.closeAllBooksCatalog = function() {
        const view = document.getElementById('view-all-books-modal');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.add('hidden');
            });
        }
    };

    window.filterCatalogCategory = function(category) {
        window.catalogState.category = category;
        document.querySelectorAll('#catalog-category-pills .cat-pill').forEach(btn => {
            const attr = btn.getAttribute('onclick') || '';
            if (attr.includes(`'${category}'`)) {
                btn.className = 'cat-pill active px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shrink-0';
            } else {
                btn.className = 'cat-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0';
            }
        });
        window.renderCatalogBooks();
    };

    window.setCatalogViewMode = function(mode) {
        window.catalogState.viewMode = mode;
        const btnGrid = document.getElementById('btn-view-grid');
        const btnList = document.getElementById('btn-view-list');
        if (btnGrid) btnGrid.className = mode === 'grid' ? 'p-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold' : 'p-1.5 rounded-lg text-slate-400 font-bold';
        if (btnList) btnList.className = mode === 'list' ? 'p-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold' : 'p-1.5 rounded-lg text-slate-400 font-bold';
        window.renderCatalogBooks();
    };

    window.renderCatalogBooks = function() {
        const container = document.getElementById('catalog-books-container');
        if (!container) return;
        let books = window.BOOK_DATA || [];
        if (!Array.isArray(books) && typeof books === 'object') {
            books = Object.keys(books).map(k => ({ id: k, ...books[k] }));
        }

        const cat = window.catalogState.category;
        if (cat && cat !== 'all') {
            books = books.filter(b => {
                const c = (b.category || '').toLowerCase();
                const t = (b.title || '').toLowerCase();
                const d = (b.desc || b.description || '').toLowerCase();
                const id = (b.id || '').toLowerCase();
                const fullText = `${c} ${t} ${d} ${id}`;

                if (cat === 'yhss') return fullText.includes('sự sống') || fullText.includes('triết lý') || fullText.includes('yhss') || fullText.includes('chữa lành') || fullText.includes('tâm học');
                if (cat === 'thaoduoc') return fullText.includes('dược') || fullText.includes('thảo') || fullText.includes('sâm') || fullText.includes('trà') || fullText.includes('thực dưỡng');
                if (cat === 'giaiphau') return fullText.includes('giải phẫu') || fullText.includes('cơ thể') || fullText.includes('chẩn đoán') || fullText.includes('nội khoa') || fullText.includes('tim mạch');
                if (cat === 'thankinh') return fullText.includes('thần kinh') || fullText.includes('tâm') || fullText.includes('não') || fullText.includes('nhận thức') || fullText.includes('miễn dịch') || fullText.includes('gen');
                return true;
            });
        }

        const mode = window.catalogState.viewMode;
        if (mode === 'grid') {
            container.className = 'flex-grow overflow-y-auto shop-scroll-container p-3 grid grid-cols-2 gap-3';
            container.innerHTML = books.map(b => `
                <div onclick="openBookDetails('${b.id}')" class="card-lift bg-white rounded-2xl border border-slate-100 p-2.5 flex flex-col cursor-pointer shadow-sm">
                    <img src="${b.cover || 'covers/cothe.png'}" alt="${b.title}" class="w-full aspect-[2/3] object-cover rounded-xl mb-2 shadow-sm" loading="lazy" decoding="async" />
                    <span class="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-max mb-1">${b.category || 'Y Khoa'}</span>
                    <h4 class="font-bold text-xs text-slate-800 line-clamp-1 leading-snug">${b.title}</h4>
                    <p class="text-[10px] text-slate-400 truncate mt-0.5">${b.author || 'GEMS Academic'}</p>
                </div>
            `).join('');
        } else {
            container.className = 'flex-grow overflow-y-auto shop-scroll-container p-3 space-y-3';
            container.innerHTML = books.map(b => `
                <div onclick="openBookDetails('${b.id}')" class="card-lift bg-white rounded-2xl border border-slate-100 p-3 flex gap-3 cursor-pointer shadow-sm">
                    <img src="${b.cover || 'covers/cothe.png'}" alt="${b.title}" class="w-16 h-24 object-cover rounded-xl shrink-0 shadow-sm" loading="lazy" decoding="async" />
                    <div class="flex-grow flex flex-col justify-between min-w-0">
                        <div>
                            <span class="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">${b.category || 'Y Khoa'}</span>
                            <h4 class="font-bold text-sm text-slate-800 truncate mt-1">${b.title}</h4>
                            <p class="text-xs text-slate-500 truncate mt-0.5">${b.author || 'GEMS Academic'}</p>
                        </div>
                        <div class="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-blue-600">
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">menu_book</span> Đọc ngay</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.syncCloudData);
    } else {
        window.syncCloudData();
    }
})();
