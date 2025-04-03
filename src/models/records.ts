import { model, models, Schema } from "mongoose";

export interface IRecord {
	position: String;
	temperature: Number;
	humidity: Number;
	noice: Number;
	time: String;
}
const RecordSchema = new Schema<IRecord>(
	{
		position: String,
		temperature: Number,
		humidity: Number,
		noice: Number,
		time: {
            type: Date,
            default: Date.now
        },
	},
	{
		timestamps: true,
		toJSON: {
			versionKey: false,
			virtuals: true,
			transform: (_, ret) => {
				delete ret._id;
			},
		},
	}
);
const Record = models.Record || model("Records", RecordSchema);
export default Record;
