const UserService = require("../services/user.services")
const { spawn } = require('child_process');
const fs = require('fs');



exports.register = async (req, res, next) => {
   try {
      const { email, password, emergencyNumber } = req.body
      console.log(req.body)

      if (!email || !password || !emergencyNumber) {
         res.status(200).json({ status: false, success: 'Parameter are not correct' })
         console.log('Parameter are not correct')
         return
      }
      const successRes = await UserService.registerUser(email, password, emergencyNumber, 'default');
      console.log(successRes)
      res.json({ status: successRes, success: "Email already exist" })
   } catch (error) {
      throw error
   }
}

exports.login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         res.status(200).json({ status: false, success: 'Parameter are not correct' })
         console.log('Parameter are not correct')
         return
      }
      const user = await UserService.checkUser(email);
      if (!user) {
         res.status(200).json({ status: false, success: 'User not exist' })
         console.log('User not exist')
         return
      }
      //
      const isMatch = await UserService.checkPassword(email, password)
      //
      if (isMatch == false) {
         res.status(200).json({ status: false, success: 'Password invalid' })
         console.log('Password invalid')
         return
      }

      let tokenData = { _id: user._id, email: user.email };
      const token = await UserService.genarateTokken(tokenData, "security", '1h')
      console.log("success login")
      res.status(200).json({ status: true, token: token, success: 'Success login' })
   } catch (error) {
      throw error
   }
}

exports.recognizeDB = async (req, res, next) => {
   try {
      const { email, file } = req.body; //the name of user
      createWevFile(file)
      console.log(email)
      const pythonScript = 'predict\\voice_auth.py'
      const input = ' -t enroll -n "' + `${email}` + '" -f predict\\my_unique_voice.wav'
      const command = `python ${pythonScript} ${input}`
      let retStatus = false;

      const pythonProc = spawn(command, { shell: true });

      pythonProc.stdout.on('data', (data) => {
         if (data = "Succesfully enrolled the user") {
            retStatus = true;
         } else {
            retStatus = false;
         }
         console.log(`stdout: ${data} + ${retStatus}`);
      });

      pythonProc.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc.on('close', (code) => {
         console.log(" function done successfuly")
         res.json({ status: retStatus })
         UserService.editUserAudioFile(email, 'my_unique_voice.wav')
         console.log(`child process exited with code ${code}`);
      });

   } catch (error) {
      throw error
   }
}

createWevFile = async (fileName) => {
   const pythonScript = 'create_wev_file.py'
   const input = fileName
   const command = `python ${pythonScript} ${input}`

   const pythonProc = spawn(command, { shell: true });

   pythonProc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
   });

   pythonProc.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
   });

   pythonProc.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
   });
}

exports.recognize = async (req, res, next) => {
   try {
      const { email, file } = req.body; //the name of user
      createWevFile(file);
      const pythonScript = 'predict\\voice_auth.py'
      const input = ' -t recognize -f predict\\my_unique_voice.wav'
      const command = `python ${pythonScript} ${input}`
      let retStatus = false;

      const pythonProc = spawn(command, { shell: true });

      pythonProc.stdout.on('data', (data) => {
         console.log(`dani + ${data}`);
         if (data == `Recognized:  ${email}`) {
            // if (data.includes(`Recognized:  ${email}`)) {
            console.log("inside")
            retStatus = true
         }
         console.log(`stdout: ${data}`);
      });

      pythonProc.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
         console.log("Recognize function done successfuly")
         res.json({ status: retStatus })

      });
   } catch (error) {
      throw error
   }
}

exports.emotion = async (req, res, next) => {
   const { email } = req.body;
   const emergencyNumber = await UserService.getEmergencyNumber(email)
   let retStatus = false;
   try {
      const pythonScript = 'predict\\predict.py'
      const command = `python ${pythonScript}`

      const pythonProc = spawn(command, { shell: true });

      pythonProc.stdout.on('data', (data) => {
         if (data.includes(`Predicted emotion: female_fearful`)
            || data.includes(`Predicted emotion: male_fearful`)) {
            retStatus = true
            console.log("inside")
         }
         console.log(`stdout: ${data}`);
      });

      pythonProc.stderr.on('data', (data) => {
         console.error(`stderr: ${data}`);
      });

      pythonProc.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
         console.log("Emotion recognition have made successfuly")
         res.json({ status: retStatus, success: "Emotion recognition have made successfuly", emergencyNumber: emergencyNumber })
      });



   } catch (error) {
      throw error
   }
}

exports.levels = async (req, res, next) => {
   try {
      const { email } = req.body;
      const isDoneLevels = await UserService.checkDoneLevels(email)
      console.log("check done levels " + isDoneLevels)
      res.json({ status: isDoneLevels, success: "check done levels" })
   } catch (error) {
      throw error
   }
}

exports.emergencyNum = async (req, res, next) => {
   try {
      const { email, emergencyNumber } = req.body;
      console.log(emergencyNumber)
      await UserService.modifyEmergencyNumber(email, emergencyNumber)
      res.json({ status: true, success: "checnged number" })
   } catch (error) {
      throw error
   }
}