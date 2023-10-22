import FilmModel from '../models/Film.js';
import BookmarkModel from '../models/Bookmark.js';

export async function getAll(req, res) {
  try {
    const { page, limit, search } = req.query;
    if (!page || !limit) {
      throw new Error();
    }

    const db_filter = { title: { $regex: search ? search : '', $options: 'i' } };
    const data = await FilmModel.find(db_filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await FilmModel.countDocuments(db_filter);
    const pages = Math.ceil(count / limit);

    res.status(200).json({ data, pages });
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      message: 'Ошибка при получение фильмов',
    });
  }
}

export async function getById(req, res) {
  try {
    const id = req.params.id;
    const film = await FilmModel.findById(id);
    let data = film;

    if (!film) {
      throw new Error();
    }

    if (req.user_id) {
      const saved = !!(await BookmarkModel.findOne({ user_id: req.user_id, film_id: film._id }));
      data = { ...film._doc, saved };
    }

    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ошибка при получении фильма',
    });
  }
}

export async function saveFilm(req, res) {
  try {
    const user_id = req.user_id;
    const { film_id } = req.body;

    const bookmark = await BookmarkModel.findOne({ user_id, film_id });

    if (!bookmark) {
      await BookmarkModel.create({
        user_id,
        film_id,
      });
    } else {
      await BookmarkModel.deleteOne({ user_id, film_id });
    }

    res.status(200).json({
      status: !bookmark,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

export async function getBookmarks(req, res) {
  try {
    const user_id = req.user_id;
    const { page, limit } = req.query;

    if (!page || !limit) {
      throw new Error();
    }

    const bookmarks = await BookmarkModel.find({ user_id }).distinct('film_id');
    const count = bookmarks.length;
    const pages = Math.ceil(count / limit);
    const data = await FilmModel.find({ _id: { $in: bookmarks } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ data, pages });
  } catch (error) {
    console.warn(error);
    res.sendStatus(400);
  }
}
