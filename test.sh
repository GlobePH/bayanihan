curl -XPOST http://wanderast01a.southeastasia.cloudapp.azure.com/byhn/sms -H "Content-Type: application/json" --data-raw '{"mobile": "+639451341213","message": "14.634278619451317,121.0388445854187 yui-yuigahama lock-screen-tap"}'

curl -XPOST http://wanderast01a.southeastasia.cloudapp.azure.com/byhn/sms -H "Content-Type: application/json" --data-raw '{"mobile": "+639451341214","message": "14.634278619451317,121.0388445854188 yukino-yukinoshita lock-screen-tap"}'

curl -XPOST  http://localhost:6530/globe/sms -H "Content-Type: application/json" --data-raw '{ "inboundSMSMessageList":{ "inboundSMSMessage":[{ "dateTime":"Fri Nov 22 2013 12:12:13 GMT+0000 (UTC)", "destinationAddress":"tel:21581234", "messageId":null, "message":"14.5528519,121.0508508 kenneth-bastian fuck-you", "resourceURL":null, "senderAddress":"tel:+639451341213" }], "numberOfMessagesInThisBatch":1, "resourceURL":null, "totalNumberOfPendingMessages":null }}'

curl -XGET http://localhost:6530 -H "Content-Type: application/json"