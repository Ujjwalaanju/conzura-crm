const twilio =
  require("twilio");

const client =
  twilio(

    process.env.TWILIO_ACCOUNT_SID,

    process.env.TWILIO_AUTH_TOKEN

  );

const sendSMS =
  async (
    to,
    message
  ) => {

    try {

      const response =

        await client.messages.create({

          body:
            message,

          from:
            process.env.TWILIO_SMS_NUMBER,

          to,

        });

      console.log(

        "SMS Sent:",

        response.sid

      );

    } catch (error) {

      console.log(

        "SMS Error:",

        error.message

      );

    }

};

module.exports =
  sendSMS;