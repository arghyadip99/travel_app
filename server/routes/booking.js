const router = require("express").Router()

const Booking = require("../models/Booking")

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body
    console.log(req.body)
    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice })
    await newBooking.save()
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})

/* UPDATE BOOKING */
router.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true })

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found!" })
    }

    res.status(200).json(updatedBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to update the Booking!", error: err.message })
  }
})

module.exports = router