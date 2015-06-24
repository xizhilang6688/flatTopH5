define("main",function(){(function(){;(function() {
  'use strict';

  var $doc = $(document),
      $body = $('body'),
      questions = {
        bear: {
          'title': '你在森林中独行，突然出现一只黑熊，你该怎么办？',
          'option': ['赶紧跑，跑得比刘翔还快','倒地装死，一动不动','和它说话,让熊知道你没恶意','扔过去食物,然后慢慢撤退'],
          'result': 1
        },
        valley: {
          'title': '被困山里如何快速发出求救信号？',
          'option': ['点燃火堆引起注意','大声呼喊求救','地面上画出SOS符号','自己默默找出路'],
          'result': 0
        },
        seed: {
          'title': '如果允许你带种子去荒山生活，你将选择哪种？',
          'option': ['玉米','马铃薯','葡萄','西红柿'],
          'result': 0
        },
        snake: {
          'title': '以下哪种蛇是毒蛇？',
          'option': ['火赤练蛇','百步蛇','帕布拉奶蛇','翠青蛇'],
          'result': 1
        },
        thunder: {
          'title': '野外露营遇到雷暴天气，怎么做最安全？',
          'option': ['躲到附近的大树下','躲到可以避雨的大石头下','躲在帐篷里不出来','转移到远离树木的低地处'],
          'result': 3
        },
        boating: {
          'title': '你正在河道里划船，什么情景预示洪水要来了？',
          'option': ['天空变得乌黑','水位上涨,水变得混浊','潮湿的风吹过河谷','闻到湿漉漉的味道'],
          'result': 1
        },
        chef: {
          'title': '平顶厨房要开饭啦，你打算为大家做些什么呢？',
          'option': ['鸡棚那只鸡和蘑菇炖了吧','土豆丰收啦,土豆丝最赞','杀头牛来份牛排解解馋','刚收获的鸡蛋都煮了吧'],
          'result': 1
        }
      },
      tmpl = '\
        <div class="loadingAni" style="display:none">\
           <div class="inner">\
            <div class="fengche">\
                <b class="box box1"></b><b class="box box2"></b><b class="box box3"></b><b class="box box4"></b>\
            </div>\
            <h4>生存天数计算中...</h4>\
        </div></div> \
        <div id="animalchanger">\
          <div class="level-one">\
            <div class="wrap left-to-right">\
              <%for(var i = 0; i < shardCount; i++) {%>\
              <div class="shard-wrap"><div class="shard"></div></div>\
              <%}%>\
            </div>\
          </div>\
          <div class="title">\
            <%for(var i = 0; i < titleSubElementCount; i++) {%>\
            <div class="triangle"></div>\
            <%}%>\
            <div class="titleNum num1"></div>\
          </div>\
          <div class="answerList">\
            <h1></h1>\
            <ul>\
              <%for(var i = 0; i < optionsIndex.length; i++) {%>\
              <li data-index="<%=i%>">\
                <span class="abcd"><%=optionsIndex[i]%>.</span>\
                  <p></p>\
                  <span class="check checked"></span>\
              </li>\
              <%}%>\
            </ul>\
          </div>\
          <div class="changePanel"></div>\
          <div class="changePanelinner"></div>\
        </div>\
      '

  // android 貌似都不支持clip-path
  //  && !($.os.android && parseFloat($.os.version) >= 4.4)
  if(!($.os.ios && parseFloat($.os.version) >= 7.1)) {
    $('html').addClass('lowPhone')    
  }

  var stateTimer = setInterval(function() {
      $body.removeClass("state-four")
      setTimeout(function(){$body.addClass("state-two")},100)
      setTimeout(function(){$body.removeClass("state-two");$body.addClass("state-three")},1100)
      setTimeout(function(){$body.removeClass("state-three");$body.addClass("state-four")},2000)
    }, 3000)

  var shimmerTimer = setInterval(function(){
      setTimeout(function(){$body.addClass("shimmer")},1000)
      setTimeout(function(){$body.removeClass("shimmer")},2520)
    },3520)


  
  // var audioidId = null,audioLen,audioIsPlay=0

  // function audioplay(animal){
  //   if($('.songBox .close').css('display')=="none") return
  //   var name = animal || 'bear'
  //   var musicanimals = {
  //         "bear":[0,5],"valley":[5,10],"seed":[10,15],"snake":[15,20],"thunder":[20,25],"boating":[25,30],"chef":[30,35]
  //   }
  //   audioLen = musicanimals[name][1]
  //   audioidId.currentTime = musicanimals[name][0]
  //   audioidId.play()
  // }
   
  // 开始答题
  $doc.on('startanswer', function() {
    bosszone("clickA","","","","","","",bossOpenId)
    var context = {shardCount: 30, titleSubElementCount: 7, optionsIndex: ['A', 'B', 'C', 'D']},
        html = txTpl(tmpl, context),
        animals = (function() {
          var names = []
          $.each(questions, function(key, value) {
            names.push(key)
          })
          return names
        })()

    $body.html(html).addClass('animal-animations-on')
        
    var t = $(window).width(),
        e = 0.7*t,
        a = -1*(t/2),
        n = -1*(e/2)-0

    $('#animalchanger .wrap').css({width: t, height: e, 'margin-top': n, 'margin-left': a})
    $('#animalchanger .title').css({
      width: Math.round($(window).width()*0.340625),
      height: Math.round($(window).width()*0.340625*0.5),
      bottom: $(window).height()*0.25
    })

    $body.data('animals', animals)
    $body.data('score', 0)
    $body.data('answercount', 0)

    var $animalchanger = $('#animalchanger')
    

    
    // 第一题固定为bear
    var animal = 'bear'
    $animalchanger.trigger('askquestion', {animal: animal})
    // audioidId = document.getElementById('audio')

    // function audioAddEvent(){
    //     if(audioidId.currentTime>audioLen){
    //         audioidId.pause();
    //     }
    // }
    // function checkAudio(){
    //     try{
    //         audioidId.load()
    //         audioidId.addEventListener('durationchange',function(){
    //         if(audioidId.duration && audioidId.duration>30){ 
    //             $(".songBox").show();
    //             audioidId.addEventListener('timeupdate',audioAddEvent,false);
    //             audioplay('bear')
    //             //只执行一次
    //             $("#animalchanger").unbind();
    //        }
    //     },false)  
    //     }catch (e){
    //     }
         
    // }
    // $("#animalchanger").bind('touchstart', function() {
    //     checkAudio()
    // })
    
    // checkAudio()
    // $('.songBox').on('tap',function(){
    //   if($('.songBox .open').css('display')=="none"){
    //     $('.songBox .open').show()
    //     $('.songBox .close').hide()
    //     audioidId.pause()
    //   }else{
    //     $('.songBox .open').hide()
    //     $('.songBox .close').show()
        
    //   }
    // })
    
  })
  
  // 提问
  $doc.on('askquestion', '#animalchanger', function(event, options) {
    var $target = $(this),
        $answerList = $('.answerList', $target),
        $title = $('.title', $target),
        $answertitle = $('.answerList h1', $target),
        $titleNum = $('.title .titleNum', $target),
        $options = $('.answerList p', $target),
        oldAnimal = $body.data('animal'),
        animal = options.animal,
        animals = $body.data('animals'),
        answercount = $body.data('answercount')

    animals.splice(animals.indexOf(animal), 1)
    $body.data('currentAnimal', animal)
    $body.data('animals', animals)
    $body.data('animal', animal)

    $answertitle.text(questions[animal].title)
    $.each(questions[animal].option, function(index, opt) {
      $options.eq(index).text(opt)
    })
    $titleNum.removeClass('num' + answercount).addClass('num' + (answercount + 1))
    $('ul', $answerList).hide()
    $answerList.css({top: $(window).height()*0.72})
    $title.css({bottom: $(window).height()*0.25})
    $('.answerList .current', $answerList).removeClass('current')
    $('.answerList .checked', $answerList).removeClass('checked')
    $('.changePanel', $target).show()
    $('.changePanelinner', $target).show()
    setTimeout(function() {
      $target.removeClass(oldAnimal + 'Two').addClass(animal)
    }, 16)
  })

  // 向上滑动题目回答问题
  $doc.on('swipeUp', '#animalchanger', function(event) {
    var animal = $body.data('animal')
    if(animal.slice(-3) === 'Two') {
      return
    }

    $('#animalchanger').trigger('answerquestion')
  })

  // 选择答案
  $doc.on('answerquestion', '#animalchanger', function(event, options) {
    var $target = $(this),
        animal = $body.data('animal')

    $target.removeClass(animal).addClass(animal + 'Two')
    $('.answerList ul', $target).show()
    $('.answerList', $target).css({top:$(window).height()*0.38})
    $('.title', $target).css({bottom:$(window).height()*0.6})
    $('.changePanel', $target).hide()
    $('.changePanelinner', $target).hide()
  })

  // 回答问题
  $doc.on('tap', '#animalchanger .answerList li', function(event) {
    var $target = $(this),
        $animalchanger = $('#animalchanger'),
        $answerList = $target.parents('.answerList'),
        index = parseInt($target.data('index')),
        animals = $body.data('animals'),
        animal = $body.data('animal'),
        score = parseInt($body.data('score')),
        answercount = $body.data('answercount')

    if($('.current', $answerList).length) {
      return
    }

    $target.addClass('current')
    $('.check', $target).addClass('checked')

    if(questions[animal].result === index) {
      score++
      $body.data('score', score)
    }

    answercount++
    $body.data('answercount', answercount)

    // 完成5道答题
    if(answercount === 5) {
      setTimeout(function(){
        $(".loadingAni").show()
      },1000)
      setTimeout(function(){
        $doc.trigger('showresult')
        return
      },3000)
      return
    }

    var randow = Math.floor(animals.length * Math.random())
    animal = animals[randow]
    setTimeout(function() {
      $animalchanger.trigger('askquestion', {animal: animal})
      // audioidId.pause()
      // audioplay(animal)
        
    }, 500)
  })

  // 禁止页面滚动
  $doc.on('touchmove', '#animalchanger, .loadingPgae', function(event) {
    event.preventDefault()
  })

})();;(function() {
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

})()})()})