import { Redirect } from "expo-router";
import React = require("react");

export default function IndexRedirect() {
  return <Redirect href="/home" />; // Automatically redirects to localhost:8081/home
}
