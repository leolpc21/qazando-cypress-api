Cypress.Commands.add('postDevice', (body, isUI) => {
  const ui = isUI ? cy.api : cy.request

  ui({
    method: 'POST',
    url: '/objects',
    body,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('deleteDevice', (device_id, isUI) => {
  const ui = isUI ? cy.api : cy.request

  ui({
    method: 'DELETE',
    url: `/objects/${device_id}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getDevice', (device_id, isUI) => {
  const ui = isUI ? cy.api : cy.request

  ui({
    method: 'GET',
    url: `/objects${device_id}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'https://restful-booker.herokuapp.com/auth',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      "username": "admin",
      "password": "password123"
    }
  })
});

Cypress.Commands.add('postBooking', (body) => {
  cy.request({
    method: 'POST',
    url: 'https://restful-booker.herokuapp.com/booking',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
});

Cypress.Commands.add('putBooking', (body, bookingId, headers) => {
  cy.api({
    method: 'PUT',
    url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    },
    body,
    failOnStatusCode: false
  })
});