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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.syncCloudData);
    } else {
        window.syncCloudData();
    }
})();
