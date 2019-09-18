import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetups from '../models/Meetups';
import User from '../models/User';
import Subsccrption from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required,
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { meetup_id } = req.body;

    const meetup = await Meetups.findByPk(meetup_id);

    if (meetup.user_id === req.userId) {
      return res.status(400).json({ error: 'You cannot sign up for meetups you have created.' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({ error: 'Post dates are not permitted' });
    }

    return res.json({ ok: true });
  }
}

export default new SubscriptionController();
