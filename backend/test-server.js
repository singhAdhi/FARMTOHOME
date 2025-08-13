import axios from "axios";

const testBackend = async () => {
  try {
    console.log("Testing backend connection...");

    // Test basic connection
    const response = await axios.get("http://localhost:5000/api/products");
    console.log("✅ Backend is working!");
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("❌ Backend connection failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Is the server running?");
    } else {
      console.error("Error:", error.message);
    }
  }
};

testBackend();
