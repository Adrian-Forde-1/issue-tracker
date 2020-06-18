const ChatModel = require('../models/ChatModel');

module.exports = {
  getChats: (req, res) => {
    if (req.params.teamID) {
      const teamID = req.params.teamID;
      ChatModel.find({ teamId: teamID })
        .populate('sender')
        .exec(function (err, chats) {
          //If an error occurs, notify users
          if (err) {
            let errors = {};
            errors.chat = 'Opps! Something went wrong';
            return res.status(500).json(errors);
          }

          //If everything went well, send response
          return res.json(chats);
        });
    } else {
      let errors = {};
      errors.chat = 'Bad Response';
      return res.status(400).json(errors);
    }
  },
};

// getChats: (req, res) => {
//   // const teamID = req.params.teamID;
//   console.log('Get chats called');
//   ChatModel.find()
//     .populate('sender')
//     .exec(function (err, chats) {
//       //If an error occurs, notify users
//       if (err) {
//         let errors = {};
//         errors.chat = 'Opps! Something went wrong';
//         return res.status(500).json(errors);
//       }

//       //If everything went well, send response
//       return res.json(chats);
//     });
// },
