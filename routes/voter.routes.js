import express from 'express';
import Voter from './../models/voter.models.js';
import { jwtMiddleware,generateToken } from '../Auth/jwt.js';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config(); 
//multer for file upload
import multer from 'multer';
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // specify the destination directory
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });
// const upload = multer({ storage: storage });
//cloudinary for image upload
const upload = multer({ storage: multer.memoryStorage() });
import { v2 as cloudinary } from 'cloudinary';
    // Configuration
    cloudinary.config({ 
        cloud_name: 'dsxlnkggc', 
        api_key: '', 
        api_secret: '' // Click 'View API Keys' above to copy your API secret
    });
    
    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });

    // console.log(autoCropUrl);
// Route to register a new user
//with cloudinary
router.post('/register', upload.single('photo'), async (req, res) => {
    // The user's data (name, aadharCard, etc.) will be in req.body.
    const userData = req.body;
    
    // The uploaded file will be in req.file.
    const file = req.file;

    // Check if a file was uploaded
    if (!file) {
        return res.status(400).send("Please upload a photo.");
    }

    try {
        // Upload the file buffer to Cloudinary using the base64 data URI format
        const uploadResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
            folder: 'voter_photos' // Optional: create a dedicated folder in Cloudinary
        });

        // Add the secure URL of the uploaded photo to the user data
        // You will need to add a 'photo' field to your voterSchema for this to work.
        userData.photo = uploadResult.secure_url;

        const voter = new Voter(userData);
        await voter.save();

        // Generate JWT token
        const payload = { id: voter.id, role: voter.role };
        const token = await generateToken(payload);
        
        res.status(201).json({ voter, token, message: "User registered and photo uploaded successfully." });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).send("Error registering user or uploading photo.");
    }
});
//2nd method
// router.post('/register', upload.single('photo'), async (req, res) => {
//     // const { name, age, email, password } = req.body;
//     // alternative method
//    const userData=req.body;
//     try {
//         const voter = new Voter(userData);
//         await voter.save();
//         // res.status(201).send("User registered successfully");
//         //generating jwt token
//         //payload
//         const payload = {id: voter.id };
//         const token =await generateToken(payload);
//         console.log(token);
//         res.status(201).json({ voter, token });
//     } catch (error) {
//         res.status(400).send("Error registering user");
//     }
// })
//login route
router.post('/login',async(req,res)=>{
    const { aadharCard, password } = req.body;
    try {
        const voter = await Voter.findOne({ aadharCard });
        if (!voter) {
            return res.status(404).send("User not found");
        }
        if (voter.password !== password) {
            return res.status(401).send("Invalid credentials");
        }
        // Generate JWT token
        const payload = { id: voter.id };
        const token = await generateToken(payload);
        res.status(200).json({ voter, token });
    } catch (error) {
        res.status(500).send("Error logging in");
    } 
})
//user profile route 
router.get('/profile', jwtMiddleware, async (req, res) => {
    const voterData=req.voter;
    const voterId=voterData.id;
    const voter = await Voter.findById(voterId);
    res.json({ voter });
})
//used to get all users data
router.get('/users',async(req,res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users");   
    }
})    
//updating voter password details
router.put('/profile/password',async(req,res)=>{
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {   
        const voter = await Voter.findById(id);
        
        if (!voter) {
            return res.status(404).send("Voter not found");
        }
        const isMatch = await voter.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).send("Invalid current password");
        }   
        voter.password = newPassword;
        await voter.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).send("Error updating password");
    }
})
//deleting voter details
// router.delete('/delete/:email',async(req,res)=>{
//     const { email } = req.params;
//     try {
//         const user = await User.findOneAndDelete({ email });
//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//         res.json({ message: "User deleted successfully" });
//     } catch (error) {
//         res.status(500).send("Error deleting user"); 
//     }
// })
export default router;
