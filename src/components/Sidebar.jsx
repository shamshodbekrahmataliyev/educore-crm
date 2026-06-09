import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CreditCard, Calendar, BarChart2, GraduationCap } from 'lucide-react';
import { useEdu } from '../context/EduContext';

const links = [
  { to:'/', icon:LayoutDashboard, label:'Boshqaruv' },
  { to:'/students', icon:Users, label:"O'quvchilar" },
  { to:'/courses', icon:BookOpen, label:'Kurslar' },
  { to:'/payments', icon:CreditCard, label:"To'lovlar" },
  { to:'/attendance', icon:Calendar, label:'Davomat' },
  { to:'/reports', icon:BarChart2, label:'Hisobotlar' },
];

export default function Sidebar() {
  const { debtors } = useEdu();
  return (
    <aside className="w-64 bg-indigo-950 min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <GraduationCap size={22}/>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">EduCore</h1>
            <p className="text-xs text-indigo-300">O'quv markaz CRM</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`}>
            <Icon size={18}/>{label}
          </NavLink>
        ))}
      </nav>
      {debtors.length > 0 && (
        <div className="m-4 bg-red-900/40 border border-red-700 rounded-xl p-3">
          <p className="text-red-400 text-xs font-semibold">⚠️ {debtors.length} ta qarzdor</p>
        </div>
      )}
    </aside>
  );
}
