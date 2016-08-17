class IndexController < ApplicationController
  before_action :require_user, only: [:index, :show]

  def index
    if session[:user_id]
      redirect_to '/stocks'
    end
  end
end
