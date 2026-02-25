import { Post, User } from "@/types";

const MOCK_USERS: User[] = [
  {
    id: "mock-u1",
    email: "ahmed@alhara.test",
    display_name: "أحمد الكيلاني",
    avatar_url: "https://i.pravatar.cc/150?img=11",
    location: "رام الله",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-u2",
    email: "fatima@alhara.test",
    display_name: "فاطمة أبو عمر",
    avatar_url: "https://i.pravatar.cc/150?img=5",
    location: "الخليل",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-u3",
    email: "mohammed@alhara.test",
    display_name: "محمد العرابي",
    avatar_url: "https://i.pravatar.cc/150?img=15",
    location: "نابلس",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-u4",
    email: "sara@alhara.test",
    display_name: "سارة جرادات",
    avatar_url: "https://i.pravatar.cc/150?img=9",
    location: "جنين",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-u5",
    email: "omar@alhara.test",
    display_name: "عمر الشامي",
    avatar_url: "https://i.pravatar.cc/150?img=12",
    location: "برطعة",
    created_at: new Date().toISOString(),
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "mock-1",
    user_id: "mock-u1",
    title: "قهوة عربية أصيلة للبيع",
    subtitle: "بيع",
    description:
      "أبيع آلة قهوة عربية أصيلة مع طقم فناجين من الفخار. الحالة ممتازة، استخدام بسيط جداً. مناسبة للهدايا وللاستخدام اليومي.",
    images: [
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    ],
    tags: ["قهوة", "تراث", "مطبخ"],
    price: "٥٠ شيكل",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[0],
  },
  {
    id: "mock-2",
    user_id: "mock-u2",
    title: "سيارة تويوتا كورولا ٢٠١٨",
    subtitle: "بيع",
    description:
      "أبيع سيارة تويوتا كورولا موديل ٢٠١٨، لون أبيض، ١١٠ ألف كيلومتر. بحالة ممتازة، بدون حوادث. الفحص متاح.",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
    ],
    tags: ["سيارة", "بيع", "تويوتا"],
    price: "٣٥٠٠٠ شيكل",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[1],
  },
  {
    id: "mock-3",
    user_id: "mock-u3",
    title: "غرفة للإيجار في نابلس",
    subtitle: "إيجار",
    description:
      "غرفة مفروشة للإيجار في منطقة هادئة في نابلس. قريبة من المواصلات العامة والخدمات. الإيجار شامل الكهرباء والماء.",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600",
    ],
    tags: ["إيجار", "سكن", "نابلس"],
    price: "٨٠٠ شيكل/شهر",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[2],
  },
  {
    id: "mock-4",
    user_id: "mock-u4",
    title: "سهرة موسيقية في الخليل",
    subtitle: "فعالية",
    description:
      "تشرف عائلة الشامي بدعوتكم لحضور سهرة موسيقية تراثية. ستُقام الفعالية يوم الجمعة القادم. الدعوة عامة للجميع.",
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600",
    ],
    tags: ["فعالية", "موسيقى", "تراث"],
    price: null,
    created_at: new Date().toISOString(),
    user: MOCK_USERS[3],
  },
  {
    id: "mock-5",
    user_id: "mock-u5",
    title: "دروس خصوصية في الرياضيات",
    subtitle: "خدمة",
    description:
      "معلم متخصص يقدم دروساً خصوصية في الرياضيات لجميع المراحل الدراسية. خبرة ١٠ سنوات. نتائج مضمونة.",
    images: [
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600",
    ],
    tags: ["تعليم", "رياضيات", "خصوصي"],
    price: "٥٠ شيكل/ساعة",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[4],
  },
  {
    id: "mock-6",
    user_id: "mock-u1",
    title: "هاتف آيفون ١٣ للبيع",
    subtitle: "بيع",
    description:
      "أبيع آيفون ١٣ لون أسود، ١٢٨ جيجا. الحالة ممتازة مع الصندوق الأصلي وملحقاته. مستخدم سنة واحدة فقط.",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    ],
    tags: ["هاتف", "آيفون", "تقنية"],
    price: "٢٢٠٠ شيكل",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[0],
  },
  {
    id: "mock-7",
    user_id: "mock-u2",
    title: "تصوير فوتوغرافي للمناسبات",
    subtitle: "خدمة",
    description:
      "مصور فوتوغرافي محترف متاح لتصوير الأفراح والمناسبات. معدات احترافية ونتائج عالية الجودة. التحرير والتوصيل خلال ٧٢ ساعة.",
    images: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    ],
    tags: ["تصوير", "مناسبات", "خدمة"],
    price: "٨٠٠ شيكل/اليوم",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[1],
  },
  {
    id: "mock-8",
    user_id: "mock-u3",
    title: "أريكة مستعملة حالة جيدة",
    subtitle: "بيع",
    description:
      "أبيع أريكة ثلاثية مستعملة بحالة جيدة. اللون بيج، مناسبة لغرفة الجلوس. التسليم متاح داخل المدينة.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    ],
    tags: ["أثاث", "بيع", "منزل"],
    price: "٤٠٠ شيكل",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[2],
  },
  {
    id: "mock-9",
    user_id: "mock-u4",
    title: "طباخة تقديم وليمات وحفلات",
    subtitle: "خدمة",
    description:
      "طباخة محترفة متخصصة في تقديم وليمات ومناسبات. أكلات شعبية وعصرية. السعر يحدد حسب عدد الأشخاص والأصناف.",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
    ],
    tags: ["طعام", "خدمة", "مناسبات"],
    price: null,
    created_at: new Date().toISOString(),
    user: MOCK_USERS[3],
  },
  {
    id: "mock-10",
    user_id: "mock-u5",
    title: "أرض زراعية للبيع - برطعة",
    subtitle: "بيع",
    description:
      "أرض زراعية مساحتها ٢ دونم في منطقة برطعة. مزروعة بأشجار الزيتون. مسجلة ووثائقها كاملة. مناسبة للاستثمار.",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    ],
    tags: ["أرض", "زراعة", "عقارات"],
    price: "٤٠٠٠٠ شيكل",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[4],
  },
  {
    id: "mock-11",
    user_id: "mock-u1",
    title: "لابتوب Dell للبيع",
    subtitle: "بيع",
    description:
      "لابتوب Dell الجيل العاشر، رام ١٦ جيجا، ذاكرة ٥١٢ SSD. مناسب للطلاب والعمل. لا يوجد مشاكل تقنية.",
    images: [
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600",
    ],
    tags: ["لابتوب", "تقنية", "بيع"],
    price: "١٨٠٠ شيكل",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[0],
  },
  {
    id: "mock-12",
    user_id: "mock-u2",
    title: "مدرس موسيقى - عود وبيانو",
    subtitle: "خدمة",
    description:
      "مدرس موسيقى معتمد يقدم دروساً في العزف على العود والبيانو. للمبتدئين والمتقدمين. الدروس متاحة في بيتك أو بيتي.",
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
    ],
    tags: ["موسيقى", "تعليم", "فنون"],
    price: "٦٠ شيكل/ساعة",
    created_at: new Date().toISOString(),
    user: MOCK_USERS[1],
  },
];
