import React from "react";
import { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";

export const login = async (username, password) => {
  const user = {
    username: username,
  };
  const account = { id: null, username: null, password: null };
  //   const { email, password } = req.body;

  try {
    const res = await axios.get("http://localhost:8800/accounts", {
      params: user,
    });

    const storedHashedPassword = res.data[0].password;

    const isPasswordValid = await bcrypt.compare(
      password,
      storedHashedPassword
    );

    if (isPasswordValid) {
      //console.log("yes");
      return true;
    } else {
      //console.log("no");
      return false;
    }
  } catch (err) {
    console.log(err.response.data);
  }
};

export const saltAndHash = async (password) => {
  //const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //const tempObj = { name, email, password: hashedPassword };
  console.log(hashedPassword);
  return hashedPassword;
  // Store the user object in the database
  // …
  //res.status(201).json({ message: "Registration successful" });
};

function AdminLogin() {}

export default AdminLogin();
