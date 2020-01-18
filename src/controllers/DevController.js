// @ts-nocheck
const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

  async index(request, response) {
    try {
      const devs = await Dev.find();
      return response.json(devs);
    } catch(e) {
      console.log(e);
      return response.status(500).json({ error: 'Falha ao listar os registros!' })
    }

  },


  async store(request, response) {
    try {
      const { github_username, techs, latitude, longitude } = request.body;

      let dev = await Dev.findOne({ github_username });

      if(!dev) {
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        const { name = login, avatar_url, bio } = apiResponse.data;

        const techsArray = parseStringAsArray(techs);
        
        const location = {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
        
        dev = await Dev.create({
          name,
          github_username,
          bio,
          avatar_url,
          techs: techsArray,
          location,
        });

        const sendSocketMessageTo = findConnections(
          { latitude, longitude },
          techsArray,
        );

        sendMessage(sendSocketMessageTo, 'new-dev', dev);
        
      } 
      return response.json(dev);
    } catch(e) {
      console.log(e);
      return response.status(500).json({ error: 'Falha ao inserir registro!' });
    }
  }
}