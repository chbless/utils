;(function(exports){
    var zDate={
      parse: function(str){
        if(/^\d{10}$/.test(str)){
          return new Date(str*1000);
        }else if(/^\d{13}$/.test(str)){
          return new Date(str*1);
        }
        str=this.trim(str);
        var reg=/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        var m=str.match(reg);
        if(m){var year=m[1];
          var month=parseInt(m[2]-1,10);
          var day=parseInt(m[3],10);
          var hour=parseInt(m[4],10);
          var minutes=parseInt(m[5],10);
          var seconds=parseInt(m[6],10);
          return new Date(year,month,day,hour,minutes,seconds);
        }else{
          return"";
        }
      },
      trim: function(str){
        return str.replace(/(^\s*)|(\s*$)/g,'');
      },
      format: function(text,date){
        var o = {
              "M+":date.getMonth()+1,
              "d+":date.getDate(),
              "h+":date.getHours(),
              "m+":date.getMinutes(),
              "s+":date.getSeconds(),
              "q+":Math.floor((date.getMonth()+3)/3),
              "S":date.getMilliseconds(),
              "w":"日一二三四五六".charAt(date.getDay())
            };
        text = text.replace(/y{4}/,date.getFullYear()).replace(/y{2}/,date.getFullYear().toString().substring(2))
        for(var k in o){
          var reg=new RegExp(k);
          text=text.replace(reg,match);
        }
        function match(m){
          return m.length==1?o[k]:("00"+o[k]).substr((""+o[k]).length);
        }
        return text;
      },
      getServerTime: function(callback){
        var xhr=new XMLHttpRequest(),self=this,dateStr,dateObj,callBackFlag=false;
        if(!xhr){
          xhr=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open("HEAD",location.href,true);
        xhr.onreadystatechange=function(){
          if(!callBackFlag&&(xhr.readyState==4||xhr.status==200)){
            callBackFlag=true;
            dateStr=xhr.getResponseHeader('Date');
            dateObj=new Date(dateStr);
            if(dateStr&&dateObj){
              callback&&callback(dateObj);
            }else{
              callback&&callback(null);
            }
          }
        }
        xhr.send(null);
      },
      isUsefulTime: function(startTime,endTime,nowTime){
        var start = startTime?this.parse(startTime):null,
            end = endTime?this.parse(endTime):null,
            now = nowTime?this.parse(nowTime):new Date(),
            flag=false;
        if(start&&end&&now){
          start=start.getTime();
          now=now.getTime();
          end=end.getTime();
          if(now>=start&&now<=end){
            flag=true;
          }
        }
        return flag;
      },
      getTimeObject: function(ms){
        var ss=1000;
        var mi=ss*60;
        var hh=mi*60;
        var dd=hh*24;
        var day=parseInt(ms/dd);
        var hour=parseInt((ms-day*dd)/hh);
        var minute=parseInt((ms-day*dd-hour*hh)/mi);
        var second=parseInt((ms-day*dd-hour*hh-minute*mi)/ss);
        var milliSecond=ms-day*dd-hour*hh-minute*mi-second*ss;
        var strDay=day;
        var strHour=hour;
        var strMinute=minute;
        var strSecond=second;
        var strMilliSecond=milliSecond<10?"0"+milliSecond:""+milliSecond;strMilliSecond=milliSecond<100?"0"+strMilliSecond:""+strMilliSecond;
        var timeObj={};
        timeObj.day=strDay;
        timeObj.hour=strHour;
        timeObj.minute=strMinute;
        timeObj.second=strSecond;
        timeObj.millisecond=strMilliSecond;
        return timeObj;
      },
      countDown: function(params){
        var dayBox=params.dayBox,
            hourBox=params.hourBox,
            minuteBox=params.minuteBox,
            secondBox=params.secondBox,
            milliSecondBox=params.milliSecondBox,
            nowTime=params.nowTime,
            startTime=params.startTime,
            endTime=params.endTime,
            nowTimeObj=nowTime&&this.parse(nowTime),
            endTimeObj=endTime&&this.parse(endTime),
            interval=params.interval||1000,
            ms,
            hashTime=0,
            timeObj,
            self=this;
        if(!nowTimeObj){
          nowTimeObj=new Date();
        }
        if(!endTimeObj){
          return
        }
        ms=endTimeObj.getTime()-nowTimeObj.getTime();
        if(ms<0){
          ms=0
        }
        if(ms>=0){
          var timeCounter=this.timeCounter=setTimeout(countDownStart,interval);
        }
        var count=0;
        var count2=0;
        var startTime=new Date().getTime();
        function countDownStart(){
          count++;
          var offset=new Date().getTime()-(startTime+count*interval);
          if(offset>10000){
            count2=~~(offset/interval);count=count+count2;ms=ms-count2*interval;
          }
          var nextTime=interval-offset;
          var daytohour=0;
          if(nextTime<0){
            nextTime=0
          };
          timeObj=self.getTimeObject(ms);
          if(!dayBox){
            daytohour=timeObj.day*24;
          }
          dayBox&&(dayBox.innerHTML=timeObj.day);
          hourBox&&(hourBox.innerHTML=timeObj.hour+daytohour);
          minuteBox&&(minuteBox.innerHTML=timeObj.minute);
          secondBox&&(secondBox.innerHTML=timeObj.second);
          milliSecondBox&&(milliSecondBox.innerHTML=timeObj.millisecond);
          ms-=interval;
          if(ms<0){
            clearTimeout(timeCounter);
            secondBox.innerHTML='0';
            params.endCallBack&&params.endCallBack();
          }else{
            timeCounter=setTimeout(countDownStart,nextTime);
          }
        }
        return{
          stopCountDown: function(){
            clearTimeout(timeCounter);
          }
        }
      }
    };
    exports.zDate = {
      parse: function(text){
        return zDate.parse(text)
      },
      format: function(text,date){
        return zDate.format(text,date)
      },
      isUsefulTime: function(startTime,endTime,nowTime){
        return zDate.isUsefulTime(startTime,endTime,nowTime)
      },
      getServerTime: function(callback){
        zDate.getServerTime(callback)
      },
      getTimeObject: function(ms){
        return zDate.getTimeObject(ms)
      },
      countDown: function(params){
        return zDate.countDown(params)
      }
    };
})(window);
