"use client";
import Loader from "@/components/custom/loader";
import axios from "axios";
import { SquareMenu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");
			if (token) {
				axios
					.get("/api/auth", {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
					.then((res) => {
						setUser(res.data.user);
						setLoading(false);
					})
					.catch((err) => {
						console.log(err);
						setLoading(false);
					});
			}else{
				setLoading(false);
			}
		}
	}, []);
	return (
		<div className="w-full h-screen">
			<header className="w-full h-[80px] bg-white shadow-md flex justify-between items-center px-4 realative">
				<Link href="/" className="flex items-center cursor-pointer z-[50]">
					<img
						src="/logo.png"
						alt="logo"
						className="w-[80px] h-[80px] rounded-full"
					/>
					<h1 className="text-xl text-accent-base font-bold">City Sense</h1>
				</Link>
				<div className="hidden lg:flex w-full items-center justify-center gap-4 absolute">
					<Link href="/" className="text-lg">
						Home
					</Link>
					<Link href="/about" className="text-lg">
						About
					</Link>
					{user ? (
						<button
							onClick={() => {
								localStorage.removeItem("token");
								router.push("/login");
							}}
							className="text-lg"
						>
							Logout
						</button>
					) : (
						<Link href="/login" className="text-lg">
							Login
						</Link>
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger className="relative lg:hidden">
						<SquareMenu className=" text-accent-base" />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						
							<DropdownMenuItem>
								<Link href="/" className="text-md">
									Home
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/about" className="text-md">
									About
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								{user ? (
									<button
										onClick={() => {
											localStorage.removeItem("token");
											router.push("/login");
										}}
										className="text-md"
									>
										Logout
									</button>
								) : (
									<Link href="/login" className="text-md">
										Login
									</Link>
								)}
							</DropdownMenuItem>
					
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
			<div className="w-full h-[calc(100vh-80px)] ">
				{loading ? <Loader /> : children}
			</div>
		</div>
	);
}
