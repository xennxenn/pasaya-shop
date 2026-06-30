import React, { useState } from 'react';
import { BudgetItem } from '../types';
import { DollarSign, Percent, TrendingUp, Sparkles, Plus, Trash2, Sliders, RefreshCw } from 'lucide-react';

interface BudgetCalculatorProps {
  isEditMode: boolean;
}

const initialBudgetItems: BudgetItem[] = [
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

interface BarterItem {
  id: string;
  name: string;
  originalCost: number;
  icon: string;
  active: boolean;
}

interface BudgetCalculatorProps {
  isEditMode: boolean;
  items: BudgetItem[];
  onItemsChange: (items: BudgetItem[]) => void;
  barters: BarterItem[];
  onBartersChange: (barters: BarterItem[]) => void;
}

const initialBarters: BarterItem[] = [
  { id: 'barter-1', name: 'โคมไฟแชนเดอเลียร์ & ระบบส่องสว่าง (Lighting)', originalCost: 350000, icon: '💡', active: true },
  { id: 'barter-2', name: 'โซฟารับรองและโต๊ะหินอ่อนโชว์รูม (Furniture)', originalCost: 280000, icon: '🛋️', active: true },
  { id: 'barter-3', name: 'ชุดเครื่องนอนตัวอย่าง (Bedding Display)', originalCost: 150000, icon: '🛏️', active: true },
  { id: 'barter-4', name: 'จอระบบ Digital Signage & วิดีโอวอลล์', originalCost: 200000, icon: '📺', active: false },
  { id: 'barter-5', name: 'งานตกแต่งศิลปะ ผนัง & ภาพวาดแคนวาส', originalCost: 120000, icon: '🎨', active: false }
];

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ 
  isEditMode,
  items,
  onItemsChange,
  barters,
  onBartersChange
}) => {
  // Interactive slider states
  const [expectedMonthlyRevenue, setExpectedMonthlyRevenue] = useState<number>(2000000); // Default 2 Million THB/month
  const [grossMarginPercent, setGrossMarginPercent] = useState<number>(50); // Default 50%

  // Addition forms
  const [newCat, setNewCat] = useState('');
  const [newSub, setNewSub] = useState('');
  const [newAmt, setNewAmt] = useState<number>(0);
  const [newNote, setNewNote] = useState('');

  const saveItems = (updated: BudgetItem[]) => {
    onItemsChange(updated);
  };

  const saveBarters = (updated: BarterItem[]) => {
    onBartersChange(updated);
  };

  const handleUpdateItem = (id: string, field: keyof BudgetItem, value: any) => {
    const updated = items.map(item => {
      if (item.id === id) {
        let finalVal = value;
        if (field === 'amount') {
          finalVal = Number(value) || 0;
        }
        return { ...item, [field]: finalVal };
      }
      return item;
    });
    saveItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim() || newAmt <= 0) return;
    const newItem: BudgetItem = {
      id: `budget-${Date.now()}`,
      category: newCat,
      subCategory: newSub || 'Custom Category',
      amount: newAmt,
      note: newNote || 'รายการเพิ่มเติมโดยผู้ใช้งาน'
    };
    saveItems([...items, newItem]);
    // reset
    setNewCat('');
    setNewSub('');
    setNewAmt(0);
    setNewNote('');
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const toggleBarter = (id: string) => {
    const updated = barters.map(b => b.id === id ? { ...b, active: !b.active } : b);
    saveBarters(updated);
  };

  // Financial Calculations
  const rawTotalExpenses = items.reduce((sum, item) => sum + item.amount, 0);
  const totalBarterDiscount = barters.filter(b => b.active).reduce((sum, b) => sum + b.originalCost, 0);
  const netTotalExpenses = Math.max(1000000, rawTotalExpenses - totalBarterDiscount);

  // Monthly operating fixed/variable cost estimation (approx. monthly rent, staff, marketing)
  // Let's assume some expenses are already annualized.
  // Monthly fixed cost estimate:
  const monthlyRent = (items.find(i => i.id === 'budget-3')?.amount || 1440000) / 12;
  const monthlyHR = (items.find(i => i.id === 'budget-4')?.amount || 2160000) / 12;
  const monthlyMarketing = (items.find(i => i.id === 'budget-5')?.amount || 600000) / 12;
  const monthlyFixedCost = monthlyRent + monthlyHR + monthlyMarketing + 50000; // adding overhead

  // Break-even monthly revenue: Break-even Revenue = Fixed Costs / Gross Margin Ratio
  const grossMarginRatio = grossMarginPercent / 100;
  const breakEvenMonthlyRevenue = grossMarginRatio > 0 ? monthlyFixedCost / grossMarginRatio : 0;

  // Monthly net profit estimate: (Expected Revenue * GM Ratio) - Fixed Costs
  const expectedMonthlyNetProfit = (expectedMonthlyRevenue * grossMarginRatio) - monthlyFixedCost;

  // Payback period: Net Total Investment / (Expected Monthly Net Profit)
  const paybackPeriodMonths = expectedMonthlyNetProfit > 0 ? netTotalExpenses / expectedMonthlyNetProfit : -1;

  // ROI Year 3
  // Annual Net Profit = Expected Monthly Net Profit * 12
  // ROI % (3 Years) = ((Annual Net Profit * 3) / Net Total Investment) * 100
  const annualNetProfit = Math.max(0, expectedMonthlyNetProfit * 12);
  const roiPercentYear3 = netTotalExpenses > 0 ? ((annualNetProfit * 3) / netTotalExpenses) * 100 : 0;

  return (
    <div className="space-y-8" id="financial-ledger">
      {/* Upper Panel: Dynamic Visual KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Net Investment */}
        <div className="bg-[#121109] border border-[#C9A96E]/20 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A96E]" />
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Net Investment (งบลงทุนรวมสุทธิ)</p>
          <p className="text-3xl font-serif font-semibold text-[#E8D5B0] mt-2">
            {netTotalExpenses.toLocaleString()} <span className="text-sm font-sans font-normal text-gray-400">฿</span>
          </p>
          <div className="flex justify-between items-center mt-3 text-[11px]">
            <span className="text-gray-500">ก่อนหัก Barter:</span>
            <span className="text-gray-400 line-through font-mono">{rawTotalExpenses.toLocaleString()} ฿</span>
          </div>
        </div>

        {/* KPI 2: Monthly Break-even */}
        <div className="bg-[#121109] border border-[#C9A96E]/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A96E]/50" />
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Break-even Revenue (จุดคุ้มทุนรายเดือน)</p>
          <p className="text-3xl font-serif font-semibold text-[#C9A96E] mt-2">
            {Math.round(breakEvenMonthlyRevenue).toLocaleString()} <span className="text-sm font-sans font-normal text-gray-400">฿</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-3">
            บนประมาณการ Fixed Cost ที่ <span className="text-gray-400 font-mono">{Math.round(monthlyFixedCost).toLocaleString()} ฿/เดือน</span>
          </p>
        </div>

        {/* KPI 3: Payback Period */}
        <div className="bg-[#121109] border border-[#C9A96E]/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A96E]" />
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Payback Period (ระยะเวลาคืนทุน)</p>
          <p className="text-3xl font-serif font-semibold text-[#E8D5B0] mt-2">
            {paybackPeriodMonths > 0 ? (paybackPeriodMonths.toFixed(1)) : 'N/A'}{' '}
            <span className="text-sm font-sans font-normal text-gray-400">{paybackPeriodMonths > 0 ? 'เดือน' : 'รายรับไม่พอ'}</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-3">
            กำไรสุทธิคาดการณ์: <span className="text-emerald-400 font-mono">{expectedMonthlyNetProfit > 0 ? `+${Math.round(expectedMonthlyNetProfit).toLocaleString()}` : Math.round(expectedMonthlyNetProfit).toLocaleString()} ฿/เดือน</span>
          </p>
        </div>

        {/* KPI 4: 3-Year ROI */}
        <div className="bg-[#121109] border border-[#C9A96E]/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/80" />
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">3-Year ROI (ผลตอบแทน 3 ปี)</p>
          <p className="text-3xl font-serif font-semibold text-emerald-400 mt-2">
            {roiPercentYear3.toFixed(1)} <span className="text-sm font-sans font-normal text-emerald-500">%</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-3">
            สะสมกําไร 3 ปี: <span className="text-gray-400 font-mono">{(annualNetProfit * 3).toLocaleString()} ฿</span>
          </p>
        </div>
      </div>

      {/* Main Split Column: Left = Ledger, Right = Interactive Simulator & Barter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Ledger Sheet (Interactive Table) */}
        <div className="lg:col-span-8 bg-[#121109] border border-[#C9A96E]/20 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h4 className="font-serif text-xl font-medium text-white flex items-center gap-2">
                📋 งบประมาณตั้งต้นและการปรับปรุงสเปก
              </h4>
              <span className="text-[10px] font-mono text-[#C9A96E] uppercase font-bold tracking-widest">
                {items.length} LINE ITEMS
              </span>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-[#1E1C11] border border-white/5 rounded-xl p-4 hover:border-[#C9A96E]/30 transition-all group relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Index & Title */}
                    <div className="md:col-span-6">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-lg text-[#C9A96E]/40 font-semibold">{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={item.category}
                              onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                              className="text-sm font-semibold text-white bg-black/40 border border-white/10 rounded px-2 py-1 w-full focus:outline-none focus:border-[#C9A96E]"
                            />
                          ) : (
                            <p className="text-sm font-semibold text-white">{item.category}</p>
                          )}
                          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mt-1">{item.subCategory}</p>
                        </div>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="md:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleUpdateItem(item.id, 'amount', e.target.value)}
                          disabled={!isEditMode}
                          className={`text-right font-serif text-lg font-medium text-[#C9A96E] bg-black/30 border rounded px-3 py-1.5 w-full focus:outline-none focus:border-[#C9A96E] ${
                            isEditMode ? 'border-[#C9A96E]/30 focus:bg-black/50' : 'border-transparent text-[#E8D5B0] font-bold'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">฿</span>
                      </div>
                    </div>

                    {/* Quick Info / Notes */}
                    <div className="md:col-span-3 text-right">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.note}
                          onChange={(e) => handleUpdateItem(item.id, 'note', e.target.value)}
                          className="text-xs text-gray-400 bg-black/40 border border-white/10 rounded px-2 py-1 w-full focus:outline-none focus:border-[#C9A96E]"
                          placeholder="คำอธิบายเพิ่มเติม..."
                        />
                      ) : (
                        <span className="text-xs text-gray-400 block line-clamp-2">{item.note}</span>
                      )}
                    </div>

                  </div>

                  {/* Remove Button for custom user categories */}
                  {isEditMode && items.length > 3 && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute -top-2 -right-2 bg-red-900/80 hover:bg-red-800 text-white p-1.5 rounded-full border border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form to add item in Edit Mode */}
          {isEditMode && (
            <form onSubmit={handleAddItem} className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs font-semibold uppercase text-[#C9A96E] tracking-widest mb-3">➕ เพิ่มหัวข้อค่าใช้จ่ายเสริม (Add custom item)</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="ชื่อหัวข้อ (เช่น ค่าประกันพื้นที่)"
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                  className="bg-[#1E1C11] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                />
                <input
                  type="text"
                  placeholder="Subcategory (EN)"
                  value={newSub}
                  onChange={e => setNewSub(e.target.value)}
                  className="bg-[#1E1C11] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                />
                <input
                  type="number"
                  placeholder="จำนวนเงิน (บาท)"
                  value={newAmt || ''}
                  onChange={e => setNewAmt(Number(e.target.value))}
                  className="bg-[#1E1C11] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                />
                <button
                  type="submit"
                  className="bg-[#C9A96E] text-[#111008] text-xs font-bold py-2 rounded hover:bg-[#E8D5B0] transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> เพิ่มเข้ารายการ
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Simulators & Barter Swaps */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Barter swaps toggle */}
          <div className="bg-[#121109] border border-[#C9A96E]/20 p-6 rounded-2xl">
            <h5 className="font-serif text-lg text-white font-medium flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              ✨ พันธมิตรสนับสนุน (Barter Swaps)
            </h5>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              สลับเปิด-ปิด รายการที่แบรนด์สามารถแลกเปลี่ยนผ้าม่านหรือจัดร่วมแสดงสินค้า เพื่อลดงบประมาณการลงทุนได้จริง:
            </p>

            <div className="space-y-3">
              {barters.map(barter => (
                <button
                  key={barter.id}
                  onClick={() => toggleBarter(barter.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    barter.active
                      ? 'bg-[#C9A96E]/10 border-[#C9A96E] text-white'
                      : 'bg-[#1E1C11] border-white/5 text-gray-500 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{barter.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-white">{barter.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">ประหยัดได้: {barter.originalCost.toLocaleString()} ฿</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    barter.active ? 'bg-[#C9A96E] border-[#C9A96E]' : 'border-gray-600'
                  }`}>
                    {barter.active && <span className="w-1.5 h-1.5 bg-[#111008] rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            {totalBarterDiscount > 0 && (
              <div className="mt-4 p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-semibold">🔥 ประหยัดรวมจากการ Barter:</span>
                <span className="font-serif font-semibold text-emerald-400">{totalBarterDiscount.toLocaleString()} ฿</span>
              </div>
            )}
          </div>

          {/* Interactive Revenue Simulator Slider */}
          <div className="bg-[#121109] border border-[#C9A96E]/20 p-6 rounded-2xl space-y-6">
            <h5 className="font-serif text-lg text-white font-medium flex items-center gap-2 border-b border-white/10 pb-3">
              <Sliders className="w-4 h-4 text-[#C9A96E]" /> จำลองรายรับ & กำไร (Revenue Simulator)
            </h5>

            {/* Expected monthly revenue slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs text-gray-400 font-medium">คาดการณ์รายได้เฉลี่ยต่อเดือน</label>
                <span className="font-serif text-lg font-bold text-[#E8D5B0]">
                  {(expectedMonthlyRevenue / 1000000).toFixed(1)} <span className="text-xs font-sans text-gray-500">ล้าน ฿</span>
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={expectedMonthlyRevenue}
                onChange={e => setExpectedMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-[#C9A96E] bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>500K</span>
                <span>2M (ค่ากลาง)</span>
                <span>5M</span>
              </div>
            </div>

            {/* Gross margin slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs text-gray-400 font-medium">อัตรากำไรขั้นต้น (Gross Margin)</label>
                <span className="font-serif text-lg font-bold text-[#C9A96E]">
                  {grossMarginPercent} <span className="text-xs font-sans text-gray-500">%</span>
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="75"
                step="5"
                value={grossMarginPercent}
                onChange={e => setGrossMarginPercent(Number(e.target.value))}
                className="w-full accent-[#C9A96E] bg-gray-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>35%</span>
                <span>50% (Standard)</span>
                <span>75% (Premium Bedding)</span>
              </div>
            </div>

            {/* Summary breakdown inside simulator */}
            <div className="bg-[#1E1C11] p-4 rounded-xl space-y-2 text-xs border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-400">รายรับคาดการณ์:</span>
                <span className="text-white font-semibold font-mono">{expectedMonthlyRevenue.toLocaleString()} ฿/เดือน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">หักต้นทุนสินค้า ({100 - grossMarginPercent}%):</span>
                <span className="text-red-400 font-mono">-{(expectedMonthlyRevenue * (1 - grossMarginRatio)).toLocaleString()} ฿</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">หักค่าใช้จ่ายดำเนินการ (Fixed):</span>
                <span className="text-red-400 font-mono">-{Math.round(monthlyFixedCost).toLocaleString()} ฿</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between font-bold">
                <span className="text-[#C9A96E]">กำไรสุทธิส่วนงานปฏิบัติการ:</span>
                <span className={expectedMonthlyNetProfit > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {expectedMonthlyNetProfit > 0 ? `+${Math.round(expectedMonthlyNetProfit).toLocaleString()}` : Math.round(expectedMonthlyNetProfit).toLocaleString()} ฿
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
