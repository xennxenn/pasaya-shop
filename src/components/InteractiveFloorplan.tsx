import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Award, Settings, ShieldCheck, MapPin, Edit3, Check, Coffee, Compass, Eye, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { ShowroomZone } from '../types';

interface InteractiveFloorplanProps {
  isEditMode: boolean;
  onZoneSelect?: (zoneId: string) => void;
}

const initialZones: ShowroomZone[] = [
  // Floor 1
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
  // Floor 2
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

interface InteractiveFloorplanProps {
  isEditMode: boolean;
  onZoneSelect?: (zoneId: string) => void;
  zones: ShowroomZone[];
  onZonesChange: (newZones: ShowroomZone[]) => void;
  floorPlans: Record<number, string>;
  onFloorPlansChange: (newFloorPlans: Record<number, string>) => void;
}

export const InteractiveFloorplan: React.FC<InteractiveFloorplanProps> = ({ 
  isEditMode, 
  zones, 
  onZonesChange, 
  floorPlans, 
  onFloorPlansChange 
}) => {
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-a');
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'hybrid' | 'imageOnly' | 'gridOnly'>('hybrid');
  const [bgOpacity, setBgOpacity] = useState<number>(0.55);

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
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
          
          const updatedPlans = { ...floorPlans, [activeFloor]: dataUrl };
          onFloorPlansChange(updatedPlans);
          
          const toast = document.getElementById('saveToast');
          if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
          }
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetFloorPlan = () => {
    const updatedPlans = { ...floorPlans, [activeFloor]: '' };
    onFloorPlansChange(updatedPlans);
  };

  const saveZones = (updatedZones: ShowroomZone[]) => {
    onZonesChange(updatedZones);
  };

  const handleUpdateZoneField = (id: string, field: keyof ShowroomZone, value: any) => {
    const updated = zones.map(z => {
      if (z.id === id) {
        return { ...z, [field]: value };
      }
      return z;
    });
    saveZones(updated);
  };

  const handleAddProduct = (zoneId: string, product: string) => {
    if (!product.trim()) return;
    const updated = zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, products: [...z.products, product] };
      }
      return z;
    });
    saveZones(updated);
  };

  const handleRemoveProduct = (zoneId: string, index: number) => {
    const updated = zones.map(z => {
      if (z.id === zoneId) {
        const copy = [...z.products];
        copy.splice(index, 1);
        return { ...z, products: copy };
      }
      return z;
    });
    saveZones(updated);
  };

  const currentZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const floorZones = zones.filter(z => z.floor === activeFloor);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Settings': return <Settings className="w-5 h-5" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full" id="interactive-showroom">
      {/* Left side: Interactive Map Visualizer */}
      <div className="w-full bg-[#121109] border border-[#C9A96E]/20 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="text-[#C9A96E] w-5 h-5" />
              <h4 className="font-serif text-xl font-medium tracking-wide text-white">Interactive Blueprint</h4>
            </div>
            
            {/* Floor Toggles */}
            <div className="flex bg-[#1E1C11] p-1 rounded-lg border border-[#C9A96E]/10">
              <button
                onClick={() => { setActiveFloor(1); setSelectedZoneId(activeFloor === 1 ? selectedZoneId : 'zone-a'); }}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all rounded-md ${
                  activeFloor === 1 ? 'bg-[#C9A96E] text-[#111008]' : 'text-gray-400 hover:text-white'
                }`}
              >
                1st Floor
              </button>
              <button
                onClick={() => { setActiveFloor(2); setSelectedZoneId(activeFloor === 2 ? selectedZoneId : 'suite-royal'); }}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all rounded-md ${
                  activeFloor === 2 ? 'bg-[#C9A96E] text-[#111008]' : 'text-gray-400 hover:text-white'
                }`}
              >
                2nd Floor
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4 font-mono">
            * คอนเทนเนอร์ 2 ชั้น พื้นที่ใช้งานเต็มรูปแบบ ออกแบบทางเดินลื่นไหล ดึงดูดสายตาจากภายนอก
          </p>

          {/* Hidden file input for floor plans */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFloorPlanUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Floor Plan Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#1E1C11]/80 p-3 rounded-xl border border-[#C9A96E]/10">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#C9A96E] font-medium font-serif">Floor Plan {activeFloor}:</span>
              <button
                type="button"
                onClick={() => setViewMode('hybrid')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  viewMode === 'hybrid' ? 'bg-[#C9A96E] text-[#111008] font-semibold' : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                ผสมผสาน (Hybrid)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('imageOnly')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  viewMode === 'imageOnly' ? 'bg-[#C9A96E] text-[#111008] font-semibold' : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                แปลนวาดจริง (Image Only)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gridOnly')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  viewMode === 'gridOnly' ? 'bg-[#C9A96E] text-[#111008] font-semibold' : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                แบบจำลอง (Interactive Grid)
              </button>
            </div>

            <div className="flex items-center gap-3">
              {viewMode === 'hybrid' && floorPlans[activeFloor] && (
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span>ความเข้มรูป:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                    className="w-16 accent-[#C9A96E] cursor-pointer"
                  />
                  <span className="font-mono text-[10px] w-8">{Math.round(bgOpacity * 100)}%</span>
                </div>
              )}

              {isEditMode && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 border border-[#C9A96E]/30 text-[#E8D5B0] px-2.5 py-1 rounded text-xs transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{floorPlans[activeFloor] ? 'เปลี่ยนรูปแปลน' : 'อัปโหลดรูปแปลน'}</span>
                  </button>
                  {floorPlans[activeFloor] && (
                    <button
                      type="button"
                      onClick={handleResetFloorPlan}
                      className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded border border-red-500/20 transition-colors"
                      title="ล้างรูปและใช้แบบจำลองมาตรฐาน"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Visual Floor Blueprint Container */}
          <div className="relative aspect-[16/10] bg-[#1A1910] border border-[#C9A96E]/15 rounded-xl overflow-hidden p-6 flex flex-col justify-between">
            {/* Grid background for technical blueprint feeling */}
            <div className="absolute inset-0 bg-[radial-gradient(#C9A96E/5%_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-[1]" />

            {/* Custom Uploaded Floor Plan Image Background */}
            {floorPlans[activeFloor] && viewMode !== 'gridOnly' && (
              <img 
                src={floorPlans[activeFloor]} 
                alt={`Floor ${activeFloor} Custom Plan`}
                className="absolute inset-0 w-full h-full object-contain bg-[#1A1910] transition-opacity duration-300"
                style={{ opacity: viewMode === 'imageOnly' ? 1.0 : bgOpacity }}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Entrance indicator for Floor 1 */}
            {activeFloor === 1 && viewMode !== 'imageOnly' && (
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 bg-[#C9A96E] text-[#111008] text-[9px] font-bold tracking-widest uppercase py-1 px-4 rounded-full z-10 border border-[#111008]">
                MAIN ENTRANCE (จาก Seasons Village)
              </div>
            )}

            {/* Simulated Architecture Blueprint Box */}
            <div 
              className="relative w-full h-full grid grid-cols-12 grid-rows-6 gap-3 pt-4 pb-4 transition-all duration-300 z-[2]"
              style={{
                opacity: viewMode === 'imageOnly' ? 0.05 : 1.0,
                pointerEvents: viewMode === 'imageOnly' ? 'none' : 'auto'
              }}
            >
              {activeFloor === 1 ? (
                <>
                  {/* Zone A: Luxury (Top Left) */}
                  <button
                    onClick={() => setSelectedZoneId('zone-a')}
                    className={`col-span-6 row-span-3 rounded-lg border flex flex-col justify-between p-4 transition-all relative group ${
                      selectedZoneId === 'zone-a'
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-white shadow-lg shadow-[#C9A96E]/5'
                        : 'bg-[#1E1C11]/50 border-white/5 hover:border-[#C9A96E]/40 text-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-[#C9A96E]/50">01 / A</span>
                    <Compass className={`w-5 h-5 ${selectedZoneId === 'zone-a' ? 'text-[#C9A96E]' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-1">Luxury Collection</p>
                      <p className="text-sm font-serif font-medium line-clamp-1 group-hover:text-white transition-colors">
                        {zones.find(z => z.id === 'zone-a')?.name}
                      </p>
                    </div>
                  </button>

                  {/* Zone B: Smart Curtains (Top Right) */}
                  <button
                    onClick={() => setSelectedZoneId('zone-b')}
                    className={`col-span-6 row-span-3 rounded-lg border flex flex-col justify-between p-4 transition-all relative group ${
                      selectedZoneId === 'zone-b'
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-white shadow-lg shadow-[#C9A96E]/5'
                        : 'bg-[#1E1C11]/50 border-white/5 hover:border-[#C9A96E]/40 text-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-[#C9A96E]/50">02 / B</span>
                    <Settings className={`w-5 h-5 ${selectedZoneId === 'zone-b' ? 'text-[#C9A96E]' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-1">Smart curtains</p>
                      <p className="text-sm font-serif font-medium line-clamp-1 group-hover:text-white transition-colors">
                        {zones.find(z => z.id === 'zone-b')?.name}
                      </p>
                    </div>
                  </button>

                  {/* Zone Lounge: Marble Table Consultation (Center-Bottom Left) */}
                  <button
                    onClick={() => setSelectedZoneId('zone-lounge')}
                    className={`col-span-7 row-span-3 rounded-lg border flex flex-col justify-between p-4 transition-all relative group ${
                      selectedZoneId === 'zone-lounge'
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-white shadow-lg shadow-[#C9A96E]/5'
                        : 'bg-[#1E1C11]/50 border-white/5 hover:border-[#C9A96E]/40 text-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-[#C9A96E]/50">03 / Lounge</span>
                    <Coffee className={`w-5 h-5 ${selectedZoneId === 'zone-lounge' ? 'text-[#C9A96E]' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-1">VIP Consultation</p>
                      <p className="text-sm font-serif font-medium line-clamp-1 group-hover:text-white transition-colors">
                        {zones.find(z => z.id === 'zone-lounge')?.name}
                      </p>
                    </div>
                  </button>

                  {/* Zone C: Decorative (Center-Bottom Right) */}
                  <button
                    onClick={() => setSelectedZoneId('zone-c')}
                    className={`col-span-5 row-span-3 rounded-lg border flex flex-col justify-between p-4 transition-all relative group ${
                      selectedZoneId === 'zone-c'
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-white shadow-lg shadow-[#C9A96E]/5'
                        : 'bg-[#1E1C11]/50 border-white/5 hover:border-[#C9A96E]/40 text-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-[#C9A96E]/50">04 / C</span>
                    <LayoutDashboard className={`w-5 h-5 ${selectedZoneId === 'zone-c' ? 'text-[#C9A96E]' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-1">Accessories</p>
                      <p className="text-sm font-serif font-medium line-clamp-1 group-hover:text-white transition-colors">
                        {zones.find(z => z.id === 'zone-c')?.name}
                      </p>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {/* Zone Royal Bedding: (Left Side) */}
                  <button
                    onClick={() => setSelectedZoneId('suite-royal')}
                    className={`col-span-7 row-span-6 rounded-lg border flex flex-col justify-between p-4 transition-all relative group ${
                      selectedZoneId === 'suite-royal'
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-white shadow-lg shadow-[#C9A96E]/5'
                        : 'bg-[#1E1C11]/50 border-white/5 hover:border-[#C9A96E]/40 text-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-[#C9A96E]/50">01 / Bedding Showcase</span>
                    <Award className={`w-5 h-5 ${selectedZoneId === 'suite-royal' ? 'text-[#C9A96E]' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-1">Luxury Bedroom Suites</p>
                      <p className="text-lg font-serif font-medium line-clamp-1 group-hover:text-white transition-colors">
                        {zones.find(z => z.id === 'suite-royal')?.name}
                      </p>
                    </div>
                  </button>

                  {/* Zone B2B Suite: (Right Side) */}
                  <button
                    onClick={() => setSelectedZoneId('suite-b2b')}
                    className={`col-span-5 row-span-6 rounded-lg border flex flex-col justify-between p-4 transition-all relative group ${
                      selectedZoneId === 'suite-b2b'
                        ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-white shadow-lg shadow-[#C9A96E]/5'
                        : 'bg-[#1E1C11]/50 border-white/5 hover:border-[#C9A96E]/40 text-gray-400'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-[#C9A96E]/50">02 / B2B Studio</span>
                    <ShieldCheck className={`w-5 h-5 ${selectedZoneId === 'suite-b2b' ? 'text-[#C9A96E]' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] font-semibold mb-1">Architect Lounge</p>
                      <p className="text-lg font-serif font-medium line-clamp-1 group-hover:text-white transition-colors">
                        {zones.find(z => z.id === 'suite-b2b')?.name}
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic tips based on active floor */}
        <div className="mt-6 p-4 bg-[#1E1C11] border border-white/5 rounded-xl">
          <p className="text-xs text-gray-400 leading-relaxed">
            💡 <strong className="text-white">จุดเด่นการจัดเรียง:</strong> {
              activeFloor === 1 
              ? 'จัดแบ่งโซนม่านตามกลุ่มฟังก์ชัน คลุมโทนสีเพื่อกระตุ้นอารมณ์หรูหรา และมีโต๊ะที่ปรึกษาเพื่อรับลูกค้าทันทีที่เข้ามา' 
              : 'สร้างบรรยากาศเหมือนอยู่บ้านจำลอง คอนเนกต์ลูกค้ากลุ่มพรีเมียมด้วย Bedding สดชื่นเย็นสบาย และมีห้องเจรจาธุรกิจแบบเป็นส่วนตัว'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
