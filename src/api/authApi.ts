 
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation,  useQueryClient } from "react-query";
import authFetch from "./axiosInterceptor";
import useAuth from "../hooks/useAuth";
import { AxiosResponse } from "axios";
import ToastProvider from "../providers/ToastProvider";

interface LoginResponse {
  data: {
    access_token: string;
    user?: any;
    data?: any;
    message?: string;
  };
}

// interface LoginData {
//   email: string;
//   password: string;
// }

interface RegisterData {
  email: string;
  password: string;
}

interface UserDetailData {
  KeyCloakID: string;
  Role: string;
  // Username: string;
  FirstName: string;
  LastName: string;
  Address: string;
  Email: string;
  Phone: string;
  Whatsapp: string;
  Country: string;
  City: string;
  Bio: string;
  bankName?: string;
  accountNumber?: string;
  ibanNumber?: string;
  // paypal: string;
  ProfilePictureURL: string;
}

interface UploadResponse {
  fileUrl: string;
  message: string;
}

interface EmirateId {
  expirydate: string;
  emirateid: string;
  emirate: string;
}

const UPLOAD_TIMEOUT_MS = 60000; // 60 seconds

export const useLogin = () => {
  const {
    setToken,
    setCurrentUser,
    setCurrentUserId,
    setCurrentUserType,
    handleRedirect,
    handleSignUpRedirect,
    setCurrentUserEmail,
    handleIncompleteProfileRedirect,
  } = useAuth();

  return useMutation<LoginResponse, any, any>({
    mutationFn: async (data: any) => {
      return await authFetch.post("/auth/login", data);
    },
    onSuccess: (data) => {
      const userData = data.data;
      if (userData?.message === "User not registered to the system") {
        setCurrentUserId(userData.data.userid);
        setCurrentUserEmail(userData.data.email);
        setToken(userData.access_token);
        handleSignUpRedirect();
      } else {
        // Check if user role is "staff" and block login
        if (userData.user.Role === "staff") {
          // Clear any stored data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userType");
          localStorage.removeItem("userId");
          localStorage.removeItem("email");
          // Reject the promise to trigger onError
          return Promise.reject({
            response: {
              data: {
                message:
                  "This account is not authorized to access the user application. Please contact your administrator for access to the appropriate system.",
              },
            },
          });
        }

        setToken(userData.access_token);
        setCurrentUser(userData.user);
        setCurrentUserType(userData.user.Role);
        setCurrentUserId(userData.user.KeyCloakID);

        if (userData.user.Role === "both") {
          handleRedirect(false, false);
        } else if (!userData.user.FirstName) {
          if (userData.user.Role === "sp" || userData.user.Role === "tp") {
            void handleIncompleteProfileRedirect(userData.user.Role);
          } else {
            handleSignUpRedirect();
          }
        } else {
          handleRedirect(
            userData?.user?.Role === "tp",
            userData?.user?.Role === "sp"
          );
        }
      }
    },
    onError: (error: any) => {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useSignUp = () => {
  const { handleRedirectToSignupOTP, setCurrentUserEmail } = useAuth();
  let signupEmail = "";
  let signupPassword = "";

  return useMutation<any, any, RegisterData>({
    mutationFn: async (data: RegisterData) => {
      signupEmail = data.email;
      signupPassword = data.password;
      return await authFetch.post("/auth/sign-up", data);
    },
    onSuccess: (data) => {
      const email = data?.data?.data?.email || signupEmail;
      setCurrentUserEmail(email);
      sessionStorage.setItem("pendingSignupPassword", signupPassword);
      ToastProvider.success(
        data?.data?.message ||
          "Account created. Please verify the OTP sent to your email."
      );
      handleRedirectToSignupOTP(email);
    },
    onError: (error: any) => {
      console.error(
        "Registration error:",
        error.response?.data?.message || error.message
      );
      const backendMessage = error.response?.data?.message;
      let displayMessage = "An error occurred during sign up. Please try again.";

      if (backendMessage) {
        if (
          backendMessage.toLowerCase().includes("already exists") ||
          backendMessage.toLowerCase().includes("email")
        ) {
          displayMessage =
            "This email address is already registered. Please try signing in.";
        } else {
          displayMessage = backendMessage;
        }
      }

      ToastProvider.error(displayMessage);
    },
  });
};

export const useRegister = () => {
  return useMutation<any, any, UserDetailData>({
    mutationFn: async (data: UserDetailData) => {
      return await authFetch.post("/user-details", { userDetails: data });
    },
    onError: (error: any) => {
      console.error(
        "Registration error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useGetUserDetails = () => {
  return useMutation<any, any, any>({
    mutationFn: async (id: string) => {
      return await authFetch.get(`/user-details/keycloak/${id}`);
    },

    onError: (error: any) => {
      console.error(
        "User details error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export { useGetCurrentUser } from "./userDetails";

export const useForgotPassword = () => {
  const { handleRedirectToOTP } = useAuth();
  let email = "";
  return useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      email = data.email;
      return await authFetch.post("/auth/forgot-password", {
        email: data.email,
      });
    },
    onSuccess: () => {
      // Backend always returns a generic anti-enumeration message.
      ToastProvider.success(
        "If an account exists for this email, an OTP has been sent."
      );
      handleRedirectToOTP(email);
    },
    onError: (error: any) => {
      console.error(
        "Forgot password error:",
        error.response?.data?.message || error.message
      );
      // Do not show "user not found" — keep messaging generic.
      ToastProvider.success(
        "If an account exists for this email, an OTP has been sent."
      );
      if (email) {
        handleRedirectToOTP(email);
      }
    },
  });
};

export const useVerifyOTP = () => {
  const { handleRedirectToResetPassword } = useAuth();
  let email = "";
  let otp = "";
  return useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      email = data.email;
      otp = data.otp;
      return await authFetch.post("/auth/verify-otp", data);
    },
    onSuccess: () => {
      handleRedirectToResetPassword(email, otp);
    },
    onError: (error: any) => {
      console.error(
        "OTP verification error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useVerifySignupOTP = () => {
  const {
    setToken,
    setCurrentUser,
    setCurrentUserId,
    setCurrentUserEmail,
    handleSignUpRedirect,
  } = useAuth();

  return useMutation<
    any,
    any,
    { email: string; otp: string; password: string }
  >({
    mutationFn: async (data) => {
      return await authFetch.post("/auth/verify-signup-otp", data);
    },
    onSuccess: (data) => {
      sessionStorage.removeItem("pendingSignupPassword");
      // Same shape as login: { access_token, user: UserDetails, message, ... }
      const body = data?.data ?? {};
      const user = body.user ?? body.data?.user ?? null;
      const userId =
        user?.KeyCloakID ||
        body.data?.userid ||
        body.userid ||
        body.data?.KeyCloakID ||
        "";
      const email = user?.Email || body.data?.email || body.email || "";

      if (!body.access_token || !userId) {
        console.error("Signup OTP verify response missing token/userId", body);
        ToastProvider.error(
          "Verification succeeded but session could not be started. Please sign in."
        );
        return;
      }

      setToken(body.access_token);
      setCurrentUserId(userId);
      if (email) {
        setCurrentUserEmail(email);
      }
      if (user) {
        setCurrentUser(user);
      }

      ToastProvider.success(
        body.message || "Email verified successfully. Welcome!"
      );
      handleSignUpRedirect();
    },
    onError: (error: any) => {
      console.error(
        "Signup OTP verification error:",
        error.response?.data?.message || error.message
      );
      ToastProvider.error(
        error.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    },
  });
};

export const useResendSignupOTP = () => {
  return useMutation<any, any, { email: string }>({
    mutationFn: async (data) => {
      return await authFetch.post("/auth/resend-signup-otp", data);
    },
    onSuccess: () => {
      ToastProvider.success(
        "If an account needs verification for this email, an OTP has been sent."
      );
    },
    onError: () => {
      // Anti-enumeration: always show the same generic message.
      ToastProvider.success(
        "If an account needs verification for this email, an OTP has been sent."
      );
    },
  });
};

export const useResetPassword = () => {
  const { handleRedirectToLogin } = useAuth();

  return useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      return await authFetch.post("/auth/reset-password", data);
    },
    onSuccess: () => {
      handleRedirectToLogin();
    },
    onError: (error: any) => {
      console.error(
        "Password reset error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useUploadImage = () => {
  return useMutation<any, any, any>({
    mutationFn: async (data: FormData) => {
      const response: AxiosResponse<UploadResponse> = await authFetch.post(
        "/upload",
        data,
        {
          timeout: UPLOAD_TIMEOUT_MS,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },

    onError: (error) => {
      console.error(
        "Image upload error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const spEmirateId = () => {
  return useMutation<any, any, EmirateId>({
    mutationFn: async (data: EmirateId) => {
      return await authFetch.post("/user-details", data);
    },
    onError: (error: any) => {
      console.error(
        "Registration error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useSignUpAndRegister = () => {
  const {
    setToken,
    setCurrentUserId,
    handleRegisterRedirect,
    setCurrentUserEmail,
  } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    any,
    any,
    { signUpData: RegisterData; registerData: UserDetailData }
  >({
    mutationFn: async ({ signUpData, registerData }) => {
      const signUpResponse = await authFetch.post("/auth/sign-up", signUpData);
      localStorage.setItem("token", signUpResponse.data.access_token);
      localStorage.setItem("userId", signUpResponse.data.data.userid);
      localStorage.setItem("email", signUpResponse.data.data.email);

      try {
        const registerResponse = await authFetch.post("/user-details", {
          userDetails: {
            ...registerData,
            KeyCloakID: signUpResponse.data.data.userid,
            Role: "sp",
            Email: signUpData.email,
          },
        });

        return {
          signUp: signUpResponse.data,
          register: registerResponse.data,
        };
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        throw error;
      }
    },
    onSuccess: async (data) => {
      setCurrentUserId(data.signUp.data.userid);
      setCurrentUserEmail(data.signUp.data.email);
      setToken(data.signUp.access_token);

      // Invalidate the user query to force refetch
      queryClient.invalidateQueries(["get_current_user", "v2"]);

      // Add a small delay to ensure backend processing is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      handleRegisterRedirect();
    },
    onError: (error: any) => {
      console.error(
        "Combined registration error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useSignUpAndRegisterTipper = () => {
  const {
    setToken,
    setCurrentUserId,
    handleRegisterRedirect,
    setCurrentUserEmail,
  } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    any,
    any,
    { signUpData: RegisterData; registerData: UserDetailData }
  >({
    mutationFn: async ({ signUpData, registerData }) => {
      const signUpResponse = await authFetch.post("/auth/sign-up", signUpData);

      localStorage.setItem("token", signUpResponse.data.access_token);
      localStorage.setItem("userId", signUpResponse.data.data.userid);
      localStorage.setItem("email", signUpResponse.data.data.email);

      try {
        const registerResponse = await authFetch.post("/user-details", {
          userDetails: {
            ...registerData,
            KeyCloakID: signUpResponse.data.data.userid,
            Role: "tp", // tp for tipper
            Email: signUpData.email,
          },
        });

        return {
          signUp: signUpResponse.data,
          register: registerResponse.data,
        };
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        throw error;
      }
    },
    onSuccess: async (data) => {
      setCurrentUserId(data.signUp.data.userid);
      setCurrentUserEmail(data.signUp.data.email);
      setToken(data.signUp.access_token);

      // Invalidate the user query to force refetch
      queryClient.invalidateQueries(["get_current_user", "v2"]);

      // Add a small delay to ensure backend processing is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      handleRegisterRedirect();
    },
    onError: (error: any) => {
      console.error(
        "Combined tipper registration error:",
        error.response?.data?.message || error.message
      );
    },
  });
};



export const useUpdateUser = () => {
  return useMutation<any, any, any>({
    mutationFn: async (data) => {
      const { Gender: _gender, ...payload } = data || {};
      return await authFetch.patch("/user-details", payload);
    },
  });
};
