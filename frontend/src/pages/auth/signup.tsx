import { FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/api";
import { UserContext } from "../../context/userContext";
import { easeInOut, easeOut, motion } from "framer-motion";
import finlogin from "../../assets/images/finlogin.png";

// Helper to check password strength
const isStrongPassword = (password: string) => {
  return (
    password.length >= 6 &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    /\d/.test(password)
  );
};

// Helper to check if age is 18+
const isAbove18 = (birthdate: string) => {
  const today = new Date();
  const dob = new Date(birthdate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
};

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>("");

  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("User context not found!");
  }

  const { updateUser } = userContext;

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (!birthdate) {
      setError("Please enter your birthdate");
      setLoading(false);
      return;
    }

    if (!isAbove18(birthdate)) {
      setError("You must be at least 18 years old to sign up.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 6 characters long, contain a special character and a number."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    setError("");

    //SignUp API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        birthdate,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col items-center mt-8 md:mt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
            staggerChildren: 0.2,
            ease: easeInOut,
            duration: 0.5,
          }}
          className="w-[90%] md:w-[400px] bg-white rounded-lg shadow-lg p-6 md:p-8 flex flex-col items-center"
        >
          <h3 className="text-xl md:text-3xl font-semibold text-black mb-6 text-center">
            Create an Account
          </h3>

          <form onSubmit={handleSignup} className="w-full">
            <div className="grid grid-cols-1 gap-4">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Full Name"
                placeholder="Jon Snow"
                type="text"
              />
              <Input
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                label="Birthdate"
                placeholder="YYYY-MM-DD"
                type="date"
                max={new Date().toISOString().split("T")[0]}
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
              />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                placeholder="password"
                type="password"
              />
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                placeholder="confirm password"
                type="password"
              />
              {loading && (
                <p className="text-gray-500 text-xs md:text-sm mt-2 pb-2.5">
                  Fetching details...
                </p>
              )}

              {!loading && error && (
                <p className="text-red-500 text-xs md:text-sm mt-2 pb-2.5">
                  {error}
                </p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full mt-4">
              SIGNUP
            </button>

            <p className="text-sm md:text-[16px] text-slate-800 mt-3 text-center">
              Already have an account?{" "}
              <Link className="font-medium text-primary underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: easeOut, delay: 1, duration: 0.3 }}
          className="w-full md:hidden mt-6"
        >
          <img
            src={finlogin}
            alt="Login hero image"
            className="w-full"
          />
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;