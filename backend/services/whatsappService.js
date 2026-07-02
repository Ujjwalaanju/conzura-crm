const twilio =
  require("twilio");

const client =
  twilio(

    process.env.TWILIO_ACCOUNT_SID,

    process.env.TWILIO_AUTH_TOKEN

  );

const sendWhatsApp =
  async (
    to,
    message
  ) => {

    try {

      const response =

        await client.messages.create({

          from:
            process.env.TWILIO_WHATSAPP_NUMBER,

          to:
            `whatsapp:${to}`,

          body:
            message,

        });

      console.log(

        "WhatsApp Sent:",

        response.sid

      );

    } catch (error) {

      console.log(

        "WhatsApp Error:",

        error.message

      );

    }

};

module.exports =
  sendWhatsApp;