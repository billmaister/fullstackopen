describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const firstUser = {
      name: 'testuser1',
      username: 'testuser1',
      password: 'ekstrasekter',
    }

    const secondUser = {
      name: 'testuser2',
      username: 'testuser2',
      password: 'ekstrasekter',
    }

    cy.request('POST', 'http://localhost:3003/api/users/', firstUser)
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser)

    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testuser1')
      cy.get('#password').type('ekstrasekter')
      cy.get('#login-button').click()

      cy.contains('Logged in successfully')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testuser1')
      cy.get('#password').type('ekstrasekter11')
      cy.get('#login-button').click()

      cy.contains('Invalid username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser1', password: 'ekstrasekter' })
    })

    it('A blog can be created', function () {
      cy.get('#add-blog-button').click()
      cy.get('#add-title').type('test title')
      cy.get('#add-author').type('test author')
      cy.get('#add-url').type('testurl.com')
      cy.contains('Submit').click()

      cy.get('#blog-container').should(
        'include.text',
        'test title by test author'
      )
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'test title',
          author: 'test author',
          url: 'testurl.com',
        })
      })

      it('A blog can be liked', function () {
        cy.get('#blog-container').eq(0).contains('view').click()
        cy.contains(0).contains('like').click()
        cy.contains('likes 1')
      })

      it('A user can remove their blogs', function () {
        cy.get('#blog-container').eq(0).contains('view').click()
        cy.contains('remove').click()
        cy.get('#blog-container').should(
          'not.include.text',
          'test title by test author'
        )
      })

      it('Only the user who created the blog can delete it', function () {
        cy.contains('Log out').click()
        cy.login({ username: 'testuser2', password: 'ekstrasekter' })
        cy.get('#blog-container').eq(0).contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      it('Blog are ordered by likes', function () {
        cy.createBlog({
          title: 'titel with most likes',
          author: 'cypress tester',
          url: 'cypresstesting.com',
        })

        cy.createBlog({
          title: 'title with second most likes',
          author: 'cypress tester',
          url: 'cypresstesting.com',
        })

        cy.contains('titel with most likes').parent().as('blog1')
        cy.contains('title with second most likes').parent().as('blog2')
        cy.contains('test title').parent().as('blog3')

        cy.get('@blog1').contains('view').click()
        cy.get('@blog1').get('button').contains('like').as('like1')
        cy.get('@like1').click()
        cy.wait(1500)
        cy.get('@like1').click()
        cy.wait(1500)
        cy.get('@blog1').get('button').contains('hide').click()

        cy.get('@blog2').contains('view').click()
        cy.get('@blog2').get('button').contains('like').click()
        cy.wait(1500)
        cy.get('@blog2').get('button').contains('hide').click()
        cy.wait(1500)

        cy.get('.blog').then((blogs) => {
          cy.wrap(blogs[0]).contains('titel with most likes')
          cy.wrap(blogs[1]).contains('title with second most likes')
          cy.wrap(blogs[2]).contains('test title')
        })
      })
    })
  })
})
