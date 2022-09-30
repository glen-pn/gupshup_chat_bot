class HomeController < ApplicationController

  before_action :authenticate_user!, :except => [] 

  def index
    @user = current_user
  end
end
