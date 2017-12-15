const Xray = require('x-ray');
const x = Xray();
const json2csv = require('json2csv');
const fs = require('fs');
const mkdirp = require('mkdirp');

//scraping fields for json2csv
const fields = ['Title', 'Price', 'ImageURL','URL','Time'];

//craete a new data folder if there isnt one already
mkdirp('./data', function (err) {
    if (err) console.error(err)
});


  //scraper Title, Price, ImageURL, URL, and Time
x('http://www.shirts4mike.com/shirts.php', '.products li',[{
    Title:x("a@href",".shirt-picture img@alt"),
    Price:x("a@href",".shirt-details .price"),
    ImageURL:"img@src",//image url
    URL:"a@href",  //the url for detailed page of each shirt
  }])(function(err, data) {
    //data is the array of objects
    if(err){
      console.error("There’s been a 404 error. Cannot connect to the to http://shirts4mike.com.");
     
    }else{
      const date = new Date().toJSON().slice(0,10);//get the curent data in format
      for(let i=0;i<data.length;i+=1){//add the time property for each object
        data[i].Time = date;
      }
      console.log(data);
      //write the data to our CSV file
      const csv = json2csv({ data: data, fields: fields });
      fs.writeFile('data/'+ date +'.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved and named correctly');
     });
   }//end else
})//end callback
