const express =
  require("express");

const router =
  express.Router();

const {

  createLead,

  getLeads,

  updateLead,

  deleteLead,

  getLeadById,

} = require(
  "../controllers/leadController"
);

const {

  protect,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);



// GET LEADS
router.get(
  "/",
  protect,
  getLeads
);

// GET SINGLE LEAD
router.get(
  "/:id",
  protect,
  getLeadById
);



// CREATE LEAD
router.post(
  "/",
  protect,
  createLead
);



// UPDATE LEAD
router.put(
  "/:id",
  protect,
  updateLead
);



// DELETE LEAD
router.delete(
  "/:id",
  protect,
  deleteLead
);



module.exports =
  router;