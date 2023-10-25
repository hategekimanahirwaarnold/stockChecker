const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const stockSchema = new mongoose.Schema({
    likes: {
        type: [String],
        default: []
    },
    name: {
        type: String, 
        required: true,
    }
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
