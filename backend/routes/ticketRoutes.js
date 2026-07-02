const express =
  require("express");

const router =
  express.Router();

const {

  createTicket,

  getTickets,

  updateTicket,

  deleteTicket,

  addComment,

} = require(
  "../controllers/ticketController"
);

router.post(
  "/",
  createTicket
);

router.get(
  "/",
  getTickets
);

router.put(
  "/:id",
  updateTicket
);

router.delete(
  "/:id",
  deleteTicket
);

router.post(
  "/:id/comment",
  addComment
);

module.exports =
  router;