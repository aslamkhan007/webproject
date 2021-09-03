const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },

  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone: {
    type: Number,
  },
  age: {
    type: Number,
  },

  password: {
    type: String,
  },
  confirmpassword: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

//generatetoken
employeeSchema.methods.generatetoken = async function () {
  try {
    console.log(this._id);
    const token = await jwt.sign(
      { _id: this._id.toString() },
      "mynameissalimfromphgawaraandadityahelloworld"
    );
    this.tokens = this.tokens.concat({ token: token });

    await this.save();
    return token;
  } catch (error) {
    res.status(400).send(`${error} the part `);
    console.log(`the error part${error}`);
  }
};

//hashpasword
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //console.log(`the password ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);

    //.log(`the password ${this.password}`);

    this.confirmpassword = undefined;
  }

  next();
});

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
