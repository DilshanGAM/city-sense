import connectMongo from "@/lib/connectDB";
import Record from "@/models/records";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await connectMongo();
	const body = await request.json();
	try {
		const record = await Record.create(body);
		return new Response(JSON.stringify(record), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
        console.error(error);
		return new Response(JSON.stringify({ message: "Error creating record" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
