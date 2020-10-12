const qiniu = require("qiniu")

const accessKey = 'Px2-ENd58jHR_a4Hcw06Ww_R64E4eBP3CWbbs60H'
const secretKey = 'J6C-b_UQSBwk8daVP_MP2F_Dh7Un_yr_DpEeofYt'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
const bucketManager = new qiniu.rs.BucketManager(mac, config);

const bucket = "alian-test";

module.exports = (resUrl, key) => {
	return new Promise ((resolve, reject) => {
		bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
		  if (err) {
		    reject(`${kye} 上传七牛云失败` + err)
		  } else {
		    if (respInfo.statusCode == 200) {
		      console.log(`${key} 上传七牛云成功`)
		      resolve()
		    } else {
		      console.log(respInfo.statusCode);
		      console.log(respBody);
		    }
		  }
		});
	})
}

