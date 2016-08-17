class AddColumnsToSavedStocks < ActiveRecord::Migration[5.0]
  def change
    add_reference :saved_stocks, :user, foreign_key: true
    add_column :saved_stocks, :stock_name, :string
    add_column :saved_stocks, :stock_data, :string
  end
end
