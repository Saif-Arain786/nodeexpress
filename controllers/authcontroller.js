const userValidate = require("../Validator/authVAlidate.js")
exports.signup = async (req, res) => {
    try {
        console.log(req.body);

        let validateData = await userValidate.validateAsync(req.body)
        if (validateData.error) {
            return res.status(400).json({
                status: false,
                message: validateData.error.details[0].message
            });
        }
        res.status(200).json({
            status: true,
            message: "User signed up successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while signing up the user"
        });
        console.log(error);
    }
};

exports.login = (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            message: "User logged in successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `An error occurred while logging in the user or ${error}`,
        });
        console.log(error);
    }
};
