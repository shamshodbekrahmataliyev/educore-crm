import { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { Calendar, Check, X } from 'lucide-react';

export default function Attendance() {
  const { students, attendance, markAttendance } = useEdu();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCourse, setFilterCourse] = useState('all');

  const courses = [...new Set(students.map(s=>s.course).filter(Boolean))];
  const filtered = students.filter(s=> filterCourse==='all' || s.course===filterCourse);

  const getStatus = (studentId) => {
    const rec = attendance.find(a=>a.studentId===studentId&&a.date===date);
    return rec ? rec.present : null;
  };

  const stats = {
    present: filtered.filter(s=>getStatus(s.id)===true).length,
    absent: filtered.filter(s=>getStatus(s.id)===false).length,
    notMarked: filtered.filter(s=>getStatus(s.id)===null).length,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Davomat</h2>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        <select value={filterCourse} onChange={e=>setFilterCourse(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Barcha kurslar</option>
          {courses.map(c=><option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-3 ml-auto">
          {[
            {label:`✅ Keldi: ${stats.present}`, color:'text-green-600 bg-green-50'},
            {label:`❌ Kelmadi: ${stats.absent}`, color:'text-red-600 bg-red-50'},
            {label:`⏳ Belgilanmagan: ${stats.notMarked}`, color:'text-gray-600 bg-gray-100'},
          ].map(({label,color})=>(
            <span key={label} className={`${color} text-sm font-semibold px-4 py-2 rounded-xl`}>{label}</span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
              <th className="px-6 py-3">O'quvchi</th>
              <th className="px-6 py-3">Kurs</th>
              <th className="px-6 py-3">Guruh</th>
              <th className="px-6 py-3 text-center">Keldi</th>
              <th className="px-6 py-3 text-center">Kelmadi</th>
              <th className="px-6 py-3 text-center">Holat</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s=>{
                const status = getStatus(s.id);
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 transition ${status===true?'bg-green-50/30':status===false?'bg-red-50/30':''}`}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{s.name}</td>
                    <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{s.course||'—'}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.group||'—'}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={()=>markAttendance(s.id,date,true)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition ${status===true?'bg-green-500 text-white shadow-md':'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}>
                        <Check size={18}/>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={()=>markAttendance(s.id,date,false)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition ${status===false?'bg-red-500 text-white shadow-md':'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'}`}>
                        <X size={18}/>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${status===true?'bg-green-100 text-green-700':status===false?'bg-red-100 text-red-700':'bg-gray-100 text-gray-500'}`}>
                        {status===true?'Keldi':status===false?'Kelmadi':'—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div className="text-center py-12 text-gray-400">O'quvchi topilmadi</div>}
        </div>
      </div>
    </div>
  );
}
