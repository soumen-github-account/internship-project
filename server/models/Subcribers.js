import mongoose from "mongoose";

const subsCriberSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true}
})

export const Subscriber = mongoose.model("Subscriber", subsCriberSchema);
