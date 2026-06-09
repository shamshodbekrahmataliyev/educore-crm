import { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { Plus, Edit2, Trash2, X, Users, BookOpen } from 'lucide-react';

export default function Courses() {
  const { courses, students, addCourse, updateCourse, deleteCourse } = useEdu();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const empty = { name:'', teacher:'', price:0, duration:'3 oy', schedule:'', maxStudents:15 };
  const [form, setForm] = useState(empty);

  const openAdd = () => { setEditItem(null); setForm(empty); setShowModal(true); };
  const openEdit = (c) => { setEditItem(c); setForm({...c}); setShowModal(true); };
  const handleSave = () => {
    if(!form.name) return;
    if(editItem) updateCourse(editItem.id,{...form,price:Number(form.price),maxStudents:Number(form.maxStudents)});
    else addCourse({...form,price:Number(form.price),maxStudents:Number(form.maxStudents)});
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kurslar</h2>
          <p className="text-gray-500 text-sm">{courses.length} ta kurs mavjud</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700">
          <Plus size={18}/>Yangi kurs
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {courses.map(c=>{
          const enrolled = students.filter(s=>s.course===c.name&&s.status==='active').length;
          return (
            <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={24} className="text-indigo-600"/>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>openEdit(c)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600"><Edit2 size={16}/></button>
                  <button onClick={()=>deleteCourse(c.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16}/></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{c.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{c.teacher}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Narxi:</span>
                  <span className="font-semibold text-green-600">{Number(c.price).toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Davomiyligi:</span>
                  <span className="font-medium text-gray-700">{c.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jadval:</span>
                  <span className="font-medium text-gray-700 text-right text-xs max-w-[150px]">{c.schedule}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1"><Users size={12}/>{enrolled} ta o'quvchi</span>
                  <span>Maks: {c.maxStudents}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{width:`${Math.min((enrolled/c.maxStudents)*100,100)}%`}}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-bold">{editItem?'Tahrirlash':'Yangi kurs'}</h3>
              <button onClick={()=>setShowModal(false)}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="space-y-4">
              {[['name','Kurs nomi'],['teacher',"O'qituvchi"],['duration','Davomiyligi'],['schedule','Dars jadvali']].map(([k,l])=>(
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                  <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[['price',"Narx (so'm)"],['maxStudents',"Max o'quvchi"]].map(([k,l])=>(
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                    <input type="number" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700">Saqlash</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold">Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
