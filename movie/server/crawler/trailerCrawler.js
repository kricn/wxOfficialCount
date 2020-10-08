const puppeteer = require("puppeteer")

const url = "https://movie.douban.com/coming"

function timeout () {
  return new Promise (resolve => {
    setTimeout(resolve, 2000)
  })
}

module.exports = async () => {
	const browser = await puppeteer.launch({
		// args: ["--no-sandbox"],
    headless: false
	});
  const page = await browser.newPage();
  await page.goto(url, {
  	waitUntil: "networkidle2"
  });
  await timeout()

  const res = await page.evaluate(() => {
    let result = []
  	const list = $("#content .coming_list tbody > tr") 
  	for (let i=0; i<list.length; i++) {
  		const trDom = $(list[i])
      const num = parseInt(trDom.find("td").last().html())
      if(num > 100) {
        var href = trDom.find("td").eq(1).find("a").attr("href")
      
        result.push({
          href
        })
      }
  	}
  	return result
  })

  let moviesData = []

  for (let i=0; i<res.length; i++) {
    let item = res[i]
    let url = item.href
    await page.goto(url, {
      waitUntil: "networkidle2"
    })

    itemRes = await page.evaluate(() => {
      function circleDom(dom) {
        let res = []
        for ( let i=0; i<dom.length; i++) {
          res.push(dom[i].innerHTML)
        }
        return res
      }
      let title = $("[property='v:itemreviewed']").html()
      let directors = circleDom($("[rel='v:directedBy']"))
      let casts = circleDom($("[rel='v:starring']"))
      let genre = circleDom($("[property='v:genre']"))
      let summary = $("[property='v:summary']").html().replace(/\s+/g, "")
      let releaseDate = circleDom($("[property='v:initialReleaseDate']"))
      let runtime = $("[property='v:runtime']").html()
      let image = $("[property='v:image']").attr("src")
      let doubanId = $(".a_show_login.lnk-sharing").attr("share-id")
      let rating = $("[property='v:average']").html()
      let href = $(".related-pic-video").attr("href")
      let cover = $(".related-pic-video").css("background-image")?$(".related-pic-video").css("background-image").slice(5,-2):""
      return {
        title,
        directors,
        casts,
        genre, 
        summary,
        releaseDate,
        runtime,
        image,
        doubanId,
        rating,
        href,
        cover
      }
    })
    moviesData.push(itemRes)
  }
  
  for (let i=0; i<moviesData.length; i++) {
    let item = moviesData[i]
    let url = item.href || undefined
    if (url) {
      await page.goto(url, {
        waitUntil: "networkidle2"
      });
  
      item.link = await page.evaluate(() => {
        return link = $("video>source").attr("src")
      })
    }

  }

  await browser.close();

  return moviesData
}
