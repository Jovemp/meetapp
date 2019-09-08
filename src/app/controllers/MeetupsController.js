import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetups from '../models/Meetups';

class MeetupsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number(),
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
}

export default new MeetupsController();
