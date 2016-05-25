const Model = require('../models/endpoint.model.js');
const controller = require('../controllers');

module.exports = function(app) {

  app.route('/mocks')
  .get(controller.getMocks)
  .post(controller.createMock);

  app.route('/mocks/:id')
  .get(controller.getMock)
  .put(controller.editMock)
  .delete(controller.deleteMock);

  app.route('*')
  .get(controller.defaultGet)
  .post(controller.defaultPost);
}
