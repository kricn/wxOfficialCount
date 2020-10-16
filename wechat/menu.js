const { url } = require("../config")

module.exports = {
	"button":[
    {		
			"type":"view",
			"name":"电影推荐🎥",
			"url":`${url}/theaters`
    },
    {
      "type":"view",
      "name":"语音识别🎤",
      "url":`${url}/search`
    },
    {
      "name":"click me",
      "sub_button": [
        {
          "type":"view",
          "name":"首页",
          "url": `${url}/index`
        },
        {
          "type":"view",
          "name":"github😍",
          "url":`https://github.com/kricn`
        },
        {
          "type":"click",
          "name":"帮助❓",
          "key": "help"
        }
      ]
    }
  ]
}
