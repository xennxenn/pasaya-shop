import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MapPin, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  Edit3, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Home, 
  GraduationCap, 
  ShoppingBag, 
  Coffee, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  Repeat,
  Store,
  RefreshCw,
  Copy,
  Send,
  BrainCircuit,
  Eye,
  Maximize2,
  Upload,
  Lock,
  X
} from 'lucide-react';

import { BudgetCalculator } from './components/BudgetCalculator';
import { getStoreDataFromFirestore, saveStoreDataToFirestore } from './firebase';

// Default editable text content matching the shared HTML
const defaultTexts = {
  // Hero
  'hero-label': 'Grand Opening · 2025',
  'hero-title-new': 'New Flagship',
  'hero-title-flagship': 'Store',
  'hero-subtitle': 'PASAYA Curtain Center',
  
  // Location
  'entrance-badge': 'Location',
  'entrance-name': 'Seasons Village ราชพฤกษ์',
  'entrance-sub': 'Luxury Community Mall · ถนนราชพฤกษ์ · นนทบุรี',
  
  // 3D Renders Header
  'renders-eyebrow': 'Store Visualization',
  'renders-title': 'แบบจำลอง 3 มิติ',
  'renders-desc-main': 'ภาพ Render แสดงการออกแบบ PASAYA Curtain Center สาขา Flagship',
  
  // Renders 01
  'render-01-title': 'หน้าร้าน (Facade)',
  'render-01-desc': 'การออกแบบ facade แบบ 2 ชั้น ด้วยกระจก floor-to-ceiling เผยให้เห็นสินค้าภายในร้าน พร้อมป้าย PASAYA CURTAIN CENTER อันเป็นเอกลักษณ์ และผ้าม่านโค้งสวยงามตกแต่งด้านบน สร้าง visual impact ที่โดดเด่น',
  
  // Renders 02
  'render-02-title': 'ด้านข้างของร้าน',
  'render-02-desc': 'มุมมองด้านข้างแสดงถึงความกว้างและความลึกของพื้นที่ร้าน ครอบคลุมพื้นที่จัดแสดงสินค้าอย่างเต็มรูปแบบ พร้อมที่จอดรถและทางเข้าสะดวกสบาย',
  
  // Renders 03
  'render-03-title': 'ด้านหลังของร้าน',
  'render-03-desc': 'พื้นที่ด้านหลังออกแบบเพื่อรองรับงาน logistics และการรับ-ส่งสินค้า พร้อมพื้นที่สำหรับ stock สินค้าและระบบการจัดการที่มีประสิทธิภาพ',
  
  // Renders 04
  'render-04-title': 'Render การจัดร้าน ชั้น 1',
  'render-04-desc': 'ชั้น 1 เน้นจัดแสดงผ้าม่านและผ้าตกแต่งหลากหลายสไตล์ พร้อม Consultation Counter ที่ตรงกลาง โต๊ะหินอ่อนสำหรับดูตัวอย่างผ้า และโซนนั่งรับรองลูกค้า ให้บรรยากาศแบบ Luxury Showroom ที่ส่งเสริมการตัดสินใจซื้อ',
  
  // Renders 05 (Floor Plan 1)
  'render-05-title': 'Floor Plan ชั้น 1',
  'render-05-desc': 'แผนผังชั้น 1 แสดงการแบ่งโซนการจัดแสดงสินค้า',
  
  // Renders 06
  'render-06-title': 'Render การจัดร้าน ชั้น 2',
  'render-06-desc': 'ชั้น 2 ออกแบบเป็น Bedroom Showcase แสดงตัวอย่างการตกแต่งห้องนอนสมบูรณ์แบบ ด้วย Bedding Collection ระดับพรีเมียม ผ้าปูที่นอนผ้าไหมและซาติน หน้าต่าง Floor-to-ceiling ให้แสงธรรมชาติ พร้อม Digital Display สำหรับโชว์ Portfolio การตกแต่ง',
  
  // Renders 07 (Floor Plan 2)
  'render-07-title': 'Floor Plan ชั้น 2',
  'render-07-desc': 'แผนผังชั้น 2 แสดงโซน Bedroom Showcase และพื้นที่ B2B Consultation',

  // Strategic Location Header
  'location-eyebrow': 'Strategic Location',
  'location-title': 'เหตุผลที่เลือกทำเลนี้',
  
  // Location Card - Seasons Village
  'reason-village-title': 'ข้อดีของ Seasons Village ราชพฤกษ์',
  
  // Location Card - Houses
  'reason-houses-title': 'โครงการบ้านหรู มูลค่า 10M+ บาท ในรัศมี 20 กม.',
  
  // Location Card - Education
  'reason-edu-title': 'สถาบันการศึกษาในรัศมี 15 กม.',
  
  // Location Card - Malls
  'reason-malls-title': 'ห้างสรรพสินค้า & Community Mall ในรัศมี 15 กม.',
  
  // Location Card - Cafes
  'reason-cafes-title': 'คาเฟ่ & ร้านอาหารชื่อดังในรัศมี 15 กม.',

  // Budget Header
  'budget-eyebrow': 'Investment Summary',
  'budget-title': 'สรุปค่าใช้จ่ายการเปิดร้าน',
  'budget-total-label': 'งบลงทุนรวม',
  'barter-title': 'สิ่งที่ได้ส่วนลด / Barter สำหรับการเปิดสาขา',

  // Goals Header
  'goals-eyebrow': 'Business Projection',
  'goals-title': 'สิ่งที่มุ่งหวังจากสาขานี้',
  'goal-sales-title': 'ยอดขายคาดการณ์',
  'goal-payback-title': 'ระยะเวลาคืนทุน',
  'goal-payback-desc': 'จากเงินลงทุนรวม 8.5 ล้านบาท คาดว่าจะคืนทุนภายใน 18 เดือน ด้วย Gross Margin เฉลี่ย 45–55% และยอดขายเฉลี่ยเดือนละ 2 ล้านบาทขึ้นไป',
  'goal-benefits-title': 'สิ่งที่ได้รับจากการมี Flagship Store',
};

// Default lists
const defaultLists = {
  reasonsVillage: [
    '<strong>Luxury Community Mall</strong> แห่งใหม่ ตั้งอยู่ใจกลางถนนราชพฤกษ์ ทำเลศักยภาพสูง',
    '<strong>Tenant Mix คุณภาพ</strong> — Audi Showroom, Ducati, Omazz Premium Mattress, Dermaster รวมแบรนด์พรีเมียม ผู้มาใช้บริการมีกำลังซื้อสูง',
    '<strong>กลุ่มลูกค้า Premium</strong> ตรงกับ target ของ PASAYA ทั้ง B2B (โรงแรม โครงการ) และ B2C (เจ้าของบ้านระดับสูง)',
    '<strong>ที่จอดรถเพียงพอ</strong> ง่ายต่อการเดินทาง รองรับการพาสินค้าขนาดใหญ่กลับบ้าน',
    '<strong>พื้นที่ร้านค้า 2 ชั้น</strong> รองรับการแสดงสินค้าได้อย่างเต็มรูปแบบ ทั้ง curtain และ bedding',
    '<strong>Visibility สูง</strong> อยู่บนถนนสายหลัก มีป้ายหน้าร้านขนาดใหญ่ ดึงดูดลูกค้าผ่านไปมา'
  ],
  reasonsHouses: [
    '<strong>บ้านแสนสิริ พาร์ค ราชพฤกษ์</strong> — เริ่ม 15–40 ล้านบาท',
    '<strong>Bangkok Boulevard ราชพฤกษ์</strong> — บ้านเดี่ยว เริ่ม 12–25 ล้านบาท',
    '<strong>ลดาวัลย์ ราชพฤกษ์-ปิ่นเกล้า</strong> — คฤหาสน์หรู 30–315 ล้านบาท',
    '<strong>Nantawan ราชพฤกษ์</strong> — บ้านเดี่ยว เริ่ม 18–50 ล้านบาท',
    '<strong>Grand Bangkok Blvd. ราชพฤกษ์</strong> — เริ่ม 15–35 ล้านบาท',
    '<strong>Perfect Masterpiece ราชพฤกษ์</strong> — เริ่ม 10–25 ล้านบาท',
    '<strong>The Palm ราชพฤกษ์</strong> — บ้านเดี่ยว เริ่ม 12–30 ล้านบาท',
    '<strong>โครงการ Luxury หลายแห่ง</strong> ในรัศมีถนนกาญจนาภิเษก นนทบุรี และพื้นที่ใกล้เคียง ≥ 30+ โครงการ'
  ],
  reasonsEdu: [
    '<strong>มหาวิทยาลัยมหิดล</strong> — ศาลายา (~8 กม.) นักศึกษา+บุคลากรกว่า 25,000 คน',
    '<strong>มหาวิทยาลัยศิลปากร</strong> — วิทยาเขตพระราชวังสนามจันทร์ (~14 กม.)',
    '<strong>สถาบันเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)</strong> — (~12 กม.)',
    '<strong>โรงเรียนสาธิต มหิดล</strong> — บุคลากรมีกำลังซื้อสูง',
    '<strong>โรงเรียนนานาชาติ ISB</strong> — นักเรียนต่างชาติ ครอบครัว expat',
    '<strong>โรงเรียน Shrewsbury International</strong> — ระดับ Premium ครอบครัวไฮเอนด์',
    '<strong>โรงเรียนอรรถมิตร, โรงเรียนสารสาสน์</strong> — หลายสาขาในรัศมี'
  ],
  reasonsMalls: [
    '<strong>The Crystal SB ราชพฤกษ์</strong> — Community Mall ยักษ์ใหญ่ บน ถ.ราชพฤกษ์ (~2 กม.)',
    '<strong>Central Plaza ปิ่นเกล้า</strong> — ห้างขนาดใหญ่ (~8 กม.)',
    '<strong>Central Plaza รัตนาธิเบศร์</strong> — (~10 กม.)',
    '<strong>The Circle ราชพฤกษ์</strong> — 39 ถ.ราชพฤกษ์ ตลิ่งชัน (~5 กม.)',
    '<strong>IKEA บางใหญ่</strong> — ฐานลูกค้าตกแต่งบ้าน (~15 กม.)',
    '<strong>Lotus\'s & Big C</strong> — หลายสาขาในรัศมี',
    '<strong>Robinson ราชพฤกษ์</strong> — (~6 กม.)'
  ],
  reasonsCafes1: [
    '<strong>Café Amazon, Starbucks</strong> — หลายสาขาในย่านราชพฤกษ์',
    '<strong>After You Dessert Café</strong> — ย่านราชพฤกษ์',
    '<strong>Red Sun Japanese Restaurant</strong> — ย่านปิ่นเกล้า',
    '<strong>Boat Noodle ท่าน้ำนนท์</strong> — นนทบุรี (~8 กม.)',
    '<strong>ร้านอาหารริมแม่น้ำ</strong> — ย่านนนทบุรี หลายร้าน'
  ],
  reasonsCafes2: [
    '<strong>The Commons Saladaeng</strong> — คาเฟ่ lifestyle กลุ่ม creative',
    '<strong>Roast Coffee</strong> — หลายสาขาในรัศมี',
    '<strong>ร้านอาหาร Thai-Contemporary</strong> — ย่าน The Crystal SB',
    '<strong>Yayoi, Fuji</strong> — Japanese restaurant ที่ Central ปิ่นเกล้า',
    '<strong>Fine Dining</strong> — หลายแห่งในโรงแรม 5 ดาว ย่านนนทบุรี'
  ]
};

// Default images list
const defaultImages = {
  hero: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
  entrance: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
  facade: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  sideview: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
  backview: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200',
  floor1_interior: 'https://images.unsplash.com/photo-1616486038857-89e3a17f225b?auto=format&fit=crop&q=80&w=1200',
  floor2_interior: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200'
};

// Initial template structures for default and new stores
const initialZones = [
  {
    id: 'zone-a',
    name: 'Luxury & Classic Curtain Zone',
    floor: 1,
    description: 'จัดแสดงผ้าม่านระดับพรีเมียม ลวดลาย Jacquard สุดประณีต และผ้าไหมทอมือหรูหราที่สะท้อนรสนิยมขั้นสูง เหมาะสำหรับห้องโถงและห้องรับแขกของคฤหาสน์หรู',
    products: ['ผ้าม่านไหมแจ็คการ์ดพรีเมียม', 'ม่านหลุยส์แบบคลาสสิก', 'พู่ประดับม่านนำเข้าระดับไฮเอนด์'],
    keyFeature: 'ผ้าทอพิเศษผสมด้ายทอง 24K และสารป้องกันไรฝุ่น',
    icon: 'Compass'
  },
  {
    id: 'zone-b',
    name: 'Modern & Smart Motorized curtains',
    floor: 1,
    description: 'นวัตกรรมผ้าม่านอัจฉริยะควบคุมด้วยเสียงและระบบสัมผัส ผสมผสานเทคโนโลยีการกรองแสง UV สูงถึง 99% และม่านกันความร้อนประหยัดพลังงาน',
    products: ['ม่านม้วนมอเตอร์แบรนด์ฝรั่งเศส Somfy', 'ผ้ากันแสง Blackout 100% สัมผัสนุ่ม', 'ม่านไฟฟ้าควบคุมผ่านสมาร์ตโฟน'],
    keyFeature: 'รองรับการเชื่อมต่อกับระบบ Smart Home (Apple HomeKit, Google Home)',
    icon: 'Settings'
  },
  {
    id: 'zone-c',
    name: 'Decorative Fabrics & Custom Trims',
    floor: 1,
    description: 'ศูนย์รวมผ้าบุเฟอร์นิเจอร์ โซฟา ปลอกหมอนอิง และงานสั่งตัดพิเศษ ให้ลูกค้าเลือกมิกซ์แอนด์แมตช์สีสันเพื่อสร้างเอกลักษณ์เฉพาะตัวให้บ้าน',
    products: ['ผ้าบุโซฟานวัตกรรมกันน้ำและคราบสกปรก', 'ปลอกหมอนผ้าแจ็คการ์ดประดับคริสตัล', 'พรมและวอลเปเปอร์ผ้าคอลเลกชันพิเศษ'],
    keyFeature: 'เทคโนโลยีผ้ากันคราบและทำความสะอาดง่ายด้วยน้ำเปล่า (Easy Clean Technology)',
    icon: 'LayoutDashboard'
  },
  {
    id: 'zone-lounge',
    name: 'Marble Consultation Lounge',
    floor: 1,
    description: 'เคาน์เตอร์หินอ่อนขนาดยักษ์สำหรับต้อนรับและให้คำปรึกษาอย่างใกล้ชิดโดย Curtain Designer ผู้เชี่ยวชาญ พร้อมชุดตัวอย่างผ้าขนาดจริง (Sample Books) นับพันรูปแบบ',
    products: ['บริการที่ปรึกษาวัดพื้นที่และออกแบบ 3D ฟรี', 'สมุดตัวอย่างคอลเลกชันระดับโลก', 'เครื่องดื่มต้อนรับสูตรพรีเมียมและกาแฟแบรนด์ดัง'],
    keyFeature: 'การจำลองมุมแสงธรรมชาติ (Daylight Simulator) เพื่อการเลือกสีผ้าม่านที่แม่นยำที่สุด',
    icon: 'Coffee'
  },
  {
    id: 'suite-royal',
    name: 'Royal Bedding Showcase',
    floor: 2,
    description: 'ห้องตัวอย่างหรูหราจัดแสดงคอลเลกชันเครื่องนอนระดับพรีเมียมทอ 1100 เส้นด้าย ผลิตจากเส้นใยไหมธรรมชาติและซาติน ให้สัมผัสเย็นสบายเป็นพิเศษ (Cool Mode)',
    products: ['ชุดผ้าปูที่นอนไหมแท้ Luxury Silk', 'ผ้านวมขนห่านเทียมไร้สารก่อภูมิแพ้', 'หมอนหนุนปรับระดับความสูงเฉพาะบุคคล'],
    keyFeature: 'ผ้าปูที่นอนปลอดสารพิษก่อมะเร็ง (Formaldehyde-Free) ปลอดภัยต่อระบบหายใจรายแรกในเอเชีย',
    icon: 'Award'
  },
  {
    id: 'suite-b2b',
    name: 'B2B Architect & Designer Suite',
    floor: 2,
    description: 'ห้องประชุมขนาดใหญ่และ Co-working Space สำหรับสถาปนิก นักออกแบบภายใน และผู้พัฒนาอสังหาริมทรัพย์ระดับประเทศ เพื่อคุยสเปกโครงการระดับพรีเมียม',
    products: ['ระบบโชว์เคส Digital Screen แสดงผลงานกว่า 1,000 โครงการ', 'คลังตัวอย่างผ้าเฉพาะงานโครงการ (Contract Fabrics)', 'โปรแกรมคำนวณราคาด่วนสำหรับงานโครงการขนาดใหญ่'],
    keyFeature: 'ผ้าป้องกันการลามไฟระดับมาตรฐานสากล (Flame Retardant) สำหรับกลุ่มโรงแรม 5 ดาว',
    icon: 'ShieldCheck'
  }
];

const initialBudgetItems = [
  {
    id: 'budget-1',
    category: 'ค่าก่อสร้าง & รีโนเวท',
    subCategory: 'Construction & Renovation',
    amount: 2500000,
    note: 'โครงสร้างสองชั้น ผนัง ฝ้าเพดาน ระบบแสงสว่างระดับ High-end'
  },
  {
    id: 'budget-2',
    category: 'ค่าตกแต่งภายในร้าน',
    subCategory: 'Interior & Decoration',
    amount: 1800000,
    note: 'เคาน์เตอร์ที่ปรึกษาหินอ่อน ชั้นโชว์ผ้าม่าน โซนต้อนรับพรีเมียม'
  },
  {
    id: 'budget-3',
    category: 'ค่าเช่าพื้นที่เปิดสาขา (ปีที่ 1)',
    subCategory: 'Annual Rental Fee',
    amount: 1440000,
    note: 'คำนวณจากประมาณ 120,000 บาท/เดือน พื้นที่ ~300 ตร.ม.'
  },
  {
    id: 'budget-4',
    category: 'ค่าจ้างพนักงานขาย & ที่ปรึกษา (รายปี)',
    subCategory: 'HR & Staffing (Annual)',
    amount: 2160000,
    note: 'ทีมที่ปรึกษาและทีมติดตั้งรวม 6–8 คน เฉลี่ย 22,500 บ./คน/เดือน'
  },
  {
    id: 'budget-5',
    category: 'งบประชาสัมพันธ์ & การตลาดเปิดตัว',
    subCategory: 'Advertising & Marketing',
    amount: 600000,
    note: 'Grand Opening, ยิงแอดพิกัดหมู่บ้านหรู, สื่อในคอมมูนิตี้มอลล์'
  }
];

const initialBarters = [
  { id: 'barter-1', name: 'โคมไฟแชนเดอเลียร์ & ระบบส่องสว่าง (Lighting)', originalCost: 350000, icon: '💡', active: true },
  { id: 'barter-2', name: 'โซฟารับรองและโต๊ะหินอ่อนโชว์รูม (Furniture)', originalCost: 280000, icon: '🛋️', active: true },
  { id: 'barter-3', name: 'ชุดเครื่องนอนตัวอย่าง (Bedding Display)', originalCost: 150000, icon: '🛏️', active: true },
  { id: 'barter-4', name: 'จอระบบ Digital Signage & วิดีโอวอลล์', originalCost: 200000, icon: '📺', active: false },
  { id: 'barter-5', name: 'งานตกแต่งศิลปะ ผนัง & ภาพวาดแคนวาส', originalCost: 120000, icon: '🎨', active: false }
];

export default function App() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStoreId, setActiveStoreId] = useState<string>("seasons-village");
  const [stores, setStores] = useState<Record<string, any>>({});

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // Secret Click Detector (5 Clicks on Top Right viewport)
  const [secretClicks, setSecretClicks] = useState<number[]>([]);
  const handleSecretClick = () => {
    const now = Date.now();
    const recent = [...secretClicks, now].filter(t => now - t < 3000);
    setSecretClicks(recent);
    if (recent.length >= 5) {
      setIsPasswordModalOpen(true);
      setSecretClicks([]);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === "024400955") {
      setIsEditMode(true);
      setIsPasswordModalOpen(false);
      setPasswordInput("");
      setPasswordError(false);
      showToastMessage("เปิดโหมดแก้ไขแล้ว ✨");
    } else {
      setPasswordError(true);
    }
  };

  const [toastMessage, setToastMessage] = useState("บันทึกข้อมูลแล้ว ✨");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store Management Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");

  // Load from Firestore first, fallback to server on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Attempting to load data from Firestore...");
        const firestoreData = await getStoreDataFromFirestore();
        
        let currentStores = null;
        let currentActiveId = "seasons-village";
        
        if (firestoreData && firestoreData.stores) {
          console.log("Successfully loaded data from Firestore!");
          currentStores = firestoreData.stores;
          currentActiveId = firestoreData.activeStoreId || "seasons-village";
        } else {
          console.log("No Firestore data found or connection failed. Trying local backend API...");
          const res = await fetch('/api/data');
          const data = await res.json();
          currentStores = data.stores || {};
          currentActiveId = data.activeStoreId || "seasons-village";
        }
        
        // If empty, initialize the default "seasons-village" store
        if (!currentStores || !currentStores["seasons-village"]) {
          currentStores = {
            "seasons-village": {
              id: "seasons-village",
              name: "Seasons Village ราชพฤกษ์",
              texts: defaultTexts,
              lists: defaultLists,
              images: defaultImages,
              showroomZones: initialZones,
              floorPlanImages: { 1: '', 2: '' },
              budgetItems: initialBudgetItems,
              barterItems: initialBarters
            }
          };
          
          // Save to both to initialize
          await saveStoreDataToFirestore({ activeStoreId: currentActiveId, stores: currentStores });
          await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activeStoreId: currentActiveId, stores: currentStores }),
          });
        } else if (!firestoreData) {
          // If we had data in the local server but not in Firestore, save it to Firestore now to synchronize
          await saveStoreDataToFirestore({ activeStoreId: currentActiveId, stores: currentStores });
        }
        
        setStores(currentStores);
        setActiveStoreId(currentActiveId);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        // Fallback local state if both fail
        setStores({
          "seasons-village": {
            id: "seasons-village",
            name: "Seasons Village ราชพฤกษ์",
            texts: defaultTexts,
            lists: defaultLists,
            images: defaultImages,
            showroomZones: initialZones,
            floorPlanImages: { 1: '', 2: '' },
            budgetItems: initialBudgetItems,
            barterItems: initialBarters
          }
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save changes to both Firebase Firestore and the local backend
  const saveToServer = async (activeId: string, allStores: Record<string, any>) => {
    try {
      // 1. Save to cloud Firestore so it persists across refreshes and different machines/reloads
      await saveStoreDataToFirestore({ activeStoreId: activeId, stores: allStores });
      
      // 2. Save to local server /api/data so it updates db.json
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeStoreId: activeId, stores: allStores }),
      });
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  // Derive active store details dynamically
  const activeStore = stores[activeStoreId] || {
    id: "seasons-village",
    name: "Seasons Village ราชพฤกษ์",
    texts: defaultTexts,
    lists: defaultLists,
    images: defaultImages,
    showroomZones: initialZones,
    floorPlanImages: { 1: '', 2: '' },
    budgetItems: initialBudgetItems,
    barterItems: initialBarters
  };

  const texts = activeStore.texts || defaultTexts;
  const lists = activeStore.lists || defaultLists;
  const images = activeStore.images || defaultImages;
  const showroomZones = activeStore.showroomZones || initialZones;
  const floorPlanImages = activeStore.floorPlanImages || { 1: '', 2: '' };
  const budgetItems = activeStore.budgetItems || initialBudgetItems;
  const barterItems = activeStore.barterItems || initialBarters;

  // Auto-reveal elements on scroll
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal-on-scroll');
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.9;
        if (isVisible) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveStoresAndSync = (updatedStores: Record<string, any>) => {
    setStores(updatedStores);
    saveToServer(activeStoreId, updatedStores);
  };

  const handleTextChange = (id: string, newVal: string) => {
    const updatedStore = {
      ...activeStore,
      texts: { ...texts, [id]: newVal }
    };
    const updatedStores = { ...stores, [activeStoreId]: updatedStore };
    saveStoresAndSync(updatedStores);
    showToastMessage("บันทึกข้อมูลเรียบร้อย ✨");
  };

  const handleListChange = (listKey: string, index: number, newVal: string) => {
    const updatedList = [...(lists[listKey] || [])];
    updatedList[index] = newVal;
    const updatedStore = {
      ...activeStore,
      lists: { ...lists, [listKey]: updatedList }
    };
    const updatedStores = { ...stores, [activeStoreId]: updatedStore };
    saveStoresAndSync(updatedStores);
    showToastMessage("บันทึกข้อมูลเรียบร้อย ✨");
  };

  const triggerImageUpload = (id: string) => {
    if (!isEditMode) return;
    setActiveImageId(id);
    fileInputRef.current?.click();
  };

  const compressImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 1600; // Efficient compression size

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // good balance of size/quality
          callback(dataUrl);
        }
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageId) {
      compressImage(file, (base64) => {
        const updatedStore = {
          ...activeStore,
          images: { ...images, [activeImageId]: base64 }
        };
        const updatedStores = { ...stores, [activeStoreId]: updatedStore };
        saveStoresAndSync(updatedStores);
        showToastMessage("อัปโหลดรูปภาพแล้ว ✨");
      });
    }
    e.target.value = ''; // Reset uploader
    setActiveImageId(null);
  };

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
  };

  const handleZonesChange = (newZones: any[]) => {
    const updatedStore = {
      ...activeStore,
      showroomZones: newZones
    };
    const updatedStores = { ...stores, [activeStoreId]: updatedStore };
    saveStoresAndSync(updatedStores);
    showToastMessage("บันทึกข้อมูลผังร้านแล้ว ✨");
  };

  const handleFloorPlansChange = (newFloorPlans: Record<number, string>) => {
    const updatedStore = {
      ...activeStore,
      floorPlanImages: newFloorPlans
    };
    const updatedStores = { ...stores, [activeStoreId]: updatedStore };
    saveStoresAndSync(updatedStores);
    showToastMessage("อัปโหลดภาพผังร้านแล้ว ✨");
  };

  const handleFloorPlanUploadDirect = (floor: 1 | 2, file: File) => {
    compressImage(file, (base64) => {
      const updatedPlans = { ...floorPlanImages, [floor]: base64 };
      handleFloorPlansChange(updatedPlans);
    });
  };

  const handleBudgetChange = (newItems: any[]) => {
    const updatedStore = {
      ...activeStore,
      budgetItems: newItems
    };
    const updatedStores = { ...stores, [activeStoreId]: updatedStore };
    saveStoresAndSync(updatedStores);
    showToastMessage("บันทึกงบประมาณแล้ว ✨");
  };

  const handleBartersChange = (newBarters: any[]) => {
    const updatedStore = {
      ...activeStore,
      barterItems: newBarters
    };
    const updatedStores = { ...stores, [activeStoreId]: updatedStore };
    saveStoresAndSync(updatedStores);
    showToastMessage("บันทึกส่วนลดแล้ว ✨");
  };

  // Add a new store branch page
  const handleAddStore = () => {
    if (!newStoreName.trim()) return;
    const cleanId = newStoreName.trim().toLowerCase()
      .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-') // Support Thai slug as well
      .replace(/(^-|-$)/g, '');
    
    const finalId = cleanId || "store-" + Date.now();
    
    // Duplicate standard default templates but customize the name & titles
    const newStoreData = {
      id: finalId,
      name: newStoreName.trim(),
      texts: {
        ...defaultTexts,
        'hero-title-new': 'PASAYA Shop',
        'hero-title-flagship': newStoreName.trim(),
        'hero-subtitle': 'Showroom & Strategic Showcase',
        'entrance-name': newStoreName.trim()
      },
      lists: { ...defaultLists },
      images: { ...defaultImages },
      showroomZones: [...initialZones],
      floorPlanImages: { 1: '', 2: '' },
      budgetItems: [...initialBudgetItems],
      barterItems: [...initialBarters]
    };

    const updatedStores = { ...stores, [finalId]: newStoreData };
    setStores(updatedStores);
    setActiveStoreId(finalId);
    saveToServer(finalId, updatedStores);
    
    setNewStoreName("");
    setIsAddModalOpen(false);
    showToastMessage(`เพิ่มหน้าสาขา ${newStoreName.trim()} สำเร็จ ✨`);
  };

  // Delete a store branch page
  const handleDeleteStore = (storeIdToDelete: string) => {
    if (storeIdToDelete === "seasons-village") {
      alert("ไม่สามารถลบสาขาหลัก Seasons Village ได้");
      return;
    }
    const confirmDelete = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสาขา "${stores[storeIdToDelete]?.name}"?`);
    if (!confirmDelete) return;

    const updatedStores = { ...stores };
    delete updatedStores[storeIdToDelete];
    
    const remainingStoreIds = Object.keys(updatedStores);
    const newActiveId = remainingStoreIds.includes("seasons-village") 
      ? "seasons-village" 
      : remainingStoreIds[0] || "";

    setStores(updatedStores);
    setActiveStoreId(newActiveId);
    saveToServer(newActiveId, updatedStores);
    showToastMessage("ลบสาขาสำเร็จ ✨");
  };

  // Reusable inline editable text element
  const EditableText = ({
    id,
    as: Component = 'span',
    className = '',
    style = {}
  }: {
    id: string;
    as?: any;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const value = texts[id] || '';

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
      handleTextChange(id, e.currentTarget.innerText);
    };

    if (!isEditMode) {
      return (
        <Component className={className} style={style} dangerouslySetInnerHTML={{ __html: value }} />
      );
    }

    return (
      <Component
        className={`${className} outline-none border-b border-dashed border-[#C9A96E]/30 hover:border-[#C9A96E]/70 focus:border-[#C9A96E] hover:bg-white/2 focus:bg-white/5 transition-all cursor-text px-0.5 inline-block`}
        style={style}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  };

  // Reusable inline editable list item
  const EditableLi = ({
    listKey,
    index,
    className = ''
  }: {
    listKey: string;
    index: number;
    className?: string;
    key?: any;
  }) => {
    const value = lists[listKey]?.[index] || '';

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
      handleListChange(listKey, index, e.currentTarget.innerHTML);
    };

    if (!isEditMode) {
      return (
        <li className={className} dangerouslySetInnerHTML={{ __html: value }} />
      );
    }

    return (
      <li className={`${className} relative group/li`}>
        <div
          className="outline-none border-b border-dashed border-[#C9A96E]/20 hover:border-[#C9A96E]/60 focus:border-[#C9A96E] hover:bg-white/2 focus:bg-white/5 transition-all cursor-text px-1"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </li>
    );
  };

  return (
    <div className="bg-[#111008] text-[#FAF8F5] font-sans overflow-x-hidden selection:bg-[#C9A96E] selection:text-black pt-20">
      {/* Secret click target for entering edit mode (Top Right, 5 clicks within 3 seconds) */}
      <div 
        onClick={handleSecretClick} 
        className="fixed top-0 right-0 w-24 h-24 z-[9999] cursor-default opacity-0 select-none" 
        title="Secret Edit Trigger"
      />

      {/* ═══ LUXURY FLOATING NAVBAR ═══ */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-md border-b border-[#C9A96E]/10 z-50 flex items-center justify-between px-6 md:px-12">
        {/* Left Side: Premium Logo */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl font-light tracking-[8px] text-[#E8D5B0]">PASAYA</span>
          <span className="text-[10px] tracking-[3px] uppercase text-[#C9A96E] font-medium border-l border-[#C9A96E]/20 pl-3">Shop</span>
        </div>

        {/* Right Side: Store Selection Dropdown & Multi-store actions */}
        <div className="flex items-center gap-4">
          <div className="relative group/store">
            <div className="flex items-center gap-2 bg-[#1E1C11] border border-[#C9A96E]/25 px-4 py-2 rounded-full cursor-pointer hover:border-[#C9A96E]/70 transition-all">
              <Store className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-xs md:text-sm text-white font-medium">{activeStore.name}</span>
              <span className="text-[#C9A96E] text-[10px]">▼</span>
            </div>

            {/* Dropdown options */}
            <div className="absolute right-0 mt-2 w-72 bg-[#1A1911] border border-[#C9A96E]/20 rounded-xl shadow-2xl opacity-0 translate-y-1 pointer-events-none group-hover/store:opacity-100 group-hover/store:translate-y-0 group-hover/store:pointer-events-auto transition-all duration-250 z-50 p-2 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#8C7B6B] px-3 py-1 border-b border-white/5 font-semibold">
                สาขา / ร้านค้า (Branches)
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {Object.values(stores).map((store: any) => (
                  <div 
                    key={store.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeStoreId === store.id 
                        ? 'bg-[#C9A96E]/10 text-[#C9A96E] font-medium' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveStoreId(store.id);
                      saveToServer(store.id, stores);
                    }}
                  >
                    <span className="truncate pr-2">{store.name}</span>
                    {activeStoreId === store.id && <Check className="w-3.5 h-3.5 text-[#C9A96E] flex-shrink-0" />}
                    
                    {/* Delete button (only in edit mode, and cannot delete seasons-village) */}
                    {isEditMode && store.id !== "seasons-village" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStore(store.id);
                        }}
                        className="p-1 hover:bg-red-950/40 rounded text-red-400 hover:text-red-500 transition-colors"
                        title="ลบสาขา"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Store Button */}
              {isEditMode && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#C9A96E] hover:bg-[#E8D5B0] text-black font-semibold text-xs py-2 rounded-lg transition-colors mt-2 cursor-pointer"
                >
                  <span>+ เพิ่มสาขาใหม่</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ ADD STORE CUSTOM MODAL ═══ */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1C1A11] border border-[#C9A96E]/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-white font-light tracking-wide">เพิ่มสาขาใหม่ (Add New Branch)</h3>
                <p className="text-xs text-[#8C7B6B]">คัดลอกรูปแบบสาขาหลักเพื่อปรับแต่งข้อมูล ตัวอย่างภาพ และงบประมาณเป็นของสาขาใหม่ได้อิสระ</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#C9A96E] uppercase tracking-wider font-semibold">ชื่อสาขา (Branch Name)</label>
                <input 
                  type="text" 
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="เช่น PASAYA Shop ทองหล่อ, Mega Bangna" 
                  className="w-full bg-[#111008] border border-[#C9A96E]/20 focus:border-[#C9A96E] text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddStore();
                  }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border border-white/10 hover:bg-white/5 text-gray-300 font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก (Cancel)
                </button>
                <button 
                  onClick={handleAddStore}
                  className="flex-1 bg-[#C9A96E] hover:bg-[#E8D5B0] text-black font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  สร้างสาขา (Create)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ PASSWORD CHECK CUSTOM MODAL ═══ */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1C1A11] border border-[#C9A96E]/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#C9A96E]/10 flex items-center justify-center border border-[#C9A96E]/20 text-[#C9A96E] mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-white font-light tracking-wide">เข้าสู่โหมดแก้ไข</h3>
                <p className="text-xs text-[#8C7B6B]">กรุณาระบุรหัสผ่านเพื่อสิทธิ์ในการแก้ไขข้อมูล</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#C9A96E] uppercase tracking-wider font-semibold">รหัสผ่าน (Password)</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="•••••••••" 
                  className={`w-full bg-[#111008] border text-white text-center text-lg tracking-[0.3em] font-mono rounded-xl px-4 py-3 outline-none transition-colors ${
                    passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-[#C9A96E]/20 focus:border-[#C9A96E]'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePasswordSubmit();
                  }}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-xs text-center font-medium mt-1">รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordInput("");
                    setPasswordError(false);
                  }}
                  className="flex-1 border border-white/10 hover:bg-[#1E1C11] text-gray-300 font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer animate-none bg-transparent"
                >
                  ยกเลิก (Cancel)
                </button>
                <button 
                  onClick={handlePasswordSubmit}
                  className="flex-1 bg-[#C9A96E] hover:bg-[#E8D5B0] text-black font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  ยืนยัน (Confirm)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden input for image uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* ═══ 1. HERO ═══ */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#2a1f0a_0%,#111008_60%)]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A96E] via-[#E8D5B0] to-transparent opacity-80" />
        
        <div className="text-center space-y-4 px-4 z-10 select-none">
          <EditableText 
            id="hero-label" 
            as="p" 
            className="text-[11px] font-semibold tracking-[6px] uppercase text-[#C9A96E]" 
          />
          
          <div className="space-y-1 py-2">
            <EditableText 
              id="hero-title-new" 
              as="h1" 
              className="text-6xl md:text-8xl lg:text-9xl font-serif font-light italic text-[#E8D5B0] tracking-tight leading-none" 
            />
            <br />
            <EditableText 
              id="hero-title-flagship" 
              as="h1" 
              className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-white tracking-tight leading-none" 
            />
          </div>

          <EditableText 
            id="hero-subtitle" 
            as="p" 
            className="text-lg md:text-2xl font-serif text-[#C9A96E] tracking-[8px] uppercase mt-4 block" 
          />
        </div>

        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent my-10 z-10" />

        {/* Scroll link to Entrance */}
        <div 
          onClick={() => document.getElementById('entrance')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-2 text-[#8C7B6B] text-[11px] tracking-[4px] uppercase cursor-pointer hover:text-white transition-colors z-10 group mt-4"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#C9A96E] to-transparent animate-pulse group-hover:h-16 transition-all duration-300" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ═══ 2. ENTRANCE ═══ */}
      <section id="entrance" className="bg-[#111008] py-16 px-6 md:px-12 border-b border-[#C9A96E]/10">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-[#C9A96E]/15 group bg-[#0a0806] shadow-2xl">
            <motion.img 
              src={images.entrance} 
              alt="Seasons Village Entrance" 
              className="w-full h-full object-cover opacity-100 origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1.0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              referrerPolicy="no-referrer"
              onClick={() => setLightboxImage({ src: images.entrance, title: 'Entrance / ทางเข้าสาขา' })}
            />
            {/* Dark gradient overlay to guarantee exquisite text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Subtle overlay for Upload when in Edit Mode */}
            {isEditMode && (
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => triggerImageUpload('entrance')}
                  className="flex items-center gap-2 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-4 py-2 rounded-full shadow-lg transition-colors cursor-pointer pointer-events-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>เปลี่ยนรูป (Upload)</span>
                </button>
              </div>
            )}

            {/* Text Overlay within the card container */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4">
              <EditableText 
                id="entrance-badge" 
                as="div" 
                className="inline-block border border-[#C9A96E]/40 px-3 py-1 text-[10px] tracking-[4px] uppercase text-[#C9A96E] font-medium rounded bg-[#111008]/40 backdrop-blur-sm" 
              />
              <EditableText 
                id="entrance-name" 
                as="h2" 
                className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white block leading-tight" 
              />
              <EditableText 
                id="entrance-sub" 
                as="p" 
                className="text-[#8C7B6B] text-xs md:text-sm tracking-[1.5px] block" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. 3D RENDERS SECTION ═══ */}
      <section className="bg-[#0d0c07] py-24 px-6 md:px-12 border-b border-[#C9A96E]/10">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Renders Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <EditableText id="renders-eyebrow" as="p" className="text-[10px] font-bold tracking-[6px] uppercase text-[#C9A96E]" />
            <EditableText id="renders-title" as="h2" className="text-4xl md:text-6xl font-serif font-light text-white block" />
            <EditableText id="renders-desc-main" as="p" className="text-[#8C7B6B] text-sm md:text-base leading-relaxed mt-2 block" />
          </div>

          {/* Exterior Renders (01, 02, 03) in a uniform 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Render Item 01: หน้าร้าน */}
            <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col h-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden group bg-[#0c0a06]">
                <motion.img 
                  src={images.facade} 
                  alt="Facade Render" 
                  className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxImage({ src: images.facade, title: '01 Exterior Facade / หน้าร้านพลาซ่า' })}
                />
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => triggerImageUpload('facade')}
                      className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>เปลี่ยนรูป (Upload)</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3 border-t border-[#C9A96E]/10 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-serif text-4xl font-extralight text-[#C9A96E]/20 select-none">01</div>
                  <EditableText id="render-01-title" as="h3" className="text-xl font-serif text-white block" />
                  <EditableText id="render-01-desc" as="p" className="text-xs text-[#8C7B6B] leading-relaxed block" />
                </div>
              </div>
            </div>

            {/* Render Item 02: ด้านข้าง */}
            <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col h-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden group bg-[#0c0a06]">
                <motion.img 
                  src={images.sideview} 
                  alt="Side View Render" 
                  className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxImage({ src: images.sideview, title: '02 Side View / ด้านข้างโครงการ' })}
                />
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => triggerImageUpload('sideview')}
                      className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>เปลี่ยนรูป (Upload)</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3 border-t border-[#C9A96E]/10 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-serif text-4xl font-extralight text-[#C9A96E]/20 select-none">02</div>
                  <EditableText id="render-02-title" as="h3" className="text-xl font-serif text-white block" />
                  <EditableText id="render-02-desc" as="p" className="text-xs text-[#8C7B6B] leading-relaxed block" />
                </div>
              </div>
            </div>

            {/* Render Item 03: ด้านหลัง */}
            <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col h-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden group bg-[#0c0a06]">
                <motion.img 
                  src={images.backview} 
                  alt="Back View Render" 
                  className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxImage({ src: images.backview, title: '03 Back View / ด้านหลังอาคาร' })}
                />
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => triggerImageUpload('backview')}
                      className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>เปลี่ยนรูป (Upload)</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3 border-t border-[#C9A96E]/10 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-serif text-4xl font-extralight text-[#C9A96E]/20 select-none">03</div>
                  <EditableText id="render-03-title" as="h3" className="text-xl font-serif text-white block" />
                  <EditableText id="render-03-desc" as="p" className="text-xs text-[#8C7B6B] leading-relaxed block" />
                </div>
              </div>
            </div>
          </div>

          {/* Interior Renders (04, 06) in a uniform 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Render Item 04: จัดแสดงชั้น 1 */}
            <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col h-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden group bg-[#0c0a06]">
                <motion.img 
                  src={images.floor1_interior} 
                  alt="1st Floor Interior Render" 
                  className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxImage({ src: images.floor1_interior, title: '04 1st Floor Showroom / สเปซภายในชั้น 1' })}
                />
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => triggerImageUpload('floor1_interior')}
                      className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>เปลี่ยนรูป (Upload)</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 space-y-3 border-t border-[#C9A96E]/10 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-serif text-4xl font-extralight text-[#C9A96E]/20 select-none">04</div>
                  <EditableText id="render-04-title" as="h3" className="text-2xl font-serif text-white block" />
                  <EditableText id="render-04-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
                </div>
              </div>
            </div>

            {/* Render Item 06: จัดแสดงชั้น 2 */}
            <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col h-full">
              <div className="relative aspect-[16/9] w-full overflow-hidden group bg-[#0c0a06]">
                <motion.img 
                  src={images.floor2_interior} 
                  alt="2nd Floor Interior Render" 
                  className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1.0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxImage({ src: images.floor2_interior, title: '06 2nd Floor Interior / โชว์รูมและสตูดิโอชั้น 2' })}
                />
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => triggerImageUpload('floor2_interior')}
                      className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>เปลี่ยนรูป (Upload)</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 space-y-3 border-t border-[#C9A96E]/10 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-serif text-4xl font-extralight text-[#C9A96E]/20 select-none">06</div>
                  <EditableText id="render-06-title" as="h3" className="text-2xl font-serif text-white block" />
                  <EditableText id="render-06-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
                </div>
              </div>
            </div>
          </div>

          {/* Render Item 05: FLOOR PLANS DISPLAY (Full width, positioned below the grid cards) */}
          <div className="border border-[#C9A96E]/15 rounded-2xl overflow-hidden bg-[#121109] p-8 md:p-12 space-y-8 relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
            
            <div className="max-w-3xl space-y-2">
              <div className="font-serif text-6xl md:text-7xl font-extralight text-[#C9A96E]/20 select-none">05</div>
              <EditableText id="render-05-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-05-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
              {/* Floor 1 Floor Plan */}
              <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-xl flex flex-col h-full">
                <div className="relative aspect-[16/10] w-full overflow-hidden group bg-[#0c0a06]">
                  <motion.img 
                    src={floorPlanImages[1] || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200'} 
                    alt="Floor 1 Floor Plan" 
                    className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                    initial={{ scale: 1.02 }}
                    whileInView={{ scale: 1.0 }}
                    viewport={{ once: true }}
                    referrerPolicy="no-referrer"
                    onClick={() => setLightboxImage({ 
                      src: floorPlanImages[1] || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200', 
                      title: '05 Floor 1 Blueprint / แปลนอาคารชั้น 1' 
                    })}
                  />
                  {isEditMode && (
                    <div className="absolute top-4 right-4 z-10">
                      <label className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>อัปโหลดแปลน ชั้น 1</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFloorPlanUploadDirect(1, file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="p-5 border-t border-[#C9A96E]/10 bg-black/20">
                  <h4 className="font-serif text-lg text-white">แปลนจัดวางเฟอร์นิเจอร์ ชั้น 1 (1st Floor Plan)</h4>
                  <p className="text-xs text-[#8C7B6B] mt-1">แสดงการจัดวางสินค้าผ้าม่าน โซนต้อนรับ และห้องที่ปรึกษาดีไซเนอร์</p>
                </div>
              </div>

              {/* Floor 2 Floor Plan */}
              <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-xl flex flex-col h-full">
                <div className="relative aspect-[16/10] w-full overflow-hidden group bg-[#0c0a06]">
                  <motion.img 
                    src={floorPlanImages[2] || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200'} 
                    alt="Floor 2 Floor Plan" 
                    className="w-full h-full object-cover origin-center cursor-zoom-in hover:brightness-110 transition-all duration-300"
                    initial={{ scale: 1.02 }}
                    whileInView={{ scale: 1.0 }}
                    viewport={{ once: true }}
                    referrerPolicy="no-referrer"
                    onClick={() => setLightboxImage({ 
                      src: floorPlanImages[2] || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200', 
                      title: '05 Floor 2 Blueprint / แปลนอาคารชั้น 2' 
                    })}
                  />
                  {isEditMode && (
                    <div className="absolute top-4 right-4 z-10">
                      <label className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-[#E8D5B0] border border-[#C9A96E]/40 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>อัปโหลดแปลน ชั้น 2</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFloorPlanUploadDirect(2, file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="p-5 border-t border-[#C9A96E]/10 bg-black/20">
                  <h4 className="font-serif text-lg text-white">แปลนจัดวางเฟอร์นิเจอร์ ชั้น 2 (2nd Floor Plan)</h4>
                  <p className="text-xs text-[#8C7B6B] mt-1">ผังการจัดแสดงสินค้าชุดเครื่องนอน โซน Co-working และห้องทำงานผู้บริหาร</p>
                </div>
              </div>
            </div>
          </div>



        </div>
      </section>

      {/* ═══ 4. REASONS (STRATEGIC LOCATION) ═══ */}
      <section className="bg-gradient-to-b from-[#111008] to-[#0d0c07] py-24 px-6 md:px-12 border-b border-[#C9A96E]/10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <EditableText id="location-eyebrow" as="p" className="text-[10px] font-bold tracking-[6px] uppercase text-[#C9A96E]" />
            <EditableText id="location-title" as="h2" className="text-4xl md:text-6xl font-serif font-light text-white block" />
            <div className="w-16 h-[2px] bg-[#C9A96E] mt-4" />
          </div>

          {/* Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Seasons Village Benefits (Wide Card) */}
            <div className="bg-[#151309] border border-[#C9A96E]/15 p-8 md:p-10 rounded-2xl md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9A96E]/10 rounded-lg text-[#C9A96E]">
                  <Store className="w-6 h-6" />
                </div>
                <EditableText id="reason-village-title" as="h3" className="text-xl md:text-2xl font-serif text-white font-normal" />
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm text-[#8C7B6B]">
                {lists.reasonsVillage.map((_, idx) => (
                  <EditableLi key={idx} listKey="reasonsVillage" index={idx} className="list-none pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#C9A96E]" />
                ))}
              </ul>
            </div>

            {/* 2. Luxury Houses */}
            <div className="bg-[#151309] border border-[#C9A96E]/10 p-8 rounded-2xl space-y-6 hover:bg-[#1c1910] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9A96E]/10 rounded-lg text-[#C9A96E]">
                  <Home className="w-5 h-5" />
                </div>
                <EditableText id="reason-houses-title" as="h3" className="text-lg font-serif text-white font-normal" />
              </div>

              <ul className="space-y-3 text-xs md:text-sm text-[#8C7B6B]">
                {lists.reasonsHouses.map((_, idx) => (
                  <EditableLi key={idx} listKey="reasonsHouses" index={idx} className="list-none pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#C9A96E]" />
                ))}
              </ul>
            </div>

            {/* 3. Education institutions */}
            <div className="bg-[#151309] border border-[#C9A96E]/10 p-8 rounded-2xl space-y-6 hover:bg-[#1c1910] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9A96E]/10 rounded-lg text-[#C9A96E]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <EditableText id="reason-edu-title" as="h3" className="text-lg font-serif text-white font-normal" />
              </div>

              <ul className="space-y-3 text-xs md:text-sm text-[#8C7B6B]">
                {lists.reasonsEdu.map((_, idx) => (
                  <EditableLi key={idx} listKey="reasonsEdu" index={idx} className="list-none pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#C9A96E]" />
                ))}
              </ul>
            </div>

            {/* 4. Malls & Shopping */}
            <div className="bg-[#151309] border border-[#C9A96E]/10 p-8 rounded-2xl space-y-6 hover:bg-[#1c1910] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9A96E]/10 rounded-lg text-[#C9A96E]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <EditableText id="reason-malls-title" as="h3" className="text-lg font-serif text-white font-normal" />
              </div>

              <ul className="space-y-3 text-xs md:text-sm text-[#8C7B6B]">
                {lists.reasonsMalls.map((_, idx) => (
                  <EditableLi key={idx} listKey="reasonsMalls" index={idx} className="list-none pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#C9A96E]" />
                ))}
              </ul>
            </div>

            {/* 5. Restaurants & Famous Cafes (Wide) */}
            <div className="bg-[#151309] border border-[#C9A96E]/10 p-8 md:p-10 rounded-2xl md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C9A96E]/10 rounded-lg text-[#C9A96E]">
                  <Coffee className="w-5 h-5" />
                </div>
                <EditableText id="reason-cafes-title" as="h3" className="text-lg font-serif text-white font-normal" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-3 text-xs md:text-sm text-[#8C7B6B]">
                  {lists.reasonsCafes1.map((_, idx) => (
                    <EditableLi key={idx} listKey="reasonsCafes1" index={idx} className="list-none pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#C9A96E]" />
                  ))}
                </ul>
                <ul className="space-y-3 text-xs md:text-sm text-[#8C7B6B]">
                  {lists.reasonsCafes2.map((_, idx) => (
                    <EditableLi key={idx} listKey="reasonsCafes2" index={idx} className="list-none pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#C9A96E]" />
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 5. BUDGET SUMMARY (INTERACTIVE LEDGER & SIMULATOR) ═══ */}
      <section className="bg-[#0a0806] py-24 px-6 md:px-12 border-b border-[#C9A96E]/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <EditableText id="budget-eyebrow" as="p" className="text-[10px] font-bold tracking-[6px] uppercase text-[#C9A96E]" />
            <EditableText id="budget-title" as="h2" className="text-4xl md:text-6xl font-serif font-light text-white block" />
            <div className="w-16 h-[2px] bg-[#C9A96E] mt-4" />
          </div>

          {/* Embed the beautiful interactive budget spreadsheet, barter, and operating model calculator! */}
          <div className="pt-4">
            <BudgetCalculator 
              isEditMode={isEditMode} 
              items={budgetItems}
              onItemsChange={handleBudgetChange}
              barters={barterItems}
              onBartersChange={handleBartersChange}
            />
          </div>

        </div>
      </section>

      {/* ═══ 6. BUSINESS GOALS & PROJECTIONS ═══ */}
      <section className="bg-[#111008] py-24 px-6 md:px-12 border-b border-[#C9A96E]/10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header */}
          <div className="max-w-3xl space-y-3 text-center mx-auto">
            <EditableText id="goals-eyebrow" as="p" className="text-[10px] font-bold tracking-[6px] uppercase text-[#C9A96E]" />
            <EditableText id="goals-title" as="h2" className="text-4xl md:text-6xl font-serif font-light text-white block" />
          </div>

          {/* Projections Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Projected Revenue Table */}
            <div className="bg-[#151309] border-t-2 border-[#C9A96E] p-8 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#C9A96E]" />
                <EditableText id="goal-sales-title" as="h3" className="text-xl md:text-2xl font-serif text-white font-normal" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm text-[#8C7B6B] border-collapse">
                  <tbody>
                    <tr className="border-b border-white/5"><td className="py-3">เดือนแรก (Grand Opening)</td><td className="py-3 text-right text-[#E8D5B0] font-serif text-lg">1,200,000 ฿</td></tr>
                    <tr className="border-b border-white/5"><td className="py-3">เดือน 2–6 (Ramp-up)</td><td className="py-3 text-right text-[#E8D5B0] font-serif text-lg">1,800,000 ฿/เดือน</td></tr>
                    <tr className="border-b border-white/5"><td className="py-3">เดือน 7–12 (Steady)</td><td className="py-3 text-right text-[#E8D5B0] font-serif text-lg">2,500,000 ฿/เดือน</td></tr>
                    <tr className="border-b border-white/5"><td className="py-3"><strong>ยอดรวมปีที่ 1</strong></td><td className="py-3 text-right text-[#C9A96E] font-serif text-xl font-semibold">24,000,000 ฿</td></tr>
                    <tr className="border-b border-white/5"><td className="py-3">ปีที่ 2 (เต็มศักยภาพ)</td><td className="py-3 text-right text-[#E8D5B0] font-serif text-lg">32,000,000 ฿</td></tr>
                    <tr className="border-b border-white/5"><td className="py-3">ปีที่ 3 (ขยายฐาน B2B)</td><td className="py-3 text-right text-[#E8D5B0] font-serif text-lg">42,000,000 ฿</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payback timeline card */}
            <div className="bg-[#151309] p-8 rounded-2xl flex flex-col justify-between border border-white/5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-[#C9A96E]" />
                  <EditableText id="goal-payback-title" as="h3" className="text-xl md:text-2xl font-serif text-white font-normal" />
                </div>
                
                {/* Grand visual metric */}
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-7xl md:text-8xl font-light text-[#C9A96E] leading-none">18</span>
                  <span className="text-xs tracking-widest text-[#8C7B6B] uppercase font-semibold">เดือน (Months)</span>
                </div>

                <EditableText id="goal-payback-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-[10px] md:text-xs text-[#8C7B6B]">
                <div>
                  <p className="text-white font-serif font-semibold">~50%</p>
                  <p className="text-[9px] mt-0.5 uppercase tracking-wider text-gray-500">Gross Margin</p>
                </div>
                <div>
                  <p className="text-white font-serif font-semibold">1.2M ฿</p>
                  <p className="text-[9px] mt-0.5 uppercase tracking-wider text-gray-500">Break-even /Mo</p>
                </div>
                <div>
                  <p className="text-white font-serif font-semibold">~38%</p>
                  <p className="text-[9px] mt-0.5 uppercase tracking-wider text-gray-500">IRR Year 3</p>
                </div>
              </div>
            </div>

          </div>

          {/* Benefits Grid (B2C, B2B, Brand Equity) */}
          <div className="bg-[#151309] border border-[#C9A96E]/10 rounded-2xl p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Award className="w-6 h-6 text-[#C9A96E]" />
              <EditableText id="goal-benefits-title" as="h3" className="text-xl md:text-2xl font-serif text-white font-normal" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Column 1: B2C */}
              <div className="space-y-4">
                <h4 className="text-sm font-serif font-semibold text-[#E8D5B0] tracking-wider uppercase border-b border-white/5 pb-2">B2C Benefits</h4>
                <div className="space-y-4 text-xs md:text-sm text-[#8C7B6B] leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Brand Visibility</strong>
                      <span>หน้าร้านพรีเมียมสร้าง Brand Awareness ให้กับกลุ่ม High-end ย่านราชพฤกษ์</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Walk-in Experience</strong>
                      <span>ลูกค้าสัมผัสเนื้อผ้าและวัสดุจริง ช่วยเพิ่มอัตราการตัดสินใจซื้อได้สูง</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Cross-sell Solutions</strong>
                      <span>ผ้าม่าน ผ้าม่านมอเตอร์ และ bedding ครบคอลเลกชัน เพิ่มขนาดตะกร้าซื้อเฉลี่ย</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: B2B */}
              <div className="space-y-4">
                <h4 className="text-sm font-serif font-semibold text-[#E8D5B0] tracking-wider uppercase border-b border-white/5 pb-2">B2B Benefits</h4>
                <div className="space-y-4 text-xs md:text-sm text-[#8C7B6B] leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Showroom for Architects</strong>
                      <span>เป็นจุดต้อนรับและสเปกงานให้กับอินทีเรียดีไซเนอร์และโครงการรอบนนทบุรี</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Dedicated B2B Meeting</strong>
                      <span>ห้องประชุมชั้น 2 ออกแบบเพื่อเจรจาสเปกผ้าหน่วงไฟ งานโรงแรม และโครงการขนาดใหญ่</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Local Network Hub</strong>
                      <span>สร้างพันธมิตรกับโครงการหมู่บ้านหรูระดับ 10 ล้านบาทขึ้นไปเพื่อบริการติดตั้งด่วน</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Brand Equity */}
              <div className="space-y-4">
                <h4 className="text-sm font-serif font-semibold text-[#E8D5B0] tracking-wider uppercase border-b border-white/5 pb-2">Brand Equity</h4>
                <div className="space-y-4 text-xs md:text-sm text-[#8C7B6B] leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Flagship Prestige</strong>
                      <span>สาขารวมผลงานระดับเรือธง ยกระดับความน่าเชื่อถือให้ภาพลักษณ์ Luxury ของแบรนด์</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Content Creation Hub</strong>
                      <span>ฉากจัดแสดงที่หรูหราทำหน้าที่เป็นสตูดิโอถ่ายทำสื่อและเรื่องเล่าสำหรับแคมเปญออนไลน์</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">VIP Workshop Space</strong>
                      <span>จัดกิจกรรมจัดเซ็ตติ้งผ้าปูเตียงและคอร์สแต่งบ้านเพื่อสร้างความใกล้ชิดกับลูกค้า VIP</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>



      {/* ═══ 8. FOOTER ═══ */}
      <footer className="bg-[#0a0806] py-16 px-6 text-center border-t border-[#C9A96E]/15 select-none">
        <div className="max-w-7xl mx-auto space-y-6">
          <p className="font-serif text-3xl font-light tracking-[10px] text-[#C9A96E] uppercase">PASAYA</p>
          <p className="text-[#8C7B6B] text-[10px] uppercase tracking-[6px]">Curtain Center · Seasons Village ราชพฤกษ์</p>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#C9A96E] to-transparent mx-auto my-4" />
          <p className="text-[11px] text-gray-600 tracking-wide">
            Flagship Store Opening Presentation · Confidential Draft
          </p>
        </div>
      </footer>

      {/* ═══ 9. FLOATING ACTION TOAST & EDIT MODE CONTROL ═══ */}
      {/* Toast */}
      <div 
        className={`fixed bottom-24 right-6 bg-white text-black px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl z-[99] transition-all duration-300 flex items-center gap-2 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span>{toastMessage}</span>
      </div>

      {/* Floating Edit Mode Toggle Button */}
      {isEditMode && (
        <button
          onClick={toggleEditMode}
          className="fixed bottom-6 right-6 px-6 py-3 rounded-full font-semibold text-sm shadow-xl z-50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer bg-[#C9A96E] text-[#111008] hover:bg-[#E8D5B0]"
        >
          <Check className="w-4 h-4" />
          <span>บันทึก & ปิดโหมดแก้ไข</span>
        </button>
      )}

      {/* ═══ LIGHTBOX FULLSCREEN MODAL ═══ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            {/* Top Info Bar */}
            <div className="absolute top-6 left-6 text-left pointer-events-none">
              <span className="text-[10px] tracking-widest text-[#C9A96E] font-mono font-bold uppercase block mb-1">
                HIGH-RESOLUTION RENDER VIEWER
              </span>
              <h4 className="text-xl font-serif text-white">{lightboxImage.title}</h4>
            </div>

            {/* Main Image Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-5xl max-h-[75vh] flex items-center justify-center select-none z-10 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg border border-[#C9A96E]/20 shadow-[0_0_50px_rgba(201,169,110,0.15)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Close Button - positioned on top */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer z-50"
              title="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Bottom Help Text */}
            <div className="absolute bottom-6 text-center text-xs text-gray-500 font-mono pointer-events-none">
              คลิกบริเวณรอบนอกเพื่อปิดหน้าต่างนี้ • PASAYA Flagship Gallery
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
