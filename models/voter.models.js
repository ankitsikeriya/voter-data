import mongoose from "mongoose";
import bcrypt from "bcrypt";
const voterSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: { 
    type: String,
    unique: true
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  aadharCard: {
    type: Number,
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter"
  },
  isVoted: {
    type: Boolean,
    default: false
  }
},{timestamps:true}
);

voterSchema.pre('save',async function(next){
  const voter = this;
  //only hash the password if it has been modified (or is new)
  if (!voter.isModified('password'))return next();
  try {
      //generate a salt
      const salt = await bcrypt.genSalt(10);
      //hash the password using the salt
      const hashedPassword = await bcrypt.hash(voter.password, salt);
      //replace the plain text password with the hashed one
      voter.password = hashedPassword;
      next();
  } catch (error) {
      next(error);
  }
})
voterSchema.methods.comparePassword = async function(candidatePassword) {
  try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
  } catch (error) {
      throw new Error("Error comparing passwords");
  }
}
const Voter = mongoose.model("Voter", voterSchema);

export default Voter;
