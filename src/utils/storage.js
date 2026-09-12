const STORAGE_KEYS = {
  STUDENTS: 'star_academy_students_v3', // v3 with 70 students across updated class sections
  ATTENDANCE: 'star_academy_attendance_v2',
  TEACHERS: 'star_academy_teachers_v1',
  TEACHER_ATTENDANCE: 'star_academy_teacher_attendance_v1',
  BANKS: 'star_academy_banks_v1',
  TRANSFERS: 'star_academy_transfers_v1',
  EXPENSE_CATEGORIES: 'star_academy_expense_categories_v1',
  CHARGED_EXPENSES: 'star_academy_charged_expenses_v1',
  TEACHER_SALARIES: 'star_academy_teacher_salaries_v1',
  FEE_VOUCHERS: 'star_academy_fee_vouchers_v1',
  TIMETABLES: 'star_academy_timetables_v2',
  TEST_DEFINITIONS: 'star_academy_test_definitions_v1',
  DATESHEETS: 'star_academy_datesheets_v2',
  CURRICULUM_SUBJECTS: 'star_academy_curriculum_subjects_v2',
  MARKSHEETS: 'star_academy_marksheets_v2',
  ACADEMIC_SESSION: 'star_academy_academic_session_v1',
  ACADEMIC_SESSIONS_LIST: 'star_academy_academic_sessions_list_v1',
  SCHEMES_OF_STUDY: 'star_academy_schemes_of_study_v1',
  BATCHES: 'star_academy_batches_v1',
  INQUIRIES: 'star_academy_inquiries_v1',
  ATTENDANCE_TIMINGS: 'star_academy_attendance_timings_v1'
};

// Generates 5 students for each of the 12 class-subject combinations (60 students total)
const FIRST_NAMES_MALE = [
  'Ahmed', 'Bilal', 'Hamza', 'Usman', 'Zayan', 'Ali', 'Omar', 'Hassan', 'Zubair', 'Danish',
  'Fahad', 'Saad', 'Haris', 'Taha', 'Abdullah', 'Mustafa', 'Arham', 'Rehan', 'Waqas', 'Asad'
];
const FIRST_NAMES_FEMALE = [
  'Fatima', 'Ayesha', 'Zainab', 'Maryam', 'Noor', 'Hafsa', 'Eman', 'Hania', 'Anaya', 'Khadija',
  'Sadia', 'Sana', 'Iqra', 'Laiba', 'Mahnoor', 'Zoya', 'Mehwish', 'Nimra', 'Rabia', 'Farah'
];
const LAST_NAMES = [
  'Raza', 'Khan', 'Malik', 'Ahmed', 'Farooq', 'Siddiqui', 'Akhtar', 'Chaudhry', 'Bhatti', 'Qureshi',
  'Mirza', 'Shah', 'Sheikh', 'Javed', 'Tariq', 'Mehmood', 'Iqbal', 'Rehman', 'Hussain', 'Niazi'
];
const FATHER_NAMES = [
  'Muhammad Raza', 'Hamid Khan', 'Shahid Malik', 'Farooq Ahmed', 'Rashid Siddiqui', 'Hassan Akhtar',
  'Tariq Mehmood', 'Amjad Ali', 'Nasir Iqbal', 'Imran Bhatti', 'Khalid Qureshi', 'Bashir Mirza',
  'Zahid Shah', 'Sajid Sheikh', 'Naveed Javed', 'Pervez Tariq', 'Kamran Mehmood', 'Waseem Rehman'
];

const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256'
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256'
];

const CLASS_CONFIGS = [
  { studentClass: '9th', subjects: ['Science', 'Computer'] },
  { studentClass: '10th', subjects: ['Science', 'Computer'] },
  { studentClass: 'FSc Part 1', subjects: ['Pre- Medical', 'Pre-Engineering', 'ICS - Physics', 'ICS - Statistics', 'FA IT'] },
  { studentClass: 'FSc Part 2', subjects: ['Pre- Medical', 'Pre-Engineering', 'ICS - Physics', 'ICS - Statistics', 'FA IT'] },
];

export function buildDemoStudents() {
  const students = [];
  let serial = 1;

  CLASS_CONFIGS.forEach(({ studentClass, subjects }) => {
    subjects.forEach((subject) => {
      // Create 5 students for this class and subject combination
      for (let i = 0; i < 5; i++) {
        const isFemale = (serial % 2 === 0);
        const gender = isFemale ? 'Female' : 'Male';
        const firstName = isFemale
          ? FIRST_NAMES_FEMALE[(serial * 3 + i) % FIRST_NAMES_FEMALE.length]
          : FIRST_NAMES_MALE[(serial * 3 + i) % FIRST_NAMES_MALE.length];
        const lastName = LAST_NAMES[(serial * 2 + i) % LAST_NAMES.length];
        const fatherName = FATHER_NAMES[(serial + i) % FATHER_NAMES.length];
        const pic = isFemale
          ? FEMALE_AVATARS[i % FEMALE_AVATARS.length]
          : MALE_AVATARS[i % MALE_AVATARS.length];

        const idNum = String(serial).padStart(4, '0');
        const id = `SA-${idNum}`;

        students.push({
          id,
          firstName,
          lastName,
          pic,
          gender,
          contactNumber: `03${String(serial % 50).padStart(2, '0')}-${String(1000000 + serial * 12345).slice(0, 7)}`,
          whatsappNumber: `03${String(serial % 50).padStart(2, '0')}-${String(1000000 + serial * 12345).slice(0, 7)}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${serial}@example.com`,
          address: `House #${(serial * 7) % 150 + 1}, Street ${(serial % 12) + 1}, Lahore`,
          fatherName,
          fatherContact: `0321-${String(9000000 - serial * 11111).slice(0, 7)}`,
          fatherCnic: `35202-${String(1000000 + serial * 3721).slice(0, 7)}-${(serial % 9) + 1}`,
          studentClass,
          subject,
          section: subject,
          academicYear: '2026 - 27',
          fees: String(5000 + (serial % 5) * 500),
          dateOfJoining: '2026-08-15',
          registeredAt: '2026-08-20',
          isActive: true,
          isLeft: false
        });

        serial++;
      }
    });
  });

  // Sample archived past year students for 2025 - 26 session
  const pastClasses = [
    { cls: '10th', sec: 'Science' },
    { cls: '10th', sec: 'Computer' },
    { cls: 'FSc Part 2', sec: 'Pre- Medical' },
    { cls: 'FSc Part 2', sec: 'Pre-Engineering' }
  ];
  pastClasses.forEach(({ cls, sec }, pIdx) => {
    for (let j = 0; j < 2; j++) {
      const isFemale = (j % 2 === 1);
      const firstName = isFemale ? FIRST_NAMES_FEMALE[(pIdx * 2 + j) % FIRST_NAMES_FEMALE.length] : FIRST_NAMES_MALE[(pIdx * 2 + j) % FIRST_NAMES_MALE.length];
      const lastName = LAST_NAMES[(pIdx + j) % LAST_NAMES.length];
      const fatherName = FATHER_NAMES[(pIdx + j) % FATHER_NAMES.length];
      const pic = isFemale ? FEMALE_AVATARS[j % FEMALE_AVATARS.length] : MALE_AVATARS[j % MALE_AVATARS.length];
      students.push({
        id: `SA-2025-${String(pIdx * 2 + j + 1).padStart(3, '0')}`,
        firstName,
        lastName,
        pic,
        gender: isFemale ? 'Female' : 'Male',
        contactNumber: `0300-${String(2000000 + (pIdx + 1) * 11111).slice(0, 7)}`,
        whatsappNumber: `0300-${String(2000000 + (pIdx + 1) * 11111).slice(0, 7)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.archive@example.com`,
        address: `House #${pIdx * 10 + 5}, Gulberg III, Lahore`,
        fatherName,
        fatherContact: `0321-${String(8000000 - pIdx * 12345).slice(0, 7)}`,
        fatherCnic: `35202-${String(2000000 + pIdx * 9876).slice(0, 7)}-1`,
        studentClass: cls,
        subject: sec,
        section: sec,
        academicYear: '2025 - 26',
        fees: '5000',
        dateOfJoining: '2025-05-10',
        registeredAt: '2025-05-15',
        isActive: false,
        isLeft: false,
        graduationStatus: 'Graduated Session 2025 - 2026'
      });
    }
  });

  return students;
}

export const DEFAULT_ACADEMIC_SESSION = '2026 - 27';

export const INITIAL_ACADEMIC_SESSIONS = [
  {
    id: 'SES-2025-26',
    year: '2025 - 26',
    label: 'Academic Year 2025 - 26',
    status: 'ARCHIVED',
    startDate: '2025-05-01',
    endDate: '2026-04-30',
    matricStartMonth: 'May',
    fscStartMonth: 'July',
    description: 'Archived session for Academic Year 2025 - 2026'
  },
  {
    id: 'SES-2026-27',
    year: '2026 - 27',
    label: 'Academic Year 2026 - 27',
    status: 'ACTIVE',
    startDate: '2026-05-01',
    matricStartMonth: 'May',
    fscStartMonth: 'July',
    description: 'Current running academic session for Matric and Intermediate'
  }
];

export const INITIAL_STUDENTS = buildDemoStudents();

export function getAcademicSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACADEMIC_SESSION);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_SESSION, DEFAULT_ACADEMIC_SESSION);
      return DEFAULT_ACADEMIC_SESSION;
    }
    return raw;
  } catch (e) {
    return DEFAULT_ACADEMIC_SESSION;
  }
}

export function saveAcademicSession(sessionStr) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_SESSION, sessionStr);
  } catch (e) {
    console.error('Failed to save academic session', e);
  }
}

export function getAcademicSessionsList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACADEMIC_SESSIONS_LIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_SESSIONS_LIST, JSON.stringify(INITIAL_ACADEMIC_SESSIONS));
      return INITIAL_ACADEMIC_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ACADEMIC_SESSIONS;
  } catch (e) {
    return INITIAL_ACADEMIC_SESSIONS;
  }
}

export function saveAcademicSessionsList(list) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_SESSIONS_LIST, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save academic sessions list', e);
  }
}

export const INITIAL_ATTENDANCE = [
  {
    id: 'ATT-20260908-01',
    date: '2026-09-08',
    studentClass: '9th',
    subject: 'Science',
    createdAt: '2026-09-08T09:30:00Z',
    records: INITIAL_STUDENTS.filter(s => s.studentClass === '9th' && s.subject === 'Science' && s.academicYear === '2026 - 27').map((s, idx) => ({
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      gender: s.gender,
      pic: s.pic,
      status: idx === 1 ? 'Absent' : idx === 3 ? 'Leave' : 'Present'
    }))
  },
  {
    id: 'ATT-20260908-02',
    date: '2026-09-08',
    studentClass: 'FSc Part 1',
    subject: 'Pre- Medical',
    createdAt: '2026-09-08T10:15:00Z',
    records: INITIAL_STUDENTS.filter(s => s.studentClass === 'FSc Part 1' && s.subject === 'Pre- Medical' && s.academicYear === '2026 - 27').map((s, idx) => ({
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      gender: s.gender,
      pic: s.pic,
      status: idx === 2 ? 'Absent' : 'Present'
    }))
  }
];

export function getStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 70) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    // Ensure every student has academicYear assigned and normalize Med / Eng to Pre- Medical / Pre-Engineering
    return parsed.map(s => {
      let subject = s.subject;
      if (subject === 'Med' || subject === 'Pre Medical') subject = 'Pre- Medical';
      else if (subject === 'Eng' || subject === 'Pre Engineering') subject = 'Pre-Engineering';

      let section = s.section || subject;
      if (section === 'Med' || section === 'Pre Medical') section = 'Pre- Medical';
      else if (section === 'Eng' || section === 'Pre Engineering') section = 'Pre-Engineering';

      return {
        ...s,
        subject,
        section,
        academicYear: s.academicYear || DEFAULT_ACADEMIC_SESSION
      };
    });
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

export function generateNextStudentId(students) {
  if (!students || students.length === 0) {
    return 'SA-0001';
  }

  let maxNum = 0;
  students.forEach(s => {
    if (s.id && s.id.startsWith('SA-')) {
      const numPart = parseInt(s.id.replace('SA-', ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `SA-${String(nextNum).padStart(4, '0')}`;
}

export function getAttendanceSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    const parsed = JSON.parse(raw);
    return parsed.map(sess => {
      let subject = sess.subject;
      if (subject === 'Med' || subject === 'Pre Medical') subject = 'Pre- Medical';
      else if (subject === 'Eng' || subject === 'Pre Engineering') subject = 'Pre-Engineering';
      return {
        ...sess,
        subject
      };
    });
  } catch (e) {
    console.error('Failed to load attendance from localStorage', e);
    return INITIAL_ATTENDANCE;
  }
}

export function saveAttendanceSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save attendance to localStorage', e);
  }
}

export const INITIAL_TEACHERS = [
  {
    id: 'TEA-0001',
    name: 'Prof. Muhammad Kamran',
    salary: '75000',
    cnic: '35202-8876543-1',
    contactNumber: '0300-8877665',
    address: 'House #12, Canal View, Lahore',
    pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    department: 'Mathematics & Physics',
    arrivalTime: '07:45',
    joinedAt: '2025-01-10'
  },
  {
    id: 'TEA-0002',
    name: 'Dr. Ayesha Siddiqua',
    salary: '85000',
    cnic: '35201-4455667-2',
    contactNumber: '0321-4455667',
    address: 'Block C, Johar Town, Lahore',
    pic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    department: 'Biology & Chemistry',
    arrivalTime: '07:45',
    joinedAt: '2025-02-01'
  },
  {
    id: 'TEA-0003',
    name: 'Engr. Tariq Mehmood',
    salary: '70000',
    cnic: '35202-1122334-3',
    contactNumber: '0333-1122334',
    address: 'Model Town, Link Road, Lahore',
    pic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
    department: 'Computer Science & IT',
    arrivalTime: '07:45',
    joinedAt: '2025-03-15'
  },
  {
    id: 'TEA-0004',
    name: 'Ms. Hira Farooq',
    salary: '60000',
    cnic: '35201-9988776-4',
    contactNumber: '0312-9988776',
    address: 'DHA Phase 3, Lahore',
    pic: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=256',
    department: 'English Literature',
    arrivalTime: '07:45',
    joinedAt: '2025-04-10'
  },
  {
    id: 'TEA-0005',
    name: 'Sir Naveed Akhtar',
    salary: '65000',
    cnic: '35202-5566778-5',
    contactNumber: '0345-5566778',
    address: 'Gulberg II, Lahore',
    pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    department: 'Physics',
    arrivalTime: '07:45',
    joinedAt: '2025-05-01'
  },
  {
    id: 'TEA-0006',
    name: 'Ms. Maryam Qureshi',
    salary: '62000',
    cnic: '35201-3322110-6',
    contactNumber: '0308-3322110',
    address: 'Wapda Town, Lahore',
    pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    department: 'Urdu & Pak Studies',
    arrivalTime: '07:45',
    joinedAt: '2025-06-15'
  }
];

export const INITIAL_TEACHER_ATTENDANCE = [
  {
    id: 'TATT-20260908-01',
    date: '2026-09-08',
    createdAt: '2026-09-08T08:30:00Z',
    records: INITIAL_TEACHERS.map((t, idx) => ({
      teacherId: t.id,
      teacherName: t.name,
      pic: t.pic,
      department: t.department,
      status: idx === 3 ? 'Leave' : 'Present'
    }))
  }
];

export function getTeachers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load teachers from localStorage', e);
    return INITIAL_TEACHERS;
  }
}

export function saveTeachers(teachers) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  } catch (e) {
    console.error('Failed to save teachers to localStorage', e);
  }
}

export function generateNextTeacherId(teachers) {
  if (!teachers || teachers.length === 0) {
    return 'TEA-0001';
  }

  let maxNum = 0;
  teachers.forEach((t) => {
    if (t.id && t.id.startsWith('TEA-')) {
      const numPart = parseInt(t.id.replace('TEA-', ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `TEA-${String(nextNum).padStart(4, '0')}`;
}

export function getTeacherAttendanceSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEACHER_ATTENDANCE, JSON.stringify(INITIAL_TEACHER_ATTENDANCE));
      return INITIAL_TEACHER_ATTENDANCE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load teacher attendance from localStorage', e);
    return INITIAL_TEACHER_ATTENDANCE;
  }
}

export function saveTeacherAttendanceSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_ATTENDANCE, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save teacher attendance to localStorage', e);
  }
}

// ----------------- BANKING MODULE -----------------
export const INITIAL_BANKS = [
  {
    id: 'BNK-0001',
    bankName: 'Meezan Bank Limited',
    accountName: 'Star Academy Main Operations',
    accountNumber: '02010105849301',
    openingBalance: 250000,
    createdAt: '2026-08-01'
  },
  {
    id: 'BNK-0002',
    bankName: 'Habib Bank Limited (HBL)',
    accountName: 'Star Academy Fee Collection',
    accountNumber: '10294857201948',
    openingBalance: 180000,
    createdAt: '2026-08-01'
  },
  {
    id: 'BNK-0003',
    bankName: 'Allied Bank Limited (ABL)',
    accountName: 'Star Academy Reserve Fund',
    accountNumber: '09483726152019',
    openingBalance: 95000,
    createdAt: '2026-08-01'
  },
  {
    id: 'BNK-0004',
    bankName: 'Cash In Hand (Petty Cash)',
    accountName: 'Office Reception Counter',
    accountNumber: 'CASH-DESK-01',
    openingBalance: 40000,
    createdAt: '2026-08-01'
  }
];

export const INITIAL_TRANSFERS = [
  {
    id: 'TRF-0001',
    date: '2026-09-02',
    fromBankId: 'BNK-0002',
    toBankId: 'BNK-0001',
    amount: 50000,
    details: 'Sweep collected student fees to main operational account',
    createdAt: '2026-09-02T11:30:00Z'
  },
  {
    id: 'TRF-0002',
    date: '2026-09-05',
    fromBankId: 'BNK-0001',
    toBankId: 'BNK-0004',
    amount: 15000,
    details: 'Petty cash counter replenishment for academy desk',
    createdAt: '2026-09-05T14:15:00Z'
  }
];

export const INITIAL_EXPENSE_CATEGORIES = [
  {
    id: 'EXP-0001',
    name: 'Campus Utilities (Electricity & Generator)',
    details: 'LESCO commercial bills, backup diesel fuel, and campus water filtration'
  },
  {
    id: 'EXP-0002',
    name: 'Printing & Examination Stationary',
    details: 'Question papers, syllabus test sheets, answer booklets, office stationary'
  },
  {
    id: 'EXP-0003',
    name: 'Campus Maintenance & Repairs',
    details: 'Janitorial cleaning items, air conditioner maintenance, classroom furniture'
  },
  {
    id: 'EXP-0004',
    name: 'Internet & Official Telecommunications',
    details: 'Optical fiber broadband connection and academy WhatsApp line packages'
  },
  {
    id: 'EXP-0005',
    name: 'Marketing & Admission Banners',
    details: 'Session banners, printed pamphlets, and digital media advertising'
  },
  {
    id: 'EXP-0006',
    name: 'Staff Tea & Academy Refreshments',
    details: 'Faculty lounge daily tea, water dispensers, and orientation events'
  }
];

export const INITIAL_CHARGED_EXPENSES = [
  {
    id: 'CHG-0001',
    date: '2026-09-03',
    expenseCategoryId: 'EXP-0001',
    expenseCategoryName: 'Campus Utilities (Electricity & Generator)',
    amount: 28500,
    bankId: 'BNK-0001',
    details: 'LESCO Electricity Bill - Paid online through Meezan portal',
    createdAt: '2026-09-03T10:00:00Z'
  },
  {
    id: 'CHG-0002',
    date: '2026-09-06',
    expenseCategoryId: 'EXP-0002',
    expenseCategoryName: 'Printing & Examination Stationary',
    amount: 14200,
    bankId: 'BNK-0004',
    details: 'Cash voucher for September monthly test series booklets',
    createdAt: '2026-09-06T15:30:00Z'
  }
];

export const INITIAL_TEACHER_SALARIES = [
  {
    id: 'PAY-0001',
    date: '2026-09-01',
    teacherId: 'TEA-0001',
    teacherName: 'Prof. Muhammad Kamran',
    amount: 75000,
    bankId: 'BNK-0001',
    details: 'Teaching faculty salary for August 2026',
    createdAt: '2026-09-01T09:00:00Z'
  },
  {
    id: 'PAY-0002',
    date: '2026-09-01',
    teacherId: 'TEA-0002',
    teacherName: 'Dr. Ayesha Siddiqua',
    amount: 85000,
    bankId: 'BNK-0001',
    details: 'Teaching faculty salary for August 2026',
    createdAt: '2026-09-01T09:15:00Z'
  }
];

// Build initial fee vouchers for all demo students
export function buildDemoFeeVouchers(students) {
  const vouchers = [];
  const activeStudents = students.filter(s => !s.isLeft && s.isActive !== false);

  activeStudents.forEach((student, index) => {
    const voucherNum = String(index + 1).padStart(4, '0');
    const id = `FEE-202609-${voucherNum}`;
    const feeAmount = Number(student.fees) || 6000;
    // First 18 students are already marked as Paid for September, rest are Pending
    const isPaid = index < 18;

    vouchers.push({
      id,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentClass: student.studentClass,
      section: student.section || student.subject,
      fatherName: student.fatherName,
      fatherContact: student.fatherContact,
      whatsappNumber: student.whatsappNumber || student.contactNumber,
      month: 'September 2026',
      dueDate: '2026-09-10',
      feeAmount,
      amountPaid: isPaid ? feeAmount : 0,
      status: isPaid ? 'PAID' : 'PENDING',
      paidDate: isPaid ? (index % 2 === 0 ? '2026-09-03' : '2026-09-05') : '',
      bankId: isPaid ? (index % 3 === 0 ? 'BNK-0001' : index % 3 === 1 ? 'BNK-0002' : 'BNK-0004') : '',
      details: isPaid ? 'Monthly tuition fee paid' : 'Monthly tuition fee voucher generated on 1st of month',
      createdAt: '2026-09-01T00:00:00Z'
    });
  });

  return vouchers;
}

export const INITIAL_FEE_VOUCHERS = buildDemoFeeVouchers(INITIAL_STUDENTS);

export const INITIAL_TIMETABLES = [
  {
    id: 'TT-0001',
    studentClass: '9th',
    section: 'Science',
    title: '9th Science Regular Timetable',
    days: 'Monday - Saturday',
    effectiveFrom: '2026-09-01',
    periods: [
      { id: 'p1', type: 'lecture', subject: 'Physics', fromTime: '08:00 AM', toTime: '08:45 AM', teacherName: 'Sir Naveed Akhtar', room: 'Room 101' },
      { id: 'p2', type: 'lecture', subject: 'Chemistry', fromTime: '08:45 AM', toTime: '09:30 AM', teacherName: 'Dr. Ayesha Siddiqua', room: 'Lab 1' },
      { id: 'p3', type: 'break', subject: 'Morning Recess Break', fromTime: '09:30 AM', toTime: '10:00 AM', isBreak: true },
      { id: 'p4', type: 'lecture', subject: 'Mathematics', fromTime: '10:00 AM', toTime: '10:45 AM', teacherName: 'Prof. Muhammad Kamran', room: 'Room 101' },
      { id: 'p5', type: 'lecture', subject: 'English', fromTime: '10:45 AM', toTime: '11:30 AM', teacherName: 'Ms. Hira Farooq', room: 'Room 101' },
      { id: 'p6', type: 'lecture', subject: 'Biology', fromTime: '11:30 AM', toTime: '12:15 PM', teacherName: 'Dr. Ayesha Siddiqua', room: 'Lab 2' },
      { id: 'p7', type: 'break', subject: 'Zuhr Prayer & Lunch Break', fromTime: '12:15 PM', toTime: '01:00 PM', isBreak: true },
      { id: 'p8', type: 'lecture', subject: 'Urdu & Pak Studies', fromTime: '01:00 PM', toTime: '01:45 PM', teacherName: 'Ms. Maryam Qureshi', room: 'Room 101' }
    ]
  },
  {
    id: 'TT-0002',
    studentClass: '10th',
    section: 'Science',
    title: '10th Science Regular Timetable',
    days: 'Monday - Saturday',
    effectiveFrom: '2026-09-01',
    periods: [
      { id: 'p1', type: 'lecture', subject: 'Mathematics', fromTime: '08:00 AM', toTime: '08:45 AM', teacherName: 'Prof. Muhammad Kamran', room: 'Room 102' },
      { id: 'p2', type: 'lecture', subject: 'Physics', fromTime: '08:45 AM', toTime: '09:30 AM', teacherName: 'Sir Naveed Akhtar', room: 'Lab 1' },
      { id: 'p3', type: 'break', subject: 'Morning Recess Break', fromTime: '09:30 AM', toTime: '10:00 AM', isBreak: true },
      { id: 'p4', type: 'lecture', subject: 'Chemistry', fromTime: '10:00 AM', toTime: '10:45 AM', teacherName: 'Dr. Ayesha Siddiqua', room: 'Lab 2' },
      { id: 'p5', type: 'lecture', subject: 'English', fromTime: '10:45 AM', toTime: '11:30 AM', teacherName: 'Ms. Hira Farooq', room: 'Room 102' },
      { id: 'p6', type: 'break', subject: 'Zuhr Prayer & Lunch Break', fromTime: '12:15 PM', toTime: '01:00 PM', isBreak: true },
      { id: 'p7', type: 'lecture', subject: 'Biology', fromTime: '01:00 PM', toTime: '01:45 PM', teacherName: 'Dr. Ayesha Siddiqua', room: 'Room 102' }
    ]
  },
  {
    id: 'TT-0003',
    studentClass: 'FSc Part 1',
    section: 'Eng',
    title: 'FSc Part 1 Eng Timetable',
    days: 'Monday - Saturday',
    effectiveFrom: '2026-09-01',
    periods: [
      { id: 'p1', type: 'lecture', subject: 'Mathematics (Calculus)', fromTime: '08:00 AM', toTime: '09:00 AM', teacherName: 'Prof. Muhammad Kamran', room: 'Hall A' },
      { id: 'p2', type: 'lecture', subject: 'Physics (Mechanics)', fromTime: '09:00 AM', toTime: '10:00 AM', teacherName: 'Sir Naveed Akhtar', room: 'Hall A' },
      { id: 'p3', type: 'break', subject: 'Morning Break', fromTime: '10:00 AM', toTime: '10:30 AM', isBreak: true },
      { id: 'p4', type: 'lecture', subject: 'Chemistry', fromTime: '10:30 AM', toTime: '11:30 AM', teacherName: 'Dr. Ayesha Siddiqua', room: 'Hall A' },
      { id: 'p5', type: 'lecture', subject: 'English & Urdu', fromTime: '11:30 AM', toTime: '12:30 PM', teacherName: 'Ms. Hira Farooq', room: 'Hall A' },
      { id: 'p6', type: 'break', subject: 'Zuhr Prayer & Lunch', fromTime: '12:30 PM', toTime: '01:15 PM', isBreak: true },
      { id: 'p7', type: 'lecture', subject: 'Physics Lab Session', fromTime: '01:15 PM', toTime: '02:00 PM', teacherName: 'Sir Naveed Akhtar', room: 'Physics Lab' }
    ]
  },
  {
    id: 'TT-0004',
    studentClass: 'FSc Part 1',
    section: 'ICS - Physics',
    title: 'FSc Part 1 ICS - Physics Timetable',
    days: 'Monday - Saturday',
    effectiveFrom: '2026-09-01',
    periods: [
      { id: 'p1', type: 'lecture', subject: 'Computer Science (C++ & IT)', fromTime: '08:00 AM', toTime: '09:00 AM', teacherName: 'Engr. Tariq Mehmood', room: 'CS Lab 1' },
      { id: 'p2', type: 'lecture', subject: 'Mathematics', fromTime: '09:00 AM', toTime: '10:00 AM', teacherName: 'Prof. Muhammad Kamran', room: 'Hall B' },
      { id: 'p3', type: 'break', subject: 'Morning Break', fromTime: '10:00 AM', toTime: '10:30 AM', isBreak: true },
      { id: 'p4', type: 'lecture', subject: 'Physics / Stats', fromTime: '10:30 AM', toTime: '11:30 AM', teacherName: 'Sir Naveed Akhtar', room: 'Hall B' },
      { id: 'p5', type: 'lecture', subject: 'English Comprehension', fromTime: '11:30 AM', toTime: '12:30 PM', teacherName: 'Ms. Hira Farooq', room: 'Hall B' },
      { id: 'p6', type: 'break', subject: 'Zuhr Prayer & Lunch', fromTime: '12:30 PM', toTime: '01:15 PM', isBreak: true },
      { id: 'p7', type: 'lecture', subject: 'Programming Practical Lab', fromTime: '01:15 PM', toTime: '02:00 PM', teacherName: 'Engr. Tariq Mehmood', room: 'CS Lab 1' }
    ]
  }
];

// --- BANK STORAGE ---
export function getBanks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(INITIAL_BANKS));
      return INITIAL_BANKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load banks', e);
    return INITIAL_BANKS;
  }
}

export function saveBanks(banks) {
  try {
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(banks));
  } catch (e) {
    console.error('Failed to save banks', e);
  }
}

export function generateNextBankId(banks) {
  if (!banks || banks.length === 0) return 'BNK-0001';
  let max = 0;
  banks.forEach(b => {
    if (b.id && b.id.startsWith('BNK-')) {
      const num = parseInt(b.id.replace('BNK-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `BNK-${String(max + 1).padStart(4, '0')}`;
}

// --- TRANSFERS STORAGE ---
export function getTransfers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(INITIAL_TRANSFERS));
      return INITIAL_TRANSFERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load transfers', e);
    return INITIAL_TRANSFERS;
  }
}

export function saveTransfers(transfers) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  } catch (e) {
    console.error('Failed to save transfers', e);
  }
}

export function generateNextTransferId(transfers) {
  if (!transfers || transfers.length === 0) return 'TRF-0001';
  let max = 0;
  transfers.forEach(t => {
    if (t.id && t.id.startsWith('TRF-')) {
      const num = parseInt(t.id.replace('TRF-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `TRF-${String(max + 1).padStart(4, '0')}`;
}

// --- EXPENSE CATEGORIES STORAGE ---
export function getExpenseCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(INITIAL_EXPENSE_CATEGORIES));
      return INITIAL_EXPENSE_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load expense categories', e);
    return INITIAL_EXPENSE_CATEGORIES;
  }
}

export function saveExpenseCategories(cats) {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save expense categories', e);
  }
}

export function generateNextExpenseCategoryId(cats) {
  if (!cats || cats.length === 0) return 'EXP-0001';
  let max = 0;
  cats.forEach(c => {
    if (c.id && c.id.startsWith('EXP-')) {
      const num = parseInt(c.id.replace('EXP-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `EXP-${String(max + 1).padStart(4, '0')}`;
}

// --- CHARGED EXPENSES STORAGE ---
export function getChargedExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHARGED_EXPENSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHARGED_EXPENSES, JSON.stringify(INITIAL_CHARGED_EXPENSES));
      return INITIAL_CHARGED_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load charged expenses', e);
    return INITIAL_CHARGED_EXPENSES;
  }
}

export function saveChargedExpenses(charges) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARGED_EXPENSES, JSON.stringify(charges));
  } catch (e) {
    console.error('Failed to save charged expenses', e);
  }
}

export function generateNextChargedExpenseId(charges) {
  if (!charges || charges.length === 0) return 'CHG-0001';
  let max = 0;
  charges.forEach(c => {
    if (c.id && c.id.startsWith('CHG-')) {
      const num = parseInt(c.id.replace('CHG-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `CHG-${String(max + 1).padStart(4, '0')}`;
}

// --- TEACHER SALARIES (PAYROLL) STORAGE ---
export function getTeacherSalaries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_SALARIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEACHER_SALARIES, JSON.stringify(INITIAL_TEACHER_SALARIES));
      return INITIAL_TEACHER_SALARIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load teacher salaries', e);
    return INITIAL_TEACHER_SALARIES;
  }
}

export function saveTeacherSalaries(salaries) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER_SALARIES, JSON.stringify(salaries));
  } catch (e) {
    console.error('Failed to save teacher salaries', e);
  }
}

export function generateNextTeacherSalaryId(salaries) {
  if (!salaries || salaries.length === 0) return 'PAY-0001';
  let max = 0;
  salaries.forEach(s => {
    if (s.id && s.id.startsWith('PAY-')) {
      const num = parseInt(s.id.replace('PAY-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `PAY-${String(max + 1).padStart(4, '0')}`;
}

// --- FEE VOUCHERS STORAGE ---
export function getFeeVouchers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEE_VOUCHERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEE_VOUCHERS, JSON.stringify(INITIAL_FEE_VOUCHERS));
      return INITIAL_FEE_VOUCHERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.FEE_VOUCHERS, JSON.stringify(INITIAL_FEE_VOUCHERS));
      return INITIAL_FEE_VOUCHERS;
    }
    return parsed.map(v => {
      let section = v.section;
      if (section === 'Med' || section === 'Pre Medical') section = 'Pre- Medical';
      else if (section === 'Eng' || section === 'Pre Engineering') section = 'Pre-Engineering';
      return { ...v, section };
    });
  } catch (e) {
    console.error('Failed to load fee vouchers', e);
    return INITIAL_FEE_VOUCHERS;
  }
}

export function saveFeeVouchers(vouchers) {
  try {
    localStorage.setItem(STORAGE_KEYS.FEE_VOUCHERS, JSON.stringify(vouchers));
  } catch (e) {
    console.error('Failed to save fee vouchers', e);
  }
}

export function generateNextFeeVoucherId(vouchers) {
  const currentMonthCode = new Date().toISOString().slice(0, 7).replace('-', '');
  if (!vouchers || vouchers.length === 0) return `FEE-${currentMonthCode}-0001`;
  let max = 0;
  vouchers.forEach(v => {
    if (v.id) {
      const parts = v.id.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > max) max = num;
      }
    }
  });
  return `FEE-${currentMonthCode}-${String(max + 1).padStart(4, '0')}`;
}

// Generates monthly fee vouchers for all active students for a specified month
export function generateMonthlyFeeVouchers(students, existingVouchers, monthStr = 'September 2026') {
  const activeStudents = students.filter(s => !s.isLeft && s.isActive !== false);
  const updatedVouchers = [...existingVouchers];
  let generatedCount = 0;

  activeStudents.forEach((student) => {
    // Check if voucher already exists for this student and month
    const exists = updatedVouchers.some(v => v.studentId === student.id && v.month === monthStr);
    if (!exists) {
      const id = generateNextFeeVoucherId(updatedVouchers);
      const feeAmount = Number(student.fees) || 6000;
      updatedVouchers.push({
        id,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        studentClass: student.studentClass,
        section: student.section || student.subject,
        fatherName: student.fatherName,
        fatherContact: student.fatherContact,
        whatsappNumber: student.whatsappNumber || student.contactNumber,
        month: monthStr,
        dueDate: `${new Date().toISOString().slice(0, 8)}10`,
        feeAmount,
        amountPaid: 0,
        status: 'PENDING',
        paidDate: '',
        bankId: '',
        details: `Monthly tuition fee voucher for ${monthStr}`,
        createdAt: new Date().toISOString()
      });
      generatedCount++;
    }
  });

  return { updatedVouchers, generatedCount };
}

// --- TIMETABLES STORAGE ---
export function getTimetables() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMETABLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(INITIAL_TIMETABLES));
      return INITIAL_TIMETABLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load timetables', e);
    return INITIAL_TIMETABLES;
  }
}

export function saveTimetables(timetables) {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(timetables));
  } catch (e) {
    console.error('Failed to save timetables', e);
  }
}

export function generateNextTimetableId(timetables) {
  if (!timetables || timetables.length === 0) return 'TT-0001';
  let max = 0;
  timetables.forEach(t => {
    if (t.id && t.id.startsWith('TT-')) {
      const num = parseInt(t.id.replace('TT-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `TT-${String(max + 1).padStart(4, '0')}`;
}

// --- COMPUTE REALTIME BANK BALANCE ---
export function calculateBankLiveBalances(banks, transfers, chargedExpenses, teacherSalaries, feeVouchers) {
  const balanceMap = {};

  banks.forEach(bank => {
    let bal = Number(bank.openingBalance) || 0;

    // Add incoming fees deposited to this bank
    if (feeVouchers) {
      feeVouchers.forEach(fv => {
        if (fv.status === 'PAID' && fv.bankId === bank.id) {
          bal += Number(fv.amountPaid || fv.feeAmount || 0);
        }
      });
    }

    // Add transfers into this bank
    if (transfers) {
      transfers.forEach(trf => {
        if (trf.toBankId === bank.id) {
          bal += Number(trf.amount || 0);
        }
        if (trf.fromBankId === bank.id) {
          bal -= Number(trf.amount || 0);
        }
      });
    }

    // Subtract charged expenses from this bank
    if (chargedExpenses) {
      chargedExpenses.forEach(exp => {
        if (exp.bankId === bank.id) {
          bal -= Number(exp.amount || 0);
        }
      });
    }

    // Subtract teacher salaries paid from this bank
    if (teacherSalaries) {
      teacherSalaries.forEach(sal => {
        if (sal.bankId === bank.id) {
          bal -= Number(sal.amount || 0);
        }
      });
    }

    balanceMap[bank.id] = bal;
  });

  return balanceMap;
}

// ----------------- DATESHEET & TESTS MODULE -----------------
export const INITIAL_TEST_DEFINITIONS = [
  {
    id: 'TST-0001',
    name: 'Mockup Exam 1',
    session: 'Session 2026-27',
    description: 'First comprehensive board mockup exam series covering entire first-term and full book syllabus',
    totalMarks: '100',
    createdAt: '2026-09-01'
  },
  {
    id: 'TST-0002',
    name: 'Send Up Exam 2',
    session: 'Pre-Board Clearance 2026',
    description: 'Pre-board qualification tests for matric and intermediate board roll number slips',
    totalMarks: '100',
    createdAt: '2026-09-01'
  },
  {
    id: 'TST-0003',
    name: 'Monthly Test - September',
    session: 'September Monthly Assessment',
    description: 'Continuous assessment test series covering chapters completed in August and September',
    totalMarks: '50',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_DATESHEETS = [
  {
    id: 'DS-0001',
    testId: 'TST-0001',
    testName: 'Mockup Exam 1',
    studentClass: '9th',
    section: 'Science',
    title: '9th Science - Mockup Exam 1 Datesheet',
    instructions: 'Reporting time 08:30 AM. Candidates must bring official roll number slip and transparent pencil box.',
    rows: [
      { id: 'ds-1', subject: 'Physics', date: '2026-09-22', day: 'Tuesday', time: '09:00 AM - 12:00 PM', syllabus: 'Chapters 1 to 4 with numericals & short questions' },
      { id: 'ds-2', subject: 'Chemistry', date: '2026-09-24', day: 'Thursday', time: '09:00 AM - 12:00 PM', syllabus: 'Chapters 1 to 5 Fundamentals & Periodic Table' },
      { id: 'ds-3', subject: 'Mathematics', date: '2026-09-26', day: 'Saturday', time: '09:00 AM - 12:00 PM', syllabus: 'Chapters 1 to 6 Real numbers, matrices & polynomials' },
      { id: 'ds-4', subject: 'English', date: '2026-09-29', day: 'Tuesday', time: '09:00 AM - 12:00 PM', syllabus: 'Lessons 1-7, Essay writing, grammar and translation' },
      { id: 'ds-5', subject: 'Biology', date: '2026-10-01', day: 'Thursday', time: '09:00 AM - 12:00 PM', syllabus: 'Chapters 1 to 5 Cell biology, enzymes & bioenergetics' }
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 'DS-0002',
    testId: 'TST-0001',
    testName: 'Mockup Exam 1',
    studentClass: '10th',
    section: 'Science',
    title: '10th Science - Mockup Exam 1 Datesheet',
    instructions: 'Morning shift begins promptly at 09:00 AM. No mobile phones or digital smartwatches allowed in exam hall.',
    rows: [
      { id: 'ds-10-1', subject: 'Mathematics', date: '2026-09-21', day: 'Monday', time: '09:00 AM - 12:00 PM', syllabus: 'Quadratic Equations, Theory of Quadratic, Variations' },
      { id: 'ds-10-2', subject: 'Physics', date: '2026-09-23', day: 'Wednesday', time: '09:00 AM - 12:00 PM', syllabus: 'Simple Harmonic Motion, Sound, Geometrical Optics' },
      { id: 'ds-10-3', subject: 'Chemistry', date: '2026-09-25', day: 'Friday', time: '09:00 AM - 12:00 PM', syllabus: 'Chemical Equilibrium, Acids, Bases and Salts, Organic Chemistry' },
      { id: 'ds-10-4', subject: 'English', date: '2026-09-28', day: 'Monday', time: '09:00 AM - 12:00 PM', syllabus: 'Full book objective + subjective board pattern' },
      { id: 'ds-10-5', subject: 'Biology', date: '2026-09-30', day: 'Wednesday', time: '09:00 AM - 12:00 PM', syllabus: 'Gaseous Exchange, Homeostasis, Coordination & Control' }
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 'DS-0003',
    testId: 'TST-0002',
    testName: 'Send Up Exam 2',
    studentClass: 'FSc Part 1',
    section: 'Eng',
    title: 'FSc Part 1 Eng - Send Up 2 Datesheet',
    instructions: 'Calculators are permitted for Mathematics & Physics only. Examination hall entry closes 15 minutes prior to start.',
    rows: [
      { id: 'ds-fsc-1', subject: 'Mathematics (Calculus & Algebra)', date: '2026-10-05', day: 'Monday', time: '08:30 AM - 11:30 AM', syllabus: 'Full book syllabus comprehensive send up paper' },
      { id: 'ds-fsc-2', subject: 'Physics (Mechanics & Heat)', date: '2026-10-07', day: 'Wednesday', time: '08:30 AM - 11:30 AM', syllabus: 'Full book theoretical board format' },
      { id: 'ds-fsc-3', subject: 'Chemistry', date: '2026-10-09', day: 'Friday', time: '08:30 AM - 11:30 AM', syllabus: 'Physical, Inorganic and Analytical Chapters' },
      { id: 'ds-fsc-4', subject: 'English', date: '2026-10-12', day: 'Monday', time: '08:30 AM - 11:30 AM', syllabus: 'Book 1 short stories, Book 3 plays and poems' }
    ],
    createdAt: '2026-09-03'
  },
  {
    id: 'DS-0004',
    testId: 'TST-0002',
    testName: 'Send Up Exam 2',
    studentClass: 'FSc Part 1',
    section: 'ICS - Physics',
    title: 'FSc Part 1 ICS - Physics - Send Up 2 Datesheet',
    instructions: 'Both objective and coding practical exams will be evaluated on the scheduled date.',
    rows: [
      { id: 'ds-ics-1', subject: 'Computer Science (C++ & IT)', date: '2026-10-05', day: 'Monday', time: '08:30 AM - 11:30 AM', syllabus: 'Overview of Computer System, C++ Basics, Control Structures' },
      { id: 'ds-ics-2', subject: 'Mathematics', date: '2026-10-07', day: 'Wednesday', time: '08:30 AM - 11:30 AM', syllabus: 'Complex numbers, matrices, sequences and series' },
      { id: 'ds-ics-3', subject: 'Physics / Stats', date: '2026-10-09', day: 'Friday', time: '08:30 AM - 11:30 AM', syllabus: 'Vectors, Equilibrium, Circular Motion' },
      { id: 'ds-ics-4', subject: 'English', date: '2026-10-12', day: 'Monday', time: '08:30 AM - 11:30 AM', syllabus: 'Comprehension, application and grammar test' }
    ],
    createdAt: '2026-09-03'
  }
];

// --- TEST DEFINITIONS STORAGE ---
export function getTestDefinitions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_DEFINITIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEST_DEFINITIONS, JSON.stringify(INITIAL_TEST_DEFINITIONS));
      return INITIAL_TEST_DEFINITIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load test definitions', e);
    return INITIAL_TEST_DEFINITIONS;
  }
}

export function saveTestDefinitions(tests) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEST_DEFINITIONS, JSON.stringify(tests));
  } catch (e) {
    console.error('Failed to save test definitions', e);
  }
}

export function generateNextTestDefinitionId(tests) {
  if (!tests || tests.length === 0) return 'TST-0001';
  let max = 0;
  tests.forEach(t => {
    if (t.id && t.id.startsWith('TST-')) {
      const num = parseInt(t.id.replace('TST-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `TST-${String(max + 1).padStart(4, '0')}`;
}

// --- DATESHEETS STORAGE ---
export function getDatesheets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DATESHEETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DATESHEETS, JSON.stringify(INITIAL_DATESHEETS));
      return INITIAL_DATESHEETS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load datesheets', e);
    return INITIAL_DATESHEETS;
  }
}

export function saveDatesheets(datesheets) {
  try {
    localStorage.setItem(STORAGE_KEYS.DATESHEETS, JSON.stringify(datesheets));
  } catch (e) {
    console.error('Failed to save datesheets', e);
  }
}

export function generateNextDatesheetId(datesheets) {
  if (!datesheets || datesheets.length === 0) return 'DS-0001';
  let max = 0;
  datesheets.forEach(d => {
    if (d.id && d.id.startsWith('DS-')) {
      const num = parseInt(d.id.replace('DS-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `DS-${String(max + 1).padStart(4, '0')}`;
}

// --- CURRICULUM SUBJECTS PER CLASS & SECTION STORAGE ---
export const INITIAL_CURRICULUM_SUBJECTS = {
  '9th_Science': ['Physics', 'Chemistry', 'Bio', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  '9th_Computer': ['Physics', 'Chemistry', 'Computer', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  '10th_Science': ['Physics', 'Chemistry', 'Bio', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  '10th_Computer': ['Physics', 'Chemistry', 'Computer', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 1_Pre- Medical': ['Physics', 'Chemistry', 'Bio', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_Pre-Engineering': ['Physics', 'Chemistry', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_Med': ['Physics', 'Chemistry', 'Bio', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_Eng': ['Physics', 'Chemistry', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_ICS - Physics': ['Physics', 'Computer', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_ICS - Statistics': ['Statistics', 'Computer', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_FA IT': ['Economics', 'Computer', 'Physical Education', 'Eng', 'Urdu', 'Islamiyat Compulsory', 'Islamiyat Elective', 'Tarjama tul Quran'],
  'FSc Part 2_Pre- Medical': ['Physics', 'Chemistry', 'Bio', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_Pre-Engineering': ['Physics', 'Chemistry', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_Med': ['Physics', 'Chemistry', 'Bio', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_Eng': ['Physics', 'Chemistry', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_ICS - Physics': ['Physics', 'Computer', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_ICS - Statistics': ['Statistics', 'Computer', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 2_FA IT': ['Economics', 'Computer', 'Physical Education', 'Eng', 'Urdu', 'Pak Studies', 'Islamiyat Elective', 'Tarjama tul Quran'],

  // Individual Subjects curriculum options
  '9th_Individual Subjects': ['Physics', 'Chemistry', 'Bio', 'Math', 'Computer', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  '10th_Individual Subjects': ['Physics', 'Chemistry', 'Bio', 'Math', 'Computer', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 1_Individual Subjects': ['Physics', 'Chemistry', 'Bio', 'Math', 'Computer', 'Statistics', 'Economics', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 2_Individual Subjects': ['Physics', 'Chemistry', 'Bio', 'Math', 'Computer', 'Statistics', 'Economics', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],

  // Legacy aliases for backward compatibility
  'FSc Part 1_Pre Medical': ['Physics', 'Chemistry', 'Bio', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_Pre Engineering': ['Physics', 'Chemistry', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 1_ICS': ['Physics', 'Computer', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
  'FSc Part 2_Pre Medical': ['Physics', 'Chemistry', 'Bio', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_Pre Engineering': ['Physics', 'Chemistry', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran'],
  'FSc Part 2_ICS': ['Physics', 'Computer', 'Math', 'Eng', 'Urdu', 'Pak Studies', 'Tarjama tul Quran']
};

export function getCurriculumSubjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRICULUM_SUBJECTS);
    let currentMap = { ...INITIAL_CURRICULUM_SUBJECTS };
    if (raw) {
      const parsed = JSON.parse(raw);
      currentMap = { ...currentMap, ...parsed };
    }
    // Cross-link Pre- Medical and Pre-Engineering with Med / Eng if customized
    if (currentMap['FSc Part 1_Med'] && !currentMap['FSc Part 1_Pre- Medical']) {
      currentMap['FSc Part 1_Pre- Medical'] = currentMap['FSc Part 1_Med'];
    }
    if (currentMap['FSc Part 1_Pre- Medical']) {
      currentMap['FSc Part 1_Med'] = currentMap['FSc Part 1_Pre- Medical'];
    }
    if (currentMap['FSc Part 1_Eng'] && !currentMap['FSc Part 1_Pre-Engineering']) {
      currentMap['FSc Part 1_Pre-Engineering'] = currentMap['FSc Part 1_Eng'];
    }
    if (currentMap['FSc Part 1_Pre-Engineering']) {
      currentMap['FSc Part 1_Eng'] = currentMap['FSc Part 1_Pre-Engineering'];
    }
    if (currentMap['FSc Part 2_Med'] && !currentMap['FSc Part 2_Pre- Medical']) {
      currentMap['FSc Part 2_Pre- Medical'] = currentMap['FSc Part 2_Med'];
    }
    if (currentMap['FSc Part 2_Pre- Medical']) {
      currentMap['FSc Part 2_Med'] = currentMap['FSc Part 2_Pre- Medical'];
    }
    if (currentMap['FSc Part 2_Eng'] && !currentMap['FSc Part 2_Pre-Engineering']) {
      currentMap['FSc Part 2_Pre-Engineering'] = currentMap['FSc Part 2_Eng'];
    }
    if (currentMap['FSc Part 2_Pre-Engineering']) {
      currentMap['FSc Part 2_Eng'] = currentMap['FSc Part 2_Pre-Engineering'];
    }
    return currentMap;
  } catch (e) {
    console.error('Failed to load curriculum subjects', e);
    return INITIAL_CURRICULUM_SUBJECTS;
  }
}

export function saveCurriculumSubjects(subjectsMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRICULUM_SUBJECTS, JSON.stringify(subjectsMap));
  } catch (e) {
    console.error('Failed to save curriculum subjects', e);
  }
}

// --- MARKSHEET MODULE STORAGE & CALCULATIONS ---
export function calculateGrade(percentage) {
  const p = Number(percentage);
  if (isNaN(p)) return 'F';
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B+';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C';
  if (p >= 40) return 'D';
  return 'F';
}

export function getGradeBadgeStyle(grade) {
  switch (grade) {
    case 'A+':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', dot: 'bg-emerald-500' };
    case 'A':
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', dot: 'bg-green-500' };
    case 'B+':
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', dot: 'bg-blue-500' };
    case 'B':
      return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', dot: 'bg-teal-500' };
    case 'C':
      return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-500' };
    case 'D':
      return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', dot: 'bg-orange-500' };
    case 'F':
    default:
      return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300', dot: 'bg-rose-500' };
  }
}

export function buildDemoMarksheets(students = INITIAL_STUDENTS) {
  const science9th = (students || []).filter(
    (s) => s.studentClass === '9th' && (s.section === 'Science' || s.subject === 'Science')
  );

  const sampleScores = [
    { scores: { 'Physics': 94, 'Chemistry': 88, 'Bio': 92, 'Math': 98, 'Eng': 85, 'Urdu': 84, 'Islamiyat': 48, 'Tarjama tul Quran': 47 }, totalObtained: 636, totalMax: 700, percentage: 90.9, grade: 'A+', isPassed: true },
    { scores: { 'Physics': 82, 'Chemistry': 84, 'Bio': 89, 'Math': 91, 'Eng': 88, 'Urdu': 90, 'Islamiyat': 46, 'Tarjama tul Quran': 45 }, totalObtained: 615, totalMax: 700, percentage: 87.9, grade: 'A', isPassed: true },
    { scores: { 'Physics': 76, 'Chemistry': 72, 'Bio': 78, 'Math': 84, 'Eng': 75, 'Urdu': 79, 'Islamiyat': 42, 'Tarjama tul Quran': 41 }, totalObtained: 547, totalMax: 700, percentage: 78.1, grade: 'B+', isPassed: true },
    { scores: { 'Physics': 68, 'Chemistry': 62, 'Bio': 65, 'Math': 70, 'Eng': 72, 'Urdu': 74, 'Islamiyat': 38, 'Tarjama tul Quran': 39 }, totalObtained: 488, totalMax: 700, percentage: 69.7, grade: 'B', isPassed: true },
    { scores: { 'Physics': 58, 'Chemistry': 51, 'Bio': 54, 'Math': 55, 'Eng': 60, 'Urdu': 62, 'Islamiyat': 35, 'Tarjama tul Quran': 36 }, totalObtained: 411, totalMax: 700, percentage: 58.7, grade: 'C', isPassed: true }
  ];

  const studentScores = science9th.slice(0, 5).map((st, idx) => {
    const sc = sampleScores[idx] || sampleScores[0];
    return {
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      fatherName: st.fatherName || '',
      whatsappNumber: st.whatsappNumber || st.contactNumber || '',
      pic: st.pic || '',
      ...sc
    };
  });

  return [
    {
      id: 'MS-0001',
      testId: 'TST-0001',
      testName: 'Mockup Exam 1',
      studentClass: '9th',
      section: 'Science',
      title: '9th Science - Mockup Exam 1 Marksheet',
      date: '2026-09-04',
      subjects: ['Physics', 'Chemistry', 'Bio', 'Math', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'],
      subjectTotalMarks: {
        'Physics': 100,
        'Chemistry': 100,
        'Bio': 100,
        'Math': 100,
        'Eng': 100,
        'Urdu': 100,
        'Islamiyat': 50,
        'Tarjama tul Quran': 50
      },
      studentScores,
      classAverage: 77.1,
      totalStudents: studentScores.length,
      passedCount: studentScores.length,
      failedCount: 0,
      createdAt: '2026-09-04'
    }
  ];
}

export const INITIAL_MARKSHEETS = buildDemoMarksheets(INITIAL_STUDENTS);

export function getMarksheets(studentsList = null) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MARKSHEETS);
    let list = raw ? JSON.parse(raw) : null;
    if (!list || !Array.isArray(list) || list.length === 0) {
      list = buildDemoMarksheets(INITIAL_STUDENTS);
      localStorage.setItem(STORAGE_KEYS.MARKSHEETS, JSON.stringify(list));
      return list;
    }

    // Always synchronize studentName, fatherName, and pic with canonical enrolled students
    const effectiveStudents = studentsList && studentsList.length > 0 ? studentsList : getStudents();
    if (effectiveStudents && effectiveStudents.length > 0) {
      const studentMap = new Map();
      effectiveStudents.forEach((s) => {
        studentMap.set(s.id, s);
      });

      let changed = false;
      list = list.map((ms) => {
        if (!ms.studentScores || !Array.isArray(ms.studentScores)) return ms;
        const syncedScores = ms.studentScores.map((score) => {
          const canonical = studentMap.get(score.studentId);
          if (canonical) {
            const canonicalName = `${canonical.firstName} ${canonical.lastName}`.trim();
            if (
              score.studentName !== canonicalName ||
              (canonical.pic && score.pic !== canonical.pic) ||
              (canonical.fatherName && score.fatherName !== canonical.fatherName)
            ) {
              changed = true;
              return {
                ...score,
                studentName: canonicalName,
                fatherName: canonical.fatherName || score.fatherName || '',
                pic: canonical.pic || score.pic || '',
                whatsappNumber: canonical.whatsappNumber || canonical.contactNumber || score.whatsappNumber || ''
              };
            }
          }
          return score;
        });
        return { ...ms, studentScores: syncedScores };
      });

      if (changed) {
        localStorage.setItem(STORAGE_KEYS.MARKSHEETS, JSON.stringify(list));
      }
    }

    return list;
  } catch (e) {
    console.error('Failed to load marksheets', e);
    return buildDemoMarksheets(INITIAL_STUDENTS);
  }
}

export function saveMarksheets(marksheets) {
  try {
    localStorage.setItem(STORAGE_KEYS.MARKSHEETS, JSON.stringify(marksheets));
  } catch (e) {
    console.error('Failed to save marksheets', e);
  }
}

export function generateNextMarksheetId(marksheets) {
  if (!marksheets || marksheets.length === 0) return 'MS-0001';
  let max = 0;
  marksheets.forEach(m => {
    if (m.id && m.id.startsWith('MS-')) {
      const num = parseInt(m.id.replace('MS-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `MS-${String(max + 1).padStart(4, '0')}`;
}

// --- SCHEME OF STUDY (SOS) STORAGE ---
export const INITIAL_SCHEMES_OF_STUDY = [
  {
    id: 'SOS-0001',
    title: '9th Science - Annual Scheme of Study',
    studentClass: '9th',
    section: 'Science',
    batch: 'Morning Batch',
    academicYear: '2026 - 27',
    createdAt: '2026-05-10',
    description: 'Annual curriculum roadmap, chapter distribution, and test schedule for Class 9th Science group.',
    rows: [
      {
        id: 'row-1',
        month: 'May',
        subject: 'Physics',
        activity: 'Study',
        topic: 'Physical Quantities & Measurement Techniques',
        chapter: 'Chapter 1',
        fromDate: '2026-05-02',
        toDate: '2026-05-18'
      },
      {
        id: 'row-2',
        month: 'May',
        subject: 'Physics',
        activity: 'Test',
        topic: 'Chapter 1 Unit Assessment Test',
        chapter: 'Chapter 1',
        fromDate: '2026-05-20',
        toDate: '2026-05-21'
      },
      {
        id: 'row-3',
        month: 'June',
        subject: 'Chemistry',
        activity: 'Study',
        topic: 'Fundamentals of Chemistry & Atomic Structure',
        chapter: 'Chapter 1 & 2',
        fromDate: '2026-06-01',
        toDate: '2026-06-18'
      },
      {
        id: 'row-4',
        month: 'June',
        subject: 'Chemistry',
        activity: 'Test',
        topic: 'Chapter 1 & 2 Joint Review Test',
        chapter: 'Chapter 1 & 2',
        fromDate: '2026-06-20',
        toDate: '2026-06-21'
      },
      {
        id: 'row-5',
        month: 'July',
        subject: 'Math',
        activity: 'Study',
        topic: 'Matrices, Determinants & Real Numbers',
        chapter: 'Chapter 1 & 2',
        fromDate: '2026-07-01',
        toDate: '2026-07-22'
      },
      {
        id: 'row-6',
        month: 'July',
        subject: 'Math',
        activity: 'Test',
        topic: 'Matrices & Determinants Grand Test',
        chapter: 'Chapter 1',
        fromDate: '2026-07-24',
        toDate: '2026-07-25'
      },
      {
        id: 'row-7',
        month: 'August',
        subject: 'Bio',
        activity: 'Study',
        topic: 'Cell Biology & Cellular Organization',
        chapter: 'Chapter 1',
        fromDate: '2026-08-01',
        toDate: '2026-08-20'
      },
      {
        id: 'row-8',
        month: 'August',
        subject: 'Bio',
        activity: 'Test',
        topic: 'Cell Biology Unit Objective & Subjective Test',
        chapter: 'Chapter 1',
        fromDate: '2026-08-24',
        toDate: '2026-08-25'
      }
    ]
  },
  {
    id: 'SOS-0002',
    title: '10th Computer - Annual Scheme of Study',
    studentClass: '10th',
    section: 'Computer',
    batch: 'Evening Batch',
    academicYear: '2026 - 27',
    createdAt: '2026-05-12',
    description: 'Syllabus distribution and programming lab milestones for 10th Computer Science students.',
    rows: [
      {
        id: 'row-10-1',
        month: 'May',
        subject: 'Computer',
        activity: 'Study',
        topic: 'Problem Solving & C Language Introduction',
        chapter: 'Unit 1 & 2',
        fromDate: '2026-05-02',
        toDate: '2026-05-20'
      },
      {
        id: 'row-10-2',
        month: 'May',
        subject: 'Computer',
        activity: 'Test',
        topic: 'Algorithm & Flowchart Practical Test',
        chapter: 'Unit 1',
        fromDate: '2026-05-25',
        toDate: '2026-05-26'
      },
      {
        id: 'row-10-3',
        month: 'June',
        subject: 'Physics',
        activity: 'Study',
        topic: 'Simple Harmonic Motion and Waves',
        chapter: 'Chapter 10',
        fromDate: '2026-06-01',
        toDate: '2026-06-20'
      },
      {
        id: 'row-10-4',
        month: 'June',
        subject: 'Physics',
        activity: 'Test',
        topic: 'SHM & Wave Motion Board Style Test',
        chapter: 'Chapter 10',
        fromDate: '2026-06-23',
        toDate: '2026-06-24'
      }
    ]
  },
  {
    id: 'SOS-0003',
    title: 'FSc Part 1 Med - Scheme of Study',
    studentClass: 'FSc Part 1',
    section: 'Med',
    batch: 'Morning Batch',
    academicYear: '2026 - 27',
    createdAt: '2026-07-15',
    description: 'Intermediate Pre-Medical curriculum pacing with weekly assessment breakdown.',
    rows: [
      {
        id: 'row-fsc-1',
        month: 'July',
        subject: 'Physics',
        activity: 'Study',
        topic: 'Measurements & Vectors, Equilibrium',
        chapter: 'Chapter 1 & 2',
        fromDate: '2026-07-16',
        toDate: '2026-07-31'
      },
      {
        id: 'row-fsc-2',
        month: 'August',
        subject: 'Bio',
        activity: 'Study',
        topic: 'Cell Structure & Biological Molecules',
        chapter: 'Chapter 1 & 2',
        fromDate: '2026-08-01',
        toDate: '2026-08-20'
      },
      {
        id: 'row-fsc-3',
        month: 'August',
        subject: 'Bio',
        activity: 'Test',
        topic: 'Biological Molecules & Enzymes Unit Test',
        chapter: 'Chapter 2 & 3',
        fromDate: '2026-08-28',
        toDate: '2026-08-29'
      }
    ]
  }
];

export function getSchemesOfStudy() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEMES_OF_STUDY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCHEMES_OF_STUDY, JSON.stringify(INITIAL_SCHEMES_OF_STUDY));
      return INITIAL_SCHEMES_OF_STUDY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load schemes of study', e);
    return INITIAL_SCHEMES_OF_STUDY;
  }
}

export function saveSchemesOfStudy(schemes) {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEMES_OF_STUDY, JSON.stringify(schemes));
  } catch (e) {
    console.error('Failed to save schemes of study', e);
  }
}

export function generateNextSchemeOfStudyId(schemes) {
  if (!schemes || schemes.length === 0) return 'SOS-0001';
  let max = 0;
  schemes.forEach(s => {
    if (s.id && s.id.startsWith('SOS-')) {
      const num = parseInt(s.id.replace('SOS-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `SOS-${String(max + 1).padStart(4, '0')}`;
}

// ----------------- ACADEMIC BATCHES STORAGE -----------------
export const INITIAL_BATCHES = [
  { id: 'BATCH-001', name: 'Morning Batch', createdAt: '2026-05-01' },
  { id: 'BATCH-002', name: 'Evening Batch', createdAt: '2026-05-01' },
  { id: 'BATCH-003', name: 'Weekend Batch', createdAt: '2026-05-01' }
];

export function getBatches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_BATCHES;
    return parsed.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          id: `BATCH-${String(idx + 1).padStart(3, '0')}`,
          name: item,
          createdAt: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
  } catch (e) {
    console.error('Failed to load batches', e);
    return INITIAL_BATCHES;
  }
}

export function saveBatches(batches) {
  try {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  } catch (e) {
    console.error('Failed to save batches', e);
  }
}

export function generateNextBatchId(batches) {
  if (!batches || batches.length === 0) return 'BATCH-001';
  let max = 0;
  batches.forEach(b => {
    const idStr = typeof b === 'string' ? '' : (b.id || '');
    if (idStr.startsWith('BATCH-')) {
      const num = parseInt(idStr.replace('BATCH-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `BATCH-${String(max + 1).padStart(3, '0')}`;
}

// ----------------- STUDENT INQUIRIES & FOLLOW-UPS MODULE -----------------
export const INITIAL_INQUIRIES = [
  {
    id: 'INQ-0001',
    studentName: 'Zain Ul Abideen',
    gender: 'Male',
    contactNumber: '0301-4455667',
    whatsappNumber: '0301-4455667',
    fatherName: 'Tariq Mehmood',
    fatherContact: '0321-7788990',
    studentClass: 'FSc Part 1',
    subject: 'Pre- Medical',
    inquiryDate: '2026-09-05',
    followUpDate: '2026-09-12',
    status: 'Pending Follow-up',
    remarks: 'Visited for Pre-Medical evening session. Asked about chemistry teacher.',
    followUpNotes: [
      { date: '2026-09-07', note: 'Called father. He requested fee installment plan.', by: 'Admin Desk' }
    ],
    createdAt: '2026-09-05T11:00:00Z'
  },
  {
    id: 'INQ-0002',
    studentName: 'Areeba Kashif',
    gender: 'Female',
    contactNumber: '0333-5566778',
    whatsappNumber: '0333-5566778',
    fatherName: 'Kashif Ali',
    fatherContact: '0312-8899001',
    studentClass: '9th',
    subject: 'Science',
    inquiryDate: '2026-09-06',
    followUpDate: '2026-09-11',
    status: 'Did Not Show Up',
    remarks: 'Took admission prospectus on Thursday, was scheduled for demo lecture but did not show up.',
    followUpNotes: [
      { date: '2026-09-08', note: 'Sent reminder WhatsApp message about demo class.', by: 'Reception' }
    ],
    createdAt: '2026-09-06T14:30:00Z'
  },
  {
    id: 'INQ-0003',
    studentName: 'Hamza Noman',
    gender: 'Male',
    contactNumber: '0345-1234890',
    whatsappNumber: '0345-1234890',
    fatherName: 'Noman Riaz',
    fatherContact: '0300-9876541',
    studentClass: 'FSc Part 2',
    subject: 'Pre-Engineering',
    inquiryDate: '2026-09-07',
    followUpDate: '2026-09-10',
    status: 'Interested',
    remarks: 'Looking for Math and Physics test preparation series only.',
    followUpNotes: [],
    createdAt: '2026-09-07T16:00:00Z'
  },
  {
    id: 'INQ-0004',
    studentName: 'Noor ul Huda',
    gender: 'Female',
    contactNumber: '0315-9988221',
    whatsappNumber: '0315-9988221',
    fatherName: 'Sheikh Waqar',
    fatherContact: '0322-6655443',
    studentClass: '10th',
    subject: 'Computer',
    inquiryDate: '2026-09-02',
    followUpDate: '2026-09-09',
    status: 'Registered',
    remarks: 'Completed admission form and enrolled.',
    followUpNotes: [
      { date: '2026-09-04', note: 'Registered and fee paid.', by: 'Accounts' }
    ],
    createdAt: '2026-09-02T10:15:00Z'
  }
];

export function getInquiries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_INQUIRIES;
  } catch (e) {
    console.error('Failed to load inquiries', e);
    return INITIAL_INQUIRIES;
  }
}

export function saveInquiries(inquiries) {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiries', e);
  }
}

export function generateNextInquiryId(inquiries) {
  if (!inquiries || inquiries.length === 0) return 'INQ-0001';
  let max = 0;
  inquiries.forEach(i => {
    if (i.id && i.id.startsWith('INQ-')) {
      const num = parseInt(i.id.replace('INQ-', ''), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `INQ-${String(max + 1).padStart(4, '0')}`;
}

// Attendance & Arrival Timings Configuration
export const DEFAULT_ATTENDANCE_TIMINGS = {
  recordTeacherArrival: true,
  teacherExpectedStartTime: '07:45',
  recordStudentArrival: true,
  classStartTimes: {
    '9th': '08:00',
    '10th': '08:00',
    'FSc Part 1': '08:30',
    'FSc Part 2': '08:30'
  }
};

export function getAttendanceTimings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_TIMINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE_TIMINGS, JSON.stringify(DEFAULT_ATTENDANCE_TIMINGS));
      return DEFAULT_ATTENDANCE_TIMINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ATTENDANCE_TIMINGS,
      ...parsed,
      classStartTimes: {
        ...DEFAULT_ATTENDANCE_TIMINGS.classStartTimes,
        ...(parsed.classStartTimes || {})
      }
    };
  } catch (e) {
    console.error('Failed to load attendance timings', e);
    return DEFAULT_ATTENDANCE_TIMINGS;
  }
}

export function saveAttendanceTimings(timings) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_TIMINGS, JSON.stringify(timings));
  } catch (e) {
    console.error('Failed to save attendance timings', e);
  }
}


