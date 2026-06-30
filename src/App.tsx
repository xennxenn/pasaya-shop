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
  Upload
} from 'lucide-react';

import { InteractiveFloorplan } from './components/InteractiveFloorplan';
import { BudgetCalculator } from './components/BudgetCalculator';

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

export default function App() {
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pasaya_edit_mode');
    return saved ? JSON.parse(saved) : true;
  });

  const [texts, setTexts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('pasaya_editable_texts');
    return saved ? JSON.parse(saved) : defaultTexts;
  });

  const [lists, setLists] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('pasaya_lists');
    return saved ? JSON.parse(saved) : defaultLists;
  });

  const [images, setImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('pasaya_editable_images');
    return saved ? JSON.parse(saved) : defaultImages;
  });

  const [showToast, setShowToast] = useState(false);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    handleScroll(); // Trigger initial view check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showSaveToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleTextChange = (id: string, newVal: string) => {
    const updated = { ...texts, [id]: newVal };
    setTexts(updated);
    localStorage.setItem('pasaya_editable_texts', JSON.stringify(updated));
    showSaveToast();
  };

  const handleListChange = (listKey: string, index: number, newVal: string) => {
    const updatedLists = { ...lists };
    updatedLists[listKey][index] = newVal;
    setLists(updatedLists);
    localStorage.setItem('pasaya_lists', JSON.stringify(updatedLists));
    showSaveToast();
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
        const maxSize = 2000;

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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
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
        const updated = { ...images, [activeImageId]: base64 };
        setImages(updated);
        localStorage.setItem('pasaya_editable_images', JSON.stringify(updated));
        showSaveToast();
      });
    }
    e.target.value = ''; // Reset uploader
    setActiveImageId(null);
  };

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    localStorage.setItem('pasaya_edit_mode', JSON.stringify(newMode));
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
    <div className="bg-[#111008] text-[#FAF8F5] font-sans overflow-x-hidden selection:bg-[#C9A96E] selection:text-black">
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
      <section id="entrance" className="relative h-auto overflow-hidden bg-[#0a0806] border-y border-[#C9A96E]/10">
        <div className="w-full relative overflow-hidden group bg-[#0a0806]">
          <motion.img 
            src={images.entrance} 
            alt="Seasons Village Entrance" 
            className="w-full h-auto block bg-[#0a0806] opacity-100 origin-center"
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1.0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            referrerPolicy="no-referrer"
          />
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
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111008] via-[#111008]/80 to-transparent p-10 md:p-16">
          <div className="max-w-7xl mx-auto space-y-4">
            <EditableText 
              id="entrance-badge" 
              as="div" 
              className="inline-block border border-[#C9A96E] px-4 py-1.5 text-[10px] tracking-[5px] uppercase text-[#C9A96E] font-medium" 
            />
            <EditableText 
              id="entrance-name" 
              as="h2" 
              className="text-4xl md:text-6xl font-serif font-light text-white block" 
            />
            <EditableText 
              id="entrance-sub" 
              as="p" 
              className="text-[#8C7B6B] text-sm md:text-base tracking-[2px] block" 
            />
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

          {/* Render Item 01: หน้าร้าน */}
          <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col">
            <div className="relative w-full overflow-hidden group bg-[#0c0a06]">
              <motion.img 
                src={images.facade} 
                alt="Facade Render" 
                className="w-full h-auto block origin-center"
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                referrerPolicy="no-referrer"
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
            <div className="p-8 md:p-10 space-y-3 border-t border-[#C9A96E]/10">
              <div className="font-serif text-5xl font-extralight text-[#C9A96E]/20 select-none">01</div>
              <EditableText id="render-01-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-01-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
            </div>
          </div>

          {/* Render Item 02: ด้านข้าง */}
          <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col">
            <div className="relative w-full overflow-hidden group bg-[#0c0a06]">
              <motion.img 
                src={images.sideview} 
                alt="Side View Render" 
                className="w-full h-auto block origin-center"
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                referrerPolicy="no-referrer"
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
            <div className="p-8 md:p-10 space-y-3 border-t border-[#C9A96E]/10">
              <div className="font-serif text-5xl font-extralight text-[#C9A96E]/20 select-none">02</div>
              <EditableText id="render-02-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-02-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
            </div>
          </div>

          {/* Render Item 03: ด้านหลัง */}
          <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col">
            <div className="relative w-full overflow-hidden group bg-[#0c0a06]">
              <motion.img 
                src={images.backview} 
                alt="Back View Render" 
                className="w-full h-auto block origin-center"
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                referrerPolicy="no-referrer"
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
            <div className="p-8 md:p-10 space-y-3 border-t border-[#C9A96E]/10">
              <div className="font-serif text-5xl font-extralight text-[#C9A96E]/20 select-none">03</div>
              <EditableText id="render-03-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-03-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
            </div>
          </div>

          {/* Render Item 04: จัดแสดงชั้น 1 (รูปใหญ่) */}
          <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col">
            <div className="relative w-full overflow-hidden group bg-[#0c0a06]">
              <motion.img 
                src={images.floor1_interior} 
                alt="1st Floor Interior Render" 
                className="w-full h-auto block origin-center"
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                referrerPolicy="no-referrer"
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
            <div className="p-8 md:p-10 space-y-3 border-t border-[#C9A96E]/10">
              <div className="font-serif text-5xl font-extralight text-[#C9A96E]/20 select-none">04</div>
              <EditableText id="render-04-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-04-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
            </div>
          </div>

          {/* Render Item 05: INTERACTIVE BLUEPRINT SHOWROOM (Replacing static floor plan) */}
          <div className="border border-[#C9A96E]/15 rounded-2xl overflow-hidden bg-[#121109] p-8 md:p-12 space-y-8 relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
            
            <div className="max-w-3xl space-y-2">
              <div className="font-serif text-6xl md:text-7xl font-extralight text-[#C9A96E]/20 select-none">05</div>
              <EditableText id="render-05-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-05-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
            </div>

            {/* Embed the highly polished interactive blueprint showroom component! */}
            <div className="pt-4 border-t border-white/5">
              <InteractiveFloorplan isEditMode={isEditMode} />
            </div>
          </div>

          {/* Render Item 06: จัดแสดงชั้น 2 (รูปใหญ่) */}
          <div className="border border-[#C9A96E]/10 bg-[#151309]/50 overflow-hidden rounded-2xl flex flex-col">
            <div className="relative w-full overflow-hidden group bg-[#0c0a06]">
              <motion.img 
                src={images.floor2_interior} 
                alt="2nd Floor Interior Render" 
                className="w-full h-auto block origin-center"
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1.0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                referrerPolicy="no-referrer"
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
            <div className="p-8 md:p-10 space-y-3 border-t border-[#C9A96E]/10">
              <div className="font-serif text-5xl font-extralight text-[#C9A96E]/20 select-none">06</div>
              <EditableText id="render-06-title" as="h3" className="text-2xl md:text-3xl font-serif text-white block" />
              <EditableText id="render-06-desc" as="p" className="text-xs md:text-sm text-[#8C7B6B] leading-relaxed block" />
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
            <BudgetCalculator isEditMode={isEditMode} />
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
        <span>บันทึกข้อมูลแล้ว ✨</span>
      </div>

      {/* Floating Edit Mode Toggle Button */}
      <button
        onClick={toggleEditMode}
        className={`fixed bottom-6 right-6 px-6 py-3 rounded-full font-semibold text-sm shadow-xl z-50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer ${
          isEditMode
            ? 'bg-[#C9A96E] text-[#111008] hover:bg-[#E8D5B0]'
            : 'bg-[#2A2A2A] text-[#FAF8F5] border border-[#C9A96E]/30 hover:bg-[#333]'
        }`}
      >
        {isEditMode ? (
          <>
            <Check className="w-4 h-4" />
            <span>บันทึก & ปิดโหมดแก้ไข</span>
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4" />
            <span>เปิดโหมดแก้ไข</span>
          </>
        )}
      </button>

      {/* ═══ LIGHTBOX FULLSCREEN MODAL ═══ */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Top Info Bar */}
            <div className="absolute top-6 left-6 text-left">
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
              className="relative max-w-7xl max-h-[80vh] w-full h-full flex items-center justify-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-w-full max-h-full object-contain rounded-lg border border-[#C9A96E]/20 shadow-[0_0_50px_rgba(201,169,110,0.15)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Bottom Help Text */}
            <div className="absolute bottom-6 text-center text-xs text-gray-500 font-mono">
              คลิกบริเวณรอบนอกเพื่อปิดหน้าต่างนี้ • PASAYA Flagship Gallery
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
