class HealthController {
  async check(req, res) {
    try{
      console.log(`[${(new Date()).toISOString()}] - HealthController.check - ${JSON.stringify(req.body)}`);
      res.status(200);
    } catch(error){
      res.status(400);
    }
  }
}

export default new HealthController();