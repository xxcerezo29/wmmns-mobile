export interface Driver {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  barangay: string;
  truck_id: number;
  assigned_truck: Truck;
  email: string;
  mobile_number: string;
  email_verified_at: string;
}

export interface Resident {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  line1: string;
  line2: string;
  barangay: string;
  city: string;
  province: string;
  country: string;
  email: string;
  email_verified_at: string;
}

export interface Schedule {
  id: number;
  barangay: string;
  day: string;
  truck_id: number;
  route_id: number;
  time: string;
  route: Route;
  truck: Truck;
  plate_number: string;
  route_name: string;
}
