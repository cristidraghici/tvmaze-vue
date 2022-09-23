// https://docs.cypress.io/api/introduction/api.html

describe('happy path', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'All available shows')
    cy.contains('div', 'There are no shows to display yet.')
  })

  it('displays some shows', () => {
    cy.visit('/')

    cy.fixture('shows-1').then((json) => {
      cy.intercept('GET', 'https://api.tvmaze.com/shows?page=0', json).as('getShows')
    })

    cy.request('https://api.tvmaze.com/shows?page=0')

    cy.contains('div', 'There are no shows to display yet.').should('not.exist')
  })

  it('searches for some shows', () => {
    cy.visit('/')

    cy.fixture('shows-1').then((json) => {
      cy.intercept('GET', 'https://api.tvmaze.com/shows?page=0', json).as('getShows')
    })

    cy.request('https://api.tvmaze.com/shows?page=0')

    cy.search('under the dome')
    cy.contains('h1', 'Search results')
  })
})
