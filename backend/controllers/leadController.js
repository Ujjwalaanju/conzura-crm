const Lead =
  require("../models/Lead");

const Customer =
  require("../models/Customer");

const Notification =
  require("../models/Notification");

  const Settings =
  require("../models/Settings");

const Project = require("../models/Project");
const Payment = require("../models/Payment");

// CREATE LEAD
const createLead =
  async (req, res) => {

    try {

// Check duplicate email or phone
// Normalize email and phone
const email = req.body.email?.trim().toLowerCase();
const phone = req.body.phone?.trim();
const name = req.body.name?.trim().toLowerCase();
const projectTitle = req.body.projectTitle?.trim().toLowerCase();

req.body.email = email;
req.body.phone = phone;

// Build duplicate conditions
const conditions = [];

if (email) {
  conditions.push({ email });
}

if (phone) {
  conditions.push({ phone });
}

if (!email && !phone && name && projectTitle) {
  conditions.push({
    name,
    projectTitle
  });
}

// Check duplicate
const existingLead =
  conditions.length > 0
    ? await Lead.findOne({ $or: conditions })
    : null;

if (existingLead) {

  if (email && existingLead.email === email) {
   return res.status(400).json({
  message: `A lead with email "${email}" already exists.`,
  lead: existingLead
});
  }

  if (phone && existingLead.phone === phone) {
    return res.status(400).json({
  message: `A lead with phone number "${phone}" already exists. Please use a different phone number or update the existing lead.`,
  lead: existingLead
});
  }

  if (
    !email &&
    !phone &&
    existingLead.name?.toLowerCase() === name &&
    existingLead.projectTitle?.toLowerCase() === projectTitle
  ) {
    return res.status(400).json({
  message: `A lead for "${req.body.name}" with project "${req.body.projectTitle}" already exists.`,
  lead: existingLead
});
  }

}
      const settings =
        await Settings.findOne();

      const lead =
        await Lead.create({

          ...req.body,

          status:
            settings?.defaultLeadStatus ||
            "New",

          createdBy:
            req.user?._id || null,

        });

      await Notification.create({

        title:
          "New Lead",

        message:
          `New lead added: ${lead.name}`,

        type:
          "Lead",

        priority:
          "Medium",

      });

      res.status(201).json(
        lead
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

};


// UPDATE LEAD
const updateLead =
  async (req, res) => {

    try {

      const updatedLead =

        await Lead.findByIdAndUpdate(

          req.params.id,

          req.body,

          { new: true }

        );

      // AUTO CONVERT
      if (
        req.body.status ===
        "Won"
      ) {

        const existingCustomer =

          await Customer.findOne({

            email:
              updatedLead.email,

          });

        // CREATE CUSTOMER
        if (
          !existingCustomer
        ) {

          await Customer.create({

            name:
              updatedLead.name,

            email:
              updatedLead.email,

            phone:
              updatedLead.phone,

            company:
              updatedLead.company,

          });

          // CUSTOMER NOTIFICATION
          await Notification.create({

            title:
              "Customer Conversion",

            message:
              `${updatedLead.name} converted to customer`,

            type:
              "Customer",

            priority:
              "High",

          });

        }

        // CREATE PROJECT IN DB
        const existingProject = await Project.findOne({ leadId: updatedLead._id });
        if (!existingProject) {
          await Project.create({
            leadId: updatedLead._id,
            name: updatedLead.name,
            phone: updatedLead.phone,
            projectTitle: updatedLead.projectTitle || "",
            status: "In Progress",
            assignedTo: "",
            deliveryDate: "",
            remarks: updatedLead.remarks || "",
            completedPercent: 0,
          });
        }

        // CREATE PAYMENT IN DB
        const existingPayment = await Payment.findOne({ leadId: updatedLead._id });
        if (!existingPayment) {
          await Payment.create({
            leadId: updatedLead._id,
            name: updatedLead.name,
            email: updatedLead.email,
            phone: updatedLead.phone,
            projectTitle: updatedLead.projectTitle || "",
            purpose: updatedLead.purpose || "Internship",
            totalPayment: updatedLead.paymentAmount || 5000,
            paidAmount: 0,
            convertedAt: new Date(),
            paymentHistory: [],
          });
        }

      }

      // STATUS NOTIFICATION
      await Notification.create({

        title:
          "Lead Updated",

        message:
          `${updatedLead.name} moved to ${updatedLead.status}`,

        type:
          "Lead",

        priority:
          "Medium",

      });

      res.status(200).json(

        updatedLead

      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

};



// DELETE LEAD
const deleteLead =
  async (req, res) => {

    try {

      const lead =
        await Lead.findById(
          req.params.id
        );

      if (!lead) {

        return res.status(404).json({

          message:
            "Lead not found",

        });

      }

      await Lead.findByIdAndDelete(

        req.params.id

      );

      // DELETE NOTIFICATION
      await Notification.create({

        title:
          "Lead Deleted",

        message:
          `Lead deleted: ${lead.name}`,

        type:
          "Lead",

        priority:
          "Low",

      });

      res.status(200).json({

        message:
          "Lead Deleted"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

};

// GET ALL LEADS
const getLeads =
  async (req, res) => {

    try {

      const leads =
        await Lead.find()

        .sort({

          createdAt: -1,

        });

      res.status(200).json(
        leads
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};

// GET SINGLE LEAD BY ID
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {

  createLead,

  getLeads,

  updateLead,

  deleteLead,

  getLeadById,

};