import mongoose from 'mongoose';

const BookmarkSchem = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    film_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Film',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Bookmark', BookmarkSchem);
