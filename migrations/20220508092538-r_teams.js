module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    const query = db.createCollection("r_teams", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["recruiter_id", "recruited_id", "date_created"],
          properties: {
            recruiter_id: {
              bsonType: "string",
            },
            recruited_id: {
              bsonType: "string",
            },
            date_created: {
              bsonType: "date",
            },
            date_updated: {
              bsonType: "string",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    // Example Data
    // const now = new Date();
    // const query = db.collection("r_teams").insertMany([
    //   {
    //     recruiter_id: "6283d975bed7091e282760e1",
    //     recruited_id: "6283d975bed7091e282760df",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e1",
    //     recruited_id: "6283d975bed7091e282760e0",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e2",
    //     recruited_id: "6283d975bed7091e282760e1",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e3",
    //     recruited_id: "6283d975bed7091e282760e2",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e4",
    //     recruited_id: "6283d975bed7091e282760e3",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e5",
    //     recruited_id: "6283d975bed7091e282760e4",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e6",
    //     recruited_id: "6283d975bed7091e282760e5",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    //   {
    //     recruiter_id: "6283d975bed7091e282760e0",
    //     recruited_id: "6283d975bed7091e282760e6",
    //     date_created: now.toISOString(),
    //     date_updated: "",
    //   },
    // ]);

    return await query;
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return await db.collection("r_teams").drop();
  },
};
