const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const { search } = require('../app');

class UserService {
    static async registerUser(email, password, emergencyNumber, audioFile) {
        try {
            console.log(await UserModel.findOne({ email }))
            if (await UserModel.findOne({ email }) == null) {
                console.log("nukk")
                const createUser = new UserModel({ email, password, emergencyNumber, audioFile });
                const newUser = await createUser.save();
                return true
            }
            return false
        } catch (error) {
            throw error;
        }
    }

    static async checkUser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async checkPassword(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            console.log(user.password + " " + password)
            console.log(user.password === password)

            return user.password === password
        } catch (error) {
            throw error;
        }
    }

    static async editUserAudioFile(email, audioFile) {
        try {
            console.log(email + " " + audioFile)
            const user = UserModel.findOne({ email })
            await user.updateOne({ $set: { audioFile } });
        } catch (error) {
            throw error;
        }
    }

    static async checkDoneLevels(email) {
        try {
            console.log(email)
            const user = await UserModel.findOne({ email })
            console.log("dani " + user.audioFile)
            if (user.audioFile != "default") {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    static async getEmergencyNumber(email) {
        try {
            console.log(email)
            const user = await UserModel.findOne({ email })
            console.log("dani " + user.emergencyNumber)
            return user.emergencyNumber;
        } catch (error) {
            throw error;
        }
    }

    static async modifyEmergencyNumber(email, emergencyNumber) {
        try {
            console.log(email)
            const user = await UserModel.findOne({ email })
            console.log("dani " + user.emergencyNumber)
            await user.updateOne({ emergencyNumber: emergencyNumber })
        } catch (error) {
            throw error;
        }
    }

    static async genarateTokken(tokenData, security, jwt_expire) {
        return jwt.sign(tokenData, security, { expiresIn: jwt_expire })
    }
}

module.exports = UserService