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
}

export interface Resident{
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
}