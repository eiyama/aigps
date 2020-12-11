import { jsonp ,ttxjsonp} from '@/utils/jsonp'
// 通天星jsonp统一用ttxjsonp这种方式，
const host = process.env.VUE_APP_BASEURL_KY

// export function alarmDetailApp(data) {
//   return jsonp({
//     url: `${host}808gps/mobile/MobileAction_alarmDetailApp.action?guid=${data.guid}&begintime=${data.begintime}&alarmType=${data.alaType}&toMap=2&jsession=${data.jsession}&callback=`,
//     isLoading: true
//   })
// }

export function alarmDetailApp(data) {
  return ttxjsonp({
    url: `${host}808gps/mobile/MobileAction_alarmDetailApp.action`,
    data:{
      guid:data.guid,
      begintime:data.begintime,
      alarmType:data.alaType,
      toMap:2,
      jsession:data.jsession,
    }     
  })
}

export function loginTTX() {
  const name = process.env.VUE_APP_NAME
  const pwd = process.env.VUE_APP_PWD;
  return jsonp({
    url: `${host}StandardApiAction_login.action?account=${name}&password=${pwd}&callback=`
  })
}

export function getAddress(lat, lng, isLoading) {
  return jsonp({
    url: `http://api.map.baidu.com/geocoder/v2/?ak=dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2&location=${lat},${lng}&output=json&pois=1&callback=`,
    isLoading: !isLoading
  })
}

export function getReportPhotoListSafe(data) {
  return ttxjsonp({
    url: `${host}StandardApiAction_performanceReportPhotoListSafe.action`,
    isLoading: true, 
    data:{
      jsession:data.jsession,
      begintime:data.begin,
      endtime:data.end,
      alarmType:data.alarmType,
      mediaType:data.mediaTyp,
      toMap:2,
      vehiIdno:encodeURI(data.vehiIdno),
      currentPage:data.curPage,
      pageRecords:data.limit
    }
  })
}

// export function getVideoFileInfo(data) {
//   return jsonp({
//     url: `${host}StandardApiAction_getVideoFileInfo.action?DownType=2&DevIDNO=${data.veh}&LOC=${data.loc}&CHN=-1&YEAR=${data.year}&MON=${data.month}&DAY=${data.day}&RECTYPE=-1&FILEATTR=2&BEG=0&END=86399&ARM1=0&ARM2=0&RES=3&STREAM=-1&STORE=0&jsession=${data.jsession}&callback=`,
//     isLoading: true
//   })
// }

export function getVideoFileInfo(data) {
  return ttxjsonp({
    url: `${host}StandardApiAction_getVideoFileInfo.action`,
    isLoading: true,  
    data:{
      DownType:2,
      DevIDNO:data.DevIDNO,
      LOC:data.LOC,
      CHN:-1,
      YEAR:data.YEAR,
      MON:data.MON,
      DAY:data.DAY,
      RECTYPE:-1,
      FILEATTR:2,
      BEG:0,END:86399,ARM1:0,ARM2:0,RES:3,STREAM:-1,STORE:0,
      jsession:data.jsession
    }
  })
}

export function getUpList(data) {
  return ttxjsonp({
    url: `${host}StandardApiAction_queryDownLoadReplayEx.action`,    
    isLoading: true,   
    data:{
      jsession:data.jsession,
      devIdno:data.devIdno,
      status:1,
      begintime:data.beg,
      endtime:data.end,
    }    
  })
}

export function upFtp(data) {
  return ttxjsonp({
    url: `${host}StandardApiAction_ftpUpload.action`,
    isLoading: true,
    data:{
      jsession:data.jsession,
      DevIDNO:data.devIdno,
      CHN:data.chn,
      BEGYEAR:data.year,
      BEGMON:data.mon,
      BEGDAY:data.day,
      BEGSEC:data.beg,
      ENDYEAR:data.year,
      ENDMON:data.mon,
      ENDDAY:data.day,
      ENDSEC:data.end,
      ARM1:data.arm1,
      ARM2:data.arm2,
      RES:data.res,
      STREAM:data.stream,
      STORE:data.store,
      NETMASK:7 
    }
  })
}


