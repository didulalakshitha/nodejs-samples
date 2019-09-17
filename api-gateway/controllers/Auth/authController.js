import "dotenv/config";

exports.login = async (req, res) => {
  const { name, emails, photos } = req.user;
  res.status(200).send({ name: name.givenName, email: emails[0].value });
  try {
  } catch (error) {
    res.status(500).send({ status: "false", error });
  }
};
