const Ticket =
  require("../models/Ticket");

// CREATE
const createTicket =
  async (req, res) => {

    try {

      const ticket =
        await Ticket.create(
          req.body
        );

      res.status(201).json(
        ticket
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

// GET
const getTickets =
  async (req, res) => {

    try {

      const tickets =
  await Ticket.find()

    .populate(
      "customer",
      "name"
    )

    .sort({
      createdAt: -1,
    });

      res.json(tickets);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

// UPDATE
const updateTicket =
  async (req, res) => {

    try {

      const ticket =
        await Ticket.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }

        );

      res.json(ticket);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

// DELETE
const deleteTicket =
  async (req, res) => {

    try {

      await Ticket.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Ticket Deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

// ADD COMMENT
const addComment =
  async (req, res) => {

    try {

      const ticket =
        await Ticket.findById(
          req.params.id
        );

      ticket.comments.push({

        text:
          req.body.text,

      });

      await ticket.save();

      res.json(ticket);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

module.exports = {

  createTicket,

  getTickets,

  updateTicket,

  deleteTicket,

  addComment,

};