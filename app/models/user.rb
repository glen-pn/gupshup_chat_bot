require 'securerandom'

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  # CONSTANTS

  # FILTERS

  # VALIDATORS

  # ASSOCIATIONS

  # SCOPES

  # METHODS

  before_create :add_uuid


  private

    def add_uuid
      self.uuid = SecureRandom.uuid
    end

end
