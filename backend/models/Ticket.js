const mongoose =
  require("mongoose");

const ticketSchema =
  new mongoose.Schema({
    
    customerName: {

  type: String,

  required: true,

},

    // CUSTOMER
    customer: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Customer",

    },

    // TITLE
    title: {

      type: String,

      required: true,

    },

    // DESCRIPTION
    description: {

      type: String,

    },

    // PRIORITY
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

    // STATUS
    status: {

      type: String,

      enum: [

        "Open",

        "In Progress",

        "Resolved",

        "Closed",

      ],

      default: "Open",

    },

    // CATEGORY
    category: {

      type: String,

      enum: [

        "Technical",

        "Billing",

        "General",

        "Sales",

      ],

      default: "General",

    },

    // ASSIGNED SUPPORT
    assignedTo: {

      type: String,

    },

    // SLA DEADLINE
    slaDeadline: {

      type: Date,

    },

    // RESOLUTION NOTES
    resolutionNotes: {

      type: String,

    },

    // RESOLVED DATE
    resolvedAt: {

      type: Date,

    },

    // COMMENTS
    comments: [

      {

        text: {

          type: String,

        },

        createdAt: {

          type: Date,

          default:
            Date.now,

        },

      },

    ],

    // ATTACHMENTS
    attachments: [

      {

        fileUrl: String,

        uploadedAt: {

          type: Date,

          default:
            Date.now,

        },

      },

    ],

    // CREATED BY
    createdBy: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

    },

  }, {

    timestamps: true,

  });

module.exports =

  mongoose.models.Ticket ||

  mongoose.model(
    "Ticket",
    ticketSchema
  );