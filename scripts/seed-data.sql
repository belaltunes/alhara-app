-- ============================================================
-- Alhara App — Seed Data
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- It creates auth users + profiles + posts in one go.
-- ============================================================

-- Fixed UUIDs for our fake users so posts can reference them
DO $$
DECLARE
  u1 uuid := 'a1000000-0000-0000-0000-000000000001';
  u2 uuid := 'a2000000-0000-0000-0000-000000000002';
  u3 uuid := 'a3000000-0000-0000-0000-000000000003';
  u4 uuid := 'a4000000-0000-0000-0000-000000000004';
  u5 uuid := 'a5000000-0000-0000-0000-000000000005';
  u6 uuid := 'a6000000-0000-0000-0000-000000000006';
  u7 uuid := 'a7000000-0000-0000-0000-000000000007';
BEGIN

-- ============================================================
-- 1. Create auth.users (allows password login)
-- ============================================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token,
  is_super_admin, is_sso_user, deleted_at
)
VALUES
  (u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'ahmed@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null),
  (u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'fatima@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null),
  (u3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'mohammed@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null),
  (u4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'sara@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null),
  (u5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'omar@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null),
  (u6, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'layla@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null),
  (u7, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'khalid@alhara.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}', '{}', '', '', false, false, null)
ON CONFLICT (id) DO NOTHING;

-- Also insert identities (needed for email/password login)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), u1, 'ahmed@alhara.test',   '{"sub":"' || u1 || '","email":"ahmed@alhara.test"}',   'email', now(), now(), now()),
  (gen_random_uuid(), u2, 'fatima@alhara.test',  '{"sub":"' || u2 || '","email":"fatima@alhara.test"}',  'email', now(), now(), now()),
  (gen_random_uuid(), u3, 'mohammed@alhara.test','{"sub":"' || u3 || '","email":"mohammed@alhara.test"}','email', now(), now(), now()),
  (gen_random_uuid(), u4, 'sara@alhara.test',    '{"sub":"' || u4 || '","email":"sara@alhara.test"}',    'email', now(), now(), now()),
  (gen_random_uuid(), u5, 'omar@alhara.test',    '{"sub":"' || u5 || '","email":"omar@alhara.test"}',    'email', now(), now(), now()),
  (gen_random_uuid(), u6, 'layla@alhara.test',   '{"sub":"' || u6 || '","email":"layla@alhara.test"}',   'email', now(), now(), now()),
  (gen_random_uuid(), u7, 'khalid@alhara.test',  '{"sub":"' || u7 || '","email":"khalid@alhara.test"}',  'email', now(), now(), now())
ON CONFLICT (provider, provider_id) DO NOTHING;

-- ============================================================
-- 2. Create public profiles
-- ============================================================
INSERT INTO public.users (id, email, display_name, avatar_url, location) VALUES
  (u1, 'ahmed@alhara.test',    'أحمد الكيلاني',  'https://i.pravatar.cc/150?img=11', 'رام الله'),
  (u2, 'fatima@alhara.test',   'فاطمة أبو عمر',  'https://i.pravatar.cc/150?img=5',  'الخليل'),
  (u3, 'mohammed@alhara.test', 'محمد العرابي',    'https://i.pravatar.cc/150?img=15', 'نابلس'),
  (u4, 'sara@alhara.test',     'سارة جرادات',    'https://i.pravatar.cc/150?img=9',  'جنين'),
  (u5, 'omar@alhara.test',     'عمر الشامي',     'https://i.pravatar.cc/150?img=12', 'برطعة'),
  (u6, 'layla@alhara.test',    'ليلى حمدان',     'https://i.pravatar.cc/150?img=16', 'طولكرم'),
  (u7, 'khalid@alhara.test',   'خالد عوض',       'https://i.pravatar.cc/150?img=8',  'القدس')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Create posts
-- ============================================================
INSERT INTO public.posts (user_id, title, subtitle, description, images, tags, price) VALUES

(u1, 'قهوة عربية أصيلة للبيع', 'بيع',
 'أبيع آلة قهوة عربية أصيلة مع طقم فناجين من الفخار. الحالة ممتازة، استخدام بسيط جداً. مناسبة للهدايا وللاستخدام اليومي.',
 ARRAY['https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
 ARRAY['قهوة', 'تراث', 'مطبخ'], '٥٠ شيكل'),

(u2, 'أبحث عن مدرب لياقة بدنية', 'بحث',
 'أبحث عن مدرب لياقة بدنية محترف في منطقة رام الله. يفضل أن يكون لديه خبرة مع المبتدئين. يرجى التواصل لمناقشة التفاصيل.',
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
 ARRAY['رياضة', 'لياقة', 'تدريب'], NULL),

(u3, 'غرفة للإيجار في نابلس', 'إيجار',
 'غرفة مفروشة للإيجار في منطقة هادئة في نابلس. قريبة من المواصلات العامة والخدمات. الإيجار شامل الكهرباء والماء.',
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600'],
 ARRAY['إيجار', 'سكن', 'نابلس'], '٨٠٠ شيكل/شهر'),

(u4, 'سهرة موسيقية في الخليل', 'فعالية',
 'تشرف عائلة الشامي بدعوتكم لحضور سهرة موسيقية تراثية. ستُقام الفعالية يوم الجمعة القادم. الدعوة عامة للجميع.',
 ARRAY['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600'],
 ARRAY['فعالية', 'موسيقى', 'تراث'], NULL),

(u5, 'سيارة تويوتا كورولا ٢٠١٨', 'بيع',
 'أبيع سيارة تويوتا كورولا موديل ٢٠١٨، لون أبيض، ١١٠ ألف كيلومتر. بحالة ممتازة، بدون حوادث. الفحص متاح.',
 ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'],
 ARRAY['سيارة', 'بيع', 'تويوتا'], '٣٥٠٠٠ شيكل'),

(u6, 'دروس خصوصية في الرياضيات', 'خدمة',
 'معلم متخصص يقدم دروساً خصوصية في الرياضيات لجميع المراحل الدراسية. خبرة ١٠ سنوات. نتائج مضمونة.',
 ARRAY['https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600'],
 ARRAY['تعليم', 'رياضيات', 'خصوصي'], '٥٠ شيكل/ساعة'),

(u7, 'أريكة مستعملة حالة جيدة', 'بيع',
 'أبيع أريكة ثلاثية مستعملة بحالة جيدة. اللون بيج، مناسبة لغرفة الجلوس. التسليم متاح داخل المدينة.',
 ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
 ARRAY['أثاث', 'بيع', 'منزل'], '٤٠٠ شيكل'),

(u1, 'طباخة تقديم وليمات وحفلات', 'خدمة',
 'طباخة محترفة متخصصة في تقديم وليمات ومناسبات. أكلات شعبية وعصرية. السعر يحدد حسب عدد الأشخاص والأصناف.',
 ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600'],
 ARRAY['طعام', 'خدمة', 'مناسبات'], NULL),

(u2, 'هاتف آيفون ١٣ للبيع', 'بيع',
 'أبيع آيفون ١٣ لون أسود، ١٢٨ جيجا. الحالة ممتازة مع الصندوق الأصلي وملحقاته. مستخدم سنة واحدة فقط.',
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'],
 ARRAY['هاتف', 'آيفون', 'تقنية'], '٢٢٠٠ شيكل'),

(u3, 'حلقة تحفيظ قرآن للأطفال', 'دعوة',
 'نعلن عن فتح باب التسجيل في حلقة تحفيظ القرآن الكريم للأطفال من سن ٥-١٢ سنة. المحاضرات ثلاث مرات أسبوعياً.',
 ARRAY['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600'],
 ARRAY['دين', 'تحفيظ', 'أطفال'], NULL),

(u4, 'حديقة منزلية للتأجير', 'إيجار',
 'حديقة منزلية جميلة ومجهزة بالكامل للتأجير للمناسبات والأفراح الصغيرة. تتسع لـ ١٠٠ شخص. مجهزة بالمقاعد والطاولات.',
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600'],
 ARRAY['حديقة', 'تأجير', 'مناسبات'], '٨٠٠ شيكل/اليوم'),

(u5, 'مجموعة كتب عربية للبيع', 'بيع',
 'لدي مجموعة كبيرة من الكتب العربية في مجالات متنوعة: أدب، تاريخ، روايات. أبيع بالقطعة أو أتبادل مع كتب أخرى.',
 ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'],
 ARRAY['كتب', 'أدب', 'ثقافة'], '٢٠-٥٠ شيكل'),

(u6, 'ورشة خياطة وتفصيل', 'خدمة',
 'ورشة خياطة وتفصيل متخصصة في الملابس التقليدية والعصرية. نقبل التصليح والتعديل والتفصيل حسب الطلب.',
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600'],
 ARRAY['خياطة', 'تفصيل', 'خدمة'], NULL),

(u7, 'لابتوب Dell للبيع', 'بيع',
 'لابتوب Dell الجيل العاشر، رام ١٦ جيجا، ذاكرة ٥١٢ SSD. مناسب للطلاب والعمل. لا يوجد مشاكل تقنية.',
 ARRAY['https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600'],
 ARRAY['لابتوب', 'تقنية', 'بيع'], '١٨٠٠ شيكل'),

(u1, 'شريك لمشروع مطعم', 'بحث',
 'أبحث عن شريك جاد للدخول معي في مشروع مطعم للوجبات السريعة. لدي الموقع والمعدات. أبحث عن شريك بخبرة في المجال.',
 ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'],
 ARRAY['شراكة', 'مطعم', 'استثمار'], NULL),

(u2, 'تصوير فوتوغرافي للمناسبات', 'خدمة',
 'مصور فوتوغرافي محترف متاح لتصوير الأفراح والمناسبات. معدات احترافية ونتائج عالية الجودة. التحرير والتوصيل خلال ٧٢ ساعة.',
 ARRAY['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
 ARRAY['تصوير', 'مناسبات', 'خدمة'], '٨٠٠ شيكل/اليوم'),

(u3, 'أرض زراعية للبيع برطعة', 'بيع',
 'أرض زراعية مساحتها ٢ دونم في منطقة برطعة. مزروعة بأشجار الزيتون. مسجلة ووثائقها كاملة. مناسبة للاستثمار.',
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'],
 ARRAY['أرض', 'زراعة', 'عقارات'], '٤٠٠٠٠ شيكل'),

(u4, 'مطلوب بائعون - نابلس', 'توظيف',
 'مطلوب بائعون لمحلات تجارية في مدينة نابلس. يشترط حسن المظهر والتعامل. الراتب حسب الاتفاق مع مكافآت.',
 ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'],
 ARRAY['وظيفة', 'بيع', 'نابلس'], NULL),

(u5, 'مستلزمات رضع بحالة ممتازة', 'بيع',
 'أبيع مجموعة متكاملة من مستلزمات الرضع: سرير، كرسي سيارة، عربة. نظيفة بحالة ممتازة. مناسبة للمولودين الجدد.',
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600'],
 ARRAY['أطفال', 'رضع', 'مستلزمات'], '٦٠٠ شيكل المجموعة'),

(u6, 'مدرس موسيقى - عود وبيانو', 'خدمة',
 'مدرس موسيقى معتمد يقدم دروساً في العزف على العود والبيانو. للمبتدئين والمتقدمين. الدروس متاحة في بيتك أو بيتي.',
 ARRAY['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600'],
 ARRAY['موسيقى', 'تعليم', 'فنون'], '٦٠ شيكل/ساعة'),

(u7, 'محل بقالة للإيجار', 'إيجار',
 'محل بقالة في موقع تجاري ممتاز للإيجار. المساحة ٦٠ متر مربع، مجهز بالرفوف والثلاجات. موقع حيوي على الشارع الرئيسي.',
 ARRAY['https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600'],
 ARRAY['تجاري', 'إيجار', 'محل'], '٣٠٠٠ شيكل/شهر'),

(u1, 'دعوة لمعرض الفن المحلي', 'دعوة',
 'يسعدنا دعوتكم لحضور معرض الفن المحلي الذي يضم أعمال فنانين محليين موهوبين. المعرض مفتوح طوال الأسبوع القادم.',
 ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600'],
 ARRAY['فن', 'معرض', 'ثقافة'], NULL),

(u2, 'خدمة تنظيف المنازل', 'خدمة',
 'فريق متخصص لتنظيف المنازل والشقق بشكل احترافي. نستخدم مواد تنظيف عالية الجودة. نقبل الحجز الأسبوعي والشهري.',
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
 ARRAY['تنظيف', 'خدمة', 'منزل'], '٢٥٠ شيكل/مرة');

END $$;
