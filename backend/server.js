import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import{ google} from 'googleapis';
import request from 'request';


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URl);
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


app.post("/api", async (req, res) => {
  res.send('Welcome to Red Tech MicroService');
});

//DarAssendan
//first googlesheets
function DarAssendangoogle(json,cardnum=10) {
  if (cardnum>num || cardnum == 0)
      cardnum = num;
  //{if you want to edit} edit the num varibles to the length of the list you want to repart about
  var num = json.length,i;
  var manychat = {"version": "v2","content": {"messages": [],"actions": [],"quick_replies": []}};
  for (i = 0; i < Math.floor(num/cardnum); i++)   {
      manychat["content"]["messages"].push({"type": "cards","elements": [],"image_aspect_ratio": "horizontal"});
      for (let j = 0; j < cardnum; j++)   {
          /*edit each vaible the way you want it to display
          don't forget the other for loop*/
          var title = json[(i*cardnum)+j]["ProductName"];
          var subtitle = json[(i*cardnum)+j]["ProductDiscreption"];
          var image_url = json[(i*cardnum)+j]["ProductImageURL"];
          manychat["content"]["messages"][i]["elements"].push({"title": title,"subtitle": subtitle,"image_url": image_url,"action_url": "https://manychat.com","buttons": []});
      }
  }
  if (num%cardnum > 0)   {
      manychat["content"]["messages"].push({"type": "cards","elements": [],"image_aspect_ratio": "horizontal"});
          for(let j = 0; j < num%cardnum; j++)    {
              //this one
              var title = json[(i*cardnum)+j]["ProductName"];
              var subtitle = json[(i*cardnum)+j]["ProductDiscreption"];
              var image_url = json[(i*cardnum)+j]["ProductImageURL"];
              manychat["content"]["messages"][i]["elements"].push({"title": title,"subtitle": subtitle,"image_url": image_url,"action_url": "https://manychat.com","buttons": []});    
          }
  }
  return manychat;
}
app.post("/api/DarAssendan/Google/get", async (req, res) => {
  //filter based on Categories
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1L5VOht4Rw7tYeNh6Dmgtg25acYN3TB5WEDAUhJz7Bd4";
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Products!A2:Z1000",
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  var googledata = getRows.data.values
  var manychat = {"value" : []};
  for (let i = 0; i < googledata.length; i++) {
    manychat["value"].push({
      "ProductID" : googledata[i][0],
      "Active": googledata[i][1],
      "ProductName" : googledata[i][2],
      "Cats" : googledata[i][3],
      "ProductDiscreption" : googledata[i][4],
      "ProductPrice" : googledata[i][5],
      "Pricing" : googledata[i][6],
      "Time" : googledata[i][7],
      "ProductImageURL" : googledata[i][8]})
  }
  var manychatfilter = manychat.value.filter(function (el) {
    return el.Cats == req.body.Categories;
  });
  res.send(DarAssendangoogle(manychatfilter));
});
app.post("/api/DarAssendan/Google/append", async (req, res) => {
  const { request, name } = req.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1L5VOht4Rw7tYeNh6Dmgtg25acYN3TB5WEDAUhJz7Bd4";
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Questions!A:E",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [['2022-10-03T16:06:07.1015285Z','Messenger','','نبي نسال لو فيه طباعه درفت او زي كتالوج ديجيتل 50 قطعه','Hala Elamari' ]],
    },
  });
  res.send('Done');
});
//second Sharepoint
function DarAssendansharepoint(json,cardnum=10) {
   
  if (cardnum>num || cardnum == 0)
      cardnum = num;
  //{if you want to edit} edit the num varibles to the length of the list you want to repart about
  var num = json["value"].length,i;
  var manychat = {"version": "v2","content": {"messages": [],"actions": [],"quick_replies": []}};
  for (i = 0; i < Math.floor(num/cardnum); i++)   {
      manychat["content"]["messages"].push({"type": "cards","elements": [],"image_aspect_ratio": "horizontal"});
      for (let j = 0; j < cardnum; j++)   {
          /*edit each vaible the way you want it to display
          don't forget the other for loop*/
          var title = json["value"][(i*cardnum)+j]["ProductName"];
          var subtitle = json["value"][(i*cardnum)+j]["ProductDiscreption"];
          var image_url = json["value"][(i*cardnum)+j]["ProductImageURL"];
          manychat["content"]["messages"][i]["elements"].push({"title": title,"subtitle": subtitle,"image_url": image_url,"action_url": "https://manychat.com","buttons": []});
      }
  }
  if (num%cardnum > 0)   {
      manychat["content"]["messages"].push({"type": "cards","elements": [],"image_aspect_ratio": "horizontal"});
          for(let j = 0; j < num%cardnum; j++)    {
              //this one
              var title = json["value"][(i*cardnum)+j]["ProductName"];
              var subtitle = json["value"][(i*cardnum)+j]["ProductDiscreption"];
              var image_url = json["value"][(i*cardnum)+j]["ProductImageURL"]; 
              manychat["content"]["messages"][i]["elements"].push({"title": title,"subtitle": subtitle,"image_url": image_url,"action_url": "https://manychat.com","buttons": []});    
          }
  }
  return manychat;
}
class REDCompanies{
  static ClientID = "bc1fdfac-50ef-4031-90c8-f12401b38e7a";
  static ClientSecret = "br+8R9XC+97p24aP8iSZaIgl16CKOxUjpcVlG41WXnM=";
  static RefreshToken = "PAQABAAEAAAD--DLA3VO7QrddgJg7WevrLVZx_-lO6VBwT_3LyQbCKCz_y31k2_NBUlGOCHVaTQNssNFOz9ciOG68LVin33nflACoDGbMXjK6GMvshqE6z7ccWyDM2Rm4Nc9WJUJazyiIxg1xCFWRNm2kwLtsw4klNSe9kEtoJQyAMTxRfqpTBn_RDXQYM7NCGkczXQ_r4V23GesvEFuggk5JDi3r9N-6Rr4C7VU7JQaX5VWn4tWDmdiGQC8d4b-lIbBMN6Iwm8dCmjQw7tenNj-K7sLKt4QioI31zIt46Q6MxsRkjUFCqCAA";
  static AccessToken;
  constructor(){
  }
  static generatetoken() {
      var RefreshToken = this.RefreshToken
      var ClientSecret = this.ClientSecret
      var RefreshToken = this.RefreshToken
      var ClientID = this.ClientID
      return new Promise(function(resolve){
      request ({
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
              form: {
                  grant_type: "refresh_token",
                  client_id: ClientID + "@" + process.env.TenantID,
                  client_secret: ClientSecret,
                  resource: process.env.ApplicationID + "/" + process.env.TenantName + ".sharepoint.com@" + process.env.TenantID,
                  refresh_token: RefreshToken
              },
              uri: "https://accounts.accesscontrol.windows.net/" + process.env.TenantID + "/tokens/OAuth/2",
              method: 'POST'
          }, async function (_err, _resreq, _body) {
             resolve(JSON.parse(await _body).access_token);
          }); 
      })     
  }
  static getAccessToken() {
      if(this.AccessToken == null)
          this.AccessToken = this.generatetoken()
      return this.AccessToken;
  }
}
app.post("/api/DarAssendan/SharePoint/get", async (req,res) => {
  var SiteName = "REDCompanies";
  var ListName = "DarAssendan";
  request({
      json:true,
      headers: {
          "Authorization" : "Bearer "+ await REDCompanies.getAccessToken(),
          "Content-Type" : "application/json; odata=verbose",
          "Accept" : "application/json; odata=nometadata"
      },
      uri: encodeURI("https://redtechly0.sharepoint.com/sites/"+ SiteName +"/_api/web/lists/GetByTitle('"+ ListName +"')/items?$filter=Cats eq '" + req.body.Categories + "'"),
      body: "",
      method: 'GET'
    }, function (_err, _resreq, _body) {
      res.send(DarAssendansharepoint(_body))          
  });
});
app.post("/api/DarAssendan/SharePoint/append", async (req,res) => {
  SiteName = "REDCompanies";
  ListName = "DarAssendan";
  request({
      json:true,
      headers: {
          "Authorization" : "Bearer "+ await REDCompanies.getAccessToken(),
          "Content-Type" : "application/json; odata=verbose",
          "Accept" : "application/json; odata=nometadata"
      },
      uri: "https://" + process.env.TenantName + ".sharepoint.com/sites/" + SiteName + "/_api/web/lists/GetByTitle('" + ListName + "')/items",
      body: {
        "__metadata":{"type":"SP.Data.DarAssendanListItem"},
        "Active": true,
        "ProductName": "test",
        "Cats": "test",
        "ProductDiscreption": "test",
        "ProductPrice": 0,
        "Pricing": null,
        "Time": null,
        "ProductImageURL": "test"
    },
      method: 'POST'
    }, function (_err, _resreq, _body) {
      res.send(_body)          
  });
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
