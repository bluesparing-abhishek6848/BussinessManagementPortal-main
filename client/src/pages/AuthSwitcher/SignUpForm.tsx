import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().length(10, "Phone number must be exactly 10 digits"), 
    password: z.string().min(3, "Minimum 3 characters"),
    confirmPassword: z.string(),
    role: z.enum([
      "admin",
      "branchManager",
      "collection-manager",
      "accountant",
    ]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpData = z.infer<typeof signUpSchema>;


const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpData) => {
    const { name, email, phone, password, role } = data;

    const userData = {
      name,
      email,
      phone: Number(phone),
      password,
      confirmPassword: password, 
      role,
    };

    
    localStorage.setItem("userData", JSON.stringify(userData));

    try {
      setIsLoading(true);
      setErrMsg(""); 

      const response = await fetch(`${baseUrl}/users/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
  
        reset(); 
      } else {
        
        setErrMsg(result.message || "Failed to sign up");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrMsg("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Create your account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Full name"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <input
          {...register("phone")}
          placeholder="Phone"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          maxLength={10}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}

        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </p>
        )}

        <select
          {...register("role")}
          className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="branchManager">Branch Manager</option>
          <option value="collection-manager">Collection Manager</option>
          <option value="accountant">Accountant</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs">{errors.role.message}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-md font-semibold hover:scale-[1.02] transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {errMsg && <p className="text-red-500 text-xs">{errMsg}</p>}
      </form>

      <div className="mt-6 text-center text-sm">
        <button  className="text-gray-600">
          Already have an account?{" "}
          <span className="underline text-blue-500 hover:text-blue-700 cursor-pointer">
            Sign In
          </span>
        </button>
      </div>
    </>
  );
};

export default SignUpForm;
