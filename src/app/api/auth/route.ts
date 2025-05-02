import { NextRequest , NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const user = request.headers.get("user");
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userObj = JSON.parse(user);
    
    return NextResponse.json({ message: "Authorized" , user: userObj }, { status: 200 });
}