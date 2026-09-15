import { useDispatch, useSelector } from "react-redux";
import { register, login, getMe, logout , forgetPassword , verifyForgetPassword, resetPassword  } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";
import { useState } from "react";

export function useAuth() {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  async function handleRegister({ name, email, password }) {
    try {
      dispatch(setLoading(true));
  
      const data = await register({ email, password, username: name });
      
       if (data?.success) {
        setRegisteredEmail(data.email);
        setShowVerifyModal(true);

        return data;
      }
      
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Register Failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      const loggedInUser = data?.data?.user || data?.user;
      if (loggedInUser) {
        dispatch(setUser(loggedInUser));
      }
      if (data?.success) {
        window.location.replace("/");
        return data;
      }
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Login failed"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      const fetchedUser = data?.data?.user || data?.data;
      dispatch(setUser(fetchedUser));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch user data"));
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
      setIsInitializing(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
 
    } finally {
      dispatch(setUser(null));
    }
  }

  async function handleForgetPassword({ email }) {
    try {
      dispatch(setLoading(true));
      const data = await forgetPassword({ email });
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to send OTP"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleVerifyForgetPassword({ email, otp }) {
    try {
      dispatch(setLoading(true));
      const data = await verifyForgetPassword({ email, otp });
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to verify OTP"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResetPassword({ newPassword, confirmPassword }) {
    try {
      dispatch(setLoading(true));
      const data = await resetPassword({ newPassword, confirmPassword });
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to reset password"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

 

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
    handleForgetPassword,
    handleVerifyForgetPassword,
    handleResetPassword,
    user,
    loading,
    error,
    isInitializing,
    showVerifyModal,
    setShowVerifyModal,
    registeredEmail,
  };
}