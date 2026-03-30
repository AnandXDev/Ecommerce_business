"use client";

export const getUserCountry = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_code; // "IN", "US"
  } catch (err) {
    return "IN"; // fallback
  }
};