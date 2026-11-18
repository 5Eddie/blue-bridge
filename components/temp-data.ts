// TEMP: UI-г бүтээх түр өгөгдөл.
// lib/types.ts + lib/queries.ts бэлэн болмогц энэ файлыг устгаад
// импортыг @/lib/queries (getProducts/getStays/getHerders) руу шилжүүлнэ.

export interface Herder {
  id: string;
  name: string;
  province: string; // аймгийн slug (messages-ийн regions[].id-тэй таарна)
  soum: string;
  avatar: string;
  rating: number;
}

export interface Product {
  id: string;
  herder_id: string;
  herder: Herder;
  category: string;
  title: string;
  description: string;
  price: number; // ₮
  unit: string;
  rating: number;
  emoji: string;
  photo: string | null;
}

export interface Stay {
  id: string;
  herder_id: string;
  herder: Herder;
  title: string;
  description: string;
  price: number; // ₮ / хоног
  rating: number;
  emoji: string;
  photo: string | null;
  activities: string[];
}

const herders: Herder[] = [
  { id: "b", name: "Д. Батжаргал", province: "arkhangai", soum: "Ихтамир", avatar: "Д", rating: 5.0 },
  { id: "m", name: "А. Мөнхтуяа", province: "selenge", soum: "Баруунбүрэн", avatar: "А", rating: 4.9 },
  { id: "h", name: "Хөвсгөл Амт өрх", province: "khovsgol", soum: "Мөрөн", avatar: "Х", rating: 4.8 },
  { id: "t", name: "Б. Түвшинбаяр", province: "ovorkhangai", soum: "Хархорин", avatar: "Б", rating: 4.7 },
  { id: "o", name: "Н. Оюунчимэг", province: "zavkhan", soum: "Тосонцэнгэл", avatar: "Н", rating: 4.9 },
];

const products: Product[] = [
  { id: "p1", herder_id: "b", herder: herders[0], category: "Айраг", title: "Хөхүүрийн айраг", description: "Хөхүүрт исгэсэн уламжлалт гүүний айраг.", price: 15000, unit: "5л", rating: 5.0, emoji: "🥛", photo: null },
  { id: "p2", herder_id: "m", herder: herders[1], category: "Тос, өрөм", title: "Цөцгийтэй өрөм, шар тос", description: "Сүүний хөөрөгөөс гар аргаар хийсэн.", price: 25000, unit: "кг", rating: 4.9, emoji: "🧈", photo: null },
  { id: "p3", herder_id: "h", herder: herders[2], category: "Ааруул", title: "Сарлагийн хатаасан ааруул", description: "Сарлагийн сүүнээс, нарыг шингээн хатаасан.", price: 18000, unit: "кг", rating: 4.8, emoji: "🧀", photo: null },
  { id: "p4", herder_id: "t", herder: herders[3], category: "Ааруул", title: "Тэмээний сүүний ааруул", description: "Хөрсөнд өтгөрүүлсэн, зөөлөн исгэлэн амттай.", price: 22000, unit: "кг", rating: 4.7, emoji: "🧀", photo: null },
  { id: "p5", herder_id: "o", herder: herders[4], category: "Тараг, ээзгий", title: "Үхрийн сүүний тараг", description: "Өглөө саасан сүүнээс өдөрт нь исгэсэн.", price: 6000, unit: "л", rating: 4.9, emoji: "🍶", photo: null },
  { id: "p6", herder_id: "b", herder: herders[0], category: "Тараг, ээзгий", title: "Ээзгий", description: "Шинэ төлөөс гарсан сүүний ээзгий, захиалгаар.", price: 12000, unit: "кг", rating: 5.0, emoji: "🍮", photo: null },
];

const stays: Stay[] = [
  { id: "s1", herder_id: "b", herder: herders[0], title: "Гүүний саам ба нүүдэлчин ахуй", description: "Гүү саах, айраг исгэхийг хамт хийнэ. Хотонд хоноглоно.", price: 85000, rating: 5.0, emoji: "⛺", photo: null, activities: ["Гүү саах", "Айраг исгэх", "Адуу барих"] },
  { id: "s2", herder_id: "m", herder: herders[1], title: "Хонь маллаж, шар тос шарна", description: "Өглөө мал таргалуулж, орой өрөм, шар тос хийх.", price: 70000, rating: 4.9, emoji: "🐑", photo: null, activities: ["Мал хариулах", "Шар тос", "Аргал түлэх"] },
  { id: "s3", herder_id: "h", herder: herders[2], title: "Сарлагийн нутагт нэг өдөр", description: "Сарлаг сааж, ааруул хатаах, цайлаг цайгаа чанах.", price: 90000, rating: 4.8, emoji: "🦬", photo: null, activities: ["Сарлаг саах", "Ааруул хатаах", "Тал нутгаар явах"] },
  { id: "s4", herder_id: "t", herder: herders[3], title: "Тэмээчин айлд зочлох", description: "Тэмээ хөтлөх, ноос түүх, тэмээний сүүгээр хоол хийх.", price: 95000, rating: 4.7, emoji: "🐪", photo: null, activities: ["Тэмээ хөтлөх", "Ноос түүх", "Хоол хийх"] },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getStays(): Promise<Stay[]> {
  return stays;
}

export async function getHerders(): Promise<Herder[]> {
  return herders;
}
