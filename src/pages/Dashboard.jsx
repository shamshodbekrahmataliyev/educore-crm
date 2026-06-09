import { useEdu } from '../context/EduContext';
import { Users, BookOpen, CreditCard, AlertCircle, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { students, courses, payments, totalRevenue, activeStudents, debtors } = useEdu();
  const todayPayments = payments.filter(p=>p.date===new Date().toISOString().split('T')[0]);
  const todayRevenue = todayPayments.reduce((s,p)=>s+Number(p.amount),0);

  const stats = [
    { label:"O'quvchilar", value:students.length, sub:`${activeStudents} faol`, icon:Users, color:'bg-indigo-500' },
    { label:'Kurslar', value:courses.length, sub:'ta kurs mavjud', icon:BookOpen, color:'bg-purple-500' },
    { label:"Jami daromad", value:(totalRevenue/1000000).toFixed(1)+' mln', sub:"so'm", icon:TrendingUp, color:'bg-green-500' },
    { label:"Bugungi to'lov", value:(todayRevenue/1000).toFixed(0)+' ming', sub:"so'm bugun", icon:CreditCard, color:'bg-blue-500' },
    { label:'Qarzdorlar', value:debtors.length, sub:'ta o\'quvchi', icon:AlertCircle, color:'bg-red-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Boshqaruv paneli</h2>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('uz-UZ',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className="text-white"/>
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
            <div className="text-xs text-gray-400">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent payments */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-indigo-500"/> So'nggi to'lovlar
          </h3>
          {payments.length === 0 ? <p className="text-gray-400 text-sm">Hali to'lov yo'q</p> : (
            <div className="space-y-3">
              {payments.slice(0,5).map(p=>(
                <div key={p.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{p.studentName}</p>
                    <p className="text-xs text-gray-400">{p.date}</p>
                  </div>
                  <span className="text-green-600 font-bold text-sm">{Number(p.amount).toLocaleString()} so'm</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debtors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500"/> Qarzdorlar
          </h3>
          {debtors.length===0 ? <p className="text-gray-400 text-sm">Qarzdor yo'q ✅</p> : (
            <div className="space-y-3">
              {debtors.map(s=>(
                <div key={s.id} className="bg-red-50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-gray-700">{s.name}</p>
                  <p className="text-xs text-red-600">{Math.abs(s.balance).toLocaleString()} so'm qarzi bor</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Courses overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-purple-500"/> Kurslar
          </h3>
          <div className="space-y-3">
            {courses.map(c=>{
              const count = students.filter(s=>s.course===c.name&&s.status==='active').length;
              return (
                <div key={c.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-gray-700">{c.name}</p>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{count} ta</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.teacher}</p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
                    <div className="h-full bg-indigo-500 rounded-full" style={{width:`${Math.min((count/c.maxStudents)*100,100)}%`}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
