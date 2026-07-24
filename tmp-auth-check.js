const axios = require("axios");

(async () => {
  try {
    const res = await axios.post(
      "https://bee-pro-academy.vercel.app/api/v1/auth/register",
      {
        fullName: "Jonah",
        email: "jonahi@mailinator.com",
        phone: "",
        password: "Pa$$w0rd!",
        role: "student",
      },
    );
    console.log(
      JSON.stringify({ status: res.status, data: res.data }, null, 2),
    );
  } catch (e) {
    console.error("ERR", e.response?.status, JSON.stringify(e.response?.data));
  }
})();
