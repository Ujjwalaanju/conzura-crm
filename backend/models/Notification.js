const mongoose =
  require("mongoose");

const notificationSchema =
  new mongoose.Schema({

    title: {

      type: String,

      required: true,

    },

    message: {

      type: String,

      required: true,

    },

    phone: {

  type: String,

},

email: {

  type: String,

},

    type: {

      type: String,

      enum: [

  "Lead",

  "Task",

  "Ticket",

  "Meeting",

  "System",

  "Customer",

  "General",

],

      default: "System",

    },

    priority: {

      type: String,

      enum: [

        "Low",

        "Medium",

        "High",

        "Critical",

      ],

      default: "Medium",

    },

    read: {

      type: Boolean,

      default: false,

    },

    recipientRole: {

      type: String,

      enum: [

        "Admin",

        "Manager",

        "SalesExecutive",

      ],

      default: "Admin",

    },

    channel: {

      type: String,

      enum: [

        "InApp",

        "Email",

        "SMS",

        "WhatsApp",

      ],

      default: "InApp",

    },

    sentAt: {

      type: Date,

      default: Date.now,

    },

  }, {

    timestamps: true,

  });

  

module.exports =

  mongoose.models.Notification ||

  mongoose.model(

    "Notification",

    notificationSchema

  );