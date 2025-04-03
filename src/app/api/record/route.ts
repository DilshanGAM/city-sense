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
