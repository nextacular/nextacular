const handler = (req, res) => {
  res.status(200).json({ ping: 'true' });
};

export default handler;
