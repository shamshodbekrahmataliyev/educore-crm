import { createContext, useContext, useState } from 'react';

const EduContext = createContext();

const now = new Date();
const fmt = (d) => d.toISOString().split('T')[0];

const initialStudents = [
  { id:1, name:'Aliyev Sardor', phone:'+998901234567', course:'Ingliz tili', group:'A1-Beginner', status:'active', balance:500000, paid:1500000, startDate:'2026-01-15', birthDate:'2007-05-20', notes:'' },
  { id:2, name:'Karimova Malika', phone:'+998901234568', course:'Matematika', group:'M1-Asosiy', status:'active', balance:0, paid:2000000, startDate:'2026-02-01', birthDate:'2008-03-14', notes:'' },
  { id:3, name:'Toshmatov Jasur', phone:'+998901234569', course:'Dasturlash', group:'P1-Python', status:'inactive', balance:-200000, paid:800000, startDate:'2025-09-01', birthDate:'2006-11-30', notes:'Darsga kelmayapti' },
];

const initialCourses = [
  { id:1, name:'Ingliz tili', teacher:'Nilufar Yusupova', price:500000, duration:'3 oy', schedule:'Dushanba, Chorshanba, Juma 15:00-17:00', maxStudents:15 },
  { id:2, name:'Matematika', teacher:'Bobur Rashidov', price:400000, duration:'6 oy', schedule:'Seshanba, Payshanba 14:00-16:00', maxStudents:20 },
  { id:3, name:'Dasturlash', teacher:'Sherzod Nazarov', price:600000, duration:'6 oy', schedule:'Har kuni 10:00-12:00', maxStudents:12 },
];

const initialPayments = [
  { id:1, studentId:1, studentName:'Aliyev Sardor', amount:500000, type:'oylik', date:'2026-06-01', note:'Iyun oyi' },
  { id:2, studentId:2, studentName:'Karimova Malika', amount:400000, type:'oylik', date:'2026-06-02', note:'Iyun oyi' },
];

const initialAttendance = [];

export function EduProvider({ children }) {
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('edu_students')||'null') || initialStudents);
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem('edu_courses')||'null') || initialCourses);
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem('edu_payments')||'null') || initialPayments);
  const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem('edu_attendance')||'null') || initialAttendance);

  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const addStudent = (s) => { const n=[...students,{...s,id:Date.now()}]; setStudents(n); save('edu_students',n); };
  const updateStudent = (id,d) => { const n=students.map(s=>s.id===id?{...s,...d}:s); setStudents(n); save('edu_students',n); };
  const deleteStudent = (id) => { const n=students.filter(s=>s.id!==id); setStudents(n); save('edu_students',n); };

  const addCourse = (c) => { const n=[...courses,{...c,id:Date.now()}]; setCourses(n); save('edu_courses',n); };
  const updateCourse = (id,d) => { const n=courses.map(c=>c.id===id?{...c,...d}:c); setCourses(n); save('edu_courses',n); };
  const deleteCourse = (id) => { const n=courses.filter(c=>c.id!==id); setCourses(n); save('edu_courses',n); };

  const addPayment = (p) => {
    const payment = {...p, id:Date.now(), date: p.date || fmt(new Date())};
    const n=[payment,...payments]; setPayments(n); save('edu_payments',n);
    const s=students.find(s=>s.id===p.studentId);
    if(s) updateStudent(p.studentId, { paid: (s.paid||0)+Number(p.amount), balance: (s.balance||0)-Number(p.amount) });
  };

  const markAttendance = (studentId, date, present) => {
    const exists = attendance.find(a=>a.studentId===studentId&&a.date===date);
    let n;
    if(exists) n=attendance.map(a=>a.studentId===studentId&&a.date===date?{...a,present}:a);
    else n=[...attendance,{id:Date.now(),studentId,date,present}];
    setAttendance(n); save('edu_attendance',n);
  };

  const totalRevenue = payments.reduce((s,p)=>s+Number(p.amount),0);
  const activeStudents = students.filter(s=>s.status==='active').length;
  const debtors = students.filter(s=>s.balance<0);

  return (
    <EduContext.Provider value={{
      students,courses,payments,attendance,
      addStudent,updateStudent,deleteStudent,
      addCourse,updateCourse,deleteCourse,
      addPayment,markAttendance,
      totalRevenue,activeStudents,debtors
    }}>
      {children}
    </EduContext.Provider>
  );
}

export const useEdu = () => useContext(EduContext);
