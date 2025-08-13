import api from "./src/utils/api.js";

const testFrontendAPI = async () => {
  try {
    console.log("Testing frontend API configuration...");

    // Test API configuration
    console.log("API baseURL:", api.defaults.baseURL);
    console.log("API timeout:", api.defaults.timeout);

    // Test products endpoint
    const response = await api.get("/api/products");
    console.log("✅ Frontend API is working!");
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("❌ Frontend API test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Check proxy configuration.");
    } else {
      console.error("Error:", error.message);
    }
  }
};

testFrontendAPI();
