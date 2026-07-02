const Settings =
  require("../models/Settings");

// GET SETTINGS
const getSettings =
  async (req, res) => {

    try {

      let settings =
        await Settings.findOne();

      if (!settings) {

        settings =
          await Settings.create({});

      }

      res.json(settings);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

};

// UPDATE SETTINGS
const updateSettings =
  async (req, res) => {

    try {

      let settings =
        await Settings.findOne();

      if (!settings) {

        settings =
          await Settings.create(
            req.body
          );

      } else {

        settings =
          await Settings.findByIdAndUpdate(

            settings._id,

            req.body,

            {
              new: true,
            }

          );

      }

      res.json(settings);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

};

module.exports = {

  getSettings,

  updateSettings,

};