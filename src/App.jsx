import React, { useState, useEffect } from 'react';
import { Plane, Map, Calendar, CreditCard, Hotel, Car, ShoppingBag, Info, Share2, CheckCircle, Wallet, Smartphone, Globe } from 'lucide-react';

const EastAfricaBudgetPlanner = () => {
  // --- 状态管理 ---
  const [country, setCountry] = useState('kenya');
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [flightCost, setFlightCost] = useState(6000); // 人民币
  const [accommodationLevel, setAccommodationLevel] = useState('mid');
  const [vehicleType, setVehicleType] = useState('van');
  const [shoppingStyle, setShoppingStyle] = useState('low');
  const [includeSim, setIncludeSim] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [grade, setGrade] = useState({ label: '经济型', color: 'bg-green-100 text-green-800' });

  // --- 基础数据配置 ---
  const CURRENCY = "¥";

  const countries = {
    kenya: { name: '肯尼亚', visa: 35, currency: 'USD' }, // 35 USD 约为 250 RMB, 此处我们在计算逻辑中统一转RMB
    tanzania: { name: '坦桑尼亚', visa: 50, currency: 'USD' },
    uganda: { name: '乌干达', visa: 50, currency: 'USD' },
    rwanda: { name: '卢旺达', visa: 50, currency: 'USD' }
  };

  const accommodationPrices = { // 每晚单人预估 (假设双人一间，单人承担一半)
    low: { price: 400, label: '经济型 (营地/三星)', desc: '干净卫生，基本设施' },
    mid: { price: 1200, label: '舒适型 (四星/Lodge)', desc: '位置较好，含泳池/景观' },
    high: { price: 3500, label: '奢华型 (五星/野奢)', desc: '顶级服务，核心保护区位置' }
  };

  const vehiclePrices = { // 每天每车价格
    van: { price: 1000, label: 'Safari面包车', desc: '顶盖可升起，性价高' },
    jeep: { price: 1800, label: '陆地巡洋舰 (Jeep)', desc: '越野性能强，体验好，拍照更佳' }
  };

  const shoppingProfiles = {
    low: { daily: 100, label: '佛系游玩', desc: '只买冰箱贴和咖啡' },
    mid: { daily: 500, label: '适当纪念', desc: '购买少量工艺品或礼物' },
    high: { daily: 2000, label: '超强购买欲', desc: '坦桑蓝、木雕、高档礼品' }
  };

  const tipsPerDay = 100; // 司机/导游小费，每人每天预估 RMB
  const simCardCost = 100; // 电话卡预估 RMB
  const exchangeRate = 7.2; // 简单美金转人民币汇率

  // --- 智能文案推荐 ---
  const getItinerarySuggestion = () => {
    if (country === 'kenya') {
      if (days <= 4) return "主要游览：内罗毕 + 纳库鲁湖或安博塞利。";
      if (days <= 7) return "经典组合：内罗毕 + 纳库鲁 + 马赛马拉（重点）。";
      return "深度游：增加桑布鲁、博戈里亚或者蒙巴萨海边。";
    }
    if (country === 'tanzania') {
      if (days <= 5) return "精华游：塞伦盖蒂 + 恩戈罗恩戈罗火山口。";
      return "全景游：增加塔兰吉雷、曼雅拉湖或桑给巴尔岛。";
    }
    return "根据天数安排国家公园追踪猩猩或游猎行程。";
  };

  // --- 核心计算逻辑 ---
  useEffect(() => {
    // 1. 签证费用 (USD -> RMB)
    const visaCost = countries[country].visa * exchangeRate;

    // 2. 住宿费用 (天数 - 1) * 单人每晚预算
    // 如果只有1天，住宿按0算，或者按日租房，这里按逻辑 (days - 1)
    const nights = Math.max(0, days - 1);
    const hotelTotal = nights * accommodationPrices[accommodationLevel].price;

    // 3. 车辆费用 (车辆单价 * 天数) / 人数
    const carTotal = (vehiclePrices[vehicleType].price * days) / travelers;

    // 4. 小费 (天数 * 单价)
    const tipsTotal = days * tipsPerDay;

    // 5. 个人消费 (天数 * 消费等级)
    const shoppingTotal = days * shoppingProfiles[shoppingStyle].daily;

    // 6. 电话卡
    const simTotal = includeSim ? simCardCost : 0;

    // 7. 总计
    const grandTotal = flightCost + visaCost + hotelTotal + carTotal + tipsTotal + shoppingTotal + simTotal;

    setTotalPrice(Math.round(grandTotal));

    // 8. 评级判定
    if (grandTotal < 15000) {
      setGrade({ label: '经济实惠型', color: 'bg-blue-100 text-blue-800' });
    } else if (grandTotal < 35000) {
      setGrade({ label: '舒适品质型', color: 'bg-yellow-100 text-yellow-800' });
    } else {
      setGrade({ label: '奢华享受型', color: 'bg-purple-100 text-purple-800' });
    }

  }, [country, days, travelers, flightCost, accommodationLevel, vehicleType, shoppingStyle, includeSim]);

  // --- 辅助组件 ---
  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 text-amber-800 border-b border-amber-200 pb-2 mt-6">
      <Icon size={20} />
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-200 pb-12">
      
      {/* 顶部 Header */}
      <header className="bg-amber-900 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="text-amber-400" />
              东非旅行预算计算器
            </h1>
            <p className="text-amber-200 text-sm mt-1">定制您的专属Safari行程</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs opacity-80">当前预估总价 (人均)</div>
            <div className="text-3xl font-bold text-amber-400">{CURRENCY} {totalPrice.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 grid md:grid-cols-3 gap-6">
        
        {/* 左侧：输入区域 */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. 区域与基础信息 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <SectionTitle icon={Map} title="基础行程信息" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">目的地国家</label>
                <select 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {Object.entries(countries).map(([key, data]) => (
                    <option key={key} value={key}>{data.name} (签证 ${data.visa})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">出行人数</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="1" max="10" 
                    value={travelers} 
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <span className="w-12 text-center font-bold bg-amber-100 py-1 rounded text-amber-900">{travelers}人</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">
                  游玩天数 <span className="text-xs text-amber-600 font-normal ml-2">({days - 1} 晚住宿)</span>
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" min="3" max="20" 
                    value={days} 
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <span className="w-12 text-center font-bold bg-amber-100 py-1 rounded text-amber-900">{days}天</span>
                </div>
                <div className="mt-2 text-sm text-stone-500 bg-stone-100 p-3 rounded-lg flex items-start gap-2">
                   <Info size={16} className="mt-0.5 shrink-0" />
                   {getItinerarySuggestion()}
                </div>
              </div>
            </div>
          </div>

          {/* 2. 大交通与硬性支出 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <SectionTitle icon={Plane} title="大交通与签证" />
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">往返机票预算 (CNY/人)</label>
                <input 
                  type="number" 
                  value={flightCost} 
                  onChange={(e) => setFlightCost(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="例如：6000"
                />
                <p className="text-xs text-stone-400 mt-1">淡旺季价格浮动较大，建议查询机票网站后填入</p>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200 flex-1">
                   <CreditCard size={18} className="text-stone-400"/>
                   <div className="text-sm">
                     <div className="text-stone-500">签证费</div>
                     <div className="font-semibold">${countries[country].visa} ≈ ¥{Math.round(countries[country].visa * exchangeRate)}</div>
                   </div>
                </div>
                <div 
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 transition-all ${includeSim ? 'bg-amber-50 border-amber-300' : 'bg-stone-50 border-stone-200'}`}
                  onClick={() => setIncludeSim(!includeSim)}
                >
                   <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${includeSim ? 'bg-amber-500 border-amber-500' : 'border-stone-400'}`}>
                      {includeSim && <CheckCircle size={14} className="text-white" />}
                   </div>
                   <div className="text-sm">
                     <div className="font-medium">电话卡/流量</div>
                     <div className="text-xs text-stone-500">约 ¥100</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 住宿与车辆 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <SectionTitle icon={Hotel} title="住宿与用车" />
            
            <div className="space-y-6">
              {/* 住宿选择 */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">住宿标准 (单人/晚)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(accommodationPrices).map(([key, item]) => (
                    <div 
                      key={key}
                      onClick={() => setAccommodationLevel(key)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${accommodationLevel === key ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-white border-stone-200 hover:border-amber-300'}`}
                    >
                      <div className="font-bold text-amber-900">{item.label}</div>
                      <div className="text-xs text-stone-500 mt-1 h-8">{item.desc}</div>
                      <div className="text-lg font-semibold text-amber-600 mt-2">¥{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 车辆选择 */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Safari 车型 (整车/天)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(vehiclePrices).map(([key, item]) => (
                    <div 
                      key={key}
                      onClick={() => setVehicleType(key)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${vehicleType === key ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-white border-stone-200 hover:border-amber-300'}`}
                    >
                      <div className="p-2 bg-white rounded-full border border-stone-100">
                        <Car className="text-amber-700" size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-stone-800">{item.label}</div>
                        <div className="text-xs text-stone-500">{item.desc}</div>
                        <div className="text-sm font-semibold text-amber-600 mt-1">¥{item.price} /车</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-stone-400 text-right">
                  当前车费人均: ¥{Math.round((vehiclePrices[vehicleType].price * days) / travelers)} (含{days}天)
                </div>
              </div>
            </div>
          </div>

          {/* 4. 其它费用 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <SectionTitle icon={Wallet} title="小费与购物" />
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-stone-600 mb-2">个人消费欲望</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {Object.entries(shoppingProfiles).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setShoppingStyle(key)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-colors ${shoppingStyle === key ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-2">
                     预估: {shoppingProfiles[shoppingStyle].desc} (约 ¥{shoppingProfiles[shoppingStyle].daily}/天)
                  </p>
               </div>
               
               <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                 <div className="flex items-center gap-2 text-stone-600">
                    <Smartphone size={18} />
                    <span className="text-sm">司导小费 (¥100/天)</span>
                 </div>
                 <div className="font-medium text-stone-800">¥{days * tipsPerDay}</div>
               </div>
            </div>
          </div>

        </div>

        {/* 右侧：结果面板 (移动端底部) */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4">
            
            {/* 价格主卡片 */}
            <div className="bg-amber-900 text-white rounded-xl shadow-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe size={100} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-lg font-medium text-amber-100 mb-1">预估总预算 (人均)</h2>
                <div className="text-4xl font-bold mb-4">{CURRENCY} {totalPrice.toLocaleString()}</div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${grade.color.replace('bg-', 'bg-white text-').replace('text-', '') === 'green-800' ? 'bg-green-500' : grade.color.includes('yellow') ? 'bg-yellow-500' : 'bg-purple-500'} text-white`}>
                  {grade.label} 行程
                </div>

                <div className="space-y-2 text-sm border-t border-amber-800/50 pt-4">
                   <div className="flex justify-between">
                     <span className="text-amber-200">机票 & 签证</span>
                     <span>{CURRENCY} {flightCost + Math.round(countries[country].visa * exchangeRate)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-amber-200">住宿 ({days-1}晚)</span>
                     <span>{CURRENCY} {(days-1) * accommodationPrices[accommodationLevel].price}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-amber-200">包车 ({days}天)</span>
                     <span>{CURRENCY} {Math.round((vehiclePrices[vehicleType].price * days) / travelers)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-amber-200">杂项 (购物/小费)</span>
                     <span>{CURRENCY} {(days * shoppingProfiles[shoppingStyle].daily) + (days * tipsPerDay) + (includeSim ? simCardCost : 0)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* 专家建议卡片 */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-3 text-amber-800">
                 <Info size={18} />
                 <h3 className="font-bold">预算优化建议</h3>
              </div>
              <ul className="text-sm text-stone-600 space-y-2 list-disc list-inside">
                {travelers < 4 && (
                   <li>当前{travelers}人出行，车费分摊较高。若能凑齐4-6人，人均可节省约 ¥{Math.round(((vehiclePrices[vehicleType].price * days) / travelers) - ((vehiclePrices[vehicleType].price * days) / 6))}。</li>
                )}
                {accommodationLevel === 'high' && (
                   <li>野奢酒店价格较高，建议 "2晚奢华 + N晚舒适" 混搭，体验既好又不超支。</li>
                )}
                {vehicleType === 'jeep' && (
                   <li>陆地巡洋舰虽然贵，但在雨季或肯尼亚马赛马拉是必须的，不要为了省钱选面包车。</li>
                )}
                {flightCost > 8000 && (
                   <li>机票预算较高，建议提前3个月关注埃塞俄比亚航空或南方航空大促。</li>
                )}
                {travelers >= 4 && (
                   <li>人数较多，非常适合包一辆独立陆巡，私密性和自由度极高。</li>
                )}
              </ul>
            </div>

            <button 
              onClick={() => alert("功能开发中：将生成图片或PDF发送给客户")}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Share2 size={18} />
              保存/分享预算方案
            </button>

          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return <EastAfricaBudgetPlanner />;
}
