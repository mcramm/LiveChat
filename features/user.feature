Feature: Managing Users
    In order to have something
    As a thing
    I want to like, do stuff

    Scenario Outline: Logging In
        Given the following user record
        | username | password | email         |
        | mike     | mike     | mike@mike.com |
        Given I am on the home page
        When I fill in '<username>' for 'username'
        And I fill in '<password>' for 'password'
        And I press 'submit'
        Then I should be on the <result> page

        Examples:
        | username | password | result   |
        | mike     | mike     | projects |
        | someone  | mike     | login    |
        | mike     | else     | login    |
