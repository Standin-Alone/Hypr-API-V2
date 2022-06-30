module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    db.createCollection("t_rewards", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["order_id", "user_id", "reward_balance", "reward_status", "date_created"],
          properties: {
            order_id: {
              bsonType: "string",
            },
            user_id: {
              bsonType: "string",
            },
            reward_balance: {
              bsonType: "double",
            },
            reward_status: {
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
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return await db.collection("t_rewards").drop();
  }
};
