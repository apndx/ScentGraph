describe('ScentGraph', function() {

  beforeEach(function() {
    cy.visit('http://localhost:3004')
  })

  it('front page can be opened', function() {
    cy.contains('ScentGraph')
  })

  it('login page can be navigated to', function() {
    cy.contains('Login').click()
    cy.contains('Username')
    cy.contains('Password')
  })
})
