const express = require("express");
const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");
const {

  getCustomers,

  addCustomer,

  deleteCustomer,

  updateCustomer,

  getCustomerById,

  addCustomerNote,

  uploadAttachment,

} = require("../controllers/customerController");

const router = express.Router();


const upload =
  require("../middleware/uploadMiddleware");
// GET CUSTOMERS
router.get("/", getCustomers);


// ADD CUSTOMER
router.post("/", addCustomer);


// DELETE CUSTOMER
router.delete(
  "/:id",
  protect,
  deleteCustomer
);

// UPDATE CUSTOMER
router.put("/:id", updateCustomer);

// GET CUSTOMER BY ID
router.get("/:id", getCustomerById);

// ADD NOTE TO CUSTOMER
router.post("/:id/notes", addCustomerNote);

router.post(

  "/:id/upload",

  upload.single("file"),

  uploadAttachment

);


module.exports = router;