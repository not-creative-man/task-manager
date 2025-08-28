class HealthController {
  async check(req, res) {
    try {
      console.log(`[${(new Date()).toISOString()}] - HealthController.check - ${JSON.stringify(req.body)}`);
      res.status(200).send('ok');
      console.log(`[${(new Date()).toISOString()}] - HealthController.check - Status: ok`);
    } catch (error) {
      res.status(500).send('error');
    }
  }
}

export default new HealthController();