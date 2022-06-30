module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // https://javascript.plainenglish.io/developer-story-db-migrations-mongodb-edition-7b36db8f2654
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    db.createCollection("t_api_products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "pid",
            "product_information",
            "page_number",
            "category_name",
            "product_name",
            "price",
            "product_add_price",
            "cache_key",
            "shop",
          ],
          properties: {
            pid: {
              bsonType: "string",
            },
            product_information: {
              bsonType: "object",
            },
            page_number: {
              bsonType: "string",
            },
            category_name: {
              bsonType: "string",
            },
            product_name: {
              bsonType: "string",
            },
            product_sku: {
              bsonType: "string",
            },
            price: {
              bsonType: "string",
            },
            product_add_price: {
              bsonType: "string",
            },
            cache_key: {
              bsonType: "string",
            },
            shop: {
              bsonType: "string",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });
    // TODO learn tags and weight when creating index
    return await db
      .collection("t_api_products")
      .createIndex({
        product_name: "text",
        category_name: "text",
        product_sku: "text",
      });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return await db.collection("t_api_products").drop();
  },
};
