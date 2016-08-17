Rails.application.routes.draw do
  root 'index#index'
  get 'stocks' => 'stocks#index'
  resources :saved_stocks

  get 'signup' => 'users#new'
  resources :users

  get 'login' => 'sessions#new'
  post 'login' => 'sessions#create'

  delete 'logout' => 'sessions#destroy'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
