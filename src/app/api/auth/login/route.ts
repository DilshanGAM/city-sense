import { NextRequest , NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import connectMongo from "@/lib/connectDB";
import User from "@/models/users";
import bcrypt from "bcrypt";
import * as jose from "jose";

export async function POST(request: NextRequest) {
    await connectMongo()
    const body = await request.json();
    const { email, password } = body;
    const user = await User.findOne({
        email,
    });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }else {
        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
        };
        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("48h")
            .sign(new TextEncoder().encode(process.env.JOSE_SECRET));
        return NextResponse.json(
            { message: "Login successful", token, user: payload },
            { status: 200 }
        );
    }
}