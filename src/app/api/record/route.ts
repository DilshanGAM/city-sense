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
    //summary of records
    //get total records created between startingDate and endingDate
    //average temperature of records created between startingDate and endingDate
    //average humidity of records created between startingDate and endingDate
    //average noice of records created between startingDate and endingDate
    //highest temperature of records created between startingDate and endingDate
    //lowest temperature of records created between startingDate and endingDate
    //highest humidity of records created between startingDate and endingDate
    //lowest humidity of records created between startingDate and endingDate
    //highest noice of records created between startingDate and endingDate
    //lowest noice of records created between startingDate and endingDate

    
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
    let highestTemperature = 0;
    let highestHumidity = 0;
    let highestNoise = 0;
    let lowestTemperature = 999999;
    let lowestHumidity = 999999;
    let lowestNoise = 999999;
    let totalTemperature = 0;
    let totalHumidity = 0;
    let totalNoise = 0;
    for(let i = 0; i< records.length; i++) {
        totalTemperature += records[i].temperature;
        totalHumidity += records[i].humidity;
        totalNoise += records[i].noice;
        if(records[i].temperature > highestTemperature) {
            highestTemperature = records[i].temperature;        
        }
        if(records[i].humidity > highestHumidity) {
            highestHumidity = records[i].humidity;        
        }
        if(records[i].noice > highestNoise) {
            highestNoise = records[i].noice;        
        } 
        if(records[i].temperature < lowestTemperature) {
            lowestTemperature = records[i].temperature;        
        }
        if(records[i].humidity < lowestHumidity) {
            lowestHumidity = records[i].humidity;        
        }
        if(records[i].noice < lowestNoise) {
            lowestNoise = records[i].noice;        
        }
    }

    let averageTemperature = totalTemperature/records.length;
    let averageHumidity = totalHumidity/records.length;
    let averageNoise = totalNoise/records.length;
    const summary = {
        averageTemperature,
        highestTemperature,
        lowestTemperature,
        averageHumidity,
        highestHumidity,
        lowestHumidity,
        averageNoise,
        highestNoise,
        lowestNoise,
    }

    return NextResponse.json({ message: "Records found", records , summary }, { status: 200 });

}
