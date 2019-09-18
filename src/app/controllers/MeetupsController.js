import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetups from '../models/Meetups';
import File from '../models/File';
import User from '../models/User';

class MeetupsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ error: 'Post dates are not permitted' });
    }

    const meetups = await Meetups.create({ ...req.body, user_id: req.userId });

    return res.json(meetups);
  }

  async index(req, res) {
    const meetups = await Meetups.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id', 'title', 'description', 'location', 'date', 'banner_id', 'user_id'],
      include: [
        { model: File, as: 'banner', attributes: ['name', 'path', 'url'] },
        { model: User, as: 'user', attributes: ['name'] },
      ],
    });

    return res.json(meetups);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const meetups = await Meetups.findByPk(id);

    if (isBefore(meetups.date, new Date())) {
      return res.status(401).json({ error: 'Put dates are not permitted' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Post dates are not permitted' });
    }

    if (meetups.user_id !== req.userId) {
      return res.status(401).json({ error: 'You can only update the meetups you have created.' });
    }

    const newMeetups = await meetups.update(req.body);

    return res.json(newMeetups);
  }

  async delete(req, res) {
    const { id } = req.params;

    const meetups = await Meetups.findByPk(id);

    if (isBefore(meetups.date, new Date())) {
      return res.status(401).json({ error: 'Put dates are not permitted' });
    }

    if (meetups.user_id !== req.userId) {
      return res.status(401).json({ error: 'You can only delete the meetups you have created.' });
    }

    const oldMeetups = await meetups.destroy({
      where: id,
    });

    return res.json(oldMeetups);
  }
}

export default new MeetupsController();
