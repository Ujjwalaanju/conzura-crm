const mongoose =
  require("mongoose");

const settingsSchema =
  new mongoose.Schema(

    {

      crmName: {

        type: String,

        default:
          "CONZURA CRM",

      },

      defaultLeadStatus: {

        type: String,

        default:
          "New",

      },

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(
    "Settings",
    settingsSchema
  );