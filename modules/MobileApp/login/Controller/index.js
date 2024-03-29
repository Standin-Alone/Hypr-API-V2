// LOGIN CONTROLLER

const e = require("express");

const methods = {};

const sendOtp = (userId, res) => {
  let generateOtp = Math.random().toFixed(6).substr(`-6`);
  // initialize update options
  let updateOptions = {
    otp: generateOtp,
  };

  let email = "";
  // UPDATE TABLE
  UsersSchema.findByIdAndUpdate(
    userId.toString(),
    updateOptions,
    (updateError, updateResult) => {
      if (updateError) {
        console.warn(updateError);
        // error on update
        return res.send({
          status: false,
          message: "Something went wrong",
          error: updateError,
        });
      } else {
        let otpEmailPayload = {
          name: `${updateResult.first_name} ${updateResult.last_name}`,
          toEmail: updateResult.email,
          otp: generateOtp,
        };

        // UNCOMMENT WHEN THE NODEMAILER IS FIX
        ejs.renderFile(
          "./views/templates/otpEmail.ejs",
          otpEmailPayload,
          function (err, data) {
            let mailOptions = {
              from: "Quarta", // sender address
              to: otpEmailPayload.toEmail,
              subject: "Quarta One Time Password",
              html: data,
              attachments: [
                {
                  filename: "otp.jpeg",
                  path: `public/images/otp.jpeg`,
                  cid: "otp", //same cid value as in the html img src
                },
                {
                  filename: "hypr-logo-v2.png",
                  path: `public/images/quarta/quarta-logo-1.png`,
                  cid: "logo", //same cid value as in the html img src
                },
              ],
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.warn(error);
                return res.send({
                  status: false,
                  message: "Error sent.",
                });
              } else {
                return res.send({
                  status: true,
                  message: "Successfully send OTP to your email.",
                  userId: userId.toString(),
                  email: otpEmailPayload.toEmail,
                });
              }
            });
          }
        );

        //  return  res.send({
        //             status:true,
        //             message:'Successfully send OTP to your email.',
        //             userId:userId.toString(),
        //             email:otpEmailPayload.toEmail
        //         })
      }
    }
  );
};

// GOOGLE SIGN IN BUTTON
methods.getSignUpUsingGoogle = async (req, res) => {
  try {
    // INITIALIZE BODY
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;

    // PAYLOAD
    let payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      verified_date: new Date(),
    };

    let checkUserIfExists = await UsersSchema.findOne({ email: email });

    if (checkUserIfExists) {
      sendOtp(checkUserIfExists._id, res);
    } else {
      UsersSchema.create(payload, (userError, insertUserResult) => {
        if (userError) {
          // error create
          return res.send({
            status: false,
            message: "Something went wrong.",
            error: userError,
          });
        } else if (insertUserResult) {
          sendOtp(insertUserResult._id, res);
        }
      });
    }
  } catch (error) {
    // CATCH ERROR
    console.warn(error);
    return res.send({
      status: false,
      message: "Something went wrong",
      error: JSON.stringify(error),
    });
  }
};

// SIGN UP BUTTON
methods.getSignUp = async (req, res) => {
  try {
    // INITIALIZE BODY
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;
    let birthday = req.body.birthday;
    let age = req.body.age;
    let country = req.body.country;
    let country_name = req.body.country_name;
    let address = req.body.address;
    let username = req.body.username;
    let password = req.body.password;
    let encrypt_password = await bcrypt.hash(password, 8);
    let referral_code = req.body.referral_code;
    let referral_code_by_id = "";
    let referred_by_name = "";
    let user_refferal_code = "";

    // PAYLOAD
    let payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      birthday: birthday,
      age: age,
      country: country,
      country_name: country_name,
      address: address,
      username: username,
      password: encrypt_password,
      referral_code: referral_code,
      referral_code_by_id: referral_code_by_id,
      referred_by_name: referred_by_name,
      user_refferal_code: user_refferal_code,
      profile_image: "default-profile.png",
      cover_pic: "default-cover.png",
    };

    let checkUserIfExists = await UsersSchema.findOne({ email: email });
    let checkIfRefferalCodeExists = await UsersSchema.findOne({
      referral_code: referral_code,
    });

    if (checkUserIfExists) {
      return res.send({
        status: false,
        message: "Your Email already exists.",
      });
    } else {
      UsersSchema.create(payload, (userError, insertUserResult) => {
        if (userError) {
          // error create
          return res.send({
            status: false,
            message: "Something went wrong.",
            error: userError,
          });
        } else if (insertUserResult) {
          // success create
          let referralLink = `/hypr-mobile/social/referral/${insertUserResult._id}`;

          let setReferralLink = {
            $set: { referral_link: referralLink },
          };

          UsersSchema.findByIdAndUpdate(
            insertUserResult._id,
            setReferralLink,
            function (updateError, updateResult) {
              if (updateError) {
                console.warn(updateError);
                // error on update
                return res.send({
                  status: false,
                  message: "Something went wrong",
                  error: updateError,
                });
              } else {
                return res.send({
                  status: true,
                  message:
                    "Sucessfully created your account. Please check your email to  verify your account.",
                });Quarta
              }
            }
          );

          let verficationLink = `${process.env.DEV_URL}/hypr-mobile/user/verifyAccount/${insertUserResult._id}`;
          let fullName = `${first_name} ${last_name}`;

          // email payload
          let emailPayload = {
            name: fullName,
            toemail: email,
            url: verficationLink,
          };

          // SEND VERIFICATION EMAIL
          ejs.renderFile(
            "./views/templates/accountVerificationEmail.ejs",
            emailPayload,
            function (err, data) {
              // co
              // ready for email otp
              var mailOptions = {
                from: "Quarta", // sender address
                to: email,
                subject: "Quarta Verification  Email",
                html: data,
                attachments: [
                  {
                    filename: "otp.jpeg",
                    path: `public/images/verification.jpg`,
                    cid: "verification", //same cid value as in the html img src
                  },
                  {
                    filename: "hypr-logo-v2.png",
                    path: `public/images/quarta/quarta-logo-1.png`,
                    cid: "logo", //same cid value as in the html img src
                  },
                ],
              };
              transporter.sendMail(mailOptions, function (mailError, info) {
                if (mailError) {
                  console.log("Error: " + mailError);
                  console.warn("Email not sent");
                  return res.json({
                    status: false,
                    msg: "Email not sent",
                    code: "E110",
                  });
                } else {
                  // success create
                  return res.send({
                    status: true,
                    message:
                      "Sucessfully created your account. Please check your email to  verify your account.",
                  });
                }
              });
            }
          );
        }
      });
    }
  } catch (error) {
    // CATCH ERROR
    console.warn(error);
    return res.send({
      status: false,
      message: "Something went wrong",
      error: JSON.stringify(error),
    });
  }
};

// VERIFY ACCOUNT BUTTON (accountVerificationEmail.ejs)
methods.renderVerifyAccount = async (req, res) => {
  try {
    // initialize body
    let userId = req.params.userId;

    let checkUserId = await UsersSchema.findById(userId);

    // CHECK IF USER ID EXIST
    if (checkUserId) {
      // check if already verified
      if (checkUserId.verified_date) {
        res.render("./templates/alreadyVerified.ejs");
      } else {
        // initialize update options
        let updateOptions = {
          verified_date: Date.now(),
        };

        // UPDATE TABLE
        UsersSchema.findByIdAndUpdate(
          userId,
          updateOptions,
          (updateError, updateResult) => {
            if (updateError) {
              console.warn(updateError);
              // error on update
              return res.send({
                status: false,
                message: "Something went wrong",
                error: updateError,
              });
            } else {
              // success on update
              return res.render("./templates/verified.ejs");
            }
          }
        );
      }
    } else {
      return res.send({
        status: false,
        message: "User Cannot be found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.render("./error.ejs", {
      message: "ERROR! PAGE NOT FOUND",
      status: 404,
      stack: false,
    });
  }
};

// SIGN IN BUTTON
methods.getSignIn = async (req, res) => {
  try {
    // initialize body
    let username = req.body.username;
    let password = req.body.password;

    let checkUserIfExists = await UsersSchema.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (checkUserIfExists) {
      let decryptPassword = await bcrypt.compare(
        password,
        checkUserIfExists.password
      );

      if (checkUserIfExists.verified_date) {
        if (decryptPassword) {
          sendOtp(checkUserIfExists._id, res);
        } else {
          res.send({
            status: false,
            message: "Incorrect email or password.",
          });
        }
      } else {
        let verficationLink = `${process.env.DEV_URL}/hypr-mobile/user/verifyAccount/${checkUserIfExists._id}`;
        let fullName = `${checkUserIfExists.first_name} ${checkUserIfExists.last_name}`;

        // email payload
        let emailPayload = {
          name: fullName,
          toemail: checkUserIfExists.email,
          url: verficationLink,
        };

        // SEND VERIFICATION EMAIL
        ejs.renderFile(
          "./views/templates/accountVerificationEmail.ejs",
          emailPayload,
          function (err, data) {
            // co
            // ready for email verification
            var mailOptions = {
              from: "Quarta", // sender address
              to: checkUserIfExists.email,
              subject: "Quarta Verification  Email",
              html: data,
              attachments: [
                {
                  filename: "otp.jpeg",
                  path: `public/images/verification.jpg`,
                  cid: "verification", //same cid value as in the html img src
                },
                {
                  filename: "hypr-logo-v2.png",
                  path: `public/images/quarta/quarta-logo-1.png`,
                  cid: "logo", //same cid value as in the html img src
                },
              ],
            };
            transporter.sendMail(mailOptions, function (mailError, info) {
              if (mailError) {
                console.log("Error: " + mailError);
                console.warn("Email not sent");
                res.json({
                  status: false,
                  msg: "Email not sent",
                  code: "E110",
                });
              } else {
                // success create
                res.send({
                  status: false,
                  message: "Please check your email to verify your account.",
                });
              }
            });
          }
        );
      }
    } else {
      res.send({
        status: false,
        message: "Username or email not found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// VERIFY OTP BUTTON
methods.getVeriyfyOtp = async (req, res) => {
  try {
    // initialize body
    let userId = req.body.userId;
    let otp = req.body.otp;

    let checkUserId = await UsersSchema.findById(userId);

    if (checkUserId) {
      if (checkUserId.otp == otp) {
        res.send({
          status: true,
          message: "Your otp is correct.",
        });
      } else {
        // error
        res.send({
          status: false,
          message: "Incorrect OTP.",
        });
      }
    } else {
      res.send({
        status: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};


// CHECK EMAIL BUTTON
methods.checkEmail = async (req, res) => {
  try {
    // initialize body
    let email = req.query.email;    
    console.warn(req.query);
    let checkUser = await UsersSchema.findOne({email:email});

    if (checkUser) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};


// GET USER INFO
methods.getUserInfo = async (req, res) => {
  try {
    // initialize body
    let userId = req.body.userId;

    let checkUserId = await UsersSchema.findById(userId).lean();
    if (checkUserId) {
      let countPals = await TeamsSchema.countDocuments({
        $or: [{ recruited_id: userId }, { recruiter_id: userId }],
      });
      checkUserId.totalPals = countPals;

      return res.send({
        status: true,
        message: "User info has been found.",
        data: checkUserId,
      });
    } else {
      return res.send({
        status: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    console.warn(error);
    return res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// RESEND OTP
methods.resendOtp = async (req, res) => {
  try {
    // initialize body
    let userId = req.body.userId;

    let checkUserId = await UsersSchema.findById(userId);

    if (checkUserId) {
      return sendOtp(userId, res);
    } else {
      return res.send({
        status: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    console.warn(error);
    return res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// CHANGE PROFILE PICTURE AND COVER PHOTO
methods.changeProfilePicture = async (req, res) => {
  try {
    // initialize body
    let userId = req.body.userId;
    let imageInfo = req.body.imageInfo;
    let changeImageType = req.body.changeImageType;

    let checkUserId = await UsersSchema.findById(userId);

    let countErrorUploads = 0;
    if (checkUserId) {
      // upload image

      let fileBuffer = Buffer.from(imageInfo.data, "base64");
      console.warn(imageInfo.data);

      if (changeImageType == "profile") {
        fs.writeFile(
          `./uploads/profile_pictures//${imageInfo.filename}`,
          fileBuffer,
          function (err) {
            if (err) {
              countErrorUploads++;
            }
          }
        );
      } else {
        fs.writeFile(
          `./uploads/covers//${imageInfo.filename}`,
          fileBuffer,
          function (err) {
            if (err) {
              countErrorUploads++;
            }
          }
        );
      }

      if (countErrorUploads == 0) {
        let profileUpdatePayload = {
          $set: {
            profile_image: imageInfo.filename,
          },
        };

        let coverUpdatePayload = {
          $set: {
            cover_pic: imageInfo.filename,
          },
        };

        UsersSchema.findByIdAndUpdate(
          userId,
          changeImageType == "profile"
            ? profileUpdatePayload
            : coverUpdatePayload,
          { new: true },
          function (updateError, updateResult) {
            if (updateError) {
              console.warn(updateError);
              // error on update
              return res.send({
                status: false,
                message: "Something went wrong",
                error: updateError,
              });
            } else {
              let updatePostsUserPicture = {
                $set: {
                  user_picture: imageInfo.filename,
                },
              };

              if (changeImageType == "profile") {
                SocialPostSchema.updateMany(
                  { user_id: userId },
                  updatePostsUserPicture,
                  { new: true },
                  function (updatePostUserPictureError, updatePostUserPicture) {
                    if (updatePostUserPictureError) {
                      // error on update
                      return res.send({
                        status: false,
                        message: "Something went wrong",
                        error: updateError,
                      });
                    } else {
                      return res.send({
                        status: true,
                        message: "Successfully updated your profile picture",
                      });
                    }
                  }
                );
              } else {
                return res.send({
                  status: true,
                  message: "Successfully updated your cover picture",
                });
              }
            }
          }
        );
      } else {
        return res.send({
          status: false,
          message: "Failed to upload.",
        });
      }
    } else {
      return res.send({
        status: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    console.warn(error);
    return res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// SEND FORGOT PASSWORD LINK
methods.sendForgotPasswordLink = async (req, res) => {
  try {
    // initialize body
    let email = req.body.email;

    let checkUser = await UsersSchema.findOne({ email: email });

    if (checkUser) {
      let emailPayload = {
        url: `${process.env.DEV_URL}/hypr-mobile/user/forgot-password/${checkUser._id}`,
        name: `${checkUser.first_name} ${checkUser.last_name}`,
      };

      let updatePayload = {
        $set: {
          is_forgot_password: 1,
        },
      };
      UsersSchema.findOneAndUpdate(
        { _id: checkUser._id },
        updatePayload,
        function (errorUpdate, successUpdate) {
          if (errorUpdate) {
            return res.send({
              status: false,
              message: "Something went wrong.",
            });
          } else {
            // SEND FORGOT PASSWORD EMAIL
            ejs.renderFile(
              "./views/templates/forgotPasswordEmail.ejs",
              emailPayload,
              function (err, data) {
                // co
                // ready for email verification
                var mailOptions = {
                  from: "Quarta", // sender address
                  to: email,
                  subject: "Quarta Reset Password",
                  html: data,
                  attachments: [
                    {
                      filename: "reset-password.jpg",
                      path: `public/images/reset-password.jpg`,
                      cid: "resetPassword", //same cid value as in the html img src
                    },
                    {
                      filename: "hypr-logo-v2.png",
                      path: `public/images/quarta/quarta-logo-1.png`,
                      cid: "logo", //same cid value as in the html img src
                    },
                  ],
                };
                transporter.sendMail(mailOptions, function (mailError, info) {
                  if (mailError) {
                    console.log("Error: " + mailError);
                    console.warn("Email not sent");
                    res.json({
                      status: false,
                      msg: "Email not sent",
                      code: "E110",
                    });
                  } else {
                    // success create
                    res.send({
                      status: true,
                      message:
                        "Successfully sent reset password link to your email.",
                    });
                  }
                });
              }
            );
          }
        }
      );
    } else {
      return res.send({
        status: false,
        message: "Email not found.",
      });
    }
  } catch (error) {
    console.warn(error);
    return res.send({
      status: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

// CHANGE PASSWORD BUTTON (resetPassword.ejs)
methods.renderForgotPassword = async (req, res) => {
  try {
    // initialize body
    let userId = req.params.userId;
    let checkUserId = await UsersSchema.findById(userId);

    // CHECK IF USER ID EXIST
    if (checkUserId) {
      if (checkUserId.is_forgot_password == 1) {
        return res.render("./templates/resetPassword.ejs", { userId: userId });
      } else {
        return res.render("./error.ejs", {
          message: "ERROR! PAGE NOT FOUND",
          status: 404,
          stack: false,
        });
      }
    } else {
      return res.send({
        status: false,
        message: "User Cannot be found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.render("./error.ejs", {
      message: "ERROR! PAGE NOT FOUND",
      status: 404,
      stack: false,
    });
  }
};

//CHANGE PASSWORD OF ACCOUNT
methods.changePassword = async (req, res) => {
  try {
    // initialize body
    let userId = req.body.userId;
    let newPassword = req.body.password;
    let encrypt_new_password = await bcrypt.hash(newPassword, 8);
    let checkUserId = await UsersSchema.findById(userId);

    // CHECK IF USER ID EXIST
    if (checkUserId) {
      // initialize update options
      let updateOptions = {
        password: encrypt_new_password,
        is_forgot_password: 0,
      };

      // UPDATE TABLE
      UsersSchema.findByIdAndUpdate(
        userId,
        updateOptions,
        (updateError, updateResult) => {
          if (updateError) {
            console.warn(updateError);
            // error on update
            return res.send({
              status: false,
              message: "Something went wrong",
              error: updateError,
            });
          } else {
            // success on update
            return res.send({
              status: true,
              message: "Successfully Change Password",
              link: "/hypr-mobile/user/success-change-password",
            });
          }
        }
      );
    } else {
      return res.send({
        status: false,
        message: "User Cannot be found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.render("./error.ejs", {
      message: "ERROR! PAGE NOT FOUND",
      status: 404,
      stack: false,
    });
  }
};

methods.successChangePassword = async (req, res) => {
  try {
    // initialize body
    return res.render("./templates/change_password_success.ejs");
  } catch (error) {
    console.log(error);
    return res.render("./error.ejs", {
      message: "ERROR! PAGE NOT FOUND",
      status: 404,
      stack: false,
    });
  }
};

methods.changeProfileInfo = async (req, res) => {
  try {
    // initialize body
    let userId = req.body.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let birthday = req.body.birthday;
    let email = req.body.email;
    let contact = req.body.contact;
    let age = req.body.age;

    console.warn(req.body);
    let payload = {
      $set: {
        first_name: firstName,
        last_name: lastName,
        birthday: birthday,
        email: email,
        phone: contact,
        age: age,
      },
    };
    let checkUser = await UsersSchema.findById(userId);
    if (checkUser) {
      UsersSchema.findByIdAndUpdate(userId, payload, (error, updateResult) => {
        if (error) {
          return res.status(500).send({
            status: false,
            message: "Something went wrong.",
            error: error,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "Succesfully updated your info.",
          });
        }
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "This use cannot be found.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = methods;
