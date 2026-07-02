const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema({

    // NAME
    name: {

      type: String,

      required: true,

    },



    // EMAIL
    email: {

      type: String,

      required: true,

      unique: true,

    },



    // PASSWORD
    password: {

      type: String,

      required: true,

    },



    // ROLE
    

  role: {
  type: String,
  enum: ["Admin", "Team Manager", "Team Leader", "Team Member"],
  default: "Team Member",
},


    // DEPARTMENT
    department: {

      type: String,

      default: "Sales",

    },

    phone: {
      type: String,
      default: "",
    },

    teamId: {
      type: String,
      default: "",
    },



    // ACTIVE STATUS
    isActive: {

      type: Boolean,

      default: true,

    },



    // RESET PASSWORD
    resetPasswordToken: {

      type: String,

    },



    resetPasswordExpire: {

      type: Date,

    },

  }, {

    timestamps: true,

  });

module.exports =
  mongoose.model(

    "User",

    userSchema

  );