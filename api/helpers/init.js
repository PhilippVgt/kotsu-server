module.exports = {

  friendlyName: 'Initialize',
  description: 'Initialize bus stops.',

  fn: async function (inputs, exits) {
    const stops = [{
          "code": 558,
          "nameEN": "Takayama Science Town",
          "nameJP": "高山サイエンスタウン",
          "visible": true
      },{
          "code": 560,
          "nameEN": "NAIST",
          "nameJP": "奈良先端科学技術大学院大学",
          "visible": true
      },{
          "code": -1,
          "nameEN": "Gakuemmae Station",
          "nameJP": "学園前駅",
          "visible": true
      },{
          "code": 631,
          "nameEN": "Chiku Center",
          "nameJP": "地区センター",
          "visible": true
      },{
          "code": 632,
          "nameEN": "Shiki-no-Mori Kōen",
          "nameJP": "四季の森公園",
          "visible": true
      },{
          "code": -14,
          "nameEN": "Gakken-Nara-Tomigaoka Station",
          "nameJP": "学研奈良登美ヶ丘駅",
          "visible": true
      },{
          "code": 2610,
          "nameEN": "Gakken-Kita-Ikoma Station",
          "nameJP": "学研北生駒駅",
          "visible": true
      },{
          "code": -5601,
          "nameEN": "Takanohara Station",
          "nameJP": "高の原駅",
          "visible": true
      },{
          "code": 606,
          "nameEN": "Keihanna Plaza",
          "nameJP": "けいはんなプラザ",
          "visible": true
      },{
          "code": 100001,
          "nameEN": "Kansai Airport Terminal 1",
          "nameJP": "関西空港第1ターミナル",
          "visible": true
      },{
          "code": 100002,
          "nameEN": "Kansai Airport Terminal 2",
          "nameJP": "関西空港第2ターミナル",
          "visible": true
      },{
          "code": 604,
          "nameEN": "Gyoen Station",
          "nameJP": "祝園駅",
          "visible": false
      },{
          "code": 625,
          "nameEN": "Kano-no-Kita 2-Chome",
          "nameJP": "鹿ノ台北二丁目",
          "visible": false
      }];

    await stops.forEach(async function(stop) {
      var stop = await Stop.findOrCreate({code: stop.code}, stop);
      console.log(stop.nameEN + " available");
    });

    return exits.success();
  }
  
};
