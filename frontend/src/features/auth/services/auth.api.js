import axios from "axios";

const api = axios.create({
    baseURL:"https://perplexity-rihg.onrender.com",
    withCredentials: true
});


export async function register({ email, password, username }) {
    try {
        const response = await api.post("/api/auth/register", { email, password, username });
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error);
        throw error; 
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error; 
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/getMe");
        return response.data;
    } catch (error) {
        console.error("GetMe Error:", error);
        throw error; 
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
}
export async function forgetPassword({ email }) {
    try {
        const response = await api.post("/api/auth/forget-password", { email });
        return response.data;
    } catch (error) {
        console.error("Forget Password Error:", error);
        throw error; 
    }
}

export async function verifyForgetPassword({ email, otp }) {
    try {
        const response = await api.post("/api/auth/verify-forget-password", { email, otp });
        return response.data;
    } catch (error) {
        console.error("Verify Forget Password Error:", error);
        throw error; 
    }
}

export async function resetPassword({ newPassword, confirmPassword }) {
  try {
    const response = await api.post(
      "/api/auth/reset-password",
      {
        newPassword,
        confirmPassword,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw error;
  }
}

