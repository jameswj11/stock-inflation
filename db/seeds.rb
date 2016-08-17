# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
SavedStock.create(user_id: 1, stock_name: 'FB', stock_data:[{price: "33.50", year: "2012-05-27"}, {price: "29.10", year: "2012-06-03"}, {price: "28.45", year: "2012-06-10"}, {price: "31.51", year: "2012-06-17"}])
