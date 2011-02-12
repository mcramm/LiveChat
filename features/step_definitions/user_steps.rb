Given /^the following user record$/ do |table|
  # table is a Cucumber::Ast::Table
  # express the regexp above with the code you wish you had
  table.hashes.each do |user|
      user['password'] = Digest::MD5.hexdigest( user['password'] ) 
      User.create(user)
  end
end

Given /^I am logged in$/ do
    visit path_to('the home page')
    fill_in('username', :with => 'user')
    fill_in('password', :with => 'test')
    click_button('submit')
end

Given /^I am viewing the user home page$/ do
    Given "I am logged in"
    Given "I am on the home page"
end

Given /^I fill in '(.*)' for '(.*)'$/ do |value, field|
    fill_in(field, :with => value)
end

When /^I press '(.*)'$/ do |name|
    click_button(name)
end
