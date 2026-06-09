import { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { CreditCard, Plus, Search } from 'lucide-react';

export default function Payments() {
  const { students, payments, addPayment } = useEdu();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ studentId:'', amount:'', type:'oylik', date:new Date().toISOString().split('T')[0], note:'' });
  const [msg, setMsg] = useState('');

  const filtered = payments.filter(p=>
    p.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!form.studentId||!form.amount) return;
    const s = students.find(s=>s.id===Number(form.studentId));
    addPayment({ ...form, studentId:Number(form.studentId), studentName:s?.name||'', amount:Number(form.amount) });
    setMsg("✅ To'lov qo'shildi!");
    setForm({ studentId:'', amount:'', type:'oylik', date:new Date().toISOString().split('T')[0], note:'' });
    setTimeout(()=>setMsg(''),3000);
  };

  const totalToday = payments.filter(p=>p.date===new Date().toISOString().split('T')[0]).reduce((s,p)=>s+Number(p.amount),0);
  const totalMonth = payments.filter(p=>p.date?.startsWith(new Date().toISOString().slice(0,7))).reduce((s,p)=>s+Number(p.amount),0);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">To'lovlar</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:"Bugungi daromad", value:totalToday, color:'bg-green-500' },
          { label:"Oylik daromad", value:totalMonth, color:'bg-indigo-500' },
          { label:"Jami to'lovlar", value:payments.reduce((s,p)=>s+Number(p.amount),0), color:'bg-purple-500' },
        ].map(({label,value,color})=>(
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-8 h-8 ${color} rounded-lg mb-3 flex items-center justify-center`}><CreditCard size={16} className="text-white"/></div>
            <div className="text-xl font-bold text-gray-800">{value.toLocaleString()} so'm</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-green-500"/> Yangi to'lov
          </h3>
          {msg&&<div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm">{msg}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">O'quvchi</label>
              <select value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Tanlang...</option>
                {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summa (so'm)</label>
              <input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To'lov turi</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {["oylik","ro'yxatdan o'tish","qo'shimcha","qaytarish"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
              <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700">To'lov qo'shish</button>
          </form>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between mb-3">
              <h3 className="font-bold text-gray-700">To'lovlar tarixi</h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{payments.length} ta</span>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="O'quvchi nomi..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            <table className="w-full">
              <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
                <th className="px-4 py-3">O'quvchi</th>
                <th className="px-4 py-3">Summa</th>
                <th className="px-4 py-3">Turi</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3">Izoh</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p=>(
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sm text-gray-800">{p.studentName}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">{Number(p.amount).toLocaleString()} so'm</td>
                    <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{p.type}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{p.note||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0&&<div className="text-center py-12 text-gray-400 text-sm">To'lov tarixi yo'q</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
