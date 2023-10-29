const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const NewsletterSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
});

NewsletterSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Newsletter", NewsletterSchema);
