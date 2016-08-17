class CreateSavedStocks < ActiveRecord::Migration[5.0]
  def change
    create_table :saved_stocks do |t|

      t.timestamps
    end
  end
end
