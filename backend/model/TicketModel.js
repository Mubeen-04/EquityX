const mongoose = require("mongoose");
const { TicketSchema } = require("../schemas/TicketSchema");

const TicketModel = mongoose.model("Ticket", TicketSchema);

module.exports = { TicketModel };
