import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req,res)=> {
       // get user details from frontend
       // validation - notEmpty
       // check if user already exists: username, email
       // check for images, check for avatar
       // upload images to cloudinary, avatar
       // create user object - create entry in db
       // remove password and refresh token from response
       // check for user creation
       // return response

       const {username, email, fullName, password} = req.body;
       console.log(username, email, fullName, password);

       if([username,email,fullName,password].some((field) => field?.trim() === '')){
              throw new ApiError(400, 'All fields are required');
       }
       if (password.length < 6) {
              throw new ApiError(400, 'Password must be at least 6 characters long');
       }
       if (email.indexOf('@') === -1) {
              throw new ApiError(400, 'Invalid email address');
       }
       
       const existedUser = User.findOne({$or: [{ username }, {email}]})

       if(existedUser){
              throw new ApiError(409, 'User already exists');
       }

       const avatarLocalPath = req.files?.avatar[0]?.path;
       const coverImageLocalPath = req.files?.coverImage[0]?.path;

       if(!avatarLocalPath){
              throw new ApiError(400, 'Avatar is required');
       }

       if(!coverImageLocalPath){
              throw new ApiError(400, 'Cover image is required');
       }

       const avatar = await uploadOnCloudinary(avatarLocalPath);
       const coverImage = await uploadOnCloudinary(coverImageLocalPath);

       if(!avatar){
              throw new ApiError(400, 'Avatar is required');
       }

       if(!coverImage){
              throw new ApiError(400, 'Cover image is required');
       }

       const user = await User.create({
              fullName,
              avatar: avatar.url,
              coverImage: coverImage?.url || '',
              username: username.toLowerCase(),
              email,
              password
       })

       const createdUser = await User.findById(user._id).select('-password -refreshToken');

       if(!createdUser){
              throw new ApiError(500, 'User could not be created');
       }

       return res.status(201).json(new ApiResponse(201, 'User created', createdUser));

})

export {registerUser};