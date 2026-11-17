# Ажлын хуваарь: Eddie ба Urnaa

## Eddie (back end)
- `lib/actions/*`: бүх Server Action (зар, туршлага, сэтгэгдэл, мэдэгдэл, баталгаажуулалт, админ)
- `lib/queries.ts`: өгөгдөл унших функцүүд (одоо mock, дараа нь Supabase)
- `lib/matching.ts`, `lib/types.ts`, `lib/mock-data.ts`, `lib/supabase/*`, `proxy.ts`
- `app/admin/*`: админ хуудсууд
- Supabase: `schema.sql`, RLS, Storage, `.env.local`
- Нийтлэх (deploy), аюулгүй байдлын шалгалт

## Urnaa (front end)
- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
- `app/onboarding`, `app/listings`, `app/stories`, `app/profile`, `app/prices`, `app/transport`
- `components/*`
- `messages/*` (Англи, Монгол орчуулга), `app/manifest.ts` (апп шиг суулгах)
- Дизайн, гар утсанд зохицох байдал

## Хоёрын хоорондох гэрээ
- `lib/types.ts` болон `lib/queries.ts`-ийн функцийн нэр, төрлийг **хамт** өөрчилнө.
- Urnaa зөвхөн `lib/queries.ts` ба `lib/actions/*`-ийг дуудна, Supabase-тэй шууд ярихгүй.
- Eddie эхлээд mock өгөгдөл өгсөн тул Urnaa хүлээлгүй дэлгэцээ хийж эхэлнэ.

## Дүрэм
- Бусдын хавтас дотор шууд засахгүй. Өөрчлөлт хэрэгтэй бол хэлнэ.
- `.env.local`-ийг GitHub-д хэзээ ч оруулахгүй.