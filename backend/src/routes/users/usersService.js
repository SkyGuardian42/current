import User from '../../models/User';
import config from '../../config'
import { sendEmailVerification } from '../../services/sendMail';
import validator from 'validator';

export async function getUsers() {
  let users = await User.find();
  return users.map(({isAdmin, emailVerified, _id, email, username, createdAt}) => ({
    isAdmin,
    emailVerified,
    _id, 
    email,
    username,
    createdAt
  }));
}

export async function getUser(usernameOrEmail) {
  if(validator.isEmail(usernameOrEmail)) {
    
  }
}

export async function findUserByEmail(email) {
  try {
    let user = await User.findOne({email: email}).exec();
    
    if(!user && email === config.admin.email) {
      let adminUser = new User();
      adminUser.username = config.admin.username;
      adminUser.email = config.admin.email;
      adminUser.isAdmin = true;
      adminUser.password = config.admin.password; 
      user = await adminUser.save();
    }

    return user;
  } catch (e) {
    console.error(e);
    return;
  }
}


export async function createUser(username, email, password) {
  let newUser = new User();
  newUser.email = email;
  newUser.username = username;
  newUser.password = password;
  const createdUser = await newUser.save();
  sendEmailVerification(createdUser);
  return createdUser;
}

export async function deleteUser(_id) {
  return User.deleteOne({_id: _id});
}

export async function verifyUserEmail(emailVerificationToken) {
  const user = await User.findOne({
    emailVerificationToken: emailVerificationToken
  });

  if(!user)
    throw new Error('verification token not recognized');

  if(user.emailVerified)
    throw new Error('Email already verified');

  user.emailVerified = true;
  user.emailVerificationToken = undefined;

  return await user.save();
}

export async function changePassword(userId, newPassword) {
  if(!userId || !newPassword)
    throw new Error('Missing userId or Password');

  return User.findOneAndUpdate(
    { _id: userId },
    {
      password: newPassword
    },
    { runValidators: true, context: 'query' }
  );
}