$(document).ready(function() {
    // User info
    var ableToText = false;
    var userInfoDiv = $('.user_info');
    var userInfo = {
        uuid: userInfoDiv.attr('uuid'),
        email: userInfoDiv.attr('email'),
        id: userInfoDiv.attr('id'),
        is_support: userInfoDiv.attr('is_support')
    };
    if (userInfo.is_support == "false") {
        userInfo.is_support = false;
    } else {
        userInfo.is_support = true;
    }

    // Step 1 - Initialize PubNub
    var pubnub = new PubNub({
        subscribeKey: "sub-c-98147de3-7977-4af3-a7c5-a84ed92119b1",
        publishKey: "pub-c-c1b71d4f-231b-420b-be97-9e065459ebfc",
        uuid: userInfo.uuid
    });

    // Step 2 - Get chatbot working immediately
    if(!userInfo.is_support) {
        pubnub.publish({
            message: {
                "botname": "SupportBotPN2022",
                "text": ""
            },
            channel: "gupshup-input"
        },
        function(status, response) {
          console.log(status);
          console.log(response);
        });
        pubnub.subscribe({channels: ["gupshup-input"]});
    
        pubnub.addListener({
            message: function(m) {
                // handle message
                var channelName = m.channel;
                var channelGroup = m.subscription;
                var publisher = m.publisher; //The Publisher
                // console.log(m);
                
                if (publisher == "GUPSHUP") {
                    // display on the device
                    console.log(m.message.text)
                    
                    let markup = ``;
    
                    if (m.message.type == "quick_reply") {
                        var splitMsg = m.message.text.split('?');
                        markup += `
                            <div class="chat-item">${splitMsg[0]}?</div>
                        `;
                        var options = splitMsg[1].split('\n');
                        if (options.length <= 1) {
                            return;
                        }
                        markup += `<div class="options">`
                        options.forEach(function(e) {
                            
                            if (e.trim() != "") {
                                var item = e.split(' ')[1];
    
                                markup += `<span class="selectItems">${item}</span>`
                            }
                        });
                        markup += `</div>`
                        
                    } else {
                        markup += `
                            <div class="chat-item">${m.message.text}</div>
                        `;

                        if(m.message.text == "Please enter query here...") {
                            // initiate support channel chat...
                            pubnub.subscribe({ channels: ["customer_care"] });
                        }
                    }
                
                    $('.chat-box').append(markup);
    
                    $('.selectItems').off('click').on('click', function(e) {
                        if ($(this).hasClass('inactive')) {
                            return;
                        }
    
                        var value = $(this).html().trim();
    
                        pubnub.publish({
                            message: {
                                "botname": "SupportBotPN2022",
                                "text": value
                            },
                            channel: "gupshup-input"
                        },
                        function(status, response) {
                          console.log(status);
                          console.log(response);
                        });
                    });
                }
            }
        });
    } else {
        pubnub.subscribe({ channels: ["customer_care"] })
    }

    $('.sendbutton').off('click').on('click', function(e) {
        var text = $('.input-box').val().trim();

        if (text == "") {
            return;
        }

        pubnub.publish({
            message: {
                "text": text
            },
            channel: "customer_care"
        },
        function(status, response) {
          console.log(status);
          console.log(response);
        });
    });

    pubnub.addListener({
        message: function(m) {
            // handle message
            if(m.channel == "customer_care") {
                var markup = ``;
                if (userInfo.uuid == m.publisher) {
                    markup += `<div class="chat-item right" style="margin-left: auto; margin-right: 0; border-radius: 50px 15px 0px 30px;">${m.message.text}</div>`;
                } else {
                    markup += `<div class="chat-item left">${m.message.text}</div>`;
                }
                

                $('.chat-box').append(markup);
            }
        }
    });


});