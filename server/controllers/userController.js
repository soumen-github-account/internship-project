import { Application } from "../models/Application.js";
import { Subscriber } from "../models/Subcribers.js";

export const getUser = async (req, res) => {
    res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const renderMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.render("userView/myApplications", {
      user: req.user,
      applications,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const subscribed = async(req, res) =>{
  try {
    const {email} = req.body;
    if(!email){
      return res.json({success: false , message:"Email is required."});
    }

    const sub = await Subscriber.findOne({email});
    if(sub){
      return res.json({success: false, message: "You have already subscribed.."});
    }

    await Subscriber.create({email});
    return res.json({success: true, message: "You are new subscriber."});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "failed" });
  }
}