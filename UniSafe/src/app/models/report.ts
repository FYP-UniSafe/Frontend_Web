export interface Report {
  report_id: string;
  report_for: string;
  created_on: string;
  created_on_date: Date;
  status: string;
  rejection_reason: string | null;
  reporter_full_name: string;
  reporter_gender: string;
  reporter_college: string;
  reporter_reg_no: string;
  reporter_email: string;
  reporter_phone: string;
  victim_email: string;
  victim_full_name: string;
  victim_phone: string;
  victim_gender: string;
  victim_reg_no: string;
  victim_college: string;
  abuse_type: string;
  date_and_time: string;
  location: string;
  other_location: string | null;
  description: string;
  perpetrator_fullname: string | null;
  perpetrator_gender: string | null;
  relationship: string | null;
  police_status: string;
  assigned_gd: string | null;
  assigned_officer: string | null;
}
