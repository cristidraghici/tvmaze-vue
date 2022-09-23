// https://docs.cypress.io/api/introduction/api.html

describe('happy path', () => {
  it('shows the details for a show', () => {
    cy.visit('/show/1')

    cy.intercept('GET', 'https://api.tvmaze.com/shows/1', (req) => {
      req.reply({
        statusCode: 200, // default
        fixture: 'show-1.json'
      })
    })

    cy.contains('h1', 'Under the Dome')
  })

  it('shows an error while retrieving the details', () => {
    cy.visit('/show/1')

    cy.intercept('GET', 'https://api.tvmaze.com/shows/1', (req) => {
      req.reply({
        forceNetworkError: true // default
      })
    })

    cy.contains('button', 'Try again')
  })
})

// https://docs.cypress.io/api/introduction/api.html

describe('unhappy path', () => {
  it('shows an error while retrieving the details', () => {
    cy.visit('/show/1')

    cy.intercept('GET', 'https://api.tvmaze.com/shows/1', (req) => {
      req.reply({
        forceNetworkError: true // default
      })
    })

    cy.contains('button', 'Try again')
  })
})
