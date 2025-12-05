import { pool } from "../../config/db";


const getDays = (start: string, end: string): number => {
  const s = new Date(start);
  const e = new Date(end);

  const diff = e.getTime() - s.getTime();
  return diff / (1000 * 60 * 60 * 24);
}

const createBooking = async(payload:Record<string,unknown>) => {

    // console.log(payload);

    const {customer_id,vehicle_id,rent_start_date,rent_end_date} = payload;

    const vehicleAvailability = await pool.query("SELECT * FROM Vehicles WHERE id=$1 AND availability_status='available'",[vehicle_id]);
    // console.log(vehicleAvailability.rows[0]);

    if(vehicleAvailability.rows.length === 0){
        return null;
    }

    const days = getDays("2024-01-15", "2024-01-20");
    const total_price = vehicleAvailability.rows[0]?.daily_rent_price*days;
    const status = "active";
    // console.log(total_price,getDays("2024-01-15", "2024-01-20"));

    const result = await pool.query(
        "INSERT INTO Bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status]
    );

    const changeVehicleStatus = await pool.query(
        "UPDATE Vehicles SET availability_status=$1 WHERE id=$2 RETURNING *",['booked',vehicle_id]
    );

    // console.log(result.rows,changeVehicleStatus.rows);

    return {result , changeVehicleStatus};
}


export const bookingService = {
    createBooking,
}
