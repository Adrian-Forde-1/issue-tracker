const {getFileStream} = require("../aws/S3");


module.exports = {
    getImage: (req, res) => {
        try {
            const key = req.params.key;
            const readStream = getFileStream(key);

            readStream.pipe(res);
        }catch(err) {
            console.error(err);
            return res.status(500).json(["Error Occured"]);
        }

    }
}