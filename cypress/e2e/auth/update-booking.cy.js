
beforeEach(function () {
  cy.login().then(response => {
    expect(response.status).to.eq(200)
    this.token = response.body.token
  })

  cy.fixture("dataBooking").then(({ booking }) => {
    this.body = booking

    cy.postBooking(booking).then((response) => {
      expect(response.status).to.eq(200)
      this.bookingId = response.body.bookingid
    })
  })
});

describe('Update Booking', function () {

  it('Update Booking', function () {
    const headers = {
      'Cookie': `token=${this.token}`
    }

    let body = this.body

    body = {
      ...body,
      totalprice: 2000,
      bookingdates: {
        checkin: '2024-09-05',
        checkout: '2024-09-10'
      }
    }

    cy.putBooking(body, this.bookingId, headers)
      .then(response => {
        expect(`status: ${response.status}`).to.eq(`status: ${200}`)
        expect(response.body.firstname).to.eq(body.firstname)
        expect(response.body.lastname).to.eq(body.lastname)
        expect(response.body.totalprice).to.eq(body.totalprice)
        expect(response.body.bookingdates.checkin).to.eq(body.bookingdates.checkin)
        expect(response.body.bookingdates.checkout).to.eq(body.bookingdates.checkout)
      })
  });

  it('Update Booking without token', function () {
    let body = this.body

    body = {
      ...body,
      totalprice: 3000,
      bookingdates: {
        checkin: '2024-09-01',
        checkout: '2024-09-10'
      }
    }

    cy.putBooking(body, this.bookingId)
      .then(response => {
        expect(`status: ${response.status}`).to.eq(`status: ${403}`)
        expect(response.body).to.eq('Forbidden')
      })
  });

  it('Update Booking with invalid token', function () {
    const headers = {
      'Cookie': `token=invalidToken`
    }

    let body = this.body

    body = {
      ...body,
      totalprice: 3000,
      bookingdates: {
        checkin: '2024-09-01',
        checkout: '2024-09-10'
      }
    }

    cy.putBooking(body, this.bookingId, headers)
      .then(response => {
        expect(`status: ${response.status}`).to.eq(`status: ${403}`)
        expect(response.body).to.eq('Forbidden')
      })
  });
});