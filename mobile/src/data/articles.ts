/**
 * News / blog articles and per-book "knowledge" data.
 *
 * Ported verbatim from the web app (index.html):
 *  - `newsArticlesData`  -> ARTICLES        (article detail modal content)
 *  - #view-news-blog     -> FEATURED_ARTICLES / RECOMMENDED_ARTICLES
 *  - #view-home          -> HOME_NEWS_CARDS
 *  - `bookKnowledgeData` -> BOOK_KNOWLEDGE  (knowledge detail screen)
 *
 * The listing copy and the detail copy intentionally differ for some articles
 * (the web app stores them in two places); both are preserved as authored.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type ArticleCategoryKey = 'all' | 'tin-y-te' | 'nghien-cuu' | 'lam-sang';

export interface ArticleCategory {
  key: ArticleCategoryKey;
  label: string;
}

/** Inline run of article text; `bold` maps to the web's <strong>. */
export interface TextSpan {
  text: string;
  bold?: boolean;
}

export type ArticleBlock =
  | { type: 'paragraph'; spans: TextSpan[] }
  | { type: 'heading'; text: string }
  | { type: 'callout'; title: string; spans: TextSpan[] };

/** Full article as shown in the detail screen. */
export interface Article {
  slug: string;
  title: string;
  category: string;
  time: string;
  author: string;
  /** Web-style cover path; resolve through `resolveCover`. */
  image: string;
  blocks: ArticleBlock[];
}

/** Compact article entry used by shelves, carousels and list rows. */
export interface ArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryKey: Exclude<ArticleCategoryKey, 'all'>;
  time: string;
  image: string;
  excerpt?: string;
  /** Renders the red "HOT" flag on the home shelf card. */
  hot?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Article bodies                                                              */
/* -------------------------------------------------------------------------- */

const ARTICLE_LIST: Article[] = [
  {
    slug: 'timmach2024',
    title: 'Cập nhật hướng dẫn điều trị tim mạch 2024: Những thay đổi quan trọng',
    category: 'Lâm sàng',
    time: '3 giờ trước',
    author: 'PGS. TS. BS. Nguyễn Văn Minh',
    image: 'covers/hospital_corridor.webp',
    blocks: [
      {
        type: 'paragraph',
        spans: [
          {
            text: 'Hiệp hội Tim mạch Học Châu Âu (ESC) vừa chính thức phát hành bản Cập nhật Hướng dẫn Lâm sàng 2024 về Quản lý và Điều trị Bệnh Tim mạch Thể tăng áp và Suy tim Cấp. Đây là tài liệu cốt lõi tổng hợp từ hơn 45 thử nghiệm lâm sàng ngẫu nhiên có đối chứng (RCT) mới nhất.',
          },
        ],
      },
      { type: 'heading', text: '1. Thay đổi ngưỡng huyết áp mục tiêu' },
      {
        type: 'paragraph',
        spans: [
          {
            text: 'Khác với khuyến cáo cũ, ngưỡng khởi đầu điều trị thuốc hạ áp đối với bệnh nhân nguy cơ cao đã được điều chỉnh giảm xuống ',
          },
          { text: '130/80 mmHg', bold: true },
          {
            text: ' (thay vì 140/90 mmHg). Việc đưa huyết áp tâm thu về mức 120-129 mmHg ở đa số bệnh nhân dưới 70 tuổi cho thấy làm giảm 22% biến cố biến chứng mạch não.',
          },
        ],
      },
      {
        type: 'callout',
        title: 'Khuyến cáo lâm sàng quan trọng:',
        spans: [
          {
            text: 'Ưu tiên phối hợp 2 thuốc trong 1 viên nén duy nhất (Single Pill Combination - SPC) ngay từ liều khởi đầu cho bệnh nhân tăng huyết áp Độ 1 có nguy cơ kèm theo.',
          },
        ],
      },
      { type: 'heading', text: '2. Vai trò của thuốc nhóm SGLT2i trong Suy tim' },
      {
        type: 'paragraph',
        spans: [
          {
            text: 'Nhóm thuốc ức chế SGLT2 (Dapagliflozin, Empagliflozin) được nâng hạng Khuyến cáo Nhóm IA cho toàn bộ dải phân suất tống máu (EF giảm, EF bảo tồn và EF giảm nhẹ).',
          },
        ],
      },
    ],
  },
  {
    slug: 'ungthu2024',
    title: 'Đột phá trong điều trị miễn dịch cho bệnh nhân ung thư phổi giai đoạn cuối',
    category: 'Nghiên cứu',
    time: '5 phút trước',
    author: 'TS. BS. Trần Thị Hoàng Anh',
    image: 'covers/immunotherapy_lab.webp',
    blocks: [
      {
        type: 'paragraph',
        spans: [
          {
            text: 'Một liệu pháp miễn dịch kết hợp mới (Anti-PD-1 cộng với kháng thể kép thế hệ mới) vừa đạt bước tiến ngoạn mục trong thử nghiệm lâm sàng Phase III, kéo dài thời gian sống thêm không tiến triển bệnh (PFS) lên gấp đôi ở bệnh nhân ung thư phổi tế bào không nhỏ.',
          },
        ],
      },
      { type: 'heading', text: 'Cơ chế tác động phân tử' },
      {
        type: 'paragraph',
        spans: [
          {
            text: 'Khác với liệu pháp đơn trị liệu trước đây, phân tử mới này có khả năng kích hoạt đồng thời tế bào T Cytotoxic và giải áp chế môi trường vi mô khối u, giúp cơ thể tự nhận diện và tiêu diệt tế bào ác tính hiệu quả gấp 3 lần.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ai_y_khoa',
    title: 'Ứng dụng AI trong chẩn đoán hình ảnh: Cơ hội và thách thức',
    category: 'Công nghệ Y học',
    time: '1 ngày trước',
    author: 'BS. Chuyên khoa II Lê Hoàng',
    image: 'covers/hospital_corridor.webp',
    blocks: [
      {
        type: 'paragraph',
        spans: [
          {
            text: 'Trí tuệ nhân tạo (AI) đang chuyển mình từ một công cụ hỗ trợ đọc phim thành trợ lý chẩn đoán thời gian thực đối với chụp CT lồng ngực và MRI sọ đóng vai trò quan trọng tại các trung tâm y khoa tuyến đầu.',
          },
        ],
      },
    ],
  },
];

export const ARTICLES: Record<string, Article> = ARTICLE_LIST.reduce<Record<string, Article>>(
  (acc, article) => ({ ...acc, [article.slug]: article }),
  {},
);

const FALLBACK_SLUG = 'timmach2024';

/** Mirrors the web fallback: an unknown id renders the tim mạch article. */
export function getArticle(slug?: string | null): Article {
  if (slug && ARTICLES[slug]) return ARTICLES[slug];
  return ARTICLES[FALLBACK_SLUG]!;
}

/* -------------------------------------------------------------------------- */
/* Listings                                                                    */
/* -------------------------------------------------------------------------- */

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'tin-y-te', label: 'Tin y tế' },
  { key: 'nghien-cuu', label: 'Nghiên cứu' },
  { key: 'lam-sang', label: 'Lâm sàng' },
];

/** Horizontal shelf on the home screen. */
export const HOME_NEWS_CARDS: ArticleCard[] = [
  {
    slug: 'timmach2024',
    title: 'Cập nhật hướng dẫn điều trị tim mạch 2024: Những thay đổi quan trọng',
    category: 'Lâm sàng',
    categoryKey: 'lam-sang',
    time: '3 giờ trước',
    image: 'covers/hospital_corridor.webp',
    hot: true,
  },
  {
    slug: 'ungthu2024',
    title: 'Đột phá trong điều trị miễn dịch cho bệnh nhân ung thư phổi giai đoạn cuối',
    category: 'Nghiên cứu',
    categoryKey: 'nghien-cuu',
    time: '5 phút trước',
    image: 'covers/immunotherapy_lab.webp',
  },
  {
    slug: 'ai_y_khoa',
    title: 'Bộ Y tế ban hành quy định mới về quản lý dữ liệu y tế điện tử toàn quốc',
    category: 'Tin y tế',
    categoryKey: 'tin-y-te',
    time: '1 giờ trước',
    image: 'covers/digital_health_data.webp',
  },
];

/** Featured carousel at the top of the news tab. */
export const FEATURED_ARTICLES: ArticleCard[] = [
  {
    slug: 'timmach2024',
    title: 'Cập nhật hướng dẫn điều trị tim mạch 2024: Những thay đổi quan trọng',
    category: 'Lâm sàng',
    categoryKey: 'lam-sang',
    time: '2 giờ trước',
    image: 'covers/hospital_corridor.webp',
    excerpt:
      'Những thay đổi quan trọng trong phác đồ điều trị suy tim và nhồi máu cơ tim cấp theo Hiệp hội Tim mạch...',
  },
  {
    slug: 'ungthu2024',
    title: 'Đột phá trong điều trị miễn dịch cho bệnh nhân ung thư phổi giai đoạn cuối',
    category: 'Nghiên cứu',
    categoryKey: 'nghien-cuu',
    time: '5 phút trước',
    image: 'covers/immunotherapy_lab.webp',
    excerpt:
      'Nghiên cứu lâm sàng giai đoạn 3 cho thấy tỷ lệ đáp ứng tích cực tăng vượt trội so với phương pháp thông thường...',
  },
  {
    slug: 'ai_y_khoa',
    title: 'Bộ Y tế ban hành quy định mới về quản lý dữ liệu y tế điện tử toàn quốc',
    category: 'Tin y tế',
    categoryKey: 'tin-y-te',
    time: '1 giờ trước',
    image: 'covers/digital_health_data.webp',
    excerpt:
      'Quyết định nhằm đồng bộ hóa hồ sơ bệnh án điện tử tại tất cả các bệnh viện tuyến trung ương...',
  },
];

/** "Dành cho bạn" list underneath the carousel. */
export const RECOMMENDED_ARTICLES: ArticleCard[] = [
  {
    slug: 'ungthu2024',
    title: 'Đột phá trong điều trị miễn dịch cho bệnh nhân ung thư phổi giai đoạn cuối',
    category: 'Nghiên cứu',
    categoryKey: 'nghien-cuu',
    time: '5 phút trước',
    image: 'covers/immunotherapy_lab.webp',
  },
  {
    slug: 'ai_y_khoa',
    title: 'Bộ Y tế ban hành quy định mới về quản lý dữ liệu y tế điện tử toàn quốc',
    category: 'Tin y tế',
    categoryKey: 'tin-y-te',
    time: '1 giờ trước',
    image: 'covers/digital_health_data.webp',
  },
];

/** Category pill filtering, matching `filterBlogCategory`. */
export function filterArticleCards(cards: ArticleCard[], key: ArticleCategoryKey): ArticleCard[] {
  if (key === 'all') return cards;
  return cards.filter((card) => card.categoryKey === key);
}

/* -------------------------------------------------------------------------- */
/* Knowledge (per-book mastery data)                                           */
/* -------------------------------------------------------------------------- */

export type KnowledgeChapterStatus = 'completed' | 'learning' | 'not_started';

export interface KnowledgeHistoryEntry {
  name: string;
  score: number;
}

export interface KnowledgeChapter {
  num: number;
  title: string;
  desc: string;
  /** 0..100 */
  progress: number;
  status: KnowledgeChapterStatus;
}

export interface KnowledgeTerm {
  badge: string;
  title: string;
  desc: string;
  type: string;
}

export interface BookKnowledge {
  bookId: string;
  title: string;
  author: string;
  /** Web-style cover path; resolve through `resolveCover`. */
  cover: string;
  /** 0..100 */
  mastery: number;
  history: KnowledgeHistoryEntry[];
  chapters: KnowledgeChapter[];
  terms: KnowledgeTerm[];
}

export const BOOK_KNOWLEDGE: Record<string, BookKnowledge> = {
  chandoanykhoa: {
    bookId: 'chandoanykhoa',
    title: 'Cẩm nang Chẩn đoán Y khoa',
    author: 'TS. Nguyễn Văn A & ThS. Trần Thị B',
    cover: 'covers/chandoanykhoa.webp',
    mastery: 84,
    history: [
      { name: 'Giải phẫu cơ bản', score: 95 },
      { name: 'Sinh lý học tim', score: 82 },
      { name: 'Chẩn đoán hình ảnh', score: 78 },
    ],
    chapters: [
      {
        num: 1,
        title: 'Khám Lâm Sàng Cơ Bản',
        desc: 'Các kỹ năng tiếp cận bệnh nhân, hỏi bệnh sử và khám thực thể toàn diện.',
        progress: 100,
        status: 'completed',
      },
      {
        num: 2,
        title: 'Chẩn Đoán Bệnh Lý Tim Mạch',
        desc: 'Tiếp cận các triệu chứng đau ngực, khó thở, và phân tích điện tâm đồ (ECG).',
        progress: 75,
        status: 'learning',
      },
      {
        num: 3,
        title: 'Hô Hấp Ký & Bệnh Lý Phổi',
        desc: 'Phân tích kết quả hô hấp ký, chẩn đoán hen phế quản và COPD.',
        progress: 0,
        status: 'not_started',
      },
    ],
    terms: [
      { badge: 'Cần ôn tập', title: 'Rung nhĩ (AF)', desc: 'Rối loạn nhịp tim thường gặp nhất,...', type: 'benhly' },
      { badge: 'Mới học', title: 'COPD', desc: 'Bệnh phổi tắc nghẽn mạn tính, tình trạng...', type: 'benhly' },
    ],
  },
  thaoduoc: {
    bookId: 'thaoduoc',
    title: 'Cẩm nang Thảo dược Quý Phương Đông',
    author: 'GS. TS. Nguyễn Văn Anh',
    cover: 'covers/thaoduoc.webp',
    mastery: 65,
    history: [
      { name: 'Dược lý Tam Thất', score: 90 },
      { name: 'Phân biệt thảo dược', score: 72 },
    ],
    chapters: [
      {
        num: 1,
        title: 'Tổng Quan Dược Liệu Học',
        desc: 'Các khái niệm cơ bản về dược liệu và lịch sử y học cổ truyền.',
        progress: 100,
        status: 'completed',
      },
      {
        num: 2,
        title: 'Tam Thất - Đặc tính & Ứng dụng',
        desc: 'Nghiên cứu sâu về saponin và tác dụng chỉ huyết, hoạt huyết.',
        progress: 60,
        status: 'learning',
      },
      {
        num: 3,
        title: 'Nhân Sâm - Đại Bổ Nguyên Khí',
        desc: 'Các bài thuốc quý và liều lượng sử dụng trong lâm sàng.',
        progress: 0,
        status: 'not_started',
      },
    ],
    terms: [
      {
        badge: 'Cần ôn tập',
        title: 'Cholesterol',
        desc: 'Chất béo tự nhiên trong cơ thể, cần thiết...',
        type: 'duoclieu',
      },
    ],
  },
};

export const DEFAULT_KNOWLEDGE_BOOK_ID = 'chandoanykhoa';

/** Mirrors `openBookKnowledgeDetails`: unknown ids fall back to the default book. */
export function getBookKnowledge(bookId?: string | null): BookKnowledge {
  if (bookId && BOOK_KNOWLEDGE[bookId]) return BOOK_KNOWLEDGE[bookId]!;
  return BOOK_KNOWLEDGE[DEFAULT_KNOWLEDGE_BOOK_ID]!;
}
