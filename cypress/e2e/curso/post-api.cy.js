/// <reference types="cypress"/>
const body_post = require('../../fixtures/postDevice.json')
const dateNow = new Date().toISOString().slice(0, 16)

describe('Cadastro de dispositivos', function () {

  it('Cadastrar um dispositivo com sucesso', function () {

    cy.postDevice(body_post, true).as('postDeviceResult');
    cy.get('@postDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.id).not.empty
      expect(body.name).to.eq(body_post.name)
      expect(body.createdAt).not.empty
      expect(body.createdAt.slice(0, 16)).to.eq(dateNow)
      expect(body).not.empty
      expect(body.data).not.empty
      expect(body.data.year).not.string
      expect(body.data.year).to.eq(body_post.data.year)
      expect(body.data.price).not.string
      expect(body.data.price).to.eq(body_post.data.price)
      expect(body.data['CPU model']).not.empty
      expect(body.data['CPU model']).to.eq(body_post.data['CPU model'])
      expect(body.data['Hard disk size']).not.empty
      expect(body.data['Hard disk size']).to.eq(body_post.data['Hard disk size'])
    })
  });

  it('Cadastrar um dispositivo sem mandar nenhum dados', function () {

    cy.postDevice('', true).as('postDeviceResult');
    cy.get('@postDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(400)
      expect(body.error).not.empty
      expect(body.error).to.eq('400 Bad Request. If you are trying to create or update the data, potential issue is that you are sending incorrect body json or it is missing at all.')
    })
  });

  it('Cadastrar um dispositivo sem mandar as descrições do dispositivo', function () {
    let body = { ...body_post }
    delete body.data;

    cy.postDevice(body, true).as('postDeviceResult');
    cy.get('@postDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.id).not.empty
      expect(body.name).to.eq(body_post.name)
      expect(body.createdAt.slice(0, 16)).to.eq(dateNow)
      expect(body.data).to.null
    })
  });

  it('Cadastrar um dispositivo com o nome nulo', function () {
    let body = { ...body_post }
    body.name = null;

    cy.postDevice(body, true).as('postDeviceResult');
    cy.get('@postDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.id).not.empty
      expect(body.name).to.null
      expect(body.createdAt.slice(0, 16)).to.eq(dateNow)
      expect(body.data).not.empty
    })
  })

  it('Cadastrar um dispositivo com cize 5.5', function () {
    let body = { ...body_post }
    body.data = {
      cize: 5.5
    };

    cy.postDevice(body, true).as('postDeviceResult');
    cy.get('@postDeviceResult').then(({ status, body }) => {
      expect(status).to.eq(200)
      expect(body.id).not.empty
      expect(body.name).to.eq(body_post.name)
      expect(body.createdAt.slice(0, 16)).to.eq(dateNow)
      expect(body.data).not.empty
      expect(body.data.cize).to.eq(5.5)
    })
  });
});