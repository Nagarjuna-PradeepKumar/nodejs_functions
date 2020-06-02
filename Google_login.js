const {request}=require('gaxios')
const {google} = require('googleapis');
const dotenv=require('dotenv');
const router=require('express').Router()
dotenv.config();

const oauth2Client = new google.auth.OAuth2(process.env.google_client_id,process.env.google_client_secret,process.env.google_redirect_url);
const scopes = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'];
const url = oauth2Client.generateAuthUrl({access_type: 'offline',scope: scopes});

router.get('/login',(req,res)=>{
    res.redirect(url)
})

async function codparser(url,callback){
    let rawurl=url;
    let unreplacedurl=rawurl.substring(rawurl.indexOf("code=")+5,rawurl.indexOf("&scope="));
    var code=unreplacedurl.replace("%2F","/");
    let {tokens} =await oauth2Client.getToken(code)
    return callback(tokens.access_token)
}
async function httpcaller(gottoken){
    const userdata=await request({baseURL: 'https://www.googleapis.com',url:'/oauth2/v2/userinfo',headers: {'Authorization': 'Bearer ' + gottoken}})
    return (userdata.data)
}

router.get('/redirect',async(req,res)=>{
    const finaluserdatas=await codparser(req.url,httpcaller)
    console.log(finaluserdatas)    
})



module.exports = router;
