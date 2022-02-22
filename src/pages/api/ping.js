const handler = (req, res) => {
  res.status(200).json({ pong: true });
};

export default handler;
