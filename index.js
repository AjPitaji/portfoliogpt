import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import session from "express-session";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.LLM);
// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const supabase = createClient(
  process.env.Url,
  process.env.api
);
const app = express();
let msg = "";
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.ss,
    resave: false,
    saveUninitialized: true,
  })
);
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth");
  }
  next();
};
app.get("/auth", (req, res) => {
  res.render("auth", { msg: msg });
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email already exists
  const existingUser = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser.error === null) {
    // Redirect or send an error message indicating that the email is already registered
    msg = "user exists";
    console.log(existingUser);
    return res.redirect("/auth");
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert hashed password in supabase table users
  await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }])
    .single();

  msg = "";
  return res.redirect("/auth");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from Supabase based on the provided email
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) {
      console.error("Error fetching user:", error);
      return res.redirect("/auth");
    }

    // Check if the user with the provided email exists
    if (users.length === 0) {
      // User not found, redirect to authentication page
      return res.redirect("/auth");
    }

    const user = users[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Save user information in the session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      msg = "";
      return res.redirect("/");
    } else {
      // Wrong password, redirect to authentication page
      msg = "wrong password";
      return res.redirect("/auth");
    }
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/", requireLogin, (req, res) => {
  res.render("landing");
});
app.get("/signout", (req, res) => {
  delete req.session.user;
  res.redirect("/auth");
});
app.get("/numbers", requireLogin, (req, res) => {
  res.render("newForm");
});
app.post("/numbers", (req, res) => {
  let { certificates, skills, projects, workroles } = req.body;
  req.session.certificates = certificates;
  req.session.skills = skills;
  req.session.projects = projects;
  req.session.workroles = workroles;
  res.redirect("/form");
});
app.get("/form", requireLogin, (req, res) => {
  res.render("form", {
    certificates: req.session.certificates,
    skills: req.session.skills,
    projects: req.session.projects,
    workroles: req.session.workroles,
  });
});

async function query(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
app.post("/submit", async (req, res) => {
  const email = req.session.user.email; // Get the user ID from the session

   const portfolioTitleExists = await supabase
     .from("users")
     .select("portfolio_title")
     .eq("portfolio_title", req.body.portfolio_title);

   if (portfolioTitleExists.data.length > 0) {
     // If portfolio_title already exists, return a response
     return res.json(
       "Portfolio title already taken. Please choose a different one. go back <-"
     );
   }

  const work = await Promise.all(
    req.body.work_title.map(async (title, index) => ({
      title,
      role: req.body.work_role[index],
      timeline: req.body.timeline[index],
      description: await query(
        `first person grammar description of job role ${title} as a ${req.body.work_role[index]}. write 2 -3 lines only `
      ),
    }))
  );

  const certificates = await Promise.all(
    req.body.certificate_title.map(async (title, index) => ({
      title,
      photo: req.body.certificate_photo[index],
      description: await query(
        `write in first person grammar 1 line about this certificate : ${title}`
      ),
    }))
  );

  const projects = await Promise.all(
    req.body.project_name.map(async (name, index) => ({
      name,
      github_repo: req.body.github_repo[index],
      thumbnail: req.body.thumbnail[index],
      description: await query(
        `write 1 line about ${name}. dont guess tech stack untill mentioned`
      ),
    }))
  );

  //  console.log(req.body);
  const formData = {
    portfolio_title: req.body.portfolio_title,
    profile_photo: req.body.profile_photo,
    certificates: certificates,
    college_name: req.body.college_name,
    skills: req.body.skills.map((skill, index) => ({
      name: skill,
      percentage: req.body.percentage[index],
    })),
    work_experience: work,
    projects: projects,
    linkedin: req.body.linkedin,
    github: req.body.github,
    instagram: req.body.instagram,
    about: await query(
      `Write in First person one para about of ${req.session.user.name} with skills ${req.body.skills}.Dont start with As name`
    ),
  };

  const { data, error } = await supabase
    .from("users")
    .update(formData)
    .eq("email", email)
    .select();

  res.render("mid",{name:formData.portfolio_title});
});

app.post("/mail", (req, res) => {
  // Handle the POST request here
  // Access form data using req.body

  // Example: Sending an email using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ds3285@srmist.edu.in",
      pass: "nvxwkoxurssrdzxe",
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: req.body.to, // Replace with the recipient's email address
    subject: req.body.subject,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.get("/portfolio/:title", async (req, res) => {
  try {
    let title = req.params.title;

    let { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("portfolio_title", title);

    if (error) {
      throw error;
    }

    res.render("portfolio1", { user: data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/gen", (req, res) => {
  run();
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
