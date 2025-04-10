export interface Appointment {
  appointment_id: string;
  created_on: string;
  created_on_date: Date;
  status: string;
  session_type: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  time_slot: string | null;
  physical_location: string | null;
  student_full_name: string;
  student_email: string;
  student_phone: string;
  student_reg_no: string;
  student_gender: string;
  consultant_phone: string;
  consultant_office: string;
  report_id: string | null;
  client: string;
  consultant: string | null;
  start_time_date?: Date | null;
  meeting_id?: string;
  meeting_token?: string;
}
