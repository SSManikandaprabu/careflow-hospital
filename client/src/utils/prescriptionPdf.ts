import { jsPDF } from 'jspdf';

interface PrescriptionData {
  doctorName: string;
  doctorSpecialty: string;
  doctorQualification: string;
  roomNumber: string;
  patientName: string;
  patientAgeOrDOB?: string;
  tokenNumber: string;
  appointmentDate: string;
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes?: string;
  prescription: string;
  labOrders?: string;
}

export const generatePrescriptionPDF = (data: PrescriptionData) => {
  const doc = new jsPDF();

  // Header Background Accent
  doc.setFillColor(2, 132, 199); // Sky-600
  doc.rect(0, 0, 210, 32, 'F');

  // Hospital Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CareFlow Medical Center', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Advanced Healthcare & Multi-Specialty Clinical Network', 14, 25);

  // Doctor Info (Right Side)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dr. ${data.doctorName}`, 196, 15, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.doctorSpecialty} | ${data.doctorQualification}`, 196, 21, { align: 'right' });
  doc.text(`Consultation Room: ${data.roomNumber}`, 196, 27, { align: 'right' });

  // Reset text color
  doc.setTextColor(30, 41, 59);

  // Patient Info Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 38, 182, 22, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Name:', 18, 46);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientName, 46, 46);

  doc.setFont('helvetica', 'bold');
  doc.text('Token #:', 130, 46);
  doc.setFont('helvetica', 'normal');
  doc.text(data.tokenNumber, 150, 46);

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 18, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(data.appointmentDate, 46, 54);

  // Section 1: Chief Complaint & Diagnosis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('Clinical Findings & Diagnosis', 14, 70);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 72, 196, 72);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Chief Complaint:', 14, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(data.chiefComplaint || 'None recorded', 50, 80);

  doc.setFont('helvetica', 'bold');
  doc.text('Final Diagnosis:', 14, 88);
  doc.setFont('helvetica', 'normal');
  doc.text(data.diagnosis || 'Under evaluation', 50, 88);

  if (data.clinicalNotes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Notes:', 14, 96);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(data.clinicalNotes, 140);
    doc.text(splitNotes, 50, 96);
  }

  // Section 2: Prescription Rx
  let yPos = 115;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('Rx - Prescribed Medications', 14, yPos);

  doc.line(14, yPos + 2, 196, yPos + 2);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  
  const prescriptionLines = data.prescription ? data.prescription.split('\n') : ['No medications prescribed'];
  yPos += 10;
  for (const line of prescriptionLines) {
    doc.text(`• ${line}`, 16, yPos);
    yPos += 7;
  }

  // Section 3: Diagnostic Lab Orders
  if (data.labOrders) {
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text('Diagnostic Lab Investigations', 14, yPos);
    doc.line(14, yPos + 2, 196, yPos + 2);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos += 8;
    const splitLabs = doc.splitTextToSize(data.labOrders, 175);
    doc.text(splitLabs, 16, yPos);
    yPos += splitLabs.length * 6;
  }

  // Footer / Doctor Signature
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Medical Practitioner Signature', 140, 260);
  doc.line(140, 255, 195, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dr. ${data.doctorName}`, 140, 266);

  doc.setFontSize(8);
  doc.text('Generated electronically via CareFlow Healthcare Portal. Valid without physical stamp.', 14, 285);

  doc.save(`CareFlow_Prescription_${data.tokenNumber || 'Record'}.pdf`);
};
