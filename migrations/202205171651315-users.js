module.exports = {
  async up(db, client) {
    // reward = "current reward"
    db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["reward", "firstname", "lastname", "role"],
          properties: {
            reward: {
              bsonType: "double"
            },
            profile_image: {
              bsonType: "string",
            },
            firstname: {
              bsonType: "string",
            },
            lastname: {
              bsonType: "string",
            },
            role: {
              bsonType: "string",
            },
            email: {
              bsonType: "string",
            },
            phone_number: {
              bsonType: "string",
            },
            birthday: {
              bsonType: "string",
            },
            country: {
              bsonType: "string",
            },
            country_name: {
              bsonType: "string",
            },
            address: {
              bsonType: "string",
            },
            shipping_address: {
              bsonType: "string",
            },
            area: {
              bsonType: "string",
            },
            city: {
              bsonType: "string",
            },
            landmark: {
              bsonType: "string",
            },
            pincode: {
              bsonType: "int",
            },
            state: {
              bsonType: "string",
            },
            about: {
              bsonType: "string",
            },
            username: {
              bsonType: "string",
            },
            password: {
              bsonType: "string",
            },
            otp: {
              bsonType: "int",
            },
            referral_link: {
              bsonType: "string",
            },
            referral_user_id: {
              bsonType: "string",
            },
            access_token: {
              bsonType: "string",
            },
            signupType: {
              bsonType: "string",
            },
            startDate: {
              bsonType: "string",
            },
            verified_date: {
              bsonType: "date",
            },
            date_created: {
              bsonType: "date",
            },
            date_updated: {
              bsonType: "date",
            },
            status: {
              bsonType: "int",
           },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    const now = new Date();
    const query = db.collection("users").insertMany([
      {
        reward: 2.8,
        firstname: "niño",
        lastname: "gunda",
        role: "ceo",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.8,
        firstname: "edcel",
        lastname: "zenarosa",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.2,
        firstname: "farjan",
        lastname: "dechali",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.4,
        firstname: "niranjan",
        lastname: "bujisat",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 5.6,
        firstname: "atom",
        lastname: "macalla",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 4.8,
        firstname: "rodel",
        lastname: "duterte",
        role: "employee",
        date_created: now,
        status: 1,
      },
      {
        reward: 4.6,
        firstname: "yessiwi",
        lastname: "bussiwi",
        role: "employee",
        date_created: now,
        status: 1,
      },
    ]);

    return await query;
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    return await db.collection("users").drop();
  }
};
// {
      //   reward: 3.8,
      //   name: "papa john",
      //   role: "member",
      //   date_created: now.toISOString(),
      //   date_updated: "",
      // },
      // {
      //   reward: 2.8,
      //   name: "barjahul",
      //   role: "member",
      //   date_created: now.toISOString(),
      //   date_updated: "",
      // },
      // {
      //   reward: 4.3,
      //   name: "shilea",
      //   role: "member",
      //   date_created: now.toISOString(),
      //   date_updated: "",
      // },