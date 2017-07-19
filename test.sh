curl -XPOST http://127.0.0.1:6510/sms -H "Content-Type: application/json" --data-raw '{"mobile": "+639451341213","message": "14.634278619451317,121.0388445854187 yui-yuigahama lock-screen-tap"}'

curl -XPOST http://127.0.0.1:6510/sms -H "Content-Type: application/json" --data-raw '{"mobile": "+639451341214","message": "14.634278619451317,121.0388445854188 yukino-yukinoshita lock-screen-tap"}'

curl -XPOST http://127.0.0.1:6510/sms -H "Content-Type: application/json" --data-raw '{"mobile": "+639451341215","message": "14.634278619451317,121.0388445854190 iroha-isshiki lock-screen-tap"}'

curl -XGET http://127.0.0.1:6510/ -H "Content-Type: application/json"