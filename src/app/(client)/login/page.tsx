"use client";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		axios.post("/api/auth/login", {
			email,
			password,
		}).then((res) => {
			console.log(res.data);
			localStorage.setItem("token", res.data.token);
			toast.success("Login successful");
			//router.push("/");
		}).catch((err) => {
			console.log(err.response.data);
			if (err.response.status === 401) {
				toast.error("Invalid password or account is not active");
			} else if (err.response.status === 404) {
				toast.error("User not found");
			} else {
				toast.error("Error logging in");
			}
		}).finally(() => {
			setIsLoading(false);
		});
	}
	return (
		<div className="w-full h-screen flex lg:flex-row flex-col bg-[url('/login.png')] bg-cover bg-no-repeat bg-center lg:justify-center items-center  overflow-hidden">
			<div className="w-[50%] lg:h-[600px] flex flex-col p-[20px] lg:justify-center items-center relative lg:p-[1px] rounded-xl overflow-hidden">
				<TypingAnimation className="text-center w-full text-[20px] lg:text-[40px] text-accent-base h-[50px]">
					Be Ready! Be You!
				</TypingAnimation>
				<div className="w-[400px] h-[200px] flex justify-center items-center lg:h-[400px]  relative">
					<div className="w-full h-full absolute rounded-full   rotate-x-[70deg] rotate-y-[-30deg] flex justify-center items-center">
						<div className="w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] rounded-full border-t-[15px] border-t-white animate-spin"></div>
					</div>
					<Image
						src="/logo.png"
						alt="login"
						width={400}
						height={400}
						className="  object-cover rounded-xl hidden lg:block"
					/>
					<Image
						src="/logo.png"
						alt="login"
						width={400}
						height={400}
						className="  object-cover rounded-xl lg:hidden"
					/>
				</div>
			</div>
			<div className=" w-[300px] lg:w-[50%]  lg:h-[600px] flex justify-center items-center relative p-[1px] rounded-xl overflow-hidden">
				<form onSubmit={handleLogin}>
					<div className="w-[300px] lg:w-[450px] h-[350px] lg:h-[450px] relative backdrop-blur-2xl rounded-2xl p-[20px] flex flex-col justify-around">
						<BorderBeam size={400} colorFrom="#9bcf46" colorTo="#4c854e" />
						<h1 className="text-center hidden lg:block text-[30px] text-accent-base font-bold">
							Login
						</h1>
						<div>
							<Input
								type="email"
								placeholder="Email"
								className="w-full h-[50px] mt-[20px] bg-transparent border-b-2 border-accent-base focus:outline-none focus:border-accent-base placeholder:text-accent-base"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								type="password"
								placeholder="Password"
								className="w-full h-[50px] mt-[20px] bg-transparent border-b-2 border-accent-base focus:outline-none focus:border-accent-base placeholder:text-accent-base"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div>
							<Button
								type="submit"
								className="w-full h-[50px] bg-accent-base text-white font-bold hover:bg-accent-base/80 transition-all duration-300"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="w-[20px] h-[20px] border-4 border-t-transparent border-white rounded-full animate-spin"></div>
								) : (
									"Login"
								)}
							</Button>
							<p className="text-center text-[15px] mt-[20px]">
								Don't have an account?{" "}
								<Link
									href={"/register"}
									className="text-white lg:text-accent-base cursor-pointer"
								>
									Sign Up
								</Link>
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
