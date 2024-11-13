/// <reference types="cypress"/>
const body_post = require('../../fixtures/postDevice.json')
const body_put = require('../../fixtures/putDevice.json')

describe('Alterar dispositivos', function () {

  before(function () {
    cy.postDevice(body_post).then(({ body, status }) => {
      expect(status).to.eq(200)
      expect(body.name).to.eq('Samsungão 2024')
      expect(body.data.year).not.string
      expect(body.data.year).to.eq(2024)
      expect(body.data.price).not.string
      expect(body.data.price).to.eq(1)
      expect(body.data['CPU model']).not.empty
      expect(body.data['CPU model']).to.eq('Intel Core i9')
      expect(body.data['Hard disk size']).not.empty
      expect(body.data['Hard disk size']).to.eq('1 TB')
      cy.wrap(body.id).as('idDevice')
    })
  })

  it('Alterar um dispositivo', function () {

    const device_id = this.idDevice;
    const dateNow = new Date().toISOString().slice(0, 16)

    cy.api({
      method: 'PUT',
      url: `/objects/${device_id}`,
      body: body_put
    }).as('putDeviceResult');

    cy.get('@putDeviceResult').then(function ({ status, body }) {
      expect(status).to.eq(200)
      expect(body.updatedAt).not.empty
      expect(body.updatedAt.slice(0, 16)).to.eq(dateNow)
      expect(body.name).to.eq(body_put.name)
      expect(body.data.year).not.string
      expect(body.data.year).to.eq(body_put.data.year)
      expect(body.data.price).not.string
      expect(body.data.price).to.eq(body_put.data.price)
      expect(body.data['CPU model']).not.empty
      expect(body.data['CPU model']).to.eq(body_put.data["CPU model"])
      expect(body.data['Hard disk size']).not.empty
      expect(body.data['Hard disk size']).to.eq(body_put.data["Hard disk size"])
      expect(body.data.color).to.eq(body_put.data.color)
    })
  });
});