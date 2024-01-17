var sendMailActive = require("../helpers/SendMailVerify");

module.exports = {
    verifyPhone: () => {
        try {

        } catch (err) {

        }
    },

    verifyEmail: async (name, email, link) => {
        try {
            await sendMailActive(name, email, link);
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
        }
    }
}