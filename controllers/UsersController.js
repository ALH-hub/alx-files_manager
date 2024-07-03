import sha1 from 'sha1';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const exist = await dbClient.findUser({ email });
    if (exist) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hash = sha1(password);

    const user = await dbClient.insertUser({ email, password: hash });

    return res
      .status(201)
      .json({ email: user.ops[0].email, id: user.insertedId });
  } catch (err) {
    console.log(err);
    return res.status(500).json('server error');
  }
};

export default postNew;
