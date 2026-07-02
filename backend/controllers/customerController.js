const Customer = require("../models/Customer");


// GET CUSTOMERS
const getCustomers = async (req, res) => {

  try {

    const customers = await Customer.find();

    res.json(customers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// ADD CUSTOMER
const addCustomer = async (req, res) => {

  try {

    const customer = new Customer(req.body);

    const savedCustomer =
      await customer.save();

    res.status(201).json(savedCustomer);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {

  try {

    await Customer.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Customer deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
};

const updateCustomer = async (req, res) => {

  try {

    const updatedCustomer =
      await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedCustomer);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
};

const getCustomerById = async (req, res) => {

  try {

    const customer =
      await Customer.findById(req.params.id);

    res.json(customer);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomerById,
};

const addCustomerNote = async (req, res) => {

  try {

    const customer =
      await Customer.findById(req.params.id);

    customer.notes.push({
      text: req.body.text,
    });

    await customer.save();

    res.json(customer);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
// UPLOAD ATTACHMENT
const uploadAttachment =
  async (req, res) => {

    try {

      const customer =
        await Customer.findById(
          req.params.id
        );

      if (!customer) {

        return res.status(404)
        .json({

          message:
            "Customer not found",

        });

      }

      customer.attachments.push({

        fileName:
          req.file.filename,

        fileUrl:
          `/uploads/${req.file.filename}`,

      });

      await customer.save();

      res.json(customer);

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };
module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  uploadAttachment,
  getCustomerById,
  addCustomerNote,
};