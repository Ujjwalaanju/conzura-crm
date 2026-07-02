const multer =
  require("multer");

const path =
  require("path");

// STORAGE
const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          "uploads/"
        );

      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(

          null,

          Date.now() +
          path.extname(
            file.originalname
          )

        );

      },

  });

// FILE FILTER
const fileFilter =
  (req, file, cb) => {

    cb(null, true);

  };

const upload =
  multer({

    storage,

    fileFilter,

  });

module.exports =
  upload;