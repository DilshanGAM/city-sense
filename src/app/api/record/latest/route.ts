import { NextRequest , NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import connectMongo from "@/lib/connectDB";
import Record from "@/models/records";

export async function GET(request: NextRequest) {
    await connectMongo()
    //get user from request header
    const user = request.headers.get("user")
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    //get latest record from db
    const record = await Record.findOne({}).sort({ createdAt: -1 }).limit(1);
    if (!record) {
        return NextResponse.json({ message: "No record found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Record found", record }, { status: 200 });
}