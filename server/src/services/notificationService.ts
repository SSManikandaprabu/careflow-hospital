export interface NotificationPayload {
  toEmail?: string;
  toPhone?: string;
  recipientName: string;
  subject: string;
  message: string;
  type: 'BOOKING_CONFIRMATION' | 'QUEUE_ALERT' | 'STATUS_UPDATE' | 'CANCELLATION';
}

export const notificationService = {
  async sendSMS(phone: string, text: string) {
    console.log(`\n📲 [SMS Gateway Triggered] To: ${phone}`);
    console.log(`   Message: "${text}"\n`);
    return { success: true, timestamp: new Date() };
  },

  async sendEmail(email: string, subject: string, body: string) {
    console.log(`\n📧 [Email Service Triggered] To: ${email}`);
    console.log(`   Subject: "${subject}"`);
    console.log(`   Body:\n${body}\n`);
    return { success: true, timestamp: new Date() };
  },

  async notifyAppointmentBooked(data: {
    patientName: string;
    patientEmail?: string;
    patientPhone?: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    tokenNumber: string;
  }) {
    const text = `Hello ${data.patientName}, your appointment with Dr. ${data.doctorName} (${data.department}) is confirmed for ${data.date} at ${data.time}. Token: ${data.tokenNumber}. Please track your live queue status on CareFlow.`;
    
    if (data.patientPhone) await this.sendSMS(data.patientPhone, text);
    if (data.patientEmail) await this.sendEmail(data.patientEmail, 'Appointment Confirmed - CareFlow Hospital', text);
  },

  async notifyQueueTurnApproaching(data: {
    patientName: string;
    patientPhone?: string;
    patientEmail?: string;
    doctorName: string;
    roomNumber: string;
    tokenNumber: string;
    waitingAhead: number;
  }) {
    const text = `Urgent Reminder: Token ${data.tokenNumber} (${data.patientName}), you are next in line for Dr. ${data.doctorName} in Room ${data.roomNumber}. ${data.waitingAhead} patient(s) remaining ahead of you.`;
    
    if (data.patientPhone) await this.sendSMS(data.patientPhone, text);
    if (data.patientEmail) await this.sendEmail(data.patientEmail, 'Live Queue Alert - Step Up To Consultation Room', text);
  }
};
