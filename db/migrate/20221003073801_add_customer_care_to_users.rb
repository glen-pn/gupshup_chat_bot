class AddCustomerCareToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :is_support, :boolean, :default => false
  end
end
