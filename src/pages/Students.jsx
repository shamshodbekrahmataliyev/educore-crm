import { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { Plus, Search, Edit2, Trash2, X, Phone, BookOpen } from 'lucide-react';

export default function Students() {
  const { students, courses, addStudent, updateStudent, deleteStudent } = useEdu();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const empty = { name:'',phone:'',course:'',group:'',status:'active',balance:0,paid:0,startDate:new Date().toISOString().split('T')[0],birthDate:'',notes:'' };
  const [form, setForm] = useState(empty);

  const filtered = students.filter(s=>{
    const q=search.toLowerCase();
    const match=s.name.toLowerCase().includes(q)||s.phone.includes(q)||s.course.toLowerCase().includes(q);
    const flt=filter==='all'||(filter==='active'&&s.status==='active')||(filter==='inactive'&&s.status==='inactive')||(filter==='debt'&&s.balance<0);
    return match&&flt;
  });

  const openAdd = () => { setEditItem(null); setForm(empty); setShowModal(true); };
  const openEdit = (s) => { setEditItem(s); setForm({...s}); setShowModal(true); };
  const handleSave = () => {
    if(!form.name) return;
    if(editItem) updateStudent(editItem.id,{...form,balance:Number(form.balance),paid:Number(form.paid)});
    else addStudent({...form,balance:Number(form.balance),paid:Number(form.paid)});
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">O'quvchilar</h2>
          <p className="text-gray-500 text-sm">Jami: {students.length} ta</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700">
          <Plus size={18}/>Yangi o'quvchi
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ism, telefon, kurs..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="flex gap-2">
            {[['all','Barchasi'],['active','Faol'],['inactive','Faol emas'],['debt','Qarzdor']].map(([v,l])=>(
              <button key={v} onClick={()=>setFilter(v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter===v?'bg-indigo-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
              <th className="px-6 py-3">O'quvchi</th>
              <th className="px-6 py-3">Kurs</th>
              <th className="px-6 py-3">Telefon</th>
              <th className="px-6 py-3">Balans</th>
              <th className="px-6 py-3">Holat</th>
              <th className="px-6 py-3">Amal</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s=>(
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.group}</p>
                  </td>
                  <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{s.course||'—'}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-sm ${s.balance<0?'text-red-600':s.balance>0?'text-green-600':'text-gray-500'}`}>
                      {s.balance>=0?'+':''}{s.balance.toLocaleString()} so'm
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${s.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>
                      {s.status==='active'?'Faol':'Faol emas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={()=>openEdit(s)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600"><Edit2 size={16}/></button>
                    <button onClick={()=>deleteStudent(s.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div className="text-center py-12 text-gray-400">O'quvchi topilmadi</div>}
        </div>
      </div>

      {showModal&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-bold">{editItem?'Tahrirlash':"Yangi o'quvchi"}</h3>
              <button onClick={()=>setShowModal(false)}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="space-y-4">
              {[['name','Ism Familiya'],['phone','Telefon'],['group','Guruh']].map(([k,l])=>(
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                  <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kurs</label>
                  <select value={form.course} onChange={e=>setForm({...form,course:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Tanlang...</option>
                    {courses.map(c=><option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="active">Faol</option>
                    <option value="inactive">Faol emas</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balans (so'm)</label>
                  <input type="number" value={form.balance} onChange={e=>setForm({...form,balance:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Boshlash sanasi</label>
                  <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Izoh</label>
                <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700">Saqlash</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200">Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
