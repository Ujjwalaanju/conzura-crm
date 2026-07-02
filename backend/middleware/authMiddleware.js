const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");



// PROTECT ROUTE
const protect =
  async (req, res, next) => {

    let token;



    if (

      req.headers.authorization &&

      req.headers.authorization.startsWith(
        "Bearer"
      )

    ) {

      try {

        token =
          req.headers.authorization.split(
            " "
          )[1];



        const decoded =
          jwt.verify(

            token,

            process.env.JWT_SECRET

          );



        req.user =
          await User.findById(
            decoded.id
          ).select("-password");



        next();

      } catch (error) {

        return res.status(401).json({

          message:
            "Invalid token",

        });

      }

    }



    if (!token) {

      return res.status(401).json({

        message:
          "No token provided",

      });

    }

};



// ADMIN ONLY
const adminOnly =
  (req, res, next) => {

    if (

      req.user.role !==
        "Admin"

      &&

      req.user.role !==
        "SuperAdmin"

      &&

      req.user.role !==
        "Team Manager"

    ) {

      return res.status(403).json({

        message:
          "Access Denied: Team Manager/Admin access only",

      });

    }



    next();

};



// SUPER ADMIN
const superAdminOnly =
  (req, res, next) => {

    if (

      req.user.role !==
      "SuperAdmin"

    ) {

      return res.status(403).json({

        message:
          "Super Admin access only",

      });

    }



    next();

};



// SALES MANAGER
const salesManagerOnly =
  (req, res, next) => {

    if (

      req.user.role !==
        "SalesManager"

      &&

      req.user.role !==
        "Admin"

      &&

      req.user.role !==
        "SuperAdmin"

    ) {

      return res.status(403).json({

        message:
          "Sales Manager access only",

      });

    }



    next();

};



// SUPPORT
const supportOnly =
  (req, res, next) => {

    if (

      req.user.role !==
      "SupportExecutive"

    ) {

      return res.status(403).json({

        message:
          "Support access only",

      });

    }



    next();

};



module.exports = {

  protect,

  adminOnly,

  superAdminOnly,

  salesManagerOnly,

  supportOnly,

};