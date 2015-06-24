;(function() {
  'use strict';

  var $doc = $(document),
      $body = $('body'),
      results = {
        0: {
          'title': '经专业鉴定，你的基因不适合探险哈！',
          'share': '我的生存天数是<%=day%>天，外面的世界好可怕，我想静静！'
        },
        1: {
          'title': '我一定不会告诉别人，你真的太弱啦！',
          'share': '我的生存天数是<%=day%>天，这么弱我也是醉了，你也来试试吧！'
        },
        2: {
          'title': '再锻炼下就能出去闯荡江湖了！',
          'share': '我的生存天数是<%=day%>天，再锻炼下就能冒险啦，你也来试试吧！'
        },
        3: {
          'title': '压线及格最骄傲，其他不重要！',
          'share': '我的生存天数是<%=day%>天，真正的能力者等你来挑战！'
        },
        4: {
          'title': '食物链顶端的勇士，集体膜拜中！',
          'share': '我的生存天数是<%=day%>天，国产版贝爷独孤求败，等你来挑战！'
        },
        5: {
          'title': '食物链顶端的勇士，集体膜拜中！',
          'share': '我的生存天数是<%=day%>天，国产版贝爷独孤求败，等你来挑战！'
        }
      },
      tmpl = '\
        <div class="resultPage">\
            <div class="img"><img src="<%=headimgurl || \"http://mat1.gtimg.com/v/h5/we15/images/avatar.png\"%>" /><span></span></div>\
            <div class="txt">\
              <b>生存<span><%=day%></span>天</b>\
              <p><%=results[score].title%></p>\
            </div>\
            <div class="download">\
              <h2><a href="http://u15.video.qq.com/web/info/download">下载《我们15个》24小时直播生存挑战</a></h2>\
               <div class="video">\
                <video id="video" webkit-playsinline controls="controls" controls="controls" src="http://mat1.gtimg.com/v/h5/we15/images/video.mp4"  poster="http://mat1.gtimg.com/v/h5/we15/images/video.jpg">您的浏览器不支持 video 标签。</video>\
              </div>\
              <p>好莱坞会员7天免费观看直播特权</p>\
            </div>\
            <div class="friends">\
              <h2>能力者们</h2>\
              <div class="bd">\
                <ul>\
                  <%var i = 0%>\
                  <%$.each(friends, function(k, friend) {%>\
                  <% if(i==0){ %>\
                  <li class="on"> \
                  <% }else { %>\
                  <li>\
                  <% } %>\
                      <em><%=++i%></em>\
                      <img src="<%=friend.headimgurl || \"http://mat1.gtimg.com/v/h5/we15/images/avatar.png\"%>" alt="" />\
                      <div class="box">\
                          <div class="name"><%=friend.nickname%></div>\
                          <div class="day">生存天数<span><%=friend.day%></span></div>\
                          <div class="line"><div class="bg" style="width:<%=friend.day%>%"></div></div>\
                      </div>\
                  </li>\
                  <%})%>\
                </ul>\
              </div>\
            </div>\
            <div class="pkfriend">喊好友来PK</div>\
            <div class="share">\
              <div class="angin">再玩一次</div>\
            </div>\
        </div>\
        <div class="countDay">\
          <div class="inner">\
          <img src="http://mat1.gtimg.com/v/h5/we15/images/jisuan.gif" alt="" width="130">\
          <h4>生存天数计算中...</h4>\
          </div>\
        </div>\
      '

  // 显示结果
  $doc.on('showresult', function(event, options) {
    var userinfo = $body.data('userinfo'),
        friends = $body.data('friends'),
        fromid = $body.data('fromid'),
        score,
        day,
        context

    if(!options) {// 如果没有options，说明不是直接进入结果页
      score = parseInt($body.data('score'))
      day = (function(score) {
        if(score === 0) {
          return 0
        }else if(score === 5){
          score=4;
        }
        return Math.floor(score * 20 - 10 + 20 * Math.random())
      })(score)
      // 提交结果
      $.post('/web/weChatGame/record', {fromid: fromid, score: day}, function(data) {
      })
    } else {
      day = options.day
      if(day >= 70) {
        score = 4
      } else if(day >= 50) {
        score = 3
      } else if(day >= 30) {
        score = 2
      } else if(day >= 10) {
        score = 1
      } else {
        score = 0
      }
      $body.data('score', score) // 记录score
    }

    $body.data('day', day) // 记录day
    
    context = {score: score, day: day, results: results, headimgurl: userinfo.headimgurl, friends: friends}
    
    $body.html(txTpl(tmpl, context))
    var video = document.getElementById('video')
        video.addEventListener('error', function (err) {
          $('#video').attr('src','http://mat1.gtimg.com/v/h5/we15/images/video.mp4')
        }, true)

    // 微信分享
    // 此处逻辑需要在答题结束后重置分享数据 否则总是分享默认数据
    var bodyData = $body.data();
    if(bodyData && bodyData.userinfo && bodyData.userinfo.uid){
      // 微信分享数据
      shareData = {
        title: txTpl(results[bodyData.score].share, {day: day}),
        desc: txTpl(results[bodyData.score].share, {day: day}),
        pic: 'http://mat1.gtimg.com/v/h5/we15/images/u15icon.png',
        link: window.location.href+"?formid="+bodyData.userinfo.uid
      }
    }
    //此处需要再次执行一次 否则微信api会出现失效状态
    if(window.setdownloadhref){window.setdownloadhref()}
    
  })

  // 再玩一次
  $doc.on('tap', '.resultPage .angin', function() {
    $doc.trigger('startanswer')
    bosszone("clickB","","","","","","","")
  })

  // 下载
  $doc.on('tap', '.download h2', function() {
    bosszone("clickB","","","","","","","")
  })


  // 微信分享
  var shareData = {
      title: "90%的人都答不对的生存挑战题，你敢赌上智商试试不？",
      desc: "90%的人都答不对的生存挑战题，你敢赌上智商试试不？",
      pic: "http://mat1.gtimg.com/v/h5/we15/images/u15icon.png",
      link: window.location.href
  }

  function onBridgeReady() {
    if(!window.WeixinJSBridge) {
      return false
    }

    //转发朋友圈
    WeixinJSBridge.on("menu:share:timeline", function(e) {
        var data = {
            img_width: "120",
            img_height: "120",
            img_url: shareData.pic,
            link: shareData.link,   //desc这个属性要加上，虽然不会显示，但是不加暂时会导致无法转发至朋友圈，
            desc: "",
            title: shareData.title
        };
        WeixinJSBridge.invoke("shareTimeline", data, function(res) {
            WeixinJSBridge.log(res.err_msg)
        });
        bosszone("clickC","","","","","","","")
    });
    //同步到微博
    WeixinJSBridge.on("menu:share:weibo", function() {
        WeixinJSBridge.invoke("shareWeibo", {
            "content": shareData.desc,
            "url": shareData.link
        }, function(res) {
            WeixinJSBridge.log(res.err_msg);
        });
        bosszone("clickC","","","","","","","")
    });
    //分享给朋友
    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        WeixinJSBridge.invoke("sendAppMessage", {
            img_width: "120",
            img_height: "120",
            img_url: shareData.pic,
            link: shareData.link,
            desc: shareData.title,
            title: '世界那么大，你敢孤身闯荡么？'
        }, function(res) {
            WeixinJSBridge.log(res.err_msg);
        });
        bosszone("clickC","","","","","","","")
    });
    //检测app是否安装
    var packageName = 'com.tencent.fifteen',
        urlscheme = 'tencentfifteen://';
    WeixinJSBridge.invoke('getInstallState', {
        packageName: packageName,
        packageUrl: urlscheme
      }, function(e) {
        if(!!~e.err_msg.indexOf('get_install_state:yes')) {
          $('.download h2 a').text('打开《我们15个》24小时直播生存挑战').attr('href', urlscheme + 'client/review')
          window.setdownloadhref=function(){
            $('.download h2 a').text('打开《我们15个》24小时直播生存挑战').attr('href', urlscheme + 'client/review')
          }
          }
      }
    )
    return true
  }
  //执行
  !onBridgeReady() && document.addEventListener('WeixinJSBridgeReady', function() {
      onBridgeReady();
  });

})()