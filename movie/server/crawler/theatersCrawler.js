const puppeteer = require("puppeteer")

const url = "https://movie.douban.com/cinema/nowplaying/guangzhou/"

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
  	const list = $("#nowplaying>.mod-bd>.lists>.list-item") 
  	for (let i=0; i<list.length; i++) {
  		const liDom = $(list[i])
  		let title = liDom.data("title")
  		let rating = liDom.data("score")
  		let runtime = liDom.data("duration")
  		let directors = liDom.data("director")
  		let casts = liDom.data("actors")
  		let href = liDom.find("li.poster>a").attr("href")
  		let image = liDom.find("li.poster>a>img").attr("src")
      let doubanId = liDom.attr("id")
      let releaseDate = liDom.data("release")
  		result.push({
  			title,
  			rating,
  			runtime,
  			directors,
				casts,
  			href,
  			image,
        doubanId,
        releaseDate
  		})
  	}
  	return result
  })
  
  for (let i=0; i<res.length; i++) {
    let item = res[i]
    let url = item.href
    await page.goto(url, {
      waitUntil: "networkidle2"
    });

    itemRes = await page.evaluate(() => {
      let genre = []
      const $genre = $('[property="v:genre"]')
      for (let j=0; j<$genre.length; j++){
        genre.push($genre[j].innerText)
      }
      const summary = $('[property="v:summary"]').html().replace(/\s+/g, "")

      return {genre, summary}
    })

    item.genre = itemRes.genre
    item.summary = itemRes.summary
  }

  await browser.close();

  return res
}
