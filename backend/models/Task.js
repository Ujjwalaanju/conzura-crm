const mongoose =
  require("mongoose");

const taskSchema =
  new mongoose.Schema({

    // TITLE
    title: {

      type: String,

      required: true,

    },



    // DESCRIPTION
    description: {

      type: String,

    },



    // TASK TYPE
    activityType: {

      type: String,

      enum: [

        "Task",

        "Meeting",

        "Call",

        "Follow-Up",

      ],

      default:
        "Task",

    },



    // PRIORITY
    priority: {

      type: String,

      enum: [

        "Low",

        "Medium",

        "High",

        "Urgent",

      ],

      default:
        "Medium",

    },



    // STATUS
    status: {

      type: String,

      enum: [

        "Pending",

        "In Progress",

        "Completed",

        "Cancelled",

      ],

      default:
        "Pending",

    },



    // ASSIGNED USER
    assignedTo: {

      type: String,

    },



    // CUSTOMER LINK
    customer: {

      type: String,

    },



    // MEETING LOCATION
    meetingLocation: {

      type: String,

    },



    // FOLLOW-UP NOTES
    followUpNotes: {

      type: String,

    },



    // REMINDER DATE
    reminderDate: {

      type: Date,

    },



    // DUE DATE
    dueDate: {
  type: Date,
  default: null,
},



    // ACTIVITY LOGS
    activityLogs: [

      {

        action: {

          type: String,

        },



        timestamp: {

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
  mongoose.model(

    "Task",

    taskSchema

  );