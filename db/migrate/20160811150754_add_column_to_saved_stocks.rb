class AddColumnToSavedStocks < ActiveRecord::Migration[5.0]
  def change
    add_column :saved_stocks, :inflation_adj, :string
  end
end
