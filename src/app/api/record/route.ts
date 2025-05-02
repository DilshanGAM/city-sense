export const dynamic = "force-dynamic";
import connectMongo from "@/lib/connectDB";
import Record from "@/models/records";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectMongo();
	const body = await request.json();
	try {
		const record = await Record.create(body);
		return NextResponse.json(
            { message: "Record created", record },
            { status: 201 }
        );
	} catch (error) {
        console.log(error);
		return NextResponse.json(
            { message: "Error creating record" },
            { status: 500 }
        );
	}
}
export async function GET(request: NextRequest) {
    await connectMongo()
    //get user from request header
    const user = request.headers.get("user")
    // if (!user) {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }
    const startingDate = request.nextUrl.searchParams.get("startingDate")
    const endingDate = request.nextUrl.searchParams.get("endingDate")
    //check if startingDate and endingDate are present and startingDate is less than endingDate and duration between them are less that 30 days
    if (startingDate && endingDate) {
        const startDate = new Date(startingDate)
        const endDate = new Date(endingDate)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // days
        if (diffDays > 30) {
            return NextResponse.json({ message: "Duration between starting date and ending date should be less than 30 days" }, { status: 400 });
        }
    }
    //get records created between startingDate and endingDate
    const records = await Record.find({
        createdAt: {
            $gte: startingDate ? new Date(startingDate) : new Date("2023-01-01"),
            $lte: endingDate ? new Date(endingDate) : new Date(),
        },
    }).sort({ createdAt: -1 });
    if (!records) {
        return NextResponse.json({ message: "No records found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Records found", records }, { status: 200 });

}
