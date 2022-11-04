function getTourData($mapx, $mapy) {
    let request = require('request');
    let cheerio = require('cheerio');

const $url = 'https://apis.data.go.kr/B551011/KorService/locationBasedList'

const $KEY = 'hKcRtn533G10xB1CdeA4puIjloLfEzldemJ3yb9Ldzu29iI8W5UCFw%2FPwl1QfUDW%2FGaeOyJQ%2BfyHIsoNjCdcUw%3D%3D'

const $numOfRows = '15'
const $pageNo = '1'
const $MobileOS = 'WIN'
const $MobileApp = 'trainPortal'
const $radius = '10000'

const $api_url = $url + '?serviceKey=' + $KEY +
                        '&numOfRows=' + $numOfRows +
                        '&pageNo=' + $pageNo +
                        '&MobileOS=' + $MobileOS +
                        '&MobileApp=' + $MobileApp +
                        '&mapx=' + $mapx +
                        '&mapy=' + $mapy +
                        '&radius=' + $radius;

console.log($api_url);


request($api_url, function(err, res, body){
    $ = cheerio.load(body);

    $('item').each(function(idx){
    let firstimage1 = $(this).find('firstimage1').text();
    let tel = $(this).find('tel').text();
    let add1 = $(this).find('add1').text();
    let add2 = $(this).find('add2').text();
    let title = $(this).find('title').text();
    let dist = $(this).find('dist').text();


    console.log(`타이틀 : ${title}, 주소 : ${add1} ${add2}, 거리 : ${dist}m , 이미지 : ${firstimage2}, 전화번호 : ${tel}`);

    });


});

 
}

getTourData(126.981611, 37.568477)