module.exports = {
  async up(db, client) {
    const _ = require('lodash');
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // https://javascript.plainenglish.io/developer-story-db-migrations-mongodb-edition-7b36db8f2654
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    db.createCollection(
      "r_rewards",
      {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "percent", "date_created"],
            properties: {
              name: {
                bsonType: "string",
              },
              percent: {
                bsonType: "string",
              },
              date_created: {
                bsonType: "date",
              },
              date_updated: {
                bsonType: "date",
              },
            },
          },
        },
        validationLevel: "strict",
        validationAction: "error",
      },
      {
        timestamps: true,
      }
    );
    const now = new Date();
    const query = db.collection("r_rewards").insertMany([
      {
        name: "Buyer",
        percent: "20",
        date_created: now,
      },
      {
        name: "Recruiter",
        percent: "20",
        date_created: now,
      },
      {
        name: "Recruiter Upline",
        percent: "40",
        date_created: now,
      },
      {
        name: "Hypr",
        percent: "20",
        date_created: now,
      },
      {
        name: "Reverse Day",
        percent: "1",
        date_created: now,
      },
    ]);

    return await query;
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return await db.collection("r_rewards").drop();
  },
};
