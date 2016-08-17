class SavedStock < ApplicationRecord
  validates :stock_name, uniqueness: true
end
