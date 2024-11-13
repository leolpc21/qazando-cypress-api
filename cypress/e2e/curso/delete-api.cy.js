/// <reference types="cypress"/>
const body_post = require('../../fixtures/postDevice.json')

describe('Deletar dispositivos', function () {

  before(function () {
    cy.postDevice(body_post).then(({ body }) => {
      cy.wrap(body.id).as('idDevice')
    })
  })

  it('Deletar um dispositivo', function () {

    const device_id = this.idDevice;

    cy.deleteDevice(device_id, true).as('deleteDeviceResult');

    cy.get('@deleteDeviceResult').then(function ({ status, body }) {
      expect(status).to.eq(200)
      expect(body.message).not.empty
      expect(body.message).to.eq(`Object with id = ${device_id} has been deleted.`)
    })
  });

  it('Deletar um dispositivo não existente', function () {

    const device_id = 5555;

    cy.deleteDevice(device_id, true).as('deleteDeviceResult');

    cy.get('@deleteDeviceResult').then(function ({ status, body }) {
      expect(status).to.eq(404)
      expect(body.error).not.empty
      expect(body.error).to.eq(`Object with id = ${device_id} doesn't exist.`)
    })
  });

  it('Deletar um dispositivo não permitido', function () {

    const device_id = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    device_id.forEach((id) => {
      cy.deleteDevice(id, true).as('deleteDeviceResult');

      cy.get('@deleteDeviceResult').then(function ({ status, body }) {
        expect(status).to.eq(405)
        expect(body.error).not.empty
        expect(body.error).to.eq(`${id} is a reserved id and the data object of it cannot be deleted. You can create your own new object via POST request and try to send a DELETE request with new generated object id.`)
      })
    })
  });
});