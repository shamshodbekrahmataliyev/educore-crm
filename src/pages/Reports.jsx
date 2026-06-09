import { useEdu } from '../context/EduContext';
import { TrendingUp, Users, BookOpen, CreditCard } from 'lucide-react';

export default function Reports() {
  const { students, courses, payments, attendance, totalRevenue } = useEdu();

  const courseStats = courses.map(c=>{
    const enrolled=students.filter(s=>s.course===c.name&&s.status==='active').length;
    const revenue=students.filter(s=>s.course===c.name).reduce((sum,s)=>sum+s.paid,0);
    return {...c,enrolled,revenue};
  });

  const monthlyPayments = {};
  payments.forEach(p=>{
    const month=p.date?.slice(0,7)||'unknown';
    monthlyPayments[month]=(monthlyPayments[month]||0)+Number(p.amount);
  });

  const maxRevenue = Math.max(...courseStats.map(c=>c.revenue),1);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hisobotlar</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {label:"Jami o'quvchi",value:students.length,icon:Users,bg:'bg-indigo-500'},
          {label:'Kurslar',value:courses.length,icon:BookOpen,bg:'bg-purple-500'},
          {label:"Jami daromad",value:(totalRevenue/1000000).toFixed(2)+' mln so\'m',icon:TrendingUp,bg:'bg-green-500'},
          {label:"Faol o'quvchi",value:students.filter(s=>s.status==='active').length,icon:Users,bg:'bg-blue-500'},
        ].map(({label,value,icon:Icon,bg})=>(
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}><Icon size={20} className="text-white"/></div>
            <div className="text-xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Kurslar bo'yicha daromad</h3>
          <div className="space-y-4">
            {courseStats.map(c=>(
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{c.name}</span>
                  <span className="text-green-600 font-semibold">{(c.revenue/1000).toFixed(0)} ming so'm</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-indigo-500 rounded-full" style={{width:`${(c.revenue/maxRevenue)*100}%`}}/>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{c.enrolled} ta faol o'quvchi</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Oylik daromad</h3>
          <div className="space-y-3">
            {Object.entries(monthlyPayments).sort((a,b)=>b[0].localeCompare(a[0])).map(([month,amount])=>(
              <div key={month} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                <span className="text-sm font-medium text-gray-700">{month}</span>
                <span className="text-green-600 font-bold">{amount.toLocaleString()} so'm</span>
              </div>
            ))}
            {Object.keys(monthlyPayments).length===0&&<p className="text-gray-400 text-sm">Ma'lumot yo'q</p>}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">O'quvchilar holati</h3>
          <table className="w-full">
            <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
              <th className="px-4 py-3">Ism</th><th className="px-4 py-3">Kurs</th>
              <th className="px-4 py-3">To'langan</th><th className="px-4 py-3">Balans</th><th className="px-4 py-3">Holat</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s=>(
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sm">{s.name}</td>
                  <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{s.course||'—'}</span></td>
                  <td className="px-4 py-3 text-green-600 font-semibold text-sm">{(s.paid||0).toLocaleString()} so'm</td>
                  <td className="px-4 py-3"><span className={`font-bold text-sm ${s.balance<0?'text-red-600':s.balance>0?'text-green-600':'text-gray-500'}`}>{(s.balance||0).toLocaleString()} so'm</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${s.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{s.status==='active'?'Faol':'Faol emas'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
