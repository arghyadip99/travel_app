import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer"

const BookingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { userId, tripId } = useParams();
  // const userId = useSelector((state) => state?.user?._id)
  const [booking, setBooking] = useState(null);

  const getBookingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/trips/${tripId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data)
      setBooking(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch booking Details Failed", err.message);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, []);

  console.log(booking)


  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  /* SUBMIT BOOKING */

  const navigate = useNavigate()


  const handleEditSubmit = async () => {
    try {
      const bookingForm = {
        userId,
        tripId,
        hostId: booking.customerId._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: booking.listingId.price * dayCount,
      }

      const response = await fetch(`http://localhost:3001/bookings/update/${tripId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm)
      })

      if (response.ok) {
        navigate(`/${userId}/trips`)
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message)
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      
      <div className="listing-details">
        <div className="title">
          <h1>{booking.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {booking.listingId.listingPhotoPaths?.map((item) => (
            <img
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="booking photo"
            />
          ))}
        </div>

        <h2>
          {booking.listingId.type} in {booking.listingId.city}, {booking.listingId.province},{" "}
          {booking.listingId.country}
        </h2>
        <p>
          {booking.listingId.guestCount} guests - {booking.listingId.bedroomCount} bedroom(s) -{" "}
          {booking.listingId.bedCount} bed(s) - {booking.listingId.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`http://localhost:3001/${booking.hostId.profileImagePath.replace(
              "public",
              ""
            )}`}
          />
          <h3>
            Hosted by {booking.hostId.firstName} {booking.hostId.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{booking.listingId.description}</p>
        <hr />

        <h3>{booking.listingId.highlight}</h3>
        <p>{booking.listingId.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {booking.listingId.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${booking.listingId.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${booking.listingId.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${booking.listingId.price * dayCount}</h2>
              <p>Start Date: {booking.startDate}</p>
              <p>End Date: {booking.endDate}</p>

              <button className="button" type="submit" onClick={handleEditSubmit}>
                EDIT BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookingDetails;
