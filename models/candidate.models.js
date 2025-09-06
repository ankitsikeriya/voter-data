import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  votes: [
    {
      voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voter",
        required: true
      },
      vote: {
        type: Boolean,
        required: true
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  voteCount: {
    type: Number,
    default: 0
  },
},
{ timestamps: true });

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
