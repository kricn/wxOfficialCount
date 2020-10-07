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
      const num = trDom.last().html()
      if(num > 100) {
        let href = trDom.eq(1).find("a").attr("href")
      }
  		result.push({
  			href
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
