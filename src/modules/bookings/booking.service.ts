import { pool } from "../../config/db";


const getDays = (start: string, end: string): number => {
  const s = new Date(start);
  const e = new Date(end);

  const diff = e.getTime() - s.getTime();
  return diff / (1000 * 60 * 60 * 24);
};

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
};


const getBookingWithDetailsForAdmin = async() => {

    const query = `
        SELECT 
            b.id,b.customer_id,b.vehicle_id,b.rent_start_date,b.rent_end_date,b.total_price,b.status,
            json_build_object(
                'name', u.name,
                'email', u.email
            ) AS customer,
            json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number',v.registration_number
            ) AS vehicle
        FROM Bookings b
        JOIN Users u ON b.customer_id = u.id
        JOIN Vehicles v ON b.vehicle_id = v.id

    `;

    const result = await pool.query(query);
    return result.rows;

};


const getBookingWithDetailsForCustomer = async(id:string) => {

    const query = `
        SELECT 
            b.id,b.vehicle_id,b.rent_start_date,b.rent_end_date,b.total_price,b.status,
            json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type
            ) AS vehicle
        FROM Bookings b
        JOIN Vehicles v ON b.vehicle_id = v.id
        Where b.customer_id = $1
    `;

    const result = await pool.query(query,[id]);

    return result.rows;

};


const getBooking = async(role:string,email:string) => {

    // const test = await getBookingWithDetailsForAdmin();
    // const test2 = await getBookingWithDetailsForCustomer('17');

    // console.log({admin:test,customer:test2});

    if(role == 'customer'){
        const userId = await pool.query('SELECT id FROM Users WHERE email=$1',[email]);
        const userid = userId.rows[0]?.id;
        const booking = await getBookingWithDetailsForCustomer('17');
        return booking;
    }

    const bookings = await getBookingWithDetailsForAdmin();
    return bookings;
};


const cancelBooking = async(bookingId:string,customerId:string)=>{

    const query = `
        UPDATE Bookings
        SET status = 'cancelled'
        WHERE id = $1 AND customer_id = $2
            AND rent_start_date > CURRENT_DATE
        RETURNING *
    `;
    const result = await pool.query(query,[bookingId,customerId]);
    
    return result.rows[0];
};

const markBookingsReturnedByAdmin = async(bookingId:string)  => {
    const bookingResult = await pool.query(
        `
            UPDATE Bookings
            SET status = 'returned'
            WHERE id = $1
            RETURNING *
        
        `,[bookingId]
    );

    const booking = bookingResult.rows[0];
    if(!booking) return booking[0];

    const vehicle = await pool.query(`
                        UPDATE Vehicles
                        SET availability_status = 'available'
                        WHERE id = $1
                        RETURNING *
                    `,[booking.vehicle_id]);
    
    // console.log(vehicle?.rows[0]);

    
    booking.vehicle = {
        availability_status: vehicle?.rows[0]?.availability_status
    };

    
    return booking;



};

const getUserIdFromEmail = async(email:string) => {
    const result = await pool.query(
        `
            Select id From Users WHERE email = $1
        `,[email]
    );
    return result.rows[0];
};




export const bookingService = {
    createBooking,
    getBooking,
    getUserIdFromEmail,
    cancelBooking,
    markBookingsReturnedByAdmin,
}
