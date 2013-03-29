require 'sinatra/base'
require 'net/http'
require 'json'

class MyApp < Sinatra::Base
  get '/' do
    erb :index
  end

  post '/broadcast' do
    uri = URI.parse("http://192.168.1.38:9090/faye")
    Net::HTTP.post_form(uri, message: params[:message])
  end
end
