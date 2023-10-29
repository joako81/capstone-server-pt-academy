const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const CourseSchema = mongoose.Schema({
  title: String,
  miniature: String,
  description: String,
  url: String,
  price: Number,
  score: Number,
  status: String,
  active: Boolean,
  created_at: Date,
});

CourseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Course", CourseSchema);
