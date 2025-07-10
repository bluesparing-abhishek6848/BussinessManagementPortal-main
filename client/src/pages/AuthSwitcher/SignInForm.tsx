import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import usePost from "../../Hooks/usePost";
import { UserPlus } from 'lucide-react';
import { loginSuccess } from "../../store/authSlice";
import type { IUser } from "../../types";
import { mapUserRoute } from "../../Constant";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Seo from "../../components/Seo/Seo";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

type SignInData = z.infer<typeof signInSchema>;


const SignInForm = () => {
  const dispatch = useDispatch();
  const { postData, isLoading, data: loginData, error } = usePost<any, SignInData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const navigate = useNavigate();


  useEffect(() => {
    console
.log("Login Data:", loginData);

    
    if (loginData && loginData.data) {
      const user = loginData.data.user as IUser;
      dispatch(loginSuccess({ user }));
      const modifiedRole = mapUserRoute(user.role);
      
      navigate(modifiedRole || "/");
    } else {
      toast.error(error)
    }
  }, [loginData, error])

  const onSubmit = async (data: SignInData) => {
    await postData(data, "users/login");
  };

  return (
    <>
       <Seo
        title="Login | Aapka Future"
        description="Sign in to access your Aapka Future dashboard and manage your loan operations."
      />
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center pb-5 border-b">
        Sign In
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <p className="mb-3 mt-5">Email</p>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
        <p className="mb-3 mt-5">Password</p>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 mt-5 bg-gradient-to-r from-blue-200 to-purple-200 rounded-md font-semibold hover:scale-[1.02] transition cursor-pointer"
        >
          {isLoading ? (
            "Signing In..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign In <UserPlus className="h-5 w-5 text-gray-800" />
            </span>
          )}
        </button>
      </form>


    </>
  );
};

export default SignInForm;
