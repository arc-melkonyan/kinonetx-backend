import mongoose from 'mongoose';

const FilmSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    coutry: {
      type: String,
      required: true,
    },
    kp: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Film', FilmSchema);
