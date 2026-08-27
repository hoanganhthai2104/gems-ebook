/* js/modules/data.js - Netflix-style Sub-Hub Ebook Catalog & Static Data */
(function() {
    // 30 Complete Medical & YHSS Books Dataset
    window.BOOK_DATA_MAP = {
        "trietly_yhss": {
            id: "trietly_yhss",
            title: "Triết Lý Y Học Sự Sống – 5 Nền Y Học & 3 Trụ Y Đức",
            author: "Chủ biên Hoàng Anh",
            rating: "5.0",
            reads: "28.9k",
            category: "Nền Y Học Sự Sống",
            cover: "covers/trietly_yhss.png",
            desc: "Tác phẩm nền tảng giới thiệu triết lý Y Học Sự Sống (YHSS), kết hợp 5 nền y học lớn và 3 trụ cột Y đức giúp chăm sóc sức khỏe toàn diện Thân - Tâm - Trí - Linh.",
            tags: ["yhss", "trietly", "nen-tang", "featured"]
        },
        "nuoc_va_su_song": {
            id: "nuoc_va_su_song",
            title: "Nước và Sự Sống – Thấu Hiểu Đạo Của Nước & Hydrogen Ion Kiềm",
            author: "Chủ biên Hoàng Anh",
            rating: "4.9",
            reads: "22.4k",
            category: "Nền Y Học Sự Sống",
            cover: "covers/nuoc_va_su_song.png",
            desc: "Nghiên cứu vai trò sinh học của nước, đặc tính Hydrogen Ion kiềm và liệu pháp dòng nước đối với việc tái tạo tế bào và phục hồi năng lượng sống cơ thể.",
            tags: ["yhss", "nuoc", "hydrogen", "te-bao"]
        },
        "tam_hoc_chua_lanh": {
            id: "tam_hoc_chua_lanh",
            title: "Tâm Học & Chữa Lành Cảm Xúc",
            author: "Chủ biên Hoàng Anh",
            rating: "4.9",
            reads: "19.8k",
            category: "Nền Y Học Sự Sống",
            cover: "covers/tam_hoc_chua_lanh.png",
            desc: "Phương pháp giải tỏa căng thẳng, nhận diện và chữa lành cảm xúc tiêu cực, khôi phục trạng thái an tĩnh nội tâm và nâng cao năng lượng sống.",
            tags: ["yhss", "tamhoc", "chua-lanh", "cam-xuc"]
        },
        "thaoduoc": {
            id: "thaoduoc",
            title: "Cẩm nang Thảo dược Quý Phương Đông",
            author: "GS. TS. Nguyễn Văn Anh",
            rating: "4.8",
            reads: "12.5k",
            category: "Dược Liệu & Thảo Dược",
            cover: "covers/thaoduoc.png",
            desc: "Kết tinh hơn 30 năm nghiên cứu thực địa về các loài thảo dược quý vùng núi phía Bắc. Hướng dẫn nhận dạng, công dụng và cách bào chế các phương thuốc nam.",
            tags: ["thaoduoc", "caythuoc", "thuocnam", "featured"]
        },
        "nhansam": {
            id: "nhansam",
            title: "Nhân Sâm: Đại Bổ Nguyên Khí",
            author: "GS. TS. Nguyễn Văn Anh",
            rating: "4.9",
            reads: "10.2k",
            category: "Dược Liệu & Thảo Dược",
            cover: "covers/nhansam.png",
            desc: "Nghiên cứu toàn diện về Nhân Sâm (Panax ginseng) và các hợp chất ginsenoside có tác dụng đại bổ nguyên khí, ích huyết, sinh tân, an thần.",
            tags: ["thaoduoc", "caythuoc", "nhansam", "quy"]
        },
        "namduocthanhieu": {
            id: "namduocthanhieu",
            title: "Nam Dược Thần Hiệu",
            author: "Thiền sư Tuệ Tĩnh",
            rating: "4.9",
            reads: "15.6k",
            category: "Dược Liệu & Thảo Dược",
            cover: "covers/namduocthanhieu.png",
            desc: "Tác phẩm y học kinh điển của thiền sư Tuệ Tĩnh về các vị thuốc nam bản địa trị bệnh cho người Việt theo phương châm Nam dược trị Nam nhân.",
            tags: ["thaoduoc", "thuocnam", "kinh-dien"]
        },
        "baoche": {
            id: "baoche",
            title: "Kỹ Thuật Bào Chế Dược Liệu",
            author: "GS. TS. Nguyễn Văn Anh",
            rating: "4.8",
            reads: "6.2k",
            category: "Dược Liệu & Thảo Dược",
            cover: "covers/baoche.png",
            desc: "Hướng dẫn chi tiết phương pháp sao tẩm, chưng cất và bào chế các loại cao thảo dược quý Đông y kết hợp kỹ thuật hiện đại.",
            tags: ["thaoduoc", "baoche", "ky-thuat"]
        },
        "dongydieuphuong": {
            id: "dongydieuphuong",
            title: "Đông Y Diệu Phương",
            author: "PGS. TS. Hoàng Tích Huyền",
            rating: "4.8",
            reads: "4.1k",
            category: "Dược Liệu & Thảo Dược",
            cover: "covers/dongydieuphuong.png",
            desc: "Tổng hợp các bài thuốc bí truyền từ cung đình đến dân gian, kết hợp chẩn trị y học hiện đại và phân tích dược lý sinh hóa học.",
            tags: ["thaoduoc", "baoche", "dongy"]
        },
        "trathaomoc": {
            id: "trathaomoc",
            title: "Trà Thảo Mộc & Trị Liệu",
            author: "BS. Vũ Thị F",
            rating: "4.7",
            reads: "8.2k",
            category: "Dược Liệu & Thảo Dược",
            cover: "covers/trathaomoc.png",
            desc: "Phân tích khoa học và công thức chưng cất chè, thảo mộc chữa trị các bệnh nhẹ, an thần cải thiện giấc ngủ và hỗ trợ thanh lọc độc tố.",
            tags: ["thaoduoc", "tra", "tri-lieu"]
        },
        "thucduong": {
            id: "thucduong",
            title: "Dinh Dưỡng & Thực Dưỡng Toàn Diện",
            author: "TS.BS Phạm Văn E",
            rating: "4.6",
            reads: "5.4k",
            category: "Dinh Dưỡng & YHSS",
            cover: "covers/thucduong.png",
            desc: "Nguyên lý ăn uống theo khoa học dinh dưỡng phương Đông kết hợp hiện đại. Cách sử dụng ngũ cốc nguyên cám tái lập hệ miễn dịch tự nhiên.",
            tags: ["yhss", "thucduong", "dinh-duong"]
        },
        "atlasgiaiphau": {
            id: "atlasgiaiphau",
            title: "Atlas Giải Phẫu Cơ Thể Người",
            author: "BS. Nguyễn Quang Quyền",
            rating: "4.9",
            reads: "21.4k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/atlasgiaiphau.png",
            desc: "Tập bản đồ giải phẫu đầy đủ nhất, cung cấp cái nhìn trực quan 3D và hệ thống danh pháp giải phẫu quốc tế chuẩn hóa.",
            tags: ["giaiphau", "atlas", "featured"]
        },
        "co-the-nguoi": {
            id: "co-the-nguoi",
            title: "Cơ Thể Người: Phân Tích Chi Tiết",
            author: "PGS. TS. Lê Thu",
            rating: "4.8",
            reads: "9.1k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/cothe.png",
            desc: "Cẩm nang sơ đồ giải phẫu đầy đủ với hình minh họa sinh động. Phân tích chi tiết các hệ tuần hoàn, hô hấp, cơ xương khớp.",
            tags: ["giaiphau", "heco", "cothe"]
        },
        "xuongkhop": {
            id: "xuongkhop",
            title: "Giải Phẫu Hệ Xương Khớp & Vận Động",
            author: "BS. Nguyễn Minh Tuấn",
            rating: "4.7",
            reads: "3.1k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/cothe.png",
            desc: "Phân tích cơ xương khớp lâm sàng và các phác đồ xử trí bệnh lý thoái hóa khớp ở người trưởng thành.",
            tags: ["giaiphau", "heco", "xuongkhop"]
        },
        "giaiphauthanhinh": {
            id: "giaiphauthanhinh",
            title: "Giải Phẫu Hệ Thần Kinh Ngoại Vi",
            author: "GS. Trịnh Bình",
            rating: "4.7",
            reads: "5.2k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/cothe.png",
            desc: "Khảo sát cấu trúc chi tiết của tủy sống, não bộ, hệ thần kinh ngoại vi và các bó dẫn truyền vận động cảm giác chính.",
            tags: ["giaiphau", "heco", "thankinh"]
        },
        "chandoanykhoa": {
            id: "chandoanykhoa",
            title: "Cẩm Nang Chẩn Đoán Y Khoa Lâm Sàng",
            author: "LIMES Academic",
            rating: "4.8",
            reads: "15.6k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/chandoanykhoa.png",
            desc: "Sách cẩm nang chẩn đoán y khoa lâm sàng toàn diện, cung cấp quy trình phân tích từ triệu chứng cơ năng đến bệnh lý chi tiết.",
            tags: ["giaiphau", "noikhoa", "chandoan"]
        },
        "lamsangnoikhoa": {
            id: "lamsangnoikhoa",
            title: "Sinh Lý Bệnh & Lâm Sàng Nội Khoa",
            author: "Dr. Elena Rostova",
            rating: "4.9",
            reads: "11.4k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/lamsangnoikhoa.png",
            desc: "Sổ tay hướng dẫn chi tiết lâm sàng nội khoa, sinh lý bệnh tim mạch và các ca bệnh thực tế dành cho bác sĩ.",
            tags: ["giaiphau", "noikhoa", "lamsang"]
        },
        "capnhatyvan": {
            id: "capnhatyvan",
            title: "Dược Lý Lâm Sàng & Cập Nhật Y Văn",
            author: "Dr. Robert H.",
            rating: "4.7",
            reads: "9.2k",
            category: "Giải Phẫu & Lâm Sàng",
            cover: "covers/capnhatyvan.png",
            desc: "Tập hợp các nghiên cứu y khoa, phác đồ dùng thuốc và hướng dẫn điều trị mới nhất được cập nhật trên thế giới.",
            tags: ["giaiphau", "noikhoa", "duocly"]
        },
        "thankinhhoc": {
            id: "thankinhhoc",
            title: "Thần Kinh Học & Nhận Thức Nâng Cao",
            author: "Dr. Sarah Jenkins",
            rating: "4.9",
            reads: "14.5k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/brain_cover.png",
            desc: "Nghiên cứu nâng cao về thần kinh học, các trung khu chức năng não bộ và ứng dụng phục hồi chức năng nhận thức lâm sàng.",
            tags: ["thankinh", "naobo", "featured"]
        },
        "naobo": {
            id: "naobo",
            title: "Não Bộ & Hành Vi Con Người",
            author: "TS. Đỗ Quyên",
            rating: "4.6",
            reads: "1.8k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/naobo.png",
            desc: "Nghiên cứu về mối liên hệ giữa các thùy não bộ, chất dẫn truyền thần kinh và hành vi tâm lý trong y học tâm thần.",
            tags: ["thankinh", "naobo", "tamly"]
        },
        "sinhlythankinh": {
            id: "sinhlythankinh",
            title: "Sinh Lý Học Thần Kinh",
            author: "GS. Phạm Hoàng Nam",
            rating: "4.8",
            reads: "2.5k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/sinhlythankinh.png",
            desc: "Cơ chế dẫn truyền xung điện màng tế bào thần kinh, điện thế hoạt động và các cung phản xạ sinh lý của con người.",
            tags: ["thankinh", "naobo", "sinhly"]
        },
        "taibienmachmau": {
            id: "taibienmachmau",
            title: "Tai Biến Mạch Máu Não & Đột Quỵ",
            author: "GS. Lê Đức Hinh",
            rating: "4.8",
            reads: "6.7k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/taibienmachmau.png",
            desc: "Hướng dẫn chẩn đoán nhanh đột quỵ giờ vàng, điều trị cấp cứu nội khoa và các liệu pháp phục hồi chức năng sau tai biến.",
            tags: ["thankinh", "dotquy", "capcuu"]
        },
        "benhthanhinh": {
            id: "benhthanhinh",
            title: "Bệnh Học Thần Kinh Lâm Sàng",
            author: "PGS. TS. Nguyễn Chương",
            rating: "4.8",
            reads: "3.9k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/thankinh.png",
            desc: "Chẩn đoán và xử trí các bệnh lý thần kinh thường gặp: đau nửa đầu migraine, động kinh, bệnh thần kinh ngoại biên và nhược cơ.",
            tags: ["thankinh", "dotquy", "benhhoc"]
        },
        "thankinh": {
            id: "thankinh",
            title: "Miễn Dịch Học Thần Kinh Nâng Cao",
            author: "Dr. Michael Chen",
            rating: "4.8",
            reads: "8.9k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/thankinh.png",
            desc: "Nghiên cứu cốt lõi về cơ chế miễn dịch tự nhiên, hàng rào máu não và kháng thể phòng ngừa các bệnh tự miễn y khoa.",
            tags: ["thankinh", "miendich", "khangthe"]
        },
        "tamly": {
            id: "tamly",
            title: "Tâm Lý Học Lâm Sàng & Trị Liệu",
            author: "ThS. Ngô Anh Tuấn",
            rating: "4.7",
            reads: "3.8k",
            category: "Thần Kinh & Não Bộ",
            cover: "covers/tamly.png",
            desc: "Giáo trình tâm lý học lâm sàng ứng dụng trong y khoa, chẩn đoán rối loạn lo âu, trầm cảm và liệu pháp trị liệu nhận thức hành vi.",
            tags: ["thankinh", "tamly", "chua-lanh"]
        },
        "ditruyen": {
            id: "ditruyen",
            title: "Di Truyền Học Y Khoa Toàn Diện",
            author: "PGS. TS. Trần Hải",
            rating: "4.8",
            reads: "3.7k",
            category: "Di Truyền & Gen",
            cover: "covers/ditruyen.png",
            desc: "Nghiên cứu ADN, đột biến gene di truyền sinh học tế bào gốc và định hướng y học chính xác cá thể hóa.",
            tags: ["ditruyen", "phantu", "featured"]
        },
        "kythuatditruyen": {
            id: "kythuatditruyen",
            title: "Kỹ Thuật Di Truyền & Chỉnh Sửa Gene",
            author: "PGS. TS. Đinh Đoàn Long",
            rating: "4.8",
            reads: "4.8k",
            category: "Di Truyền & Gen",
            cover: "covers/kythuatditruyen.png",
            desc: "Các công nghệ cốt lõi: phản ứng PCR, giải trình tự gen thế hệ mới (NGS) và công nghệ chỉnh sửa gen CRISPR-Cas9.",
            tags: ["ditruyen", "crispr", "congnghe"]
        },
        "ditruyenphantu": {
            id: "ditruyenphantu",
            title: "Di Truyền Học Phân Tử Tế Bào",
            author: "PGS. Lê Huy",
            rating: "4.7",
            reads: "2.9k",
            category: "Di Truyền & Gen",
            cover: "covers/ditruyenphantu.png",
            desc: "Cấu trúc ADN và ARN, cơ chế nhân đôi, phiên mã và dịch mã sinh học phân tử tế bào ứng dụng trong y học.",
            tags: ["ditruyen", "phantu", "tebao"]
        },
        "dotbiengene": {
            id: "dotbiengene",
            title: "Đột Biến Gene Lâm Sàng",
            author: "TS. Nguyễn Thị Trang",
            rating: "4.9",
            reads: "3.5k",
            category: "Di Truyền & Gen",
            cover: "covers/ditruyen.png",
            desc: "Các dạng đột biến cấu trúc nhiễm sắc thể gây ra hội chứng bệnh lý hiếm gặp và giải pháp chẩn đoán trước sinh.",
            tags: ["ditruyen", "dotbien", "lamsang"]
        },
        "ditruyentebao": {
            id: "ditruyentebao",
            title: "Di Truyền Tế Bào Học",
            author: "GS. Phan Cự Nhân",
            rating: "4.6",
            reads: "2.3k",
            category: "Di Truyền & Gen",
            cover: "covers/ditruyentebao.png",
            desc: "Khảo sát bộ nhiễm sắc thể, phân bào và các bất thường NST liên quan đến dị tật bẩm sinh và ung thư di truyền.",
            tags: ["ditruyen", "phantu", "nhiemsacthe"]
        },
        "genkhoa": {
            id: "genkhoa",
            title: "Gen Và Bệnh Học Lâm Sàng",
            author: "TS. Vũ Thị Lan",
            rating: "4.7",
            reads: "2.6k",
            category: "Di Truyền & Gen",
            cover: "covers/genkhoa.png",
            desc: "Mối liên hệ giữa biến thể gen và các bệnh mạn tính, phân tích GWAS và ứng dụng di truyền dược lý điều trị đích.",
            tags: ["ditruyen", "dotbien", "benhhoc"]
        }
    };

    window.BOOK_DATA = Object.values(window.BOOK_DATA_MAP);

    // Dedicated Category Hubs Configuration (Single Niche Focus Across All Categories)
    window.CATEGORY_HUBS = {
        all: {
            id: 'all',
            title: 'Kho Sách Y Khoa LIMES',
            tagline: 'Toàn bộ 30+ tác phẩm y học chuyên sâu & triết lý sự sống',
            themeGradient: 'from-[#080e20] via-[#0f1933] to-[#060a17]',
            glowColor: 'rgba(59, 130, 246, 0.3)',
            accentBadge: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
            spotlightId: 'trietly_yhss',
            spotlightBadge: '⭐ MASTERPIECE TUYỂN CHỌN SỐ 1',
            shelves: [
                {
                    title: 'Tác Phẩm Nền Tảng & Triết Lý YHSS',
                    subtitle: '5 nền Y học lớn, 3 trụ cột Y đức và năng lượng sống',
                    bookIds: ['trietly_yhss', 'nuoc_va_su_song', 'tam_hoc_chua_lanh', 'thucduong']
                },
                {
                    title: 'Dược Liệu & Thảo Dược Quý Phương Đông',
                    subtitle: 'Cẩm nang thảo dược, phương thuốc bí truyền và trà trị liệu',
                    bookIds: ['thaoduoc', 'nhansam', 'namduocthanhieu', 'baoche', 'dongydieuphuong', 'trathaomoc']
                },
                {
                    title: 'Giải Phẫu Học & Chẩn Đoán Lâm Sàng',
                    subtitle: 'Atlas toàn diện, giải phẫu cơ quan và sổ tay nội khoa',
                    bookIds: ['atlasgiaiphau', 'co-the-nguoi', 'xuongkhop', 'chandoanykhoa', 'lamsangnoikhoa', 'capnhatyvan']
                },
                {
                    title: 'Thần Kinh Học & Tâm Thần Học',
                    subtitle: 'Khám phá não bộ, phục hồi nhận thức và tâm lý lâm sàng',
                    bookIds: ['thankinhhoc', 'naobo', 'sinhlythankinh', 'taibienmachmau', 'benhthanhinh', 'tamly']
                },
                {
                    title: 'Di Truyền Học & Công Nghệ Sinh Học',
                    subtitle: 'Đột biến phân tử, kỹ thuật CRISPR-Cas9 và y học chính xác',
                    bookIds: ['ditruyen', 'kythuatditruyen', 'ditruyenphantu', 'dotbiengene', 'ditruyentebao', 'genkhoa']
                }
            ]
        },
        yhss: {
            id: 'yhss',
            title: 'Nền Y Học Sự Sống (YHSS)',
            tagline: 'Hợp nhất 5 nền Y học lớn, khơi thông năng lượng tự chữa lành Thân - Tâm - Trí',
            themeGradient: 'from-[#050e26] via-[#0a1b46] to-[#03081a]',
            glowColor: 'rgba(99, 102, 241, 0.4)',
            accentBadge: 'bg-amber-400/20 text-amber-300 border-amber-400/50',
            spotlightId: 'trietly_yhss',
            spotlightBadge: '🔥 TÁC PHẨM CỐT LÕI YHSS',
            shelves: [
                {
                    title: 'Bộ 3 Tác Phẩm Kinh Điển YHSS',
                    subtitle: 'Giáo trình nền tảng độc quyền của Chủ biên Hoàng Anh',
                    bookIds: ['trietly_yhss', 'nuoc_va_su_song', 'tam_hoc_chua_lanh']
                },
                {
                    title: 'Liệu Pháp Dinh Dưỡng & Nước Sinh Học',
                    subtitle: 'Đạo của nước, Hydrogen Ion Kiềm & thực dưỡng nguyên bản',
                    bookIds: ['nuoc_va_su_song', 'thucduong', 'trathaomoc']
                },
                {
                    title: 'Chữa Lành Tâm Thể & Năng Lượng Sống',
                    subtitle: 'Giải tỏa stress, chuyển hóa cảm xúc và an định nội tâm',
                    bookIds: ['tam_hoc_chua_lanh', 'tamly', 'naobo']
                }
            ]
        },
        thaoduoc: {
            id: 'thaoduoc',
            title: 'Dược Liệu & Thảo Dược Quý',
            tagline: 'Kho tàng cây thuốc nam, phương pháp sao tẩm bào chế & bài thuốc trị liệu',
            themeGradient: 'from-[#02170f] via-[#052b1d] to-[#01110b]',
            glowColor: 'rgba(16, 185, 129, 0.4)',
            accentBadge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50',
            spotlightId: 'thaoduoc',
            spotlightBadge: '🌿 CẨM NANG DƯỢC LIỆU KINH ĐIỂN',
            shelves: [
                {
                    title: 'Thảo Dược & Cây Thuốc Dân Gian',
                    subtitle: 'Các vị thuốc quý núi rừng phía Bắc và thảo mộc đất Việt',
                    bookIds: ['thaoduoc', 'nhansam', 'namduocthanhieu']
                },
                {
                    title: 'Kỹ Thuật Bào Chế & Phương Dược Bí Truyền',
                    subtitle: 'Phương pháp sao tẩm cao thảo dược và bài thuốc gia truyền',
                    bookIds: ['baoche', 'dongydieuphuong', 'capnhatyvan']
                },
                {
                    title: 'Trà Trị Liệu & Dinh Dưỡng Phục Hồi',
                    subtitle: 'Công thức thảo mộc thanh lọc cơ thể và cải thiện giấc ngủ',
                    bookIds: ['trathaomoc', 'thucduong']
                }
            ]
        },
        giaiphau: {
            id: 'giaiphau',
            title: 'Giải Phẫu & Lâm Sàng Toàn Diện',
            tagline: 'Atlas trực quan, sơ đồ hệ cơ xương khớp và quy trình chẩn đoán y khoa',
            themeGradient: 'from-[#05112c] via-[#0a2052] to-[#030b1e]',
            glowColor: 'rgba(14, 165, 233, 0.4)',
            accentBadge: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/50',
            spotlightId: 'atlasgiaiphau',
            spotlightBadge: '🫀 ATLAS BẢN ĐỒ GIẢI PHẪU 3D',
            shelves: [
                {
                    title: 'Atlas & Sơ Đồ Cơ Thể Người',
                    subtitle: 'Bản đồ chi tiết hệ tuần hoàn, hô hấp và cơ quan nội tạng',
                    bookIds: ['atlasgiaiphau', 'co-the-nguoi', 'giaiphauthanhinh']
                },
                {
                    title: 'Hệ Cơ Xương Khớp & Vận Động Học',
                    subtitle: 'Giải phẫu chi tiết khớp xương và điều trị thoái hóa lâm sàng',
                    bookIds: ['xuongkhop', 'co-the-nguoi']
                },
                {
                    title: 'Sổ Tay Chẩn Đoán & Sinh Lý Bệnh',
                    subtitle: 'Cẩm nang xử trí triệu chứng và sinh lý bệnh tim mạch',
                    bookIds: ['chandoanykhoa', 'lamsangnoikhoa', 'capnhatyvan']
                }
            ]
        },
        thankinh: {
            id: 'thankinh',
            title: 'Thần Kinh & Não Bộ Lâm Sàng',
            tagline: 'Cơ chế xung điện thần kinh, nhận thức não bộ, miễn dịch và cấp cứu đột quỵ',
            themeGradient: 'from-[#0f0724] via-[#1c0f42] to-[#080414]',
            glowColor: 'rgba(168, 85, 247, 0.4)',
            accentBadge: 'bg-purple-400/20 text-purple-300 border-purple-400/50',
            spotlightId: 'thankinhhoc',
            spotlightBadge: '🧠 NGHIÊN CỨU NÃO BỘ ĐỈNH CAO',
            shelves: [
                {
                    title: 'Chức Năng Não Bộ & Nhận Thức',
                    subtitle: 'Trung khu não bộ, dẫn truyền xung điện và phản xạ thần kinh',
                    bookIds: ['thankinhhoc', 'naobo', 'sinhlythankinh']
                },
                {
                    title: 'Cấp Cứu Tai Biến & Bệnh Lý Thần Kinh',
                    subtitle: 'Quy trình xử trí đột quỵ sớm và điều trị bệnh thần kinh',
                    bookIds: ['taibienmachmau', 'benhthanhinh', 'thankinh']
                },
                {
                    title: 'Tâm Lý Học & Miễn Dịch Nâng Cao',
                    subtitle: 'Trị liệu tâm thần, kiểm soát trầm cảm và kháng thể tự nhiên',
                    bookIds: ['tamly', 'tam_hoc_chua_lanh']
                }
            ]
        },
        ditruyen: {
            id: 'ditruyen',
            title: 'Di Truyền Học & Công Nghệ Sinh Học',
            tagline: 'Bản đồ gen, công nghệ CRISPR-Cas9, đột biến tế bào và y học cá thể hóa',
            themeGradient: 'from-[#021822] via-[#052d3f] to-[#01111a]',
            glowColor: 'rgba(6, 182, 212, 0.4)',
            accentBadge: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/50',
            spotlightId: 'ditruyen',
            spotlightBadge: '🧬 CÔNG NGHỆ CHỈNH SỬA GENE',
            shelves: [
                {
                    title: 'Di Truyền Y Khoa & Phân Tử',
                    subtitle: 'Cấu trúc ADN, ARN và cơ chế phiên mã dịch mã tế bào',
                    bookIds: ['ditruyen', 'ditruyenphantu', 'ditruyentebao']
                },
                {
                    title: 'Kỹ Thuật Thao Tác & Chỉnh Sửa Gene',
                    subtitle: 'Công nghệ PCR, NGS và CRISPR-Cas9 trong y học hiện đại',
                    bookIds: ['kythuatditruyen', 'dotbiengene', 'genkhoa']
                }
            ]
        }
    };

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

    window.catalogState = {
        category: 'all',
        viewMode: 'hub' // 'hub' (Netflix Sub-Hub), 'grid', 'list'
    };

    window.syncCloudData = async function() {
        if (!window.db) return;
        try {
            const booksSnap = await window.db.collection('books').get();
            if (!booksSnap.empty) {
                booksSnap.forEach(doc => {
                    const data = doc.data();
                    window.BOOK_DATA_MAP[doc.id] = { id: doc.id, ...data };
                });
                window.BOOK_DATA = Object.values(window.BOOK_DATA_MAP);
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

    window.openAllBooksCatalog = function(category = 'all') {
        const view = document.getElementById('view-all-books-modal');
        if (view) {
            requestAnimationFrame(() => {
                view.classList.remove('hidden');
                view.classList.add('gpu-layer');
            });
        }

        window.catalogState.category = category;
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

        // Update Header Title to the EXACT Niche Title
        const headerTitle = document.getElementById('catalog-header-title');
        const hub = window.CATEGORY_HUBS[category] || window.CATEGORY_HUBS['all'];
        if (headerTitle) {
            headerTitle.innerText = hub.title || 'Kho Sách Y Khoa LIMES';
        }

        window.renderCatalogBooks();
    };

    window.setCatalogViewMode = function(mode) {
        window.catalogState.viewMode = mode;
        const btnHub = document.getElementById('btn-view-hub');
        const btnGrid = document.getElementById('btn-view-grid');
        const btnList = document.getElementById('btn-view-list');

        const activeClass = 'p-1.5 rounded-xl bg-blue-600 text-white shadow-sm font-bold transition-all scale-105';
        const inactiveClass = 'p-1.5 rounded-xl bg-transparent text-slate-500 hover:text-slate-700 font-bold transition-all';

        if (btnHub) btnHub.className = mode === 'hub' ? activeClass : inactiveClass;
        if (btnGrid) btnGrid.className = mode === 'grid' ? activeClass : inactiveClass;
        if (btnList) btnList.className = mode === 'list' ? activeClass : inactiveClass;

        window.renderCatalogBooks();
    };

    window.renderCatalogBooks = function() {
        const container = document.getElementById('catalog-books-container');
        if (!container) return;

        const cat = window.catalogState.category || 'all';
        const mode = window.catalogState.viewMode || 'hub';

        if (mode === 'hub') {
            window.renderNetflixSubHub(cat, container);
        } else if (mode === 'grid') {
            window.renderCatalogGrid(cat, container);
        } else {
            window.renderCatalogList(cat, container);
        }
    };

    // Render Ultra Clean, Iconic, Pure Netflix Sub-Hub View (NO extra pills, NO quote box, NO icon boxes)
    window.renderNetflixSubHub = function(catKey, container) {
        const hub = window.CATEGORY_HUBS[catKey] || window.CATEGORY_HUBS['all'];
        const spotlightBook = window.BOOK_DATA_MAP[hub.spotlightId] || window.BOOK_DATA[0];

        container.className = 'flex-grow overflow-y-auto shop-scroll-container px-3 pb-28 pt-2 space-y-6 select-none';

        // 1. Ultra-Clean & Spacious WOW Hero Spotlight
        const heroHtml = `
            <div class="relative overflow-hidden rounded-[26px] bg-gradient-to-br ${hub.themeGradient || 'from-slate-950 via-slate-900 to-blue-950'} text-white p-5 shadow-2xl border border-white/10">
                <!-- Ambient Glow Lights -->
                <div class="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none animate-ambient-glow" style="background: ${hub.glowColor || 'rgba(59, 130, 246, 0.35)'}"></div>
                <div class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style="background: rgba(245, 158, 11, 0.15)"></div>
                <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                <div class="relative z-10 flex gap-4 sm:gap-5 items-center">
                    <!-- 3D Book Cover Presentation -->
                    <div class="book-3d-container shrink-0">
                        <div onclick="openBookDetails('${spotlightBook.id}')" class="book-3d-card relative group cursor-pointer w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.7)] border border-white/20">
                            <img src="${spotlightBook.cover || 'covers/cothe.png'}" alt="${spotlightBook.title}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                            
                            <!-- Gold Ribbon Badge -->
                            <div class="absolute top-2 left-2 badge-shimmer bg-amber-500 text-slate-950 text-[8.5px] font-black uppercase px-2 py-0.5 rounded shadow-lg border border-amber-300/40">
                                Top #1
                            </div>

                            <span class="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow flex items-center gap-0.5 border border-white/10">
                                <span class="material-symbols-outlined text-[10px] filled-icon">star</span>${spotlightBook.rating || '5.0'}
                            </span>
                        </div>
                    </div>

                    <!-- Hero Info Column (Spacious, FULL Title, NO line-clamp, NO quote box) -->
                    <div class="flex-grow min-w-0 space-y-2.5">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[8.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${hub.accentBadge || 'bg-amber-400/20 text-amber-300 border-amber-400/40'}">
                                ${hub.spotlightBadge || '⭐ MASTERPIECE TUYỂN CHỌN'}
                            </span>
                            <span class="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                ${spotlightBook.reads || '20k+'} người đọc
                            </span>
                        </div>

                        <!-- FULL Title (No truncation, No line-clamp) -->
                        <h2 onclick="openBookDetails('${spotlightBook.id}')" class="text-sm sm:text-base font-black text-white leading-snug cursor-pointer hover:text-blue-300 transition-colors drop-shadow-md">
                            ${spotlightBook.title}
                        </h2>

                        <!-- Author & Verified Badge -->
                        <p class="text-[11px] font-bold text-blue-200/90 flex items-center gap-1">
                            <span>${spotlightBook.author || 'Chủ biên Hoàng Anh'}</span>
                            <span class="material-symbols-outlined text-xs text-blue-400 font-bold">verified</span>
                        </p>

                        <!-- Key Feature Tags (Clean, Minimal) -->
                        <div class="flex items-center gap-1.5 flex-wrap text-[9.5px] font-semibold text-slate-300">
                            <span class="px-2 py-0.5 rounded-md bg-white/10 border border-white/10">📖 Bản Đầy Đủ</span>
                            <span class="px-2 py-0.5 rounded-md bg-white/10 border border-white/10">🎧 Audio HD</span>
                            <span class="px-2 py-0.5 rounded-md bg-white/10 border border-white/10">🎓 LIMES</span>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-2 pt-1 flex-wrap">
                            <button onclick="openBookDetails('${spotlightBook.id}')" class="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-[11px] px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/40 active:scale-95 transition-all flex items-center gap-1.5 border border-white/20">
                                <span class="material-symbols-outlined text-sm font-black">play_arrow</span>
                                <span>Bắt đầu đọc</span>
                            </button>
                            
                            <button onclick="openBookDetails('${spotlightBook.id}')" class="bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] px-3 py-2.5 rounded-xl backdrop-blur-md border border-white/15 active:scale-95 transition-all flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">headphones</span>
                                <span>Nghe Audio</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 2. Pure Typography Shelf Headers (NO icon boxes, clean modern titles)
        let shelves = hub.shelves || [];
        const shelvesHtml = shelves.map(shelf => {
            let bookList = shelf.bookIds
                .map(id => window.BOOK_DATA_MAP[id])
                .filter(Boolean);

            if (bookList.length === 0) return '';

            return `
                <section class="space-y-2.5">
                    <!-- Pure Typography Shelf Header (No Icon Box) -->
                    <div class="flex items-baseline justify-between px-1 mb-1 border-b border-slate-100/60 pb-1.5">
                        <div>
                            <h3 class="text-xs font-black text-slate-900 uppercase tracking-wide leading-tight">${shelf.title}</h3>
                            <p class="text-[10px] text-slate-400 font-medium mt-0.5">${shelf.subtitle || ''}</p>
                        </div>
                        <span class="text-[9.5px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 ml-2">
                            ${bookList.length} cuốn
                        </span>
                    </div>

                    <!-- Horizontal Shelf Cards -->
                    <div class="flex gap-3.5 overflow-x-auto scrollbar-none pb-2 pt-1 px-1">
                        ${bookList.map(book => `
                            <div onclick="openBookDetails('${book.id}')" class="card-lift group flex-shrink-0 w-32 cursor-pointer p-0 rounded-2xl transition-all duration-300">
                                <div class="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl border border-slate-100 group-hover:scale-[1.02] transition-transform duration-300">
                                    <img src="${book.cover || 'covers/cothe.png'}" alt="${book.title}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <span class="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full shadow flex items-center gap-0.5">
                                            <span class="material-symbols-outlined text-[10px]">menu_book</span> Đọc ngay
                                        </span>
                                    </div>
                                    <span class="absolute top-1.5 right-1.5 bg-black/65 backdrop-blur-md text-amber-400 text-[8.5px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm border border-white/10">
                                        <span class="material-symbols-outlined text-[9px] filled-icon">star</span>${book.rating || '4.8'}
                                    </span>
                                </div>
                                <div class="pt-2 px-0.5 space-y-0.5">
                                    <h4 class="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        ${book.title}
                                    </h4>
                                    <p class="text-[9.5px] text-slate-400 font-semibold truncate">
                                        ${book.author || 'LIMES Academic'}
                                    </p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }).join('');

        container.innerHTML = `
            ${heroHtml}
            <div class="space-y-6 pt-1">
                ${shelvesHtml}
            </div>
        `;
    };

    // Render Grid View Mode
    window.renderCatalogGrid = function(catKey, container) {
        container.className = 'flex-grow overflow-y-auto shop-scroll-container p-3 grid grid-cols-2 gap-3 pb-24';
        let books = window.getFilteredBooks(catKey);

        container.innerHTML = books.map(b => `
            <div onclick="openBookDetails('${b.id}')" class="card-lift bg-white rounded-2xl border border-slate-100 p-2.5 flex flex-col cursor-pointer shadow-sm hover:shadow-md transition-all">
                <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-2 shadow-sm">
                    <img src="${b.cover || 'covers/cothe.png'}" alt="${b.title}" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                    <span class="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md text-amber-400 text-[8.5px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[9px] filled-icon">star</span>${b.rating || '4.8'}
                    </span>
                </div>
                <span class="text-[8.5px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-max mb-1">${b.category || 'Y Khoa'}</span>
                <h4 class="font-black text-xs text-slate-800 line-clamp-2 leading-snug">${b.title}</h4>
                <p class="text-[10px] text-slate-400 truncate mt-1">${b.author || 'LIMES Academic'}</p>
            </div>
        `).join('');
    };

    // Render List View Mode
    window.renderCatalogList = function(catKey, container) {
        container.className = 'flex-grow overflow-y-auto shop-scroll-container p-3 space-y-3 pb-24';
        let books = window.getFilteredBooks(catKey);

        container.innerHTML = books.map(b => `
            <div onclick="openBookDetails('${b.id}')" class="card-lift bg-white rounded-2xl border border-slate-100 p-3 flex gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all">
                <img src="${b.cover || 'covers/cothe.png'}" alt="${b.title}" class="w-16 aspect-[2/3] object-cover rounded-xl shrink-0 shadow-sm" loading="lazy" decoding="async" />
                <div class="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="text-[8.5px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">${b.category || 'Y Khoa'}</span>
                            <span class="text-amber-500 text-[10px] font-bold flex items-center gap-0.5">
                                <span class="material-symbols-outlined text-[10px] filled-icon">star</span>${b.rating || '4.8'}
                            </span>
                        </div>
                        <h4 class="font-black text-xs text-slate-800 line-clamp-1 mt-1">${b.title}</h4>
                        <p class="text-[10.5px] text-slate-400 truncate mt-0.5">${b.author || 'LIMES Academic'}</p>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-blue-600">
                        <span class="flex items-center gap-1 text-[11px]"><span class="material-symbols-outlined text-sm">menu_book</span> Đọc sách</span>
                        <span class="text-[10px] text-slate-400 font-semibold">${b.reads || '10k+'} đọc</span>
                    </div>
                </div>
            </div>
        `).join('');
    };

    window.getFilteredBooks = function(catKey) {
        let books = window.BOOK_DATA || [];
        if (!catKey || catKey === 'all') return books;

        return books.filter(b => {
            const tags = b.tags || [];
            const c = (b.category || '').toLowerCase();
            const t = (b.title || '').toLowerCase();
            const id = (b.id || '').toLowerCase();
            const fullText = `${tags.join(' ')} ${c} ${t} ${id}`;

            if (catKey === 'yhss') return fullText.includes('yhss') || fullText.includes('sự sống') || fullText.includes('triết lý');
            if (catKey === 'thaoduoc') return fullText.includes('thaoduoc') || fullText.includes('dược') || fullText.includes('thảo');
            if (catKey === 'giaiphau') return fullText.includes('giaiphau') || fullText.includes('giải phẫu') || fullText.includes('cơ thể');
            if (catKey === 'thankinh') return fullText.includes('thankinh') || fullText.includes('thần kinh') || fullText.includes('não');
            if (catKey === 'ditruyen') return fullText.includes('ditruyen') || fullText.includes('di truyền') || fullText.includes('gen');
            return true;
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.syncCloudData);
    } else {
        window.syncCloudData();
    }
})();
