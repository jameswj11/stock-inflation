class User < ApplicationRecord
  has_secure_password

  # references refers to the table name
  has_many :saved_stocks
end
