class SavedStocksController < ApplicationController
  def index
    render :json => SavedStock.where(user_id: session[:user_id])
  end

  def show
    render :json => SavedStock.find(params[:id])
  end

  def create
    stock = {user_id: session[:user_id], stock_name: params[:stock_name], stock_data: params[:stock_data], inflation_adj: params[:inflation_adj]}
    SavedStock.create stock
    render :json => SavedStock.last
  end

  def destroy
    puts params[:stock_name]
    stock = SavedStock.find(params[:id])
    if stock
      stock.destroy
      render :json => {:deleted => true} if stock
    else
      render :json => {:deleted => false}
    end
  end
end
