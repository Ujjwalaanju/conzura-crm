const mongoose =
  require("mongoose");

const customerSchema =
  new mongoose.Schema({

    // NAME
    name: {

      type: String,

      required: true,

    },



    // COMPANY
    company: {

      type: String,

    },



    // EMAIL
    email: {

      type: String,

      required: true,

    },



    // PHONE
    phone: {

      type: String,

    },



    // CUSTOMER TYPE
    segment: {

      type: String,

      enum: [

        "Enterprise",

        "Startup",

        "Premium",

        "Regular",

      ],

      default:
        "Regular",

    },



    // CUSTOMER STATUS
    lifecycleStage: {

      type: String,

      enum: [

        "Lead",

        "Active",

        "Inactive",

        "Churned",

      ],

      default:
        "Active",

    },



    // TOTAL PURCHASE VALUE
    totalPurchases: {

      type: Number,

      default: 0,

    },



    // COMMUNICATION HISTORY
    interactions: [

      {

        type: {

          type: String,

          enum: [

            "Call",

            "Email",

            "Meeting",

            "WhatsApp",

          ],

        },



        message: {

          type: String,

        },



        createdAt: {

          type: Date,

          default:
            Date.now,

        },

      },

    ],



    // NOTES
    notes: [

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



    // DOCUMENTS
    attachments: [

      {

        fileName: {

          type: String,

        },



        fileUrl: {

          type: String,

        },



        uploadedAt: {

          type: Date,

          default:
            Date.now,

        },

      },

    ],



    // CONTACT HISTORY
    contactHistory: [

      {

        action: {

          type: String,

        },



        date: {

          type: Date,

          default:
            Date.now,

        },

      },

    ],

  }, {

    timestamps: true,

  });

module.exports =
  mongoose.model(

    "Customer",

    customerSchema

  );