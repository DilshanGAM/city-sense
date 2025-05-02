import User from "@/models/users";
import { NextRequest , NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectMongo from "@/lib/connectDB";

export async function POST(request: NextRequest) {
    await connectMongo()
    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            email,
            password : passwordHash,
            firstName,
            lastName,
            phone,
        });
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}