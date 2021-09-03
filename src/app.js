const express = require("express");
require("./db/conn");
const bcrypt = require("bcryptjs");
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");
const hbs = require("hbs");
const Register = require("./modals/registers");
const cookieparser = require("cookie-parser");
const auth = require("./middlware/auth");

const temp_path = path.join(__dirname, "../templates/views");
const patial_path = path.join(__dirname, "../templates/partials");
console.log(patial_path);

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", temp_path);
hbs.registerPartials(patial_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secret", auth, (req, res) => {
  // console.log(`my token ${req.cookies.jwt}`);
  res.render("secret");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      console.log(`the succes part ${registerEmployee}`);
      //middleware
      const token = await registerEmployee.generatetoken();
      console.log("the token pat is " + token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true,
      });

      //console.log(cookie);

      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.send("password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/", async (req, res) => {
  await res.send("hello world");
});

app.get("/logout", auth, async (req, res) => {
  try {
    // req.user.tokens = req.user.tokens.filter((currenttoken) => {
    //   return currenttoken.token !== req.token;
    // });

    req.user.tokens =[];

 

    res.clearCookie("jwt");
    console.log("logout  is succssfuly");



    await req.user.save();

    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    //console.log(`${email} and ${password}`);

    const useremail = await Register.findOne({ email: email });
    //res.send(useremail.password );
    //console.log(useremail.password);
    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generatetoken();
    // console.log("the token pat is " + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true,
    });
    // console.log(cookies);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      console.log();
      res.status(401).send("invalid password");
    }
  } catch (error) {
    res.status(401).send(`${error} error is found`);
  }
});

app.listen(port, () => {
  console.log(`connection is setup  on ${port}`);
});
