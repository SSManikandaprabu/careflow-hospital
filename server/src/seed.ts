import bcrypt from 'bcryptjs';
import { prisma } from './utils/prisma.js';

async function main() {
  console.log('🌱 Expanding CareFlow Hospital Doctor Directory & Departments...');

  // 1. Create Comprehensive Hospital Departments
  const departmentsData = [
    { name: 'Cardiology', code: 'CARD', description: 'Advanced heart & cardiovascular medical care' },
    { name: 'Neurology', code: 'NEUR', description: 'Comprehensive brain, spine, and nerve diagnostics' },
    { name: 'Orthopedics', code: 'ORTH', description: 'Joint replacement, bone fractures, and sports therapy' },
    { name: 'Pediatrics', code: 'PEDI', description: 'Infant, child, and adolescent healthcare' },
    { name: 'General Medicine', code: 'GENM', description: 'Primary care, diagnostic triage, and chronic wellness' },
    { name: 'Dermatology & Cosmetology', code: 'DERM', description: 'Clinical skin therapy, laser care, and hair restoration' },
    { name: 'Gynecology & Obstetrics', code: 'GYNE', description: 'Maternity care, fetal medicine, and women wellness' },
    { name: 'Oncology', code: 'ONCO', description: 'Medical, surgical, and radiation cancer therapy' },
    { name: 'Gastroenterology', code: 'GAST', description: 'Digestive tract, liver endoscopy, and pancreas care' },
    { name: 'Pulmonology', code: 'PULM', description: 'Chest diseases, asthma, sleep apnea, and critical care' },
    { name: 'Endocrinology & Diabetology', code: 'ENDO', description: 'Diabetes, thyroid disorders, and hormonal wellness' },
    { name: 'Ophthalmology', code: 'OPHT', description: 'Cataract surgery, LASIK, and retina vitreous care' },
    { name: 'ENT & Head Neck Surgery', code: 'ENTH', description: 'Ear, nose, throat micro-surgery, and sinus care' },
    { name: 'Psychiatry & Behavioral Health', code: 'PSYC', description: 'Mental wellness, anxiety, depression, and therapy' },
    { name: 'Nephrology & Urology', code: 'NEPH', description: 'Kidney dialysis, kidney stones, and prostate surgery' },
  ];

  const departments: any = {};
  for (const dep of departmentsData) {
    departments[dep.code] = await prisma.department.upsert({
      where: { code: dep.code },
      update: {},
      create: dep,
    });
  }

  // Common password for all accounts: "Password123!"
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 2. Comprehensive Roster of 20+ Specialist Doctors across all departments in INR
  const doctorsData = [
    {
      email: 'dr.marcus@careflow.com',
      firstName: 'Marcus',
      lastName: 'Vance',
      phone: '+91 98765 01001',
      departmentCode: 'CARD',
      specialization: 'Interventional Cardiology & Coronary Angioplasty',
      qualification: 'MD, DM (Cardiology), AIIMS New Delhi',
      experienceYrs: 15,
      consultationFee: 1200,
      roomNumber: 'Suite 302',
      biography: 'Expert in complex coronary artery stenting, heart failure management, and acute cardiac care.',
    },
    {
      email: 'dr.ananya@careflow.com',
      firstName: 'Ananya',
      lastName: 'Deshmukh',
      phone: '+91 98765 01002',
      departmentCode: 'CARD',
      specialization: 'Pediatric & Congenital Heart Specialist',
      qualification: 'MBBS, MD, FACC (Cardiology)',
      experienceYrs: 11,
      consultationFee: 1100,
      roomNumber: 'Suite 305',
      biography: 'Specializes in congenital pediatric heart defects, echocardiography, and pediatric arrhythmia.',
    },
    {
      email: 'dr.elena@careflow.com',
      firstName: 'Elena',
      lastName: 'Rostova',
      phone: '+91 98765 01003',
      departmentCode: 'NEUR',
      specialization: 'Clinical Neurologist & Epilepsy Specialist',
      qualification: 'MD, DM (Neurology), NIMHANS Bengaluru',
      experienceYrs: 12,
      consultationFee: 1500,
      roomNumber: 'Suite 415',
      biography: 'Specializing in complex seizure management, migraine disorders, neuro-rehab, and Parkinsonism.',
    },
    {
      email: 'dr.vikram@careflow.com',
      firstName: 'Vikram',
      lastName: 'Singhania',
      phone: '+91 98765 01004',
      departmentCode: 'NEUR',
      specialization: 'Neurosurgeon & Minimally Invasive Spine Surgeon',
      qualification: 'MS, M.Ch (Neurosurgery), CMC Vellore',
      experienceYrs: 18,
      consultationFee: 1800,
      roomNumber: 'Suite 418',
      biography: 'Pioneer in endoscopic brain surgery, spinal disc reconstruction, and cerebral aneurysm clipping.',
    },
    {
      email: 'dr.david@careflow.com',
      firstName: 'David',
      lastName: 'Chen',
      phone: '+91 98765 01005',
      departmentCode: 'ORTH',
      specialization: 'Orthopedic & Robotic Joint Reconstruction',
      qualification: 'MBBS, MS (Ortho), Stanford Fellow',
      experienceYrs: 16,
      consultationFee: 1000,
      roomNumber: 'Suite 108',
      biography: 'Specialist in robotic total knee and hip replacement, arthroscopy, and complex fracture healing.',
    },
    {
      email: 'dr.priya@careflow.com',
      firstName: 'Priya',
      lastName: 'Nair',
      phone: '+91 98765 01006',
      departmentCode: 'ORTH',
      specialization: 'Sports Medicine & Arthroscopic Surgeon',
      qualification: 'MBBS, D.Ortho, M.Ch (Ortho)',
      experienceYrs: 9,
      consultationFee: 900,
      roomNumber: 'Suite 112',
      biography: 'Focused on ACL ligament reconstruction, shoulder rotator cuff repair, and sports injury rehab.',
    },
    {
      email: 'dr.rahul@careflow.com',
      firstName: 'Rahul',
      lastName: 'Mehta',
      phone: '+91 98765 01007',
      departmentCode: 'PEDI',
      specialization: 'Consultant Pediatrician & Neonatologist',
      qualification: 'MD (Pediatrics), DCH, IAP Fellow',
      experienceYrs: 13,
      consultationFee: 750,
      roomNumber: 'Suite 201',
      biography: 'Comprehensive child healthcare, newborn neonatal care, growth monitoring, and immunization.',
    },
    {
      email: 'dr.kavita@careflow.com',
      firstName: 'Kavita',
      lastName: 'Sharma',
      phone: '+91 98765 01008',
      departmentCode: 'GYNE',
      specialization: 'Senior Obstetrician & Laparoscopic Gynecologist',
      qualification: 'MBBS, MS (OBG), FICOG',
      experienceYrs: 17,
      consultationFee: 1000,
      roomNumber: 'Suite 210',
      biography: 'High-risk pregnancy delivery, painless labor, PCOS management, and hysteroscopic surgery.',
    },
    {
      email: 'dr.arjun@careflow.com',
      firstName: 'Arjun',
      lastName: 'Patel',
      phone: '+91 98765 01009',
      departmentCode: 'GENM',
      specialization: 'Internal Medicine & Critical Care Physician',
      qualification: 'MBBS, MD (General Medicine), MRCP (UK)',
      experienceYrs: 14,
      consultationFee: 650,
      roomNumber: 'Suite 102',
      biography: 'Expertise in chronic diabetes management, infectious fevers, hypertension, and preventive health.',
    },
    {
      email: 'dr.sneha@careflow.com',
      firstName: 'Sneha',
      lastName: 'Kulkarni',
      phone: '+91 98765 01010',
      departmentCode: 'DERM',
      specialization: 'Dermatologist, Trichologist & Dermatosurgeon',
      qualification: 'MBBS, MD (DVL), Gold Medalist',
      experienceYrs: 10,
      consultationFee: 850,
      roomNumber: 'Suite 115',
      biography: 'Psoriasis, chronic eczema, acne scar treatments, PRP hair therapy, and anti-aging dermatology.',
    },
    {
      email: 'dr.rajesh@careflow.com',
      firstName: 'Rajesh',
      lastName: 'Iyer',
      phone: '+91 98765 01011',
      departmentCode: 'GAST',
      specialization: 'Medical Gastroenterologist & Hepatologist',
      qualification: 'MD, DM (Gastroenterology), AIIMS',
      experienceYrs: 15,
      consultationFee: 1300,
      roomNumber: 'Suite 310',
      biography: 'Upper GI endoscopy, colonoscopy, fatty liver disease, GERD acidity, and ulcerative colitis.',
    },
    {
      email: 'dr.neha@careflow.com',
      firstName: 'Neha',
      lastName: 'Verma',
      phone: '+91 98765 01012',
      departmentCode: 'ENDO',
      specialization: 'Senior Endocrinologist & Diabetologist',
      qualification: 'MD, DM (Endocrinology)',
      experienceYrs: 12,
      consultationFee: 1200,
      roomNumber: 'Suite 315',
      biography: 'Complex type 1 & type 2 diabetes, Hashimoto thyroiditis, adrenal gland disorders, and obesity.',
    },
    {
      email: 'dr.siddharth@careflow.com',
      firstName: 'Siddharth',
      lastName: 'Menon',
      phone: '+91 98765 01013',
      departmentCode: 'PULM',
      specialization: 'Pulmonologist & Interventional Sleep Specialist',
      qualification: 'MBBS, MD (Pulmonary Medicine), FCCP',
      experienceYrs: 11,
      consultationFee: 950,
      roomNumber: 'Suite 220',
      biography: 'Asthma, COPD rehabilitation, post-COVID lung fibrosis, bronchoscopy, and snoring sleep apnea.',
    },
    {
      email: 'dr.rohit@careflow.com',
      firstName: 'Rohit',
      lastName: 'Bose',
      phone: '+91 98765 01014',
      departmentCode: 'ONCO',
      specialization: 'Medical Oncologist & Hematology Cancer Specialist',
      qualification: 'MD, DM (Medical Oncology), Tata Memorial Fellow',
      experienceYrs: 14,
      consultationFee: 1600,
      roomNumber: 'Suite 501',
      biography: 'Targeted immunotherapy, modern chemotherapy, breast & lung cancer management, and leukemia.',
    },
    {
      email: 'dr.tanvi@careflow.com',
      firstName: 'Tanvi',
      lastName: 'Gupta',
      phone: '+91 98765 01015',
      departmentCode: 'OPHT',
      specialization: 'Cataract, Cornea & Refractive Surgeon',
      qualification: 'MBBS, MS (Ophthalmology), FICO (UK)',
      experienceYrs: 10,
      consultationFee: 700,
      roomNumber: 'Suite 125',
      biography: 'Robotic femto-cataract surgery, Contoura Vision LASIK, diabetic retinopathy, and glaucoma care.',
    },
    {
      email: 'dr.amit@careflow.com',
      firstName: 'Amit',
      lastName: 'Choudhury',
      phone: '+91 98765 01016',
      departmentCode: 'ENTH',
      specialization: 'ENT, Head & Neck Micro-Ear Surgeon',
      qualification: 'MBBS, MS (ENT), DNB',
      experienceYrs: 13,
      consultationFee: 800,
      roomNumber: 'Suite 130',
      biography: 'Microscopic eardrum repair (Tympanoplasty), endoscopic sinus surgery (FESS), and vertigo triage.',
    },
    {
      email: 'dr.meera@careflow.com',
      firstName: 'Meera',
      lastName: 'Srinivasan',
      phone: '+91 98765 01017',
      departmentCode: 'PSYC',
      specialization: 'Neuro-Psychiatrist & Cognitive Behavioral Therapist',
      qualification: 'MBBS, MD (Psychiatry), DPM',
      experienceYrs: 12,
      consultationFee: 1100,
      roomNumber: 'Suite 405',
      biography: 'Depression, panic disorders, adult ADHD, insomnia treatment, and holistic psychopharmacology.',
    },
    {
      email: 'dr.sanjay@careflow.com',
      firstName: 'Sanjay',
      lastName: 'Rao',
      phone: '+91 98765 01018',
      departmentCode: 'NEPH',
      specialization: 'Urologist, Andrologist & Renal Transplant Surgeon',
      qualification: 'MS, M.Ch (Urology), DNB',
      experienceYrs: 16,
      consultationFee: 1400,
      roomNumber: 'Suite 325',
      biography: 'Laser kidney stone removal (RIRS), prostate enlargement (TURP), and kidney transplant surgery.',
    },
  ];

  for (const doc of doctorsData) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {
        firstName: doc.firstName,
        lastName: doc.lastName,
        phone: doc.phone,
      },
      create: {
        email: doc.email,
        passwordHash,
        firstName: doc.firstName,
        lastName: doc.lastName,
        phone: doc.phone,
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            departmentId: departments[doc.departmentCode].id,
            specialization: doc.specialization,
            qualification: doc.qualification,
            experienceYrs: doc.experienceYrs,
            consultationFee: doc.consultationFee,
            roomNumber: doc.roomNumber,
            biography: doc.biography,
            schedules: {
              create: [1, 2, 3, 4, 5, 6].map((day) => ({
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '17:00',
                breakStart: '13:00',
                breakEnd: '14:00',
              })),
            },
          },
        },
      },
    });

    // Ensure doctor profile exists and has full schedules
    const existingDoc = await prisma.doctorProfile.findUnique({
      where: { userId: user.id },
      include: { schedules: true },
    });

    if (existingDoc && existingDoc.schedules.length === 0) {
      await prisma.doctorSchedule.createMany({
        data: [1, 2, 3, 4, 5, 6].map((day) => ({
          doctorId: existingDoc.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          breakStart: '13:00',
          breakEnd: '14:00',
        })),
      });
    }
  }

  console.log(`✅ Successfully seeded ${doctorsData.length} multi-specialty doctors across ${departmentsData.length} hospital departments!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
