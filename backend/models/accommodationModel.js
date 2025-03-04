const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
        },
        sname: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        birthday: {
            type: Date,
            required: true,
        },
        NICnumber: {
            type: String,
            required: true,
        },
       
        mobnum: {
            type: String,
            required: true,
        },
        emailA: {
            type: String,
            required: true,
        },
        paddress: {
            type: String,
            required: true,
        },
        ncity: {
            type: String,
            required: true,
        },
        
        guardianFullname: {
            type: String,
            required: true,
        },
        guardianPaddress: {
            type: String,
            required: true,
        },
        contactnum: {
            type: String,
            required: true,
        },
      
        eFname: {
            type: String,
            required: true,
        },
        eContactnum: {
            type: String,
            required: true,
        },
        eAddress: {
            type: String,
            required: true,
        },
        confirmationFname: {
            type: String,
            required: true,
        },
        confirmationDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);
