/// <reference types="cypress"/>
const body_post = require('../../fixtures/postDevice.json')

describe('Buscar dispositivos', function () {
  
  it('Buscar um dispositivo específico', function () {

    const device_id = '7';

    cy.getDevice(`/${device_id}`, true).as('getDeviceResult');

    cy.get('@getDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.id).to.eq(device_id)
      expect(body.name).to.eq('Apple MacBook Pro 16')
      expect(body).not.empty //serve para validar se não é vazio, mas funciona apenas para string
      expect(body.data).not.empty
      expect(body.data.year).not.string
      expect(body.data.year).to.eq(2019)
      expect(body.data.price).not.string
      expect(body.data.price).to.eq(1849.99)
      expect(body.data['CPU model']).not.empty
      expect(body.data['CPU model']).to.eq('Intel Core i9')
      expect(body.data['Hard disk size']).not.empty
      expect(body.data['Hard disk size']).to.eq('1 TB')
    })
  });

  context('Buscar dispositivos', function () {

    beforeEach(function () {
      cy.postDevice(body_post).then(({ body }) => {
        cy.wrap(body.id).as('idDevice')
      })
    })

    it('Buscar um dispositivo recem cadastrado', function () {

      const device_id = this.idDevice;

      cy.getDevice(`/${device_id}`, true).as('getDeviceResult');

      cy.get('@getDeviceResult').then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body.id).to.eq(device_id)
        expect(body.name).to.eq(body_post.name)
        expect(body).not.empty
        expect(body.data).not.empty
        expect(body.data.year).not.string
        expect(body.data.year).to.eq(body_post.data.year)
        expect(body.data.price).not.string
        expect(body.data.price).to.eq(body_post.data.price)
        expect(body.data['CPU model']).not.empty
        expect(body.data['CPU model']).to.eq(body_post.data["CPU model"])
        expect(body.data['Hard disk size']).not.empty
        expect(body.data['Hard disk size']).to.eq(body_post.data["Hard disk size"])
      })
    });

    it('Buscar 3 dispositivos específico, onde 1 é recem cadastrado', function () {

      const device_id = `?id=3&id=10&id=${this.idDevice}`;

      cy.getDevice(device_id, true).as('getDeviceResult');

      cy.get('@getDeviceResult').then(({ status, body }) => {
        expect(status).to.eq(200)
        expect(body[0].id).to.eq('3')
        expect(body[0].name).to.eq('Apple iPhone 12 Pro Max')
        expect(body[0].data.color).to.eq('Cloudy White')
        expect(body[0].data['capacity GB']).to.eq(512)

        expect(body[1].id).to.eq('10')
        expect(body[1].name).to.eq('Apple iPad Mini 5th Gen')
        expect(body[1].data.Capacity).to.eq('64 GB')
        expect(body[1].data['Screen size']).to.eq(7.9)

        expect(body[2].id).to.eq(`${this.idDevice}`)
        expect(body[2].name).to.eq(body_post.name)
        expect(body[2].data.year).to.eq(body_post.data.year)
        expect(body[2].data.price).to.eq(body_post.data.price)
        expect(body[2].data['CPU model']).to.eq(body_post.data["CPU model"])
        expect(body[2].data['Hard disk size']).to.eq(body_post.data["Hard disk size"])
      });
    });
  });

  it('Buscar todos os dispositivos', function () {

    cy.getDevice('', true).as('getDeviceResult');

    cy.get('@getDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.length).to.eq(13)
      for (let index = 0; index < body.length; index++) {
        const idDevice = index + 1
        expect(body[index].id).to.eq(`${idDevice}`)
      }
    })
  });

  context('Buscar dispositivo inexistente', function () {

    before(function () {
      cy.postDevice(body_post).then(({ body }) => {
        cy.wrap(body.id).as('idDevice')
        cy.deleteDevice(body.id);
      })
    });

    it('Buscar um dispositivo deletado', function () {
      const device_id = this.idDevice;

      cy.getDevice(`/${device_id}`, true).as('getDeviceResult');

      cy.get('@getDeviceResult').then(({ status, body }) => {
        expect(status).to.eq(404)
        expect(body.error).to.eq(`Oject with id=${device_id} was not found.`)
      })
    });
  })
});